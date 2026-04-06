PRAGMA defer_foreign_keys = ON;

-- Revert Tables
DROP TABLE IF EXISTS "recipe_item";
DROP TABLE IF EXISTS "recipe_list";
DROP TABLE IF EXISTS "material";

-- Revert receipt_item (remove satang_at_sale and add back category_id)
CREATE TABLE IF NOT EXISTS "receipt_item_old" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"receipt_id" INTEGER NOT NULL,
	"product_id" INTEGER NOT NULL,
	"category_id" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	FOREIGN KEY ("receipt_id") REFERENCES "receipt_list"("receipt_id"),
	FOREIGN KEY ("product_id") REFERENCES "product"("product_id"),
	FOREIGN KEY ("category_id") REFERENCES "category"("id")
);

INSERT INTO "receipt_item_old" ("id", "receipt_id", "product_id", "category_id", "quantity")
SELECT ri.id, ri.receipt_id, ri.product_id, p.category_id, ri.quantity
FROM receipt_item ri
JOIN product p ON ri.product_id = p.product_id;

DROP TABLE receipt_item;
ALTER TABLE receipt_item_old RENAME TO receipt_item;

-- Revert Stock (re-add catagory)
CREATE TABLE IF NOT EXISTS "stock_old" (
	"stock_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"product_id" INTEGER NOT NULL,
	"catagory" VARCHAR NOT NULL,
	"satang" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	FOREIGN KEY ("product_id") REFERENCES "product"("product_id")
);

INSERT INTO "stock_old" ("stock_id", "product_id", "catagory", "satang", "quantity")
SELECT s.stock_id, s.product_id, c.name, s.satang, s.quantity
FROM stock s
JOIN product p ON s.product_id = p.product_id
JOIN category c ON p.category_id = c.id;

DROP TABLE stock;
ALTER TABLE stock_old RENAME TO stock;
DROP INDEX IF EXISTS stock_index_product_id;

-- Revert Product (re-add AUTOINCREMENT)
CREATE TABLE IF NOT EXISTS "product_old" (
	"product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"title" VARCHAR NOT NULL,
	"category_id" INTEGER NOT NULL,
	"satang" INTEGER NOT NULL,
	FOREIGN KEY ("category_id") REFERENCES "category"("id")
);

INSERT INTO "product_old" ("product_id", "title", "category_id", "satang")
SELECT product_id, title, category_id, satang
FROM product;

DROP TABLE product;
ALTER TABLE product_old RENAME TO product;
