-- Down Migration
PRAGMA defer_foreign_keys = ON;

CREATE TABLE "material_new" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "precision" INTEGER NOT NULL,
    PRIMARY KEY("id")
);

INSERT INTO "material_new" ("id", "name", "type", "volume", "quantity", "precision")
SELECT id, name, type, volume, quantity, precision
FROM material;

DROP TABLE material;
ALTER TABLE material_new RENAME TO material;
