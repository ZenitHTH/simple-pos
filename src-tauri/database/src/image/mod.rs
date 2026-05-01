//! Image database operations.
//!
//! This module handles CRUD operations for the image library. It manages image
//! metadata, including file paths, hashes for deduplication, and display preferences
//! (like CSS object-position).

use diesel::prelude::*;

pub mod model;

/// Inserts a new image record into the database.
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

/// Retrieves an image record by its unique ID.
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

/// Retrieves an image record by its file hash (SHA-256).
///
/// Returns `Ok(None)` if no image with that hash exists.
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

/// Retrieves all image records from the database, ordered by newest first.
pub fn get_all_images(
    conn: &mut SqliteConnection,
) -> Result<Vec<model::Image>, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    images.order(created_at.desc()).load::<model::Image>(conn)
}

/// Deletes an image record from the database by its ID.
///
/// Note: This only deletes the database record; the physical file must be handled separately.
pub fn delete_image(
    conn: &mut SqliteConnection,
    image_id: i32,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::images::dsl::*;

    diesel::delete(images.find(image_id)).execute(conn)
}

/// Updates the stored file path of an image.
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

/// Updates the CSS `object-position` value for an image.
///
/// This is used by the frontend to control which part of the image is visible
/// when it's cropped in a square or fixed-aspect-ratio container.
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
