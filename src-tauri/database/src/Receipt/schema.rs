diesel::table! {
    receipt (receipt_id) {
        receipt_id -> Integer,
        receipt_list_id -> Integer,
        product_id -> Integer,
        quantity -> Integer,
    }
}

diesel::table! {
    receipt_list (product_id) {
        receipt_list_id -> Integer,
        datetime -> Integer,

    }
}
