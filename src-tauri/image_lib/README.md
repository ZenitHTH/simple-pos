# Image Library Module

This crate `image_lib` provides a robust image management system for the Vibe POS application. It handles image processing, secure storage, and synchronization with the database.

## Features

- **Content-Addressable Storage**: Images are stored using their SHA-256 hash as the filename, automatically preventing duplicates and ensuring data integrity.
- **Atomic Writes**: Ensures image files are either fully written or not written at all, preventing corruption during system crashes or power failures.
- **Deduplication**: If an identical image is uploaded multiple times, the library detects the existing hash and reuses the same file, saving disk space.
- **Secure Storage**: Images are stored in a dedicated `images` directory within the application's local data folder (e.g., `~/.local/share/simple-pos/images` on Linux).
- **Metadata Management**: Automatically generates metadata for the database, including file name, hash, and absolute path.

## Key Functions

- **`save_image`**: Main entry point. Processes raw image bytes, calculates SHA-256, saves to the content-addressed store, and returns metadata for database insertion.
- **`delete_image_file`**: Safely removes an image file from the filesystem. Includes checks to ensure the file isn't being used by other references if necessary (though primary deduplication is hash-based).
- **`verify_image`**: (Utility) Checks if a physical file matches its stored SHA-256 hash.

## Technical Details

- **Processing**: Uses `image` crate for basic validation and processing if needed.
- **Hashing**: Uses `sha2` crate for consistent and secure file hashing.
- **Path Resolution**: Integrates with the application's global path management to ensure cross-platform compatibility (Windows, macOS, Linux).
