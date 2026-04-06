use diesel::prelude::*;

use std::path::Path;
use std::fs;

#[test]
fn test_encryption_workflow() {
    let db_path = "test_encrypted.db";
    let db_url = db_path;
    
    // Clean up previous run
    if Path::new(db_path).exists() {
        fs::remove_file(db_path).unwrap();
    }

    // 1. Create and Write with Key
    {
        let mut conn = SqliteConnection::establish(db_url).unwrap();
        diesel::sql_query("PRAGMA key = 'password';").execute(&mut conn).unwrap();
        
        diesel::sql_query("CREATE TABLE secrets (id INTEGER PRIMARY KEY, msg TEXT);")
            .execute(&mut conn).unwrap();
        diesel::sql_query("INSERT INTO secrets (msg) VALUES ('Top Secret');")
            .execute(&mut conn).unwrap();
    }

    // 2. Try Read WITHOUT Key (Should Fail to read data)
    {
        let mut conn = SqliteConnection::establish(db_url).unwrap();
        // Without key, opening is fine, but reading should fail
        let result = diesel::sql_query("SELECT * FROM secrets;").execute(&mut conn);
        // Depending on sqlcipher version, it might fail at open or at read.
        // Usually valid sqlite file header allows open, but read fails "file is not a database"
        assert!(result.is_err(), "Should not be able to read encrypted DB without key");
    }

    // 3. Try Read WITH Wrong Key (Should Fail)
    {
        let mut conn = SqliteConnection::establish(db_url).unwrap();
        diesel::sql_query("PRAGMA key = 'wrong';").execute(&mut conn).unwrap();
        let result = diesel::sql_query("SELECT * FROM secrets;").execute(&mut conn);
        assert!(result.is_err(), "Should not be able to read with wrong key");
    }

    // 4. Try Read WITH Correct Key (Should Succeed)
    {
        let mut conn = SqliteConnection::establish(db_url).unwrap();
        diesel::sql_query("PRAGMA key = 'password';").execute(&mut conn).unwrap();
        let result = diesel::sql_query("SELECT * FROM secrets;").execute(&mut conn);
        assert!(result.is_ok(), "Should be able to read with correct key");
    }

    // Cleanup
    if Path::new(db_path).exists() {
        fs::remove_file(db_path).unwrap();
    }
}
