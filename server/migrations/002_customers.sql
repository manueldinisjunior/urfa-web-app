CREATE TABLE customers (id uuid PRIMARY KEY, email text UNIQUE NOT NULL, verified_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE customer_tokens (token_hash text PRIMARY KEY, customer_id uuid NOT NULL REFERENCES customers(id), expires_at timestamptz NOT NULL);
CREATE TABLE customer_sessions (token_hash text PRIMARY KEY, customer_id uuid NOT NULL REFERENCES customers(id), expires_at timestamptz NOT NULL);
CREATE TABLE customer_favorites (customer_id uuid NOT NULL REFERENCES customers(id), product_id text NOT NULL REFERENCES products(id), PRIMARY KEY(customer_id,product_id));
CREATE TABLE customer_carts (customer_id uuid PRIMARY KEY REFERENCES customers(id), items jsonb NOT NULL, expires_at timestamptz NOT NULL);
