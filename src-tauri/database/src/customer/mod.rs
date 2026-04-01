pub mod model;

use crate::schema::customer::dsl::*;
use diesel::prelude::*;
pub use model::*;

pub fn get_all_customers(conn: &mut SqliteConnection) -> QueryResult<Vec<Customer>> {
    customer.load::<Customer>(conn)
}

pub fn insert_customer(
    conn: &mut SqliteConnection,
    new_customer: &NewCustomer,
) -> QueryResult<Customer> {
    diesel::insert_into(customer)
        .values(new_customer)
        .returning(Customer::as_returning())
        .get_result(conn)
}

pub fn update_customer_record(
    conn: &mut SqliteConnection,
    customer_id: i32,
    update_data: &NewCustomer,
) -> QueryResult<Customer> {
    diesel::update(customer.find(customer_id))
        .set((
            name.eq(&update_data.name),
            tax_id.eq(&update_data.tax_id),
            address.eq(&update_data.address),
            branch.eq(update_data.branch.as_deref().unwrap_or("00000")),
        ))
        .returning(Customer::as_returning())
        .get_result(conn)
}
