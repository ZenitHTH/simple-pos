use database::*;
use std::env;

fn print_usage() {
    println!("Usage: db_cli <COMMAND> [ARGS]");
    println!("\nCommands:");
    println!("  check --key <KEY>          Verify connection and existence");
    println!("  init --key <KEY>           Run migrations");
    println!("  list <TYPE> --key <KEY>    List items (categories, products, materials, customers, stocks)");
}

fn main() -> Result<(), String> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return Ok(());
    }

    let command = &args[1];

    match command.as_str() {
        "check" => {
            let key = get_arg(&args, "--key").ok_or("Missing --key argument")?;
            let mut conn =
                establish_connection(key).map_err(|e| format!("Connection failed: {}", e))?;

            // Actually verify the connection by querying something that touches the schema
            use diesel::RunQueryDsl;
            diesel::sql_query("SELECT count(*) FROM sqlite_master;")
                .execute(&mut conn)
                .map_err(|e| format!("Verification query failed (likely wrong key): {}", e))?;

            let db_path = get_database_path().map_err(|e| e.to_string())?;
            println!("✅ Database exists at: {:?}", db_path);
            println!("✅ Successfully connected and decrypted database.");
            Ok(())
        }
        "init" => {
            let key = get_arg(&args, "--key").ok_or("Missing --key argument")?;
            let mut conn =
                establish_connection(key).map_err(|e| format!("Connection failed: {}", e))?;
            run_migrations(&mut conn).map_err(|e| format!("Migration failed: {}", e))?;
            println!("✅ Migrations completed successfully.");
            Ok(())
        }
        "list" => {
            if args.len() < 3 {
                return Err("Missing item type for list command".to_string());
            }
            let item_type = &args[2];
            let key = get_arg(&args, "--key").ok_or("Missing --key argument")?;
            let mut conn =
                establish_connection(key).map_err(|e| format!("Connection failed: {}", e))?;

            match item_type.as_str() {
                "categories" => {
                    let items = database::category::get_all_categories(&mut conn)
                        .map_err(|e| e.to_string())?;
                    println!("{:<5} | {:<20}", "ID", "Name");
                    println!("{:-<30}", "");
                    for item in items {
                        println!("{:<5} | {:<20}", item.id, item.name);
                    }
                }
                "products" => {
                    let items = database::product::get_all_products(&mut conn)
                        .map_err(|e| e.to_string())?;
                    println!("{:<5} | {:<20} | {:<10}", "ID", "Title", "Price (Satang)");
                    println!("{:-<40}", "");
                    for item in items {
                        println!(
                            "{:<5} | {:<20} | {:<10}",
                            item.product_id, item.title, item.satang
                        );
                    }
                }
                "materials" => {
                    let items = database::material::get_all_materials(&mut conn)
                        .map_err(|e| e.to_string())?;
                    println!(
                        "{:<5} | {:<20} | {:<10} | {:<10}",
                        "ID", "Name", "Type", "Qty"
                    );
                    println!("{:-<50}", "");
                    for item in items {
                        println!(
                            "{:<5} | {:<20} | {:<10} | {:<10}",
                            item.id, item.name, item.type_, item.quantity
                        );
                    }
                }
                "customers" => {
                    let items = database::customer::get_all_customers(&mut conn)
                        .map_err(|e| e.to_string())?;
                    println!("{:<5} | {:<20} | {:<15}", "ID", "Name", "Tax ID");
                    println!("{:-<45}", "");
                    for item in items {
                        println!(
                            "{:<5} | {:<20} | {:<15}",
                            item.id,
                            item.name,
                            item.tax_id.unwrap_or_else(|| "-".to_string())
                        );
                    }
                }
                "stocks" => {
                    let items =
                        database::stock::get_all_stocks(&mut conn).map_err(|e| e.to_string())?;
                    println!(
                        "{:<5} | {:<10} | {:<10} | {:<10}",
                        "ID", "Prod ID", "Qty", "Satang"
                    );
                    println!("{:-<45}", "");
                    for item in items {
                        println!(
                            "{:<5} | {:<10} | {:<10} | {:<10}",
                            item.stock_id, item.product_id, item.quantity, item.satang
                        );
                    }
                }
                _ => return Err(format!("Unknown item type: {}", item_type)),
            }
            Ok(())
        }
        _ => {
            println!("Unknown command: {}", command);
            print_usage();
            Ok(())
        }
    }
}

fn get_arg<'a>(args: &'a [String], flag: &str) -> Option<&'a String> {
    args.iter()
        .position(|r| r == flag)
        .and_then(|i| args.get(i + 1))
}
