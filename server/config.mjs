import { randomBytes } from "node:crypto";
export function config(env = process.env) {
  const production = env.NODE_ENV === "production";
  if (
    production &&
    (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || !env.PUBLIC_URL)
  )
    throw new Error("Set a strong JWT_SECRET (32+ characters) and PUBLIC_URL");
  return {
    production,
    secret: env.JWT_SECRET || randomBytes(48).toString("hex"),
    publicUrl: (env.PUBLIC_URL || "http://localhost:3000").replace(/\/$/, ""),
    origins: (
      env.ALLOWED_ORIGINS ||
      env.PUBLIC_URL ||
      "http://localhost:3000,http://terminal.local:4173"
    ).split(","),
    twilioSid: env.TWILIO_ACCOUNT_SID,
    twilioToken: env.TWILIO_AUTH_TOKEN,
    twilioFrom: env.TWILIO_FROM,
    smsEnabled: Boolean(
      env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM,
    ),
    smtpUrl: env.SMTP_URL,
    mailFrom: env.MAIL_FROM,
    adminEmail: env.ADMIN_NOTIFICATION_EMAIL,
    port: Number(env.PORT || 4000),
    emailEnabled: Boolean(env.SMTP_URL && env.MAIL_FROM),
  };
}
