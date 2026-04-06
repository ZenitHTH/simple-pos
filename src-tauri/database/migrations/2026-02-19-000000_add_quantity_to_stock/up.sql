-- Add quantity column to stock table
ALTER TABLE stock ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
