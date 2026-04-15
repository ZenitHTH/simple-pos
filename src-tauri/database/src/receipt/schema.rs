diesel::table! {
    receipt_list (receipt_id) {
        receipt_id -> Integer,
        datetime_unix -> BigInt, // Maps to i64
        customer_id -> Nullable<Integer>,
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
    receipt_item_material (id) {
        id -> Integer,
        receipt_item_id -> Integer,
        material_id -> Integer,
        volume_used -> Integer,
        precision -> Integer,
    }
}

diesel::joinable!(receipt_item -> receipt_list (receipt_id));
diesel::joinable!(receipt_item_material -> receipt_item (receipt_item_id));

diesel::allow_tables_to_appear_in_same_query!(receipt_list, receipt_item, receipt_item_material);
