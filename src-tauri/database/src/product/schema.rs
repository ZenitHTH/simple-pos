diesel::table! {
    product (product_id) {
        product_id -> Integer,
        title -> Text,
        category_id -> Integer,
        satang -> Integer,
    }
}
