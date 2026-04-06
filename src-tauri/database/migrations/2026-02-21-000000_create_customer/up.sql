PRAGMA foreign_keys = OFF;
PRAGMA defer_foreign_keys = ON;
-- Fix any existing foreign key violations from before to pass Diesel's PRAGMA foreign_key_check
DELETE FROM receipt_item
WHERE receipt_id NOT IN (
        SELECT receipt_id
        FROM receipt_list
    );
DELETE FROM receipt_item
WHERE product_id NOT IN (
        SELECT product_id
        FROM product
    );
DELETE FROM stock
WHERE product_id NOT IN (
        SELECT product_id
        FROM product
    );
DELETE FROM product
WHERE category_id NOT IN (
        SELECT id
        FROM category
    );
CREATE TABLE customer (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tax_id TEXT,
    address TEXT
);
ALTER TABLE receipt_list
ADD COLUMN customer_id INTEGER REFERENCES customer(id);
PRAGMA foreign_keys = ON;