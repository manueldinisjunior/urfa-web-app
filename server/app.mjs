/** Author: Manuel Dinis Júnior — https://manueldinisjunior.de/ */
import express from "express";
import helmet from "helmet";
import cookies from "cookie-parser";
import { randomUUID, createHmac } from "node:crypto";
import { z } from "zod";
import { DateTime } from "luxon";
import swaggerUi from "swagger-ui-express";
import { authService, hash } from "./auth.mjs";
import {
  assert,
  productSchema,
  orderSchema,
  reservationSchema,
  settingsSchema,
  dateSchema,
  defaults,
} from "./validation.mjs";
import {
  settings,
  availability,
  chooseTable,
  parseSlot,
  validateSlot,
  priceOrder,
  event,
  audit,
  queueEmail,
  orderTransitions,
  labels,
  orderMail,
  reservationMail,
  nowBerlin,
  zone,
} from "./domain.mjs";
import { openapi } from "./openapi.mjs";

const uuid = z.string().uuid();
const statusInput = z.object({
  status: z.string(),
  reason: z.string().trim().max(1000).default(""),
});
const publicProduct = (row) => {
  const { internalNotes, ...data } = row.data;
  return { id: row.id, ...data };
};
const periodStart = (period) =>
  nowBerlin()
    .startOf(period === "week" ? "week" : period === "month" ? "month" : "day")
    .toISO();

