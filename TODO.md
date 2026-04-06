# project TODO

## Bugs
- [x] **Image-Product Linking Confusion**: Resolve conflict in image linking logic. Currently, one product can be linked to multiple images, and the exclusivity logic in `useImageManagement.ts` only prevents one image from being linked to multiple products, which is counter-intuitive.
    - **Affected Files**: 
        - `src-tauri/database/src/image/**`
        - `src/app/manage/images/**`
    - **Details**: The user is confused by the relationship. Need to decide if it should be 1:1, 1:N (Product:Images), or if the UI should better represent the current many-to-many relationship.
