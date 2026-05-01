// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    {
        // Detect if the system is using an NVIDIA GPU or running Wayland.
        // WebKit's DMABUF renderer often causes issues (flickering/white screens) in these environments.
        let is_nvidia = std::path::Path::new("/proc/driver/nvidia/version").exists();
        let is_wayland = std::env::var("XDG_SESSION_TYPE")
            .map(|v| v == "wayland")
            .unwrap_or(false);

        unsafe {
            if is_nvidia || is_wayland {
                std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
            }
            // Performance: Force accelerated compositing to avoid flickering when entering/exiting AC mode.
            std::env::set_var("WEBKIT_FORCE_COMPOSITING_MODE", "1");
        }
    }
    app_lib::run();
}