export function createApp(db, cfg) {
  const app = express();
  const auth = authService(db, cfg);
  app.disable("x-powered-by");
  app.set("trust proxy", cfg.production ? 1 : false);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          frameSrc: ["'self'", "https://www.tiktok.com"],
          "img-src": ["'self'", "https:", "data:"],
          "script-src": ["'self'"],
          "style-src": ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  );
  app.use((req, res, next) => {
    const origin = req.get("origin");
    if (origin && cfg.origins.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Access-Control-Allow-Credentials", "true");
      res.vary("Origin");
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type,X-Urfa-Request,X-Order-Token,X-Reservation-Token",
      );
      res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    }
    if (req.method === "OPTIONS")
      return res.sendStatus(origin && cfg.origins.includes(origin) ? 204 : 403);
    if (req.path.startsWith("/api") && !["GET", "HEAD"].includes(req.method)) {
      // JSON + a non-simple custom header prevents cross-site form CSRF, including login CSRF.
      if (
        !origin ||
        !cfg.origins.includes(origin) ||
        req.get("x-urfa-request") !== "1" ||
        !req.is("application/json")
      )
        return res.status(403).json({ error: "Anfrageherkunft nicht erlaubt" });
    }
    next();
  });
  app.use(express.json({ limit: "128kb" }));
  app.use(cookies());
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  const limit = (max, scope) => async (req, res, next) => {
    const key = hash(`${scope}:${req.ip}:${Math.floor(Date.now() / 60000)}`);
    const { rows } = await db.query(
      "INSERT INTO rate_limits(key,count,expires_at) VALUES($1,1,now()+interval '2 minutes') ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count",
      [key],
    );
    if (rows[0].count > max)
      return res
        .status(429)
        .json({ error: "Zu viele Anfragen. Bitte später erneut versuchen." });
    next();
  };
  const admin = async (req, res, next) => {
    req.admin = await auth.verify(req);
    next();
  };
  const privateToken = (kind, key) =>
    createHmac("sha256", cfg.secret).update(`${kind}:${key}`).digest("hex");
  const emailState = () => (cfg.emailEnabled ? "queued" : "disabled");
  app.get("/api/health", async (req, res) => {
    await db.query("SELECT 1");
    res.json({ ok: true });
  });
  app.post("/api/auth/login", limit(8, "login"), async (req, res) => {
    const data = z
      .object({
        email: z.string().email().max(254),
        password: z.string().min(1).max(256),
      })
      .parse(req.body);
    res.json(await auth.login(data.email, data.password, res));
  });
  app.post("/api/auth/logout", async (req, res) => {
    await auth.logout(req, res);
    res.json({ ok: true });
  });
  app.post("/api/auth/refresh", limit(30, "refresh"), async (req, res) =>
    res.json(await auth.refresh(req, res)),
  );
  app.get("/api/auth/verify", admin, (req, res) => res.json(req.admin));
  app.get("/api/products", async (req, res) => {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE deleted_at IS NULL AND data->>'available'='true' AND data->>'stockAvailable'='true' ORDER BY data->>'name'",
    );
    res.json(rows.map(publicProduct));
  });
  app.get("/api/products/:id", async (req, res) => {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE id=$1 AND deleted_at IS NULL AND data->>'available'='true' AND data->>'stockAvailable'='true'",
      [req.params.id],
    );
    assert(rows[0], 404, "Produkt nicht gefunden");
    res.json(publicProduct(rows[0]));
  });
  app.get("/api/settings", async (req, res) =>
    res.json({
      ...(await settings(db)),
      timezone: zone,
      emailEnabled: cfg.emailEnabled,
      smsEnabled: cfg.smsEnabled,
    }),
  );
  app.get("/api/admin/products", admin, async (req, res) =>
    res.json(
      (
        await db.query(
          "SELECT * FROM products WHERE deleted_at IS NULL ORDER BY data->>'name'",
        )
      ).rows.map((r) => ({ id: r.id, ...r.data })),
    ),
  );
  app.post("/api/products", admin, async (req, res) => {
    const data = productSchema.parse(req.body);
    const id = randomUUID();
    await db.tx(async (tx) => {
      await tx.query("INSERT INTO products(id,data) VALUES($1,$2)", [
        id,
        JSON.stringify(data),
      ]);
      await audit(tx, req.admin.id, "product.created", id);
    });
    res.status(201).json({ id, ...data });
  });
  app.put("/api/products/:id", admin, async (req, res) => {
    const data = productSchema.parse(req.body);
    await db.tx(async (tx) => {
      const result = await tx.query(
        "UPDATE products SET data=$1,updated_at=now() WHERE id=$2 AND deleted_at IS NULL RETURNING id",
        [JSON.stringify(data), req.params.id],
      );
      assert(result.rows.length, 404, "Produkt nicht gefunden");
      await audit(tx, req.admin.id, "product.updated", req.params.id);
    });
    res.json({ id: req.params.id, ...data });
  });
  app.delete("/api/products/:id", admin, async (req, res) => {
    await db.tx(async (tx) => {
      const result = await tx.query(
        "UPDATE products SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING id",
        [req.params.id],
      );
      assert(result.rows.length, 404, "Produkt nicht gefunden");
      await audit(tx, req.admin.id, "product.deleted", req.params.id);
    });
    res.json({ ok: true });
  });
  app.put("/api/settings", admin, async (req, res) => {
    const data = settingsSchema.parse(req.body);
    await db.tx(async (tx) => {
      await settings(tx, true);
      const tables = (
        await tx.query("SELECT * FROM restaurant_tables ORDER BY table_number")
      ).rows;
      if (
        tables.length !== data.totalTables ||
        tables.some((t) => t.capacity !== data.tableCapacity)
      ) {
        const upcoming = await tx.query(
          "SELECT id FROM reservations WHERE status<>'cancelled' AND ends_at>now() LIMIT 1",
        );
        assert(
          !upcoming.rows.length,
          409,
          "Tischkapazität kann erst nach Abschluss vorhandener Reservierungen geändert werden",
        );
        // Historical reservations retain their table IDs. Unused tables may be deleted.
        for (let n = 1; n <= data.totalTables; n++)
          await tx.query(
            "INSERT INTO restaurant_tables(id,table_number,capacity) VALUES($1,$2,$3) ON CONFLICT(table_number) DO UPDATE SET capacity=$3",
            [randomUUID(), n, data.tableCapacity],
          );
        await tx.query(
          "DELETE FROM restaurant_tables WHERE table_number>$1 AND NOT EXISTS(SELECT 1 FROM reservations WHERE table_id=restaurant_tables.id)",
          [data.totalTables],
        );
        const remaining = await tx.query(
          "SELECT count(*) FROM restaurant_tables",
        );
        assert(
          Number(remaining.rows[0].count) === data.totalTables,
          409,
          "Historisch verwendete Tische müssen erhalten bleiben",
        );
      }
      await tx.query("UPDATE settings SET data=$1 WHERE id=1", [
        JSON.stringify(data),
      ]);
      await audit(tx, req.admin.id, "settings.updated", "1");
    });
    res.json(data);
  });
  app.get("/api/admin/tables", admin, async (req, res) =>
    res.json(
      (await db.query("SELECT * FROM restaurant_tables ORDER BY table_number"))
        .rows,
    ),
  );
  app.post("/api/orders", limit(12, "order"), async (req, res) => {
    const data = orderSchema.parse(req.body);
    const trackingToken = privateToken("order", data.requestKey);
    const requestHash = hash(JSON.stringify(data));
    const row = await db.tx(async (tx) => {
      const cfg = await settings(tx, true);
      const existing = (
        await tx.query("SELECT * FROM orders WHERE request_key=$1", [
          data.requestKey,
        ])
      ).rows[0];
      if (existing) {
        assert(
          existing.request_hash === requestHash,
          409,
          "Anfrageschlüssel wurde bereits verwendet",
        );
        return existing;
      }
      const pickup = parseSlot(data.date, data.time);
      validateSlot(cfg, pickup, { reservation: false });
      const priced = await priceOrder(tx, data.items, data.ageConfirmed);
      assert(
        priced.totalCents === data.expectedTotalCents,
        409,
        "Preise haben sich geändert. Bitte Warenkorb anhand der aktuellen Speisekarte neu zusammenstellen.",
      );
      const id = randomUUID();
      const seq = (await tx.query("SELECT nextval('order_numbers') AS n"))
        .rows[0].n;
      const number = `ORD-${nowBerlin().toFormat("yyyyMMdd")}-${String(seq).padStart(4, "0")}`;
      const row = (
        await tx.query(
          "INSERT INTO orders(id,order_number,tracking_hash,customer,items,total_cents,status,notes,pickup_at,estimated_minutes,history,request_key,request_hash) VALUES($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,$10,$11,$12) RETURNING *",
          [
            id,
            number,
            hash(trackingToken),
            JSON.stringify(data.customer),
            JSON.stringify(priced.items),
            priced.totalCents,
            data.notes,
            pickup.toISO(),
            cfg.preparationMinutes,
            JSON.stringify([event("pending")]),
            data.requestKey,
            requestHash,
          ],
        )
      ).rows[0];
      if (cfg && emailState() === "queued")
        await queueEmail(
          tx,
          `order:${id}:pending`,
          data.customer.email,
          `Bestellung eingegangen – ${number}`,
          orderMail(
            row,
            `${app.locals.config.publicUrl}/#/tracking/${id}?token=${trackingToken}`,
          ),
        );
      return row;
    });
    res
      .status(201)
      .json({
        id: row.id,
        number: row.order_number,
        trackingToken,
        totalCents: row.total_cents,
        status: row.status,
        email: emailState(),
      });
  });
  app.get("/api/orders", admin, async (req, res) => {
    const start = periodStart(req.query.period);
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const q = String(req.query.q || "").slice(0, 120);
    res.json(
      (
        await db.query(
          "SELECT * FROM orders WHERE created_at >= $1 AND ($2='' OR status=$2) AND (order_number ILIKE $3 OR customer->>'name' ILIKE $3) ORDER BY created_at DESC LIMIT 500",
          [start, status, `%${q}%`],
        )
      ).rows.map(({ tracking_hash, request_hash, request_key, ...row }) => row),
    );
  });
  app.get("/api/orders/:id", limit(120, "tracking"), async (req, res) => {
    uuid.parse(req.params.id);
    const row = (
      await db.query("SELECT * FROM orders WHERE id=$1", [req.params.id])
    ).rows[0];
    assert(row, 404, "Bestellung nicht gefunden");
    if (
      req.get("x-order-token") &&
      hash(req.get("x-order-token")) === row.tracking_hash
    )
      return res.json({
        id: row.id,
        number: row.order_number,
        items: row.items,
        totalCents: row.total_cents,
        status: row.status,
        history: row.history,
        pickupAt: row.pickup_at,
        estimatedMinutes: row.estimated_minutes,
      });
    await auth.verify(req);
    const { tracking_hash, request_key, request_hash, ...safe } = row;
    res.json(safe);
  });
  app.put("/api/orders/:id/status", admin, async (req, res) => {
    uuid.parse(req.params.id);
    const data = statusInput.parse(req.body);
    const row = await db.tx(async (tx) => {
      const current = (
        await tx.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [
          req.params.id,
        ])
      ).rows[0];
      assert(current, 404, "Bestellung nicht gefunden");
      assert(
        orderTransitions[current.status].includes(data.status),
        409,
        "Ungültiger Statuswechsel",
      );
      const updated = (
        await tx.query(
          "UPDATE orders SET status=$1,history=$2,updated_at=now() WHERE id=$3 RETURNING *",
          [
            data.status,
            JSON.stringify([...current.history, event(data.status)]),
            current.id,
          ],
        )
      ).rows[0];
      await audit(tx, req.admin.id, `order.${data.status}`, current.id);
      if (
        cfg.emailEnabled &&
        ["confirmed", "ready", "rejected"].includes(data.status)
      )
        await queueEmail(
          tx,
          `order:${current.id}:${data.status}`,
          current.customer.email,
          `${labels[data.status]} – ${current.order_number}`,
          `${orderMail(updated)}\n${data.reason}`,
        );
      return updated;
    });
    res.json({ status: row.status });
  });
  app.post("/api/orders/:id/notify", admin, async (req, res) => {
    uuid.parse(req.params.id);
    assert(cfg.emailEnabled, 503, "Email ist noch nicht konfiguriert");
    const row = (
      await db.query("SELECT * FROM orders WHERE id=$1", [req.params.id])
    ).rows[0];
    assert(row, 404, "Bestellung nicht gefunden");
    await queueEmail(
      db,
      `manual:${randomUUID()}`,
      row.customer.email,
      `${labels[row.status]} – ${row.order_number}`,
      orderMail(row),
    );
    res.json({ email: "queued" });
  });
  app.get(
    "/api/reservations/availability",
    limit(120, "availability"),
    async (req, res) => {
      const date = dateSchema.parse(req.query.date);
      const people = z.coerce
        .number()
        .int()
        .min(1)
        .max(20)
        .parse(req.query.people || 1);
      res.json(await availability(db, date, people));
    },
  );
  app.post("/api/reservations", limit(8, "reservation"), async (req, res) => {
    const data = reservationSchema.parse(req.body);
    const cancellationToken = privateToken("reservation", data.requestKey);
    const requestHash = hash(JSON.stringify(data));
    const row = await db.tx(async (tx) => {
      const options = await settings(tx, true);
      const existing = (
        await tx.query("SELECT * FROM reservations WHERE request_key=$1", [
          data.requestKey,
        ])
      ).rows[0];
      if (existing) {
        assert(
          existing.request_hash === requestHash,
          409,
          "Anfrageschlüssel wurde bereits verwendet",
        );
        return existing;
      }
      const start = parseSlot(data.date, data.time);
      const { table, end } = await chooseTable(tx, options, start, data.people);
      const id = randomUUID();
      const seq = (await tx.query("SELECT nextval('reservation_numbers') AS n"))
        .rows[0].n;
      const number = `RES-${nowBerlin().toFormat("yyyyMMdd")}-${String(seq).padStart(4, "0")}`;
      const status = options.autoConfirm ? "confirmed" : "pending";
      const row = (
        await tx.query(
          "INSERT INTO reservations(id,reservation_number,token_hash,customer,starts_at,ends_at,people,table_id,status,notes,history,request_key,request_hash) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
          [
            id,
            number,
            hash(cancellationToken),
            JSON.stringify(data.customer),
            start.toISO(),
            end.toISO(),
            data.people,
            table.id,
            status,
            data.notes,
            JSON.stringify([event(status)]),
            data.requestKey,
            requestHash,
          ],
        )
      ).rows[0];
      if (cfg.emailEnabled)
        await queueEmail(
          tx,
          `reservation:${id}:${status}`,
          data.customer.email,
          `Reservierung ${labels[status]} – ${number}`,
          reservationMail(
            row,
            `${cfg.publicUrl}/#/reservar/cancelar/${id}?token=${cancellationToken}`,
          ),
        );
      return row;
    });
    res
      .status(201)
      .json({
        id: row.id,
        number: row.reservation_number,
        status: row.status,
        cancellationToken,
        email: emailState(),
      });
  });
  app.post(
    "/api/reservations/:id/cancel",
    limit(12, "cancel"),
    async (req, res) => {
      uuid.parse(req.params.id);
      const supplied = req.get("x-reservation-token") || "";
      await db.tx(async (tx) => {
        await settings(tx, true);
        const row = (
          await tx.query("SELECT * FROM reservations WHERE id=$1 FOR UPDATE", [
            req.params.id,
          ])
        ).rows[0];
        assert(
          row && row.token_hash === hash(supplied),
          404,
          "Reservierung nicht gefunden",
        );
        assert(
          new Date(row.starts_at) > new Date(),
          409,
          "Reservierung liegt in der Vergangenheit",
        );
        if (row.status === "cancelled") return;
        const updated = (
          await tx.query(
            "UPDATE reservations SET status='cancelled',history=$1,updated_at=now() WHERE id=$2 RETURNING *",
            [JSON.stringify([...row.history, event("cancelled")]), row.id],
          )
        ).rows[0];
        if (cfg.emailEnabled)
          await queueEmail(
            tx,
            `reservation:${row.id}:cancelled`,
            row.customer.email,
            "Reservierung storniert",
            reservationMail(updated),
          );
      });
      res.json({ status: "cancelled" });
    },
  );
  app.get("/api/reservations", admin, async (req, res) => {
    const from = dateSchema.parse(req.query.from || nowBerlin().toISODate());
    const to = dateSchema.parse(req.query.to || from);
    assert(
      to >= from &&
        parseSlot(to, "00:00").diff(parseSlot(from, "00:00"), "days").days <=
          42,
      400,
      "Maximal 42 Tage abrufen",
    );
    res.json(
      (
        await db.query(
          "SELECT r.*,t.table_number FROM reservations r JOIN restaurant_tables t ON t.id=r.table_id WHERE starts_at >= $1 AND starts_at < $2 ORDER BY starts_at",
          [
            parseSlot(from, "00:00").toISO(),
            parseSlot(to, "00:00").plus({ days: 1 }).toISO(),
          ],
        )
      ).rows.map(({ token_hash, request_hash, request_key, ...row }) => row),
    );
  });
  app.put("/api/reservations/:id/status", admin, async (req, res) => {
    uuid.parse(req.params.id);
    const data = statusInput.parse(req.body);
    await db.tx(async (tx) => {
      await settings(tx, true);
      const row = (
        await tx.query("SELECT * FROM reservations WHERE id=$1 FOR UPDATE", [
          req.params.id,
        ])
      ).rows[0];
      assert(row, 404, "Reservierung nicht gefunden");
      assert(
        (row.status === "pending" &&
          ["confirmed", "cancelled"].includes(data.status)) ||
          (row.status === "confirmed" && data.status === "cancelled"),
        409,
        "Ungültiger Statuswechsel",
      );
      assert(
        new Date(row.starts_at) > new Date(),
        409,
        "Reservierung liegt in der Vergangenheit",
      );
      const updated = (
        await tx.query(
          "UPDATE reservations SET status=$1,reason=$2,history=$3,updated_at=now() WHERE id=$4 RETURNING *",
          [
            data.status,
            data.reason,
            JSON.stringify([...row.history, event(data.status)]),
            row.id,
          ],
        )
      ).rows[0];
      await audit(tx, req.admin.id, `reservation.${data.status}`, row.id);
      if (cfg.emailEnabled)
        await queueEmail(
          tx,
          `reservation:${row.id}:${data.status}`,
          row.customer.email,
          `Reservierung ${labels[data.status]}`,
          `${reservationMail(updated)}\n${data.reason}`,
        );
    });
    res.json({ status: data.status });
  });
  app.put("/api/reservations/:id", admin, async (req, res) => {
    uuid.parse(req.params.id);
    const data = z
      .object({
        date: dateSchema,
        time: z.string().regex(/^\d{2}:\d{2}$/),
        people: z.number().int().min(1).max(20),
        tableId: z.string().uuid().optional(),
      })
      .parse(req.body);
    await db.tx(async (tx) => {
      const options = await settings(tx, true);
      const row = (
        await tx.query("SELECT * FROM reservations WHERE id=$1 FOR UPDATE", [
          req.params.id,
        ])
      ).rows[0];
      assert(
        row && row.status !== "cancelled",
        409,
        "Reservierung kann nicht bearbeitet werden",
      );
      const start = parseSlot(data.date, data.time);
      const { table, end } = await chooseTable(
        tx,
        options,
        start,
        data.people,
        data.tableId,
        row.id,
      );
      const updated = (
        await tx.query(
          "UPDATE reservations SET starts_at=$1,ends_at=$2,people=$3,table_id=$4,reminder_at=NULL,updated_at=now() WHERE id=$5 RETURNING *",
          [start.toISO(), end.toISO(), data.people, table.id, row.id],
        )
      ).rows[0];
      await audit(tx, req.admin.id, "reservation.updated", row.id);
      if (cfg.emailEnabled)
        await queueEmail(
          tx,
          `reservation-edit:${randomUUID()}`,
          row.customer.email,
          "Reservierung aktualisiert",
          reservationMail(updated),
        );
    });
    res.json({ ok: true });
  });
  // Cancellation preserves audit/history instead of destroying customer records.
  app.delete("/api/reservations/:id", admin, (req, res) =>
    res.status(405).json({ error: "Bitte über den Status stornieren" }),
  );
  app.get("/api/admin/dashboard", admin, async (req, res) => {
    const today = periodStart("today");
    const tomorrow = nowBerlin().startOf("day").plus({ days: 1 }).toISO();
    const orders = (
      await db.query("SELECT * FROM orders WHERE created_at >= $1", [
        periodStart(req.query.period),
      ])
    ).rows;
    const todayOrders = orders.filter(
      (o) => new Date(o.created_at) >= new Date(today),
    );
    const reservations = Number(
      (
        await db.query(
          "SELECT count(*) FROM reservations WHERE status='confirmed' AND starts_at >= $1 AND starts_at < $2",
          [today, tomorrow],
        )
      ).rows[0].count,
    );
    const preparation = todayOrders
      .map((o) => {
        const a = o.history.find((h) => h.status === "preparing"),
          b = o.history.find((h) => h.status === "ready");
        return a && b ? (new Date(b.at) - new Date(a.at)) / 60000 : null;
      })
      .filter((n) => n !== null);
    const top = {};
    for (const order of orders.filter((o) => o.status === "delivered"))
      for (const item of order.items)
        top[item.name] = (top[item.name] || 0) + item.quantity;
    const week = (
      await db.query(
        "SELECT to_char(created_at AT TIME ZONE 'Europe/Berlin','YYYY-MM-DD') AS day,count(*) AS count FROM orders WHERE created_at>= $1 GROUP BY day ORDER BY day",
        [nowBerlin().startOf("day").minus({ days: 6 }).toISO()],
      )
    ).rows;
    res.json({
      pending: todayOrders.filter((o) => o.status === "pending").length,
      reservations,
      revenueCents: todayOrders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + o.total_cents, 0),
      periodRevenueCents: orders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + o.total_cents, 0),
      averagePreparation: preparation.length
        ? Math.round(
            preparation.reduce((a, b) => a + b, 0) / preparation.length,
          )
        : null,
      week,
      popularity: top,
      top: Object.entries(top)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      settings: await settings(db),
      emailEnabled: cfg.emailEnabled,
      failedEmails: Number(
        (
          await db.query(
            "SELECT count(*) FROM outbox WHERE sent_at IS NULL AND attempts>=8",
          )
        ).rows[0].count,
      ),
    });
  });
  app.get("/api/admin/audit", admin, async (req, res) =>
    res.json(
      (
        await db.query(
          "SELECT a.action,a.entity_id,a.created_at,u.email FROM audit_log a LEFT JOIN admins u ON u.id=a.admin_id ORDER BY a.created_at DESC LIMIT 100",
        )
      ).rows,
    ),
  );
  app.get("/api/openapi.json", (req, res) => res.json(openapi));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({
          error: error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        });
    const status = error.status || 500;
    if (status >= 500)
      console.error("Request failed", error.code || error.name);
    res
      .status(status)
      .json({
        error:
          status >= 500
            ? "Serverfehler. Bitte später erneut versuchen."
            : error.message,
      });
  });
  app.locals.config = cfg;
  return app;
}
