diesel::table! {
    receipt_list (receipt_id) {
        receipt_id -> Integer,
        datetime_unix -> BigInt, // Maps to i64
    }
}

diesel::table! {
    // Maps SQL "Receipt" table to Rust "receipt_item" variable
    receipt_item (id) {
        id -> Integer,
        receipt_id -> Integer,
        product_id -> Integer,
        quantity -> Integer,
    }
}

diesel::joinable!(receipt_item -> receipt_list (receipt_id));
diesel::allow_tables_to_appear_in_same_query!(receipt_list, receipt_item);
