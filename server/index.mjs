import express from "express";
import path from "node:path";
import { openDatabase } from "./db.mjs";
import { createApp } from "./app.mjs";
import { config } from "./config.mjs";
import { processNotifications } from "./notifications.mjs";
const cfg = config();
const db = await openDatabase();
const app = createApp(db, cfg);
app.use(express.static(path.resolve("dist"), { maxAge: "1h" }));
const server = app.listen(cfg.port, "0.0.0.0", () =>
  console.log(
    `Urfa API listening on ${cfg.port}; email ${cfg.emailEnabled ? "enabled" : "disabled"}`,
  ),
);
let busy = false;
const work = async () => {
  if (busy) return;
  busy = true;
  try {
    await processNotifications(db, cfg);
  } catch {
    console.error("Notification worker failed");
  } finally {
    busy = false;
  }
};
const timer = setInterval(work, 60000);
timer.unref();
async function stop() {
  clearInterval(timer);
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
