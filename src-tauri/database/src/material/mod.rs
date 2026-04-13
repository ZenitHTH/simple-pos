pub mod model;
pub mod schema;

use crate::material::model::{Material, NewMaterial};
use crate::material::schema::material::dsl::*;
use diesel::prelude::*;

/// Retrieves all material records from the database.
pub fn get_all_materials(conn: &mut SqliteConnection) -> QueryResult<Vec<Material>> {
    material.load::<Material>(conn)
}

/// Inserts a new material record into the database.
pub fn insert_material(
    conn: &mut SqliteConnection,
    new_mat: &NewMaterial,
) -> QueryResult<Material> {
    diesel::insert_into(material)
        .values(new_mat)
        .returning(Material::as_returning())
        .get_result(conn)
}

/// Updates an existing material record.
pub fn update_material(
    conn: &mut SqliteConnection,
    material_data: Material,
) -> QueryResult<Material> {
    diesel::update(material.find(material_data.id))
        .set((
            name.eq(material_data.name),
            type_.eq(material_data.type_),
            volume.eq(material_data.volume),
            quantity.eq(material_data.quantity),
            precision.eq(material_data.precision),
        ))
        .returning(Material::as_returning())
        .get_result(conn)
}

/// Deletes a material record from the database by its ID.
pub fn remove_material(conn: &mut SqliteConnection, target_id: i32) -> QueryResult<usize> {
    diesel::delete(material.find(target_id)).execute(conn)
}

/// Finds a specific material by its ID.
pub fn find_material(conn: &mut SqliteConnection, target_id: i32) -> QueryResult<Material> {
    material.find(target_id).first(conn)
}
