DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
--
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL,
  img_src VARCHAR NOT NULL,
  alt VARCHAR NOT NULL,
  description TEXT NOT NULL
);
--
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  img_src VARCHAR NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories (id),
  features TEXT [] NOT NULL DEFAULT '{}'
);
--
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password TEXT NOT NULL
);
-- 
CREATE TABLE carts(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
);
--
CREATE TABLE cart_items(
  cart_id INTEGER NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (cart_id, product_id)
);
--
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  shipping_info JSONB NOT NULL,
  total INTEGER NOT NULL CHECK(total > 0),
  status VARCHAR NOT NULL default 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);