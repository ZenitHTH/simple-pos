-- Your SQL goes here
CREATE TABLE receipt_item (
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
receipt_id INTEGER NOT NULL,
product_id INTEGER NOT NULL ,
quantity INTEGER NOT NULL,
FOREIGN KEY (receipt_id) REFERENCES receipt_list (receipt_id),
FOREIGN KEY (product_id) REFERENCES product (product_id)
)
