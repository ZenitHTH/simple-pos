-- Revert changes
ALTER TABLE product ADD COLUMN image_object_position TEXT;
ALTER TABLE images DROP COLUMN image_object_position;
