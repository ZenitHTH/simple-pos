use atomic_write_file::AtomicWriteFile;
use database::{Image, NewImage, insert_image};
use sha2::{Digest, Sha256};
use std::io::Write;
use std::path::Path;
use thiserror::Error;

/// Errors that can occur during image processing and storage operations.
#[derive(Error, Debug)]
pub enum ImageError {
    /// Errors originating from the database layer.
    #[error("Database error: {0}")]
    Database(#[from] diesel::result::Error),
    /// Errors originating from standard I/O operations.
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    /// Errors originating from the image processing library.
    #[error("Image error: {0}")]
    Image(#[from] image::ImageError),
    /// Connection-related errors, typically stringified database errors.
    #[error("Connection error: {0}")]
    Connection(String),
    /// The target image directory could not be determined or found.
    #[error("Directory not found")]
    DirectoryNotFound,
    /// The file extension is not supported or the filename is invalid.
    #[error("Invalid file extension: {0}")]
    InvalidExtension(String),
}

const ALLOWED_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "webp"];

/// Saves an image to disk and creates a record in the database.
///
/// This function handles hash-based deduplication, path traversal protection,
/// and atomic file writes.
///
/// # Arguments
///
/// * `data` - The raw image byte data.
/// * `filename` - The original filename of the image.
/// * `target_dir` - Optional custom directory to save the image. Defaults to `images/` next to the DB.
/// * `conn` - The active database connection.
///
/// # Returns
///
/// The created or existing `Image` record.
pub fn save_image(
    data: &[u8],
    filename: &str,
    target_dir: Option<&Path>,
    conn: &mut diesel::SqliteConnection,
) -> Result<Image, ImageError> {
    // 0. Sanitize filename to prevent path traversal
    if filename.contains('/') || filename.contains('\\') || filename.contains("..") {
        return Err(ImageError::InvalidExtension("Traversal characters detected".to_string()));
    }

    // 1. Calculate Hash
    let mut hasher = Sha256::new();
    hasher.update(data);
    let hash = hex::encode(hasher.finalize());

    // 2. Check if image already exists in DB
    let db_path =
        database::get_database_path().map_err(|e| ImageError::Connection(e.to_string()))?;

    // Check if hash exists
    if let Ok(Some(existing_image)) = database::image::get_image_by_hash(conn, &hash) {
        if Path::new(&existing_image.file_path).exists() {
            return Ok(existing_image);
        }
    }

    // 3. Determine Output Path
    let save_dir = if let Some(d) = target_dir {
        d.to_path_buf()
    } else {
        db_path
            .parent()
            .map(|p| p.join("images"))
            .ok_or(ImageError::DirectoryNotFound)?
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

    let saved_image = insert_image(conn, &new_image).map_err(ImageError::Database)?;
    Ok(saved_image)
}

/// Verifies that an image file exists and matches its stored hash.
///
/// # Arguments
///
/// * `image_id` - The ID of the image to verify.
/// * `conn` - The active database connection.
///
/// # Returns
///
/// `true` if the image is valid and matches the hash, `false` otherwise.
pub fn verify_image(image_id: i32, conn: &mut diesel::SqliteConnection) -> Result<bool, ImageError> {
    let img = database::image::get_image(conn, image_id).map_err(ImageError::Database)?;
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

/// Deletes an image file from disk.
///
/// # Arguments
///
/// * `file_path` - The absolute path to the file to delete.
pub fn delete_image_file(file_path: &str) -> Result<(), ImageError> {
    let path = Path::new(file_path);
    if path.exists() {
        std::fs::remove_file(path).map_err(ImageError::Io)?;
    }
    Ok(())
}
