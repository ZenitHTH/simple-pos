pub mod model;
pub mod schema;

use self::schema::{recipe_item, recipe_list};
use diesel::prelude::*;
pub use model::*;

// --- Header Functions ---

pub fn create_recipe_list(
    conn: &mut SqliteConnection,
    product_id: i32,
) -> Result<RecipeList, diesel::result::Error> {
    let new_header = NewRecipeList { product_id };

    diesel::insert_into(recipe_list::table)
        .values(&new_header)
        .returning(RecipeList::as_returning())
        .get_result(conn)
}

pub fn get_recipe_list_by_product(
    conn: &mut SqliteConnection,
    pid: i32,
) -> Result<Option<RecipeList>, diesel::result::Error> {
    recipe_list::table
        .filter(recipe_list::product_id.eq(pid))
        .first::<RecipeList>(conn)
        .optional()
}

pub fn delete_recipe_list(
    conn: &mut SqliteConnection,
    list_id: i32,
) -> Result<usize, diesel::result::Error> {
    diesel::delete(recipe_list::table.find(list_id)).execute(conn)
}

// --- Item Functions ---

pub fn add_recipe_item(
    conn: &mut SqliteConnection,
    new_item: &NewRecipeItem,
) -> Result<RecipeItem, diesel::result::Error> {
    diesel::insert_into(recipe_item::table)
        .values(new_item)
        .returning(RecipeItem::as_returning())
        .get_result(conn)
}

pub fn get_items_by_recipe_list_id(
    conn: &mut SqliteConnection,
    header_id: i32,
) -> Result<Vec<RecipeItem>, diesel::result::Error> {
    recipe_item::table
        .filter(recipe_item::recipe_list_id.eq(header_id))
        .load::<RecipeItem>(conn)
}

pub fn update_recipe_item(
    conn: &mut SqliteConnection,
    item_id: i32,
    volume: i32,
    unit: String,
    volume_use_precision: i32,
) -> Result<RecipeItem, diesel::result::Error> {
    diesel::update(recipe_item::table.find(item_id))
        .set((
            recipe_item::volume_use.eq(volume),
            recipe_item::unit.eq(unit),
            recipe_item::volume_use_precision.eq(volume_use_precision),
        ))
        .returning(RecipeItem::as_returning())
        .get_result(conn)
}

pub fn remove_recipe_item(
    conn: &mut SqliteConnection,
    item_id: i32,
) -> Result<usize, diesel::result::Error> {
    diesel::delete(recipe_item::table.find(item_id)).execute(conn)
}

pub fn deduct_stock_from_recipe(
    conn: &mut SqliteConnection,
    product_id: i32,
    quantity: i32,
    saved_receipt_item_id: i32,
) -> Result<(), diesel::result::Error> {
    use crate::material;
    use crate::receipt;
    use crate::NewReceiptItemMaterial;

    if let Ok(Some(recipe_list)) = get_recipe_list_by_product(conn, product_id) {
        let recipe_items = get_items_by_recipe_list_id(conn, recipe_list.id)?;

        for r_item in recipe_items {
            if let Ok(mut mat) = material::find_material(conn, r_item.material_id) {
                let total_deduction_scaled = (r_item.volume_use as i64) * (quantity as i64);
                let deduction_aligned = calculate_aligned_deduction(
                    total_deduction_scaled,
                    r_item.volume_use_precision,
                    mat.precision,
                );

                let current_total_vol_scaled = (mat.volume as i64) * (mat.quantity as i64);
                let new_total_vol_scaled = current_total_vol_scaled - deduction_aligned;

                if mat.volume > 0 {
                    mat.quantity = (new_total_vol_scaled / mat.volume as i64) as i32;
                }

                material::update_material(conn, mat.clone())?;

                receipt::add_item_material(
                    conn,
                    &NewReceiptItemMaterial {
                        receipt_item_id: saved_receipt_item_id,
                        material_id: r_item.material_id,
                        volume_used: total_deduction_scaled as i32,
                        precision: r_item.volume_use_precision,
                    },
                )?;
            }
        }
    }
    Ok(())
}

fn calculate_aligned_deduction(total_scaled: i64, from_prec: i32, to_prec: i32) -> i64 {
    if to_prec >= from_prec {
        total_scaled * 10i64.pow((to_prec - from_prec) as u32)
    } else {
        total_scaled / 10i64.pow((from_prec - to_prec) as u32)
    }
}
