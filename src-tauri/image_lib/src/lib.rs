use atomic_write_file::AtomicWriteFile;
use database::{Image, NewImage, establish_connection, insert_image};
use sha2::{Digest, Sha256};
use std::io::Write;
use std::path::Path;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ImageError {
    #[error("Database error: {0}")]
    Database(#[from] diesel::result::Error),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Image error: {0}")]
    Image(#[from] image::ImageError),
    #[error("Connection error: {0}")]
    Connection(String),
    #[error("Directory not found")]
    DirectoryNotFound,
    #[error("Invalid file extension: {0}")]
    InvalidExtension(String),
}

const ALLOWED_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "webp"];

pub fn save_image(
    data: &[u8],
    filename: &str,
    target_dir: Option<&Path>,
    key: &str,
) -> Result<Image, ImageError> {
    // 1. Calculate Hash
    let mut hasher = Sha256::new();
    hasher.update(data);
    let hash = hex::encode(hasher.finalize());

    // 2. Check if image already exists in DB
    let db_path =
        database::get_database_path().map_err(|e| ImageError::Connection(e.to_string()))?;
    let mut conn = establish_connection(key).map_err(|e| ImageError::Connection(e.to_string()))?;

    // Check if hash exists
    if let Ok(Some(existing_image)) = database::image::get_image_by_hash(&mut conn, &hash) {
        if Path::new(&existing_image.file_path).exists() {
            return Ok(existing_image);
        }
    }

    // 3. Determine Output Path
    let save_dir = if let Some(d) = target_dir {
        d.to_path_buf()
    } else {
        if let Some(parent) = db_path.parent() {
            parent.join("images")
        } else {
            return Err(ImageError::DirectoryNotFound);
        }
    };

    if !save_dir.exists() {
        std::fs::create_dir_all(&save_dir).map_err(ImageError::Io)?;
    }

    // 4. Save File
    // Use hash + extension (from filename or detection) as filename
    let extension = Path::new(filename)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .ok_or_else(|| ImageError::InvalidExtension("None".to_string()))?;

    if !ALLOWED_EXTENSIONS.contains(&extension.as_str()) {
        return Err(ImageError::InvalidExtension(extension));
    }

    let safe_filename = format!("{}.{}", hash, extension);
    let file_path = save_dir.join(&safe_filename);

    // Atomic Write
    // Note: atomic-write-file doesn't seem to have a simple `write` method that takes path + content directly in one go that returns Result cleanly without opening, but `AtomicWriteFile` struct does.
    // Let's use `atomic_write_file::write` if available, or the struct.
    // The struct `AtomicWriteFile` in version 0.1 usually requires opening.
    // Wait, `atomic-write-file` 0.1 has `AtomicWriteFile::open`.
    let mut file = AtomicWriteFile::open(&file_path).map_err(ImageError::Io)?;
    file.write_all(data).map_err(ImageError::Io)?;
    file.commit().map_err(ImageError::Io)?;

    // 5. Save to DB
    let file_path_str = file_path
        .to_str()
        .ok_or(ImageError::Io(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "Invalid path",
        )))?;

    let new_image = NewImage {
        file_name: filename,
        file_hash: &hash,
        file_path: file_path_str,
        image_object_position: None,
    };

    let saved_image = insert_image(&mut conn, &new_image).map_err(ImageError::Database)?;
    Ok(saved_image)
}

pub fn verify_image(image_id: i32, key: &str) -> Result<bool, ImageError> {
    let mut conn = establish_connection(key).map_err(|e| ImageError::Connection(e.to_string()))?;

    // Fix: `database::image::get_image` is not pub or not reachable via that path?
    // `insert_image` and `get_image` are imported at top level of `database` crate via `pub use image::...`?
    // Let's check `database/src/lib.rs`.
    // It has `pub mod image;` and `pub use image::model::{Image, NewImage};`
    // It does NOT seem to export `get_image` directly unless I added it.
    // I added `pub fn get_image` to `database/src/image.rs`, but did I export it in `lib.rs`?
    // I only exported models. I should adjust `database/src/lib.rs` to export functions too, or use `database::image::get_image`.

    // Assuming `database::image::get_image` is public (it is in my edit), so this call should work if `image` mod is public.
    let img = database::image::get_image(&mut conn, image_id).map_err(ImageError::Database)?;
    let path = Path::new(&img.file_path);

    if !path.exists() {
        return Ok(false);
    }

    let data = std::fs::read(path).map_err(ImageError::Io)?;
    let mut hasher = Sha256::new();
    hasher.update(&data);
    let hash = hex::encode(hasher.finalize());

    Ok(hash == img.file_hash)
}

pub fn delete_image_file(file_path: &str) -> Result<(), ImageError> {
    let path = Path::new(file_path);
    if path.exists() {
        std::fs::remove_file(path).map_err(ImageError::Io)?;
    }
    Ok(())
}
