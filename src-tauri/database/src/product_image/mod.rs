use diesel::prelude::*;

pub mod model;

pub fn link_product_image(
    conn: &mut SqliteConnection,
    prod_id: i32,
    img_id: i32,
) -> Result<model::ProductImage, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;

    let new_link = model::NewProductImage {
        product_id: prod_id,
        image_id: img_id,
    };

    diesel::insert_into(product_images)
        .values(&new_link)
        .returning(model::ProductImage::as_returning())
        .get_result(conn)
}

pub fn unlink_product_image(
    conn: &mut SqliteConnection,
    prod_id: i32,
    img_id: i32,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;

    diesel::delete(product_images.filter(product_id.eq(prod_id).and(image_id.eq(img_id))))
        .execute(conn)
}

pub fn get_linked_images(
    conn: &mut SqliteConnection,
    prod_id: i32,
) -> Result<Vec<crate::image::model::Image>, diesel::result::Error> {
    use crate::schema::images;
    use crate::schema::product_images;

    product_images::table
        .inner_join(images::table)
        .filter(product_images::product_id.eq(prod_id))
        .select(crate::image::model::Image::as_select())
        .load(conn)
}

pub fn get_product_images(
    conn: &mut SqliteConnection,
    prod_id: i32,
) -> Result<Vec<model::ProductImage>, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;

    product_images
        .filter(product_id.eq(prod_id))
        .select(model::ProductImage::as_select())
        .load(conn)
}

pub fn get_all_links(
    conn: &mut SqliteConnection,
) -> Result<Vec<model::ProductImage>, diesel::result::Error> {
    use crate::schema::product_images::dsl::*;

    product_images
        .select(model::ProductImage::as_select())
        .load(conn)
}
