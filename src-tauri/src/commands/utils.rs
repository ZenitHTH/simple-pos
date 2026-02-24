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
