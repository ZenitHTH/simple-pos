diesel::table! {
    recipe_item (id) {
        id -> Integer,
        recipe_list_id -> Integer,
        material_id -> Integer,
        volume_use -> Integer,
        unit -> Text,
        volume_use_precision -> Integer,
    }
}

diesel::table! {
    recipe_list (id) {
        id -> Integer,
        product_id -> Integer,
    }
}

diesel::joinable!(recipe_item -> crate::material::schema::material (material_id));
diesel::joinable!(recipe_item -> recipe_list (recipe_list_id));
diesel::joinable!(recipe_list -> crate::product::schema::product (product_id));

diesel::allow_tables_to_appear_in_same_query!(recipe_item, recipe_list,);
