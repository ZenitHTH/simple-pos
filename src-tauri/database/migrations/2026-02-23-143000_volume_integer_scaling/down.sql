-- Rollback migration (SQLite doesn't support DROP COLUMN easily before 3.35.0, so we just recreate or leave it if acceptable)
-- For completeness, we rename and recreate
PRAGMA foreign_keys=OFF;

CREATE TABLE "material_old" AS SELECT * FROM "material";
DROP TABLE "material";
CREATE TABLE "material" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR NOT NULL,
	"type" VARCHAR NOT NULL,
	"volume" INTEGER NOT NULL,
	"quantity" INTEGER NOT NULL,
	PRIMARY KEY("id")
);
INSERT INTO "material" ("id", "name", "type", "volume", "quantity")
SELECT "id", "name", "type", "volume", "quantity" FROM "material_old";
DROP TABLE "material_old";

CREATE TABLE "recipe_item_old" AS SELECT * FROM "recipe_item";
DROP TABLE "recipe_item";
CREATE TABLE "recipe_item" (
	"id" INTEGER NOT NULL,
	"recipe_list_id" INTEGER NOT NULL,
	"material_id" INTEGER NOT NULL,
	"volume_use" INTEGER NOT NULL,
	"unit" TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("recipe_list_id") REFERENCES "recipe_list"("id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY ("material_id") REFERENCES "material"("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
INSERT INTO "recipe_item" ("id", "recipe_list_id", "material_id", "volume_use", "unit")
SELECT "id", "recipe_list_id", "material_id", "volume_use", "unit" FROM "recipe_item_old";
DROP TABLE "recipe_item_old";

PRAGMA foreign_keys=ON;
