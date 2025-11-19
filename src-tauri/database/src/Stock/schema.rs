diesel::table! {
    stock (product_id) {
        stock_id -> Integer,
        product_id -> Integer,
        quantity -> Integer,
    }
}
