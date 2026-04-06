use diesel::prelude::*;

pub mod model;

pub fn insert_image(
    conn: &mut SqliteConnection,
    new_image: &model::NewImage,
) -> Result<model::Image, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    diesel::insert_into(images)
        .values(new_image)
        .returning(model::Image::as_returning())
        .get_result(conn)
}

pub fn get_image(
    conn: &mut SqliteConnection,
    image_id: i32,
) -> Result<model::Image, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    images
        .find(image_id)
        .select(model::Image::as_select())
        .first(conn)
}

pub fn get_image_by_hash(
    conn: &mut SqliteConnection,
    hash: &str,
) -> Result<Option<model::Image>, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    images
        .filter(file_hash.eq(hash))
        .select(model::Image::as_select())
        .first(conn)
        .optional()
}

pub fn get_all_images(
    conn: &mut SqliteConnection,
) -> Result<Vec<model::Image>, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    images.order(created_at.desc()).load::<model::Image>(conn)
}

pub fn delete_image(
    conn: &mut SqliteConnection,
    image_id: i32,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    diesel::delete(images.find(image_id)).execute(conn)
}

pub fn update_image_path(
    conn: &mut SqliteConnection,
    image_id: i32,
    new_path: &str,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    diesel::update(images.find(image_id))
        .set(file_path.eq(new_path))
        .execute(conn)
}

pub fn update_image_position(
    conn: &mut SqliteConnection,
    image_id: i32,
    position: &str,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    diesel::update(images.find(image_id))
        .set(image_object_position.eq(position))
        .execute(conn)
}
