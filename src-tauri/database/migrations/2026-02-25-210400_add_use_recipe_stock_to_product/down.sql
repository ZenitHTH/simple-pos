-- SQLite doesn't support DROP COLUMN easily in older versions, but for recent ones it does.
-- However, Diesel migrations often avoid it or use temporary tables.
-- For simplicity in this environment:
ALTER TABLE product DROP COLUMN use_recipe_stock;
