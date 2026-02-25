# Image Library Module

This crate `image_lib` provides a robust image management system for the Vibe POS application. it handles image processing, secure storage, and database synchronization.

## Features

- **Content-Addressable Storage**: Images are stored using their SHA-256 hash as the filename, automatically preventing duplicates and ensuring data integrity.
- **Atomic Writes**: Uses `atomic-write-file` to ensure that image files are either fully written or not written at all, preventing corruption during system crashes.
- **Database Integration**: Automatically records image metadata (filename, hash, path) in the encrypted SQLite database.
- **Verification**: Built-in functionality to verify that the physical file matches the stored database hash.
- **Deduplication**: If an identical image is uploaded, the library detects the existing hash and reuses the existing file instead of creating a copy.

## Key Functions

- `save_image`: Main entry point to process raw image data, calculate hash, save to disk, and update the database.
- `verify_image`: Checks if a stored image still matches its original hash on disk.
- `delete_image_file`: Safely removes an image file from the filesystem.

## Security

Images are stored in a dedicated `images` directory within the application's local data folder (e.g., `~/.local/share/simple-pos/images` on Linux). This keeps application assets isolated and organized.
