CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO category (name) VALUES ('Coffee'), ('Tea'), ('Bakery'), ('Dessert');
