-- Your SQL goes here
CREATE TABLE receipt_item (
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
receipt_id INTEGER NOT NULL,
product_id INTEGER NOT NULL ,
quantity INTEGER NOT NULL,
FOREIGN KEY (receipt_id) REFERENCES ReceiptList (receipt_id),
FOREIGN KEY (product_id) REFERENCES Product (product_id)
)
