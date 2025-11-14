diesel::table! {
    product (product_id) {
        product_id -> Integer,
        title -> Text,
        catagory -> Text,
        satang -> i32,
    }
}