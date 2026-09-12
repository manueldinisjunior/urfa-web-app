import {
  randomBytes,
  randomUUID,
  scrypt as scryptCb,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import { assert } from "./validation.mjs";
const scrypt = promisify(scryptCb);
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("hex");
export async function passwordHash(password) {
  const salt = token();
  return `${salt}:${(await scrypt(password, salt, 64)).toString("hex")}`;
}
export async function passwordMatches(password, stored) {
  const [salt, key] = stored.split(":");
  const result = await scrypt(password, salt, 64);
  return key.length === 128 && timingSafeEqual(Buffer.from(key, "hex"), result);
}
export function authService(db, cfg) {
  const secret = new TextEncoder().encode(cfg.secret);
  const cookieOptions = {
    httpOnly: true,
    secure: cfg.production,
    sameSite: "lax",
    path: "/api/auth",
  };
  async function issue(res, session) {
    const access = await new SignJWT({ sid: session.id })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.admin_id)
      .setIssuedAt()
      .setExpirationTime("15m")
      .setIssuer("urfa")
      .setAudience("urfa-admin")
      .sign(secret);
    res.cookie("urfa_access", access, {
      ...cookieOptions,
      path: "/api",
      maxAge: 900000,
    });
  }
  return {
    async login(email, password, res) {
      const { rows } = await db.query("SELECT * FROM admins WHERE email=$1", [
        email.toLowerCase(),
      ]);
      const admin = rows[0];
      // Perform the same expensive KDF even when the account does not exist.
      const valid = await passwordMatches(
        password,
        admin?.password_hash || `${"0".repeat(64)}:${"0".repeat(128)}`,
      );
      assert(admin && valid, 401, "E-Mail oder Passwort ist falsch");
      const refresh = token();
      const session = { id: randomUUID(), admin_id: admin.id };
      await db.query(
        "INSERT INTO sessions(id,admin_id,refresh_hash,expires_at) VALUES($1,$2,$3,now()+interval '7 days')",
        [session.id, admin.id, hash(refresh)],
      );
      res.cookie("urfa_refresh", `${session.id}.${refresh}`, {
        ...cookieOptions,
        maxAge: 604800000,
      });
      await issue(res, session);
      return { email: admin.email, expiresAt: Date.now() + 900000 };
    },
    async verify(req) {
      try {
        const { payload } = await jwtVerify(
          req.cookies.urfa_access || "",
          secret,
          { issuer: "urfa", audience: "urfa-admin", algorithms: ["HS256"] },
        );
        const { rows } = await db.query(
          "SELECT s.*, a.email FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.id=$1 AND s.admin_id=$2 AND expires_at>now()",
          [payload.sid, payload.sub],
        );
        assert(rows.length, 401, "Sitzung abgelaufen");
        return {
          id: payload.sub,
          email: rows[0].email,
          expiresAt: payload.exp * 1000,
        };
      } catch {
        assert(false, 401, "Bitte erneut anmelden");
      }
    },
    async refresh(req, res) {
      const [sid, value] = (req.cookies.urfa_refresh || "").split(".");
      assert(
        sid && /^[0-9a-f-]{36}$/.test(sid) && value,
        401,
        "Bitte erneut anmelden",
      );
      const next = token();
      const session = await db.tx(async (tx) => {
        const { rows } = await tx.query(
          "SELECT * FROM sessions WHERE id=$1 AND expires_at>now() FOR UPDATE",
          [sid],
        );
        assert(
          rows[0] && rows[0].refresh_hash === hash(value),
          401,
          "Bitte erneut anmelden",
        );
        await tx.query("UPDATE sessions SET refresh_hash=$1 WHERE id=$2", [
          hash(next),
          sid,
        ]);
        return rows[0];
      });
      res.cookie("urfa_refresh", `${sid}.${next}`, {
        ...cookieOptions,
        maxAge: Math.max(
          0,
          new Date(session.expires_at).getTime() - Date.now(),
        ),
      });
      await issue(res, session);
      return { expiresAt: Date.now() + 900000 };
    },
    async logout(req, res) {
      const [sid, value] = (req.cookies.urfa_refresh || "").split(".");
      if (sid && /^[0-9a-f-]{36}$/.test(sid) && value)
        await db.query("DELETE FROM sessions WHERE id=$1 AND refresh_hash=$2", [
          sid,
          hash(value),
        ]);
      res.clearCookie("urfa_access", { ...cookieOptions, path: "/api" });
      res.clearCookie("urfa_refresh", cookieOptions);
    },
  };
}
