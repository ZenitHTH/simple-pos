-- Your SQL goes here
CREATE TABLE Stock (
  strock_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES Product (product_id),
  catagory VARCHAR NOT NULL,
  satang INTEGER NOT NULL
)
