
-- Fitness classes
CREATE TABLE IF NOT EXISTS fitness_classes (
    id INTEGER PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    intensity VARCHAR(20) NOT NULL,
    duration VARCHAR(30) NOT NULL,
    trainer VARCHAR(100) NOT NULL,
    spots_left INTEGER NOT NULL,
    rating NUMERIC(2, 1) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membership plans
CREATE TABLE IF NOT EXISTS memberships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    benefits TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Persistent login sessions
CREATE TABLE IF NOT EXISTS "session" (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
    ON "session" (expire);

    
-- Add a price to each fitness class
ALTER TABLE fitness_classes
ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) NOT NULL DEFAULT 150.00;
UPDATE fitness_classes
SET price = 150.00;

-- Orders: one record per purchase
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'zar',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items: the classes purchased
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES fitness_classes(id),
    class_title VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id
ON orders(user_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
ON order_items(order_id);

