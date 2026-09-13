import nodemailer from "nodemailer";
import { queueEmail, reservationMail } from "./domain.mjs";

// Outbox delivery is at-least-once: a provider accepting mail before a DB commit
// can cause a retry. A stable Message-ID assists deduplication.
export async function processNotifications(db, cfg, transport) {
  await db.query('DELETE FROM customer_carts WHERE expires_at<=now()');
  await db.query('DELETE FROM customer_tokens WHERE expires_at<=now()');
  await db.query('DELETE FROM customer_sessions WHERE expires_at<=now()');
  if (!cfg.emailEnabled && !cfg.smsEnabled) return { enabled: false, sent: 0 };
  const mailer =
    transport ||
    nodemailer.createTransport({
      url: cfg.smtpUrl,
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
  await db.tx(async (tx) => {
    const { rows } = await tx.query(
      "SELECT * FROM reservations WHERE status='confirmed' AND reminder_at IS NULL AND starts_at > now() AND starts_at <= now()+interval '2 hours' FOR UPDATE",
    );
    for (const row of rows) {
      if (cfg.smsEnabled && row.customer.smsOptIn)
        await queueEmail(
          tx,
          `sms:reminder:${row.id}`,
          row.customer.phone,
          "Reservierungserinnerung",
          reservationMail(row),
        );
      if (cfg.emailEnabled)
        await queueEmail(
          tx,
          `reminder:${row.id}`,
          row.customer.email,
          "Erinnerung an deine Reservierung",
          reservationMail(row),
        );
      await tx.query("UPDATE reservations SET reminder_at=now() WHERE id=$1", [
        row.id,
      ]);
    }
  });
  let sent = 0;
  for (let i = 0; i < 20; i++) {
    const processed = await db.tx(async (tx) => {
      const { rows } = await tx.query(
        "SELECT * FROM outbox WHERE sent_at IS NULL AND available_at<=now() AND attempts<8 AND (($1 AND dedupe_key NOT LIKE 'sms:%') OR ($2 AND dedupe_key LIKE 'sms:%')) ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 1",
        [cfg.emailEnabled, Boolean(cfg.smsEnabled)],
      );
      if (!rows[0]) return false;
      const row = rows[0];
      try {
        if (row.dedupe_key.startsWith("sms:")) {
          const result = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${cfg.twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${Buffer.from(`${cfg.twilioSid}:${cfg.twilioToken}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: row.recipient,
                From: cfg.twilioFrom,
                Body: row.body,
              }),
              signal: AbortSignal.timeout(15000),
            },
          );
          if (!result.ok) throw new Error("SMS rejected");
        } else
          await mailer.sendMail({
            from: cfg.mailFrom,
            to: row.recipient,
            subject: row.subject,
            text: row.body,
            messageId: `<${row.id}@urfa-notifications>`,
          });
        await tx.query(
          "UPDATE outbox SET sent_at=now(),attempts=attempts+1,last_error=NULL WHERE id=$1",
          [row.id],
        );
        sent++;
      } catch {
        await tx.query(
          "UPDATE outbox SET attempts=attempts+1,last_error='Delivery failed; check provider logs',available_at=now()+interval '5 minutes' WHERE id=$1",
          [row.id],
        );
      }
      return true;
    });
    if (!processed) break;
  }
  await db.query("DELETE FROM rate_limits WHERE expires_at<now()");
  await db.query("DELETE FROM sessions WHERE expires_at<now()");
  return { enabled: true, sent };
}
