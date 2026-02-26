-- Add to images table
ALTER TABLE images ADD COLUMN image_object_position TEXT;

-- Remove from product table
ALTER TABLE product DROP COLUMN image_object_position;
