import { randomUUID } from "node:crypto";
import { DateTime } from "luxon";
import { assert, defaults } from "./validation.mjs";
export const zone = "Europe/Berlin";
export const nowBerlin = () => DateTime.now().setZone(zone);
export const event = (status) => ({ status, at: new Date().toISOString() });
export async function settings(tx, lock = false) {
  return (
    (
      await tx.query(
        `SELECT data FROM settings WHERE id=1${lock ? " FOR UPDATE" : ""}`,
      )
    ).rows[0]?.data || defaults
  );
}
export function parseSlot(date, time) {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone });
  assert(
    dt.isValid && dt.toFormat("yyyy-MM-dd HH:mm") === `${date} ${time}`,
    400,
    "Ungültiger Zeitpunkt",
  );
  return dt;
}
export function validateSlot(cfg, start, { reservation = true } = {}) {
  assert(cfg.isOpen, 409, "Das Restaurant nimmt derzeit keine Anfragen an");
  const hours = cfg.openingHours[start.weekday - 1];
  assert(!hours.closed, 409, "An diesem Tag ist geschlossen");
  assert(
    start.toMillis() >=
      Date.now() +
        (reservation ? cfg.leadMinutes : cfg.preparationMinutes) * 60000,
    409,
    "Bitte einen späteren Zeitpunkt wählen",
  );
  assert(
    start.toMillis() < Date.now() + 180 * 86400000,
    400,
    "Maximal 180 Tage im Voraus",
  );
  const opening = parseSlot(start.toISODate(), hours.open);
  const closing = parseSlot(start.toISODate(), hours.close);
  assert(
    start >= opening &&
      start.plus({ minutes: reservation ? cfg.durationMinutes : 0 }) <= closing,
    409,
    "Außerhalb der Öffnungszeiten",
  );
  if (reservation)
    assert(
      start.diff(opening, "minutes").minutes % cfg.slotMinutes === 0,
      400,
      "Ungültiges Zeitfenster",
    );
}
export async function freeTables(tx, start, end, people, excludeId = null) {
  return (
    await tx.query(
      `SELECT t.* FROM restaurant_tables t WHERE t.capacity >= $1 AND NOT EXISTS (SELECT 1 FROM reservations r WHERE r.table_id=t.id AND r.status <> 'cancelled' AND r.starts_at < $3 AND r.ends_at > $2 AND ($4::uuid IS NULL OR r.id<>$4)) ORDER BY t.capacity,t.table_number`,
      [people, start.toISO(), end.toISO(), excludeId],
    )
  ).rows;
}
export async function availability(tx, date, people = 1) {
  const cfg = await settings(tx);
  const day = parseSlot(date, "00:00");
  const hours = cfg.openingHours[day.weekday - 1];
  if (hours.closed || !cfg.isOpen) return [];
  const result = [];
  const close = parseSlot(date, hours.close);
  for (
    let start = parseSlot(date, hours.open);
    start.plus({ minutes: cfg.durationMinutes }) <= close;
    start = start.plus({ minutes: cfg.slotMinutes })
  ) {
    let valid = true;
    try {
      validateSlot(cfg, start);
    } catch {
      valid = false;
    }
    const end = start.plus({ minutes: cfg.durationMinutes });
    const tables = valid ? await freeTables(tx, start, end, people) : [];
    const count = Number(
      (
        await tx.query(
          "SELECT count(*) FROM reservations WHERE starts_at=$1 AND status<>'cancelled'",
          [start.toISO()],
        )
      ).rows[0].count,
    );
    result.push({
      time: start.toFormat("HH:mm"),
      availableTables: count < cfg.slotLimit ? tables.length : 0,
      available: tables.length > 0 && count < cfg.slotLimit,
    });
  }
  return result;
}
export async function chooseTable(
  tx,
  cfg,
  start,
  people,
  requested,
  excludeId = null,
) {
  validateSlot(cfg, start);
  const end = start.plus({ minutes: cfg.durationMinutes });
  const { rows } = await tx.query(
    "SELECT count(*) FROM reservations WHERE starts_at=$1 AND status<>'cancelled' AND ($2::uuid IS NULL OR id<>$2)",
    [start.toISO(), excludeId],
  );
  assert(
    Number(rows[0].count) < cfg.slotLimit,
    409,
    "Dieses Zeitfenster ist ausgebucht",
  );
  const tables = await freeTables(tx, start, end, people, excludeId);
  const table = requested ? tables.find((t) => t.id === requested) : tables[0];
  assert(table, 409, "Keine passende freie Tischkapazität");
  return { table, end };
}
export async function priceOrder(tx, input, ageConfirmed = false) {
  const result = [];
  for (const item of input) {
    let product = (
      await tx.query(
        "SELECT data FROM products WHERE id=$1 AND deleted_at IS NULL FOR SHARE",
        [item.id],
      )
    ).rows[0]?.data;
    assert(
      product && product.available && product.stockAvailable,
      409,
      "Ein Produkt ist nicht mehr verfügbar. Bitte Speisekarte aktualisieren.",
    );
    assert(
      !product.configurationPending,
      409,
      "Produktoptionen müssen vom Restaurant geprüft werden",
    );
    assert(
      !product.minAge || ageConfirmed,
      400,
      "Bitte Altersbestätigung für alkoholische Getränke angeben",
    );
    const options = [];
    const extras = [];
    if (product.variants?.length) {
      const variant = product.variants.find(
        (v) => v.id === item.options.variant,
      );
      assert(variant, 400, "Bitte gültige Größe auswählen");
      product = { ...product, ...variant };
      options.push({ groupName: "Größe", optionName: variant.name });
    }
    let cents = Math.round(product.price * 100);
    for (const key of Object.keys(item.options))
      assert(
        (key === "variant" && product.variants?.length) ||
          product.optionGroups.some((g) => g.id === key),
        400,
        "Unbekannte Produktoption",
      );
    for (const group of product.optionGroups) {
      const selected = item.options[group.id];
      assert(!group.required || selected, 400, `Bitte ${group.name} auswählen`);
      if (selected) {
        const option = group.options.find((o) => o.id === selected);
        assert(option, 400, "Ungültige Produktoption");
        cents += Math.round((option.price || 0) * 100);
        options.push({ groupName: group.name, optionName: option.name });
      }
    }
    assert(
      new Set(item.extras).size === item.extras.length,
      400,
      "Doppelte Extras",
    );
    for (const id of item.extras) {
      const extra = product.extras.find((e) => e.id === id);
      assert(extra, 400, "Ungültiges Extra");
      cents += Math.round(extra.price * 100);
      extras.push(extra.name);
    }
    result.push({
      id: item.id,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity: item.quantity,
      unitCents: cents,
      options,
      extras,
    });
  }
  return {
    items: result,
    totalCents: result.reduce(
      (sum, item) => sum + item.unitCents * item.quantity,
      0,
    ),
  };
}
export async function audit(tx, admin, action, id) {
  await tx.query(
    "INSERT INTO audit_log(id,admin_id,action,entity_id) VALUES($1,$2,$3,$4)",
    [randomUUID(), admin, action, id],
  );
}
export async function queueEmail(tx, key, to, subject, body) {
  await tx.query(
    "INSERT INTO outbox(id,dedupe_key,recipient,subject,body) VALUES($1,$2,$3,$4,$5) ON CONFLICT(dedupe_key) DO NOTHING",
    [randomUUID(), key, to, subject, body],
  );
}
export const orderTransitions = {
  pending: ["confirmed", "rejected"],
  confirmed: ["preparing"],
  preparing: ["ready"],
  ready: ["delivered"],
  delivered: [],
  rejected: [],
};
export const labels = {
  pending: "Eingegangen",
  confirmed: "Bestätigt",
  preparing: "In Zubereitung",
  ready: "Abholbereit",
  delivered: "Abgeholt",
  rejected: "Abgelehnt",
  cancelled: "Storniert",
};
export function reservationMail(row, url) {
  return `${row.reservation_number}\nStatus: ${labels[row.status]}\n${DateTime.fromJSDate(new Date(row.starts_at)).setZone(zone).toFormat("dd.MM.yyyy HH:mm")} – ${row.people} Personen\n${url ? `Reservierung verwalten: ${url}\n` : ""}Urfa Grill, Schuhstraße 39, Hildesheim\nKontakt: 04951 219890410`;
}
export function orderMail(row, url) {
  return `${row.order_number}\nStatus: ${labels[row.status]}\n${row.items.map((i) => `${i.quantity} × ${i.name}: ${((i.unitCents * i.quantity) / 100).toFixed(2)} EUR`).join("\n")}\nGesamt: ${(row.total_cents / 100).toFixed(2)} EUR\nVoraussichtliche Zubereitung: ${row.estimated_minutes} Minuten\n${url ? `Bestellstatus: ${url}\n` : ""}Abholung: Schuhstraße 39, Hildesheim`;
}
