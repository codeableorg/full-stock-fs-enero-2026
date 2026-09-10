DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
--
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL,
  img_src TEXT NOT NULL,
  alt VARCHAR NOT NULL,
  description TEXT NOT NULL
);
--
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  img_src TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories (id),
  features TEXT [] NOT NULL DEFAULT '{}'
);
--
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password TEXT NOT NULL
);
-- 
CREATE TABLE IF NOT EXISTS carts(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id)
);
-- --
CREATE TABLE IF NOT EXISTS cart_items(
  cart_id INTEGER NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (cart_id, product_id)
);
--
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  shipping_info JSONB NOT NULL,
  total INTEGER NOT NULL CHECK(total > 0),
  status VARCHAR NOT NULL default 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--
CREATE TABLE IF NOT EXISTS order_items(
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id),
  name VARCHAR NOT NULL,
  price INTEGER NOT NULL CHECK(price > 0),
  img_src TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  PRIMARY KEY (order_id, product_id)
)