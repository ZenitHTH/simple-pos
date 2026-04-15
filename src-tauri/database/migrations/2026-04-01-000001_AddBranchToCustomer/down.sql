-- Down Migration
PRAGMA defer_foreign_keys = ON;

CREATE TABLE "customer_new" (
	"id" INTEGER NOT NULL,
	"name" TEXT NOT NULL,
	"tax_id" TEXT,
	"address" TEXT,
	PRIMARY KEY("id")
);

INSERT INTO "customer_new" ("id", "name", "tax_id", "address")
SELECT id, name, tax_id, address
FROM customer;

DROP TABLE customer;
ALTER TABLE customer_new RENAME TO customer;
