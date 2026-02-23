-- Migration to add precision columns for volume fields
ALTER TABLE "material" ADD COLUMN "precision" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "recipe_item" ADD COLUMN "volume_use_precision" INTEGER NOT NULL DEFAULT 0;
