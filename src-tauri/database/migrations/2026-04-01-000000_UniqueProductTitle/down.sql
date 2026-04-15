-- Down Migration
PRAGMA defer_foreign_keys = ON;

CREATE TABLE "product_new" (
	"product_id" INTEGER NOT NULL,
	"title" VARCHAR NOT NULL,
	"category_id" INTEGER NOT NULL,
	"satang" INTEGER NOT NULL,
    "use_recipe_stock" BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY("product_id"),
	FOREIGN KEY ("category_id") REFERENCES "category"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO "product_new" ("product_id", "title", "category_id", "satang", "use_recipe_stock")
SELECT product_id, title, category_id, satang, use_recipe_stock
FROM product;

DROP TABLE product;
ALTER TABLE product_new RENAME TO product;
