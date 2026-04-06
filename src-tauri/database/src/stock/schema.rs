diesel::table! {
    stock (stock_id) {
        stock_id -> Integer,
        product_id -> Integer,
        satang -> Integer,
        quantity -> Integer,
    }
}
