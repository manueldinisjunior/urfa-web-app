import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { DateTime } from "luxon";
import { openDatabase } from "../db.mjs";
import { initialize } from "../setup.mjs";
import { createApp } from "../app.mjs";
import { config } from "../config.mjs";
import { passwordHash } from "../auth.mjs";
import { defaults } from "../validation.mjs";
import { processNotifications } from "../notifications.mjs";
let db, app, admin, product;
const cfg = {
  ...config({
    NODE_ENV: "test",
    JWT_SECRET: "test-only-secret-with-more-than-32-characters",
    PUBLIC_URL: "http://localhost:3000",
  }),
  emailEnabled: true,
};
const customer = {
  name: "Test Customer",
  email: "test@example.com",
  phone: "05121123456",
};
const date = DateTime.now()
  .setZone("Europe/Berlin")
  .plus({ days: 2 })
  .toISODate();
const write = (agent, method, path, body) =>
  agent[method](path)
    .set("Origin", "http://localhost:3000")
    .set("X-Urfa-Request", "1")
    .send(body);
const booking = (extra = {}) => ({
  date,
  time: "18:00",
  people: 4,
  customer,
  requestKey: randomUUID(),
  ...extra,
});
before(async () => {
  db = await openDatabase(
    process.env.TEST_DATABASE_URL
      ? { DATABASE_URL: process.env.TEST_DATABASE_URL }
      : { NODE_ENV: "test", LOCAL_DATABASE_PATH: "memory://" },
  );
  await initialize(db);
  await db.query(
    "INSERT INTO admins(id,email,password_hash) VALUES($1,$2,$3)",
    [
      randomUUID(),
      "admin@example.com",
      await passwordHash("test-password-1234"),
    ],
  );
  app = createApp(db, cfg);
  admin = request.agent(app);
  const logged = await write(admin, "post", "/api/auth/login", {
    email: "admin@example.com",
    password: "test-password-1234",
  });
  assert.equal(logged.status, 200);
  const result = await write(admin, "post", "/api/products", {
    name: "Test meal",
    description: "A test product",
    category: "Grill",
    price: 10,
    imageUrl: "",
    optionGroups: [
      {
        id: "side",
        name: "Side",
        required: true,
        options: [{ id: "rice", name: "Rice", price: 2 }],
      },
    ],
    extras: [{ id: "sauce", name: "Sauce", price: 1.5 }],
  });
  assert.equal(result.status, 201);
  product = result.body;
  await write(admin, "put", "/api/settings", {
    ...defaults,
    isOpen: true,
    openingHours: defaults.openingHours.map((h) => ({
      ...h,
      closed: false,
      open: "00:00",
      close: "23:59",
    })),
    leadMinutes: 0,
    totalTables: 1,
    tableCapacity: 4,
  });
});
after(async () => {
  await db?.close();
});
test("admin cookies are HttpOnly and private routes reject anonymous access", async () => {
  const response = await write(request(app), "post", "/api/auth/login", {
    email: "admin@example.com",
    password: "test-password-1234",
  });
  assert.equal(response.status, 200);
  assert.ok(
    response.headers["set-cookie"].every(
      (c) => c.includes("HttpOnly") && c.includes("SameSite=Lax"),
    ),
  );
  assert.equal((await request(app).get("/api/orders")).status, 401);
});
test("CSRF rejects disallowed origins and missing custom headers", async () => {
  assert.equal(
    (
      await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@example.com", password: "test-password-1234" })
    ).status,
    403,
  );
  assert.equal(
    (
      await request(app)
        .post("/api/auth/login")
        .set("Origin", "https://evil.example")
        .set("X-Urfa-Request", "1")
        .send({})
    ).status,
    403,
  );
});
test("refresh rotates, replay fails, logout revokes current access", async () => {
  const client = request.agent(app);
  const response = await write(client, "post", "/api/auth/login", {
    email: "admin@example.com",
    password: "test-password-1234",
  });
  const old = response.headers["set-cookie"].map((c) => c.split(";")[0]);
  assert.equal(
    (await write(client, "post", "/api/auth/refresh", {})).status,
    200,
  );
  assert.equal(
    (
      await write(request(app), "post", "/api/auth/refresh", {}).set(
        "Cookie",
        old,
      )
    ).status,
    401,
  );
  await write(client, "post", "/api/auth/logout", {});
  assert.equal(
    (await request(app).get("/api/auth/verify").set("Cookie", old)).status,
    401,
  );
});
const orderInput = (extra = {}) => ({
  expectedTotalCents: 2700,
  date,
  time: "18:00",
  customer,
  requestKey: randomUUID(),
  items: [
    {
      id: product.id,
      quantity: 2,
      options: { side: "rice" },
      extras: ["sauce"],
    },
  ],
  ...extra,
});
let savedOrder;
test("server computes prices; retries are idempotent; tracking hides contact data", async () => {
  const input = orderInput({ total: 0 });
  const response = await write(request(app), "post", "/api/orders", input);
  assert.equal(response.status, 201, JSON.stringify(response.body));
  assert.equal(response.body.totalCents, 2700);
  savedOrder = response.body;
  const retry = await write(request(app), "post", "/api/orders", input);
  assert.equal(retry.body.id, response.body.id);
  assert.equal(
    (await request(app).get(`/api/orders/${savedOrder.id}`)).status,
    401,
  );
  const tracking = await request(app)
    .get(`/api/orders/${savedOrder.id}`)
    .set("X-Order-Token", savedOrder.trackingToken);
  assert.equal(tracking.status, 200);
  assert.equal(tracking.body.customer, undefined);
  assert.equal(tracking.body.totalCents, 2700);
});
test("past date and past time today rejected by server", async () => {
  for (const input of [
    orderInput({ date: "2020-01-01" }),
    orderInput({
      date: DateTime.now().setZone("Europe/Berlin").toISODate(),
      time: "00:00",
    }),
  ]) {
    const result = await write(request(app), "post", "/api/orders", input);
    assert.equal(result.status, 409, JSON.stringify(result.body));
  }
});
test("unknown options, duplicate extras and stock changes rejected", async () => {
  for (const items of [
    [{ id: product.id, quantity: 1, options: { side: "fake" } }],
    [
      {
        id: product.id,
        quantity: 1,
        options: { side: "rice" },
        extras: ["sauce", "sauce"],
      },
    ],
    [{ id: product.id, quantity: 1, options: {} }],
  ])
    assert.equal(
      (await write(request(app), "post", "/api/orders", orderInput({ items })))
        .status,
      400,
    );
  await write(admin, "put", `/api/products/${product.id}`, {
    ...product,
    stockAvailable: false,
  });
  assert.equal(
    (await write(request(app), "post", "/api/orders", orderInput())).status,
    409,
  );
  await write(admin, "put", `/api/products/${product.id}`, product);
});
test("order transitions enforced and notifications queued transactionally", async () => {
  assert.equal(
    (
      await write(admin, "put", `/api/orders/${savedOrder.id}/status`, {
        status: "delivered",
      })
    ).status,
    409,
  );
  for (const status of ["confirmed", "preparing", "ready", "delivered"])
    assert.equal(
      (
        await write(admin, "put", `/api/orders/${savedOrder.id}/status`, {
          status,
        })
      ).status,
      200,
    );
  const queue = await db.query(
    "SELECT * FROM outbox WHERE dedupe_key LIKE 'order:%'",
  );
  assert.equal(queue.rows.length, 3);
});
let reservation;
test("concurrent overlapping bookings allocate capacity once", async () => {
  const results = await Promise.all([
    write(request(app), "post", "/api/reservations", booking()),
    write(
      request(app),
      "post",
      "/api/reservations",
      booking({ time: "18:30" }),
    ),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  reservation = results.find((r) => r.status === 201).body;
});
test("reservation past date and impossible party rejected", async () => {
  assert.equal(
    (
      await write(
        request(app),
        "post",
        "/api/reservations",
        booking({ date: "2020-01-01" }),
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await write(
        request(app),
        "post",
        "/api/reservations",
        booking({ people: 20, time: "12:00" }),
      )
    ).status,
    409,
  );
});
test("cancellation requires secret and releases held table", async () => {
  assert.equal(
    (
      await write(
        request(app),
        "post",
        `/api/reservations/${reservation.id}/cancel`,
        {},
      )
    ).status,
    404,
  );
  const result = await write(
    request(app),
    "post",
    `/api/reservations/${reservation.id}/cancel`,
    {},
  ).set("X-Reservation-Token", reservation.cancellationToken);
  assert.equal(result.status, 200);
  assert.equal(
    (await write(request(app), "post", "/api/reservations", booking())).status,
    201,
  );
});
test("dashboard derives revenue only from completed orders", async () => {
  const result = await admin.get("/api/admin/dashboard");
  assert.equal(result.status, 200, JSON.stringify(result.body));
  assert.equal(result.body.revenueCents, 2700);
  assert.ok(result.body.week.length);
});
test("outbox delivery marks only successful mail and retries failure", async () => {
  let count = 0;
  const result = await processNotifications(db, cfg, {
    sendMail: async () => {
      count++;
      if (count === 1) throw new Error("Provider unavailable");
    },
  });
  assert.ok(result.sent > 0);
  const failed = (
    await db.query("SELECT * FROM outbox WHERE sent_at IS NULL AND attempts=1")
  ).rows;
  assert.equal(failed.length, 1);
  assert.equal(
    (await processNotifications(db, { ...cfg, emailEnabled: false })).enabled,
    false,
  );
});
test("checkout requires consent to current total after a price change", async () => {
  const result = await write(
    request(app),
    "post",
    "/api/orders",
    orderInput({ expectedTotalCents: 1 }),
  );
  assert.equal(result.status, 409);
});
test("expired database session rejects otherwise valid access token", async () => {
  const client = request.agent(app);
  await write(client, "post", "/api/auth/login", {
    email: "admin@example.com",
    password: "test-password-1234",
  });
  await db.query("UPDATE sessions SET expires_at=now()-interval '1 minute'");
  assert.equal((await client.get("/api/auth/verify")).status, 401);
});
