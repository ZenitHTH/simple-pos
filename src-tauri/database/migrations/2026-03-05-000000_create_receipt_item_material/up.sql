CREATE TABLE receipt_item_material (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    receipt_item_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    volume_used INTEGER NOT NULL,
    precision INTEGER NOT NULL,
    FOREIGN KEY(receipt_item_id) REFERENCES receipt_item(id),
    FOREIGN KEY(material_id) REFERENCES material(id)
);