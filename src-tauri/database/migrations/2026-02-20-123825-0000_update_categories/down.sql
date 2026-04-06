PRAGMA defer_foreign_keys = ON;

CREATE TABLE product_new (
  product_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  title VARCHAR NOT NULL,
  catagory VARCHAR NOT NULL,
  satang INTEGER NOT NULL
);

INSERT INTO product_new (product_id, title, catagory, satang)
SELECT p.product_id, p.title, c.name, p.satang
FROM product p
JOIN category c ON p.category_id = c.id;

CREATE TABLE receipt_item_new (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  receipt_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (receipt_id) REFERENCES receipt_list (receipt_id),
  FOREIGN KEY (product_id) REFERENCES product (product_id)
);

INSERT INTO receipt_item_new (id, receipt_id, product_id, quantity)
SELECT id, receipt_id, product_id, quantity
FROM receipt_item;

DROP TABLE receipt_item;
DROP TABLE product;

ALTER TABLE product_new RENAME TO product;
ALTER TABLE receipt_item_new RENAME TO receipt_item;
