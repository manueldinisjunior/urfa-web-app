CREATE TABLE IF NOT EXISTS admins (id uuid PRIMARY KEY, email text UNIQUE NOT NULL, password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sessions (id uuid PRIMARY KEY, admin_id uuid NOT NULL REFERENCES admins(id), refresh_hash text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS products (id text PRIMARY KEY, data jsonb NOT NULL, deleted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS settings (id integer PRIMARY KEY CHECK(id=1), data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS restaurant_tables (id uuid PRIMARY KEY, table_number integer UNIQUE NOT NULL, capacity integer NOT NULL CHECK(capacity BETWEEN 1 AND 20));
CREATE SEQUENCE IF NOT EXISTS order_numbers;
CREATE SEQUENCE IF NOT EXISTS reservation_numbers;
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY, order_number text UNIQUE NOT NULL, tracking_hash text NOT NULL,
 customer jsonb NOT NULL, items jsonb NOT NULL, total_cents integer NOT NULL CHECK(total_cents >= 0),
 status text NOT NULL CHECK(status IN ('pending','confirmed','preparing','ready','delivered','rejected')),
 notes text NOT NULL DEFAULT '', pickup_at timestamptz NOT NULL, estimated_minutes integer NOT NULL,
 history jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 request_key uuid UNIQUE NOT NULL, request_hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS reservations (
 id uuid PRIMARY KEY, reservation_number text UNIQUE NOT NULL, token_hash text NOT NULL,
 customer jsonb NOT NULL, starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 people integer NOT NULL CHECK(people BETWEEN 1 AND 20), table_id uuid NOT NULL REFERENCES restaurant_tables(id),
 status text NOT NULL CHECK(status IN ('pending','confirmed','cancelled')), notes text NOT NULL DEFAULT '',
 reason text NOT NULL DEFAULT '', history jsonb NOT NULL, reminder_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 request_key uuid UNIQUE NOT NULL, request_hash text NOT NULL, CHECK(ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS reservations_availability ON reservations(starts_at,ends_at) WHERE status <> 'cancelled';
CREATE INDEX IF NOT EXISTS orders_created ON orders(created_at DESC);
CREATE TABLE IF NOT EXISTS audit_log (id uuid PRIMARY KEY, admin_id uuid REFERENCES admins(id), action text NOT NULL, entity_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS outbox (id uuid PRIMARY KEY, dedupe_key text UNIQUE NOT NULL, recipient text NOT NULL, subject text NOT NULL, body text NOT NULL, attempts integer NOT NULL DEFAULT 0, available_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz, last_error text);
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
