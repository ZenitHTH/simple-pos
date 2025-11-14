-- Your SQL goes here
CREATE TABLE Receipt (
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
receipt_id INTEGER NOT NULL,
FORGIEN KEY (receipt_id) REFERENCES ReceiptList (receipt_id),
product_id INTEGER NOT NULL ,
FORGIEN KEY (product_id) REFERENCES Product (product_id),
quantity INTEGER NOT NULL
)
