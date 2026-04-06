PRAGMA defer_foreign_keys = ON;

-- 1. Create Category (Use IF NOT EXISTS as it might exist from previous migration, but redefine to be sure)
CREATE TABLE IF NOT EXISTS "category" (
	"id" INTEGER NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id")
);

-- 2. Create Product with category_id
CREATE TABLE IF NOT EXISTS "product_new" (
	"product_id" INTEGER NOT NULL,
	"title" VARCHAR NOT NULL,
	"category_id" INTEGER NOT NULL,
	"satang" INTEGER NOT NULL,
	PRIMARY KEY("product_id"),
	FOREIGN KEY ("category_id") REFERENCES "category"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO "product_new" ("product_id", "title", "category_id", "satang")
SELECT product_id, title, category_id, satang
FROM product;

-- 3. Create Stock without category
CREATE TABLE IF NOT EXISTS "stock_new" (
	"stock_id" INTEGER NOT NULL,
	"product_id" INTEGER NOT NULL,
	"satang" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	PRIMARY KEY("stock_id"),
	FOREIGN KEY ("product_id") REFERENCES "product"("product_id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO "stock_new" ("stock_id", "product_id", "satang", "quantity")
SELECT stock_id, product_id, satang, quantity
FROM stock;

CREATE INDEX IF NOT EXISTS "stock_index_product_id" ON "stock_new" ("product_id");

-- 4. Create Receipt System with satang_at_sale
-- receipt_list already exists, keep it
CREATE TABLE IF NOT EXISTS "receipt_list" (
	"receipt_id" INTEGER NOT NULL,
	"datetime_unix" INTEGER NOT NULL,
	PRIMARY KEY("receipt_id")
);

CREATE TABLE IF NOT EXISTS "receipt_item_new" (
	"id" INTEGER NOT NULL,
	"receipt_id" INTEGER NOT NULL,
	"product_id" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	"satang_at_sale" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("receipt_id") REFERENCES "receipt_list"("receipt_id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("product_id") REFERENCES "product"("product_id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO "receipt_item_new" ("id", "receipt_id", "product_id", "quantity", "satang_at_sale")
SELECT ri.id, ri.receipt_id, ri.product_id, ri.quantity, p.satang
FROM receipt_item ri
JOIN product p ON ri.product_id = p.product_id;

-- 6. Create Material and Recipe System (5. Images already correct)
CREATE TABLE IF NOT EXISTS "material" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR NOT NULL,
	"type" VARCHAR NOT NULL,
	"volume" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "recipe_list" (
	"id" INTEGER NOT NULL,
	"product_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("product_id") REFERENCES "product"("product_id")
	ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "recipe_item" (
	"id" INTEGER NOT NULL,
	"recipe_list_id" INTEGER NOT NULL,
	"material_id" INTEGER NOT NULL,
	"volume_use" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("recipe_list_id") REFERENCES "recipe_list"("id")
	ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY ("material_id") REFERENCES "material"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Clean up and Rename
DROP TABLE receipt_item;
DROP TABLE stock;
DROP TABLE product;

ALTER TABLE product_new RENAME TO product;
ALTER TABLE stock_new RENAME TO stock;
ALTER TABLE receipt_item_new RENAME TO receipt_item;
-- Recreate the index on the renamed table
DROP INDEX IF EXISTS stock_index_product_id;
CREATE INDEX stock_index_product_id ON stock ("product_id");
