pub mod model;
pub mod schema;

use self::model::{Category, NewCategory};
use self::schema::category::dsl::*;
use diesel::prelude::*;

pub fn get_all_categories(conn: &mut SqliteConnection) -> QueryResult<Vec<Category>> {
    category.load::<Category>(conn)
}

pub fn insert_category(
    conn: &mut SqliteConnection,
    new_category: &NewCategory,
) -> QueryResult<Category> {
    diesel::insert_into(category)
        .values(new_category)
        .returning(Category::as_returning())
        .get_result(conn)
}

pub fn update_category(
    conn: &mut SqliteConnection,
    category_data: Category,
) -> QueryResult<Category> {
    diesel::update(category.find(category_data.id))
        .set(name.eq(category_data.name))
        .returning(Category::as_returning())
        .get_result(conn)
}

pub fn remove_category(conn: &mut SqliteConnection, category_id: i32) -> QueryResult<usize> {
    diesel::delete(category.find(category_id)).execute(conn)
}

pub fn find_category_by_name(
    conn: &mut SqliteConnection,
    target_name: &str,
) -> QueryResult<Option<Category>> {
    category
        .filter(name.eq(target_name))
        .first::<Category>(conn)
        .optional()
}
