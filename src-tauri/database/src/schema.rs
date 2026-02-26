// @generated automatically by Diesel CLI.

diesel::table! {
    category (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::table! {
    customer (id) {
        id -> Integer,
        name -> Text,
        tax_id -> Nullable<Text>,
        address -> Nullable<Text>,
    }
}

diesel::table! {
    images (id) {
        id -> Integer,
        file_name -> Text,
        file_hash -> Text,
        file_path -> Text,
        created_at -> Timestamp,
        image_object_position -> Nullable<Text>,
    }
}

diesel::table! {
    material (id) {
        id -> Integer,
        name -> Text,
        #[sql_name = "type"]
        type_ -> Text,
        volume -> Integer,
        quantity -> Integer,
        precision -> Integer,
    }
}

diesel::table! {
    product (product_id) {
        product_id -> Integer,
        title -> Text,
        category_id -> Integer,
        satang -> Integer,
        use_recipe_stock -> Bool,
    }
}

diesel::table! {
    product_images (product_id, image_id) {
        product_id -> Integer,
        image_id -> Integer,
    }
}

diesel::table! {
    receipt_item (id) {
        id -> Integer,
        receipt_id -> Integer,
        product_id -> Integer,
        quantity -> Integer,
        satang_at_sale -> Integer,
    }
}

diesel::table! {
    receipt_list (receipt_id) {
        receipt_id -> Integer,
        datetime_unix -> Integer,
        customer_id -> Nullable<Integer>,
    }
}

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

diesel::table! {
    stock (stock_id) {
        stock_id -> Integer,
        product_id -> Integer,
        satang -> Integer,
        quantity -> Integer,
    }
}

diesel::joinable!(product -> category (category_id));
diesel::joinable!(product_images -> images (image_id));
diesel::joinable!(product_images -> product (product_id));
diesel::joinable!(receipt_item -> product (product_id));
diesel::joinable!(receipt_item -> receipt_list (receipt_id));
diesel::joinable!(receipt_list -> customer (customer_id));
diesel::joinable!(recipe_item -> material (material_id));
diesel::joinable!(recipe_item -> recipe_list (recipe_list_id));
diesel::joinable!(recipe_list -> product (product_id));
diesel::joinable!(stock -> product (product_id));

diesel::allow_tables_to_appear_in_same_query!(
    category,
    customer,
    images,
    material,
    product,
    product_images,
    receipt_item,
    receipt_list,
    recipe_item,
    recipe_list,
    stock,
);
