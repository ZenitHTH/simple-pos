#[macro_export]
macro_rules! conn {
    ($key:expr) => {
        database::establish_connection(&$key).map_err(|e| e.to_string())?
    };
}

/// Converts a floating-point number to a scaled integer representation.
///
/// This is used for precise storage of decimal values like material volumes,
/// where floating point inaccuracies should be avoided.
///
/// # Arguments
///
/// * `val` - The floating-point value to scale.
///
/// # Returns
///
/// A tuple containing:
/// 1. The significand as an i32 (the digits without the decimal point).
/// 2. The precision as an i32 (the number of decimal places).
pub fn float_to_scaled(val: f64) -> (i32, i32) {
    let s = format!("{:.4}", val);
    let trimmed = s.trim_end_matches('0').trim_end_matches('.');
    if trimmed.is_empty() {
        return (0, 0);
    }

    let parts: Vec<&str> = trimmed.split('.').collect();
    if parts.len() == 1 {
        return (parts[0].parse().unwrap_or(0), 0);
    }

    let precision = parts[1].len() as i32;
    let significand_str = format!("{}{}", parts[0], parts[1]);
    (significand_str.parse().unwrap_or(0), precision)
}
