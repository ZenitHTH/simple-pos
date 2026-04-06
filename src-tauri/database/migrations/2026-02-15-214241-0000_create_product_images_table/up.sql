CREATE TABLE product_images (
    product_id INTEGER NOT NULL,
    image_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, image_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);
