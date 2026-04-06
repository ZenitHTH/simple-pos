PRAGMA defer_foreign_keys = ON;

-- Ensure all current string categories exist in the category table
INSERT INTO category (name)
SELECT DISTINCT catagory FROM product WHERE catagory NOT IN (SELECT name FROM category);

-- Migrate Product table
CREATE TABLE product_new (
    product_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title VARCHAR NOT NULL,
    category_id INTEGER NOT NULL,
    satang INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id)
);

INSERT INTO product_new (product_id, title, category_id, satang)
SELECT p.product_id, p.title, c.id, p.satang
FROM product p
JOIN category c ON p.catagory = c.name;

-- Migrate receipt_item table
CREATE TABLE receipt_item_new (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    receipt_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (receipt_id) REFERENCES receipt_list (receipt_id),
    FOREIGN KEY (product_id) REFERENCES product (product_id),
    FOREIGN KEY (category_id) REFERENCES category (id)
);

INSERT INTO receipt_item_new (id, receipt_id, product_id, category_id, quantity)
SELECT ri.id, ri.receipt_id, ri.product_id, p.category_id, ri.quantity
FROM receipt_item ri
JOIN product_new p ON ri.product_id = p.product_id;

-- Drop old tables and rename new ones
DROP TABLE receipt_item;
DROP TABLE product;

ALTER TABLE product_new RENAME TO product;
ALTER TABLE receipt_item_new RENAME TO receipt_item;
