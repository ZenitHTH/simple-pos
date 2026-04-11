use directories::ProjectDirs;
use std::fs;
use std::path::PathBuf;

pub fn get_settings_path() -> Result<PathBuf, String> {
    let proj_dirs = ProjectDirs::from("", "", "simple-pos").ok_or_else(|| {
        "No valid home directory path could be retrieved from the operating system.".to_string()
    })?;

    let data_dir = proj_dirs.data_dir();
    if !data_dir.exists() {
        fs::create_dir_all(data_dir)
            .map_err(|e| format!("Error creating data directory: {}", e))?;
    }
    Ok(data_dir.join("settings.json"))
}

pub fn validate_path(path_str: &str) -> Result<(), String> {
    let path = PathBuf::from(path_str);
    if !path.is_absolute() {
        return Err(format!("Path '{}' must be absolute", path_str));
    }
    if path
        .components()
        .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err(format!(
            "Path '{}' cannot contain '..' components",
            path_str
        ));
    }
    Ok(())
}
