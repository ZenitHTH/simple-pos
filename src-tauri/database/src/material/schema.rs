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
