pub mod model;
pub mod schema;

use crate::product::model::{NewProduct, Product};
use crate::schema::product as product_schema;
use diesel::prelude::*;
use diesel::result::Error;

// FIX: Return Result<Product, Error> instead of ()
pub fn insert_product(conn: &mut SqliteConnection, newprod: &NewProduct) -> Result<Product, Error> {
    diesel::insert_into(product_schema::table)
        .values(newprod)
        .returning(Product::as_returning())
        .get_result(conn)
    // FIX: Removed .expect(), letting the caller handle the error
}

pub fn remove_product(conn: &mut SqliteConnection, id: i32) -> Result<usize, Error> {
    diesel::delete(product_schema::dsl::product.find(id)).execute(conn)
}

pub fn remove_product_images_link(
    conn: &mut SqliteConnection,
    target_id: i32,
) -> Result<usize, Error> {
    use crate::schema::product_images::dsl::{product_id, product_images};
    diesel::delete(product_images.filter(product_id.eq(target_id))).execute(conn)
}

pub fn check_product_dependencies(
    conn: &mut SqliteConnection,
    target_id: i32,
) -> Result<bool, Error> {
    use crate::schema::receipt_item::dsl::{product_id as receipt_pid, receipt_item};

    let receipt_count: i64 = receipt_item
        .filter(receipt_pid.eq(target_id))
        .count()
        .get_result(conn)?;

    Ok(receipt_count > 0)
}

pub fn find_product_by_title(
    conn: &mut SqliteConnection,
    target_title: &str,
) -> Result<Option<Product>, Error> {
    use product_schema::dsl::{product, title};
    product
        .filter(title.eq(target_title))
        .first::<Product>(conn)
        .optional()
}

pub fn get_all_products(conn: &mut SqliteConnection) -> Result<Vec<Product>, Error> {
    product_schema::table.load::<Product>(conn)
}
pub fn update_product(conn: &mut SqliteConnection, prod: Product) -> Result<Product, Error> {
    use product_schema::dsl::{
        category_id, product as product_dsl, product_id, satang, title, use_recipe_stock,
    };

    diesel::update(product_dsl.find(prod.product_id))
        .set((
            product_id.eq(prod.product_id),
            title.eq(prod.title),
            category_id.eq(prod.category_id),
            satang.eq(prod.satang),
            use_recipe_stock.eq(prod.use_recipe_stock),
        ))
        .returning(Product::as_returning())
        .get_result(conn)
}

pub fn set_product_stock_mode(
    conn: &mut SqliteConnection,
    id: i32,
    use_recipe: bool,
) -> Result<(), Error> {
    use product_schema::dsl::{product, use_recipe_stock};
    diesel::update(product.find(id))
        .set(use_recipe_stock.eq(use_recipe))
        .execute(conn)?;
    Ok(())
}

pub fn find_product(conn: &mut SqliteConnection, id: i32) -> Result<Product, Error> {
    product_schema::table.find(id).first(conn)
}

pub fn get_all_products_with_images(
    conn: &mut SqliteConnection,
) -> Result<Vec<crate::product::model::ProductWithImage>, Error> {
    use crate::product::model::ProductWithImage;
    use crate::schema::images;
    use crate::schema::product_images;
    use std::collections::BTreeMap;

    let raw_data = product_schema::table
        .left_join(
            product_images::table.on(product_schema::product_id.eq(product_images::product_id)),
        )
        .left_join(images::table.on(product_images::image_id.eq(images::id)))
        .select((
            product_schema::all_columns,
            images::file_path.nullable(),
            images::image_object_position.nullable(),
        ))
        .load::<(Product, Option<String>, Option<String>)>(conn)?;

    let mut products_map: BTreeMap<i32, ProductWithImage> = BTreeMap::new();

    for (prod, img_path, img_pos) in raw_data {
        products_map
            .entry(prod.product_id)
            .or_insert(ProductWithImage {
                product: prod,
                image_path: img_path,
                image_object_position: img_pos,
            });
    }

    Ok(products_map.into_values().collect())
}
