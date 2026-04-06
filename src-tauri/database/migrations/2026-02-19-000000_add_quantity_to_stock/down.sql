-- SQLite doesn't support DROP COLUMN directly in older versions.
-- Recreate the table without the quantity column.
CREATE TABLE stock_backup AS SELECT stock_id, product_id, catagory, satang FROM stock;
DROP TABLE stock;
CREATE TABLE stock (
  stock_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  catagory VARCHAR NOT NULL,
  satang INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES Product (product_id)
);
INSERT INTO stock (stock_id, product_id, catagory, satang) SELECT stock_id, product_id, catagory, satang FROM stock_backup;
DROP TABLE stock_backup;
