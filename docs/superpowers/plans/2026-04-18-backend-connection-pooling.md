# Backend Connection Pooling & SQLCipher Customizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a thread-safe connection pool using r2d2 with a custom SQLCipher authenticator to eliminate re-authentication latency.

**Architecture:** Use `r2d2` for connection pooling. Implement a `SqlCipherCustomizer` that implements `CustomizeConnection` to set the encryption key and optimize database settings (WAL mode, synchronous=NORMAL) whenever a connection is acquired or created.

**Tech Stack:** Rust, Diesel, r2d2, SQLCipher.

---

### Task 1: Update database crate dependencies

**Files:**
- Modify: `src-tauri/database/Cargo.toml`

- [ ] **Step 1: Add r2d2 and enable diesel r2d2 feature**

Modify `src-tauri/database/Cargo.toml`:
```toml
diesel = { version = "^2.3.6", features = ["sqlite", "returning_clauses_for_sqlite_3_35", "chrono", "r2d2"] }
r2d2 = "0.8"
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/database/Cargo.toml
git commit -m "chore: add r2d2 dependency and enable diesel r2d2 feature"
```

---

### Task 2: Implement SQLCipher Customizer and Connection Pool

**Files:**
- Modify: `src-tauri/database/src/connection.rs`

- [ ] **Step 1: Add necessary imports**

```rust
use diesel::r2d2::{ConnectionManager, CustomizeConnection, Pool};
```

- [ ] **Step 2: Implement SqlCipherCustomizer**

```rust
#[derive(Debug)]
pub struct SqlCipherCustomizer {
    hex_key: String,
}

impl CustomizeConnection<SqliteConnection, diesel::r2d2::Error> for SqlCipherCustomizer {
    fn on_acquire(&self, conn: &mut SqliteConnection) -> Result<(), diesel::r2d2::Error> {
        apply_encryption_key(conn, &self.hex_key)
            .map_err(|e| diesel::r2d2::Error::QueryError(diesel::result::Error::DatabaseError(
                diesel::result::DatabaseErrorKind::Unknown,
                Box::new(e),
            )))?;
            
        sql_query("PRAGMA journal_mode = WAL;").execute(conn).map_err(|e| diesel::r2d2::Error::QueryError(e))?;
        sql_query("PRAGMA synchronous = NORMAL;").execute(conn).map_err(|e| diesel::r2d2::Error::QueryError(e))?;
        
        Ok(())
    }
}
```

- [ ] **Step 3: Add create_pool function and mark establish_connection as legacy**

```rust
pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

/// DEPRECATED: Use create_pool instead for thread-safe access.
pub fn establish_connection(key: &str) -> Result<SqliteConnection, String> {
    // ... existing implementation ...
}

pub fn create_pool(key: &str) -> Result<DbPool, String> {
    let database_url = get_database_url()?;
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    let hex_key = hex::encode(key);
    
    Pool::builder()
        .connection_customizer(Box::new(SqlCipherCustomizer { hex_key }))
        .build(manager)
        .map_err(|e| format!("Failed to create pool: {}", e))
}
```

- [ ] **Step 4: Run cargo check to verify compilation**

Run: `cd src-tauri/database && cargo check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src-tauri/database/src/connection.rs
git commit -m "feat: implement SqlCipherCustomizer and create_pool"
```

---

### Task 3: Register Pool in Tauri State

**Files:**
- Modify: `src-tauri/src/lib.rs`

- [ ] **Step 1: Initialize Pool and add to Tauri State**

In `run()` function in `src-tauri/src/lib.rs`, initialize the pool (after database initialization logic) and register it.
Wait, `initialize_database` is an IPC command. The pool creation should probably happen there or when the app starts if the key is available.
Looking at `src-tauri/src/commands/database.rs` might be necessary.

Actually, the user said "Register Pool in Tauri State in src-tauri/src/main.rs". Since `main.rs` calls `app_lib::run()`, I should do it in `lib.rs` where `run()` is.

- [ ] **Step 2: Run cargo check in root src-tauri**

Run: `cd src-tauri && cargo check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src-tauri/src/lib.rs
git commit -m "feat: register database pool in Tauri state"
```
