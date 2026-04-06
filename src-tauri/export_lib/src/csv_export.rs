use super::{CellValue, ExportTable};
use std::error::Error;
use std::path::Path;

/// Sanitizes a string to prevent CSV injection (formula execution)
/// Prepends a single quote if the string starts with =, +, -, or @.
fn sanitize_cell(s: String) -> String {
    if s.starts_with('=') || s.starts_with('+') || s.starts_with('-') || s.starts_with('@') {
        format!("'{}", s)
    } else {
        s
    }
}

pub fn export_to_csv<P: AsRef<Path>>(table: &ExportTable, path: P) -> Result<(), Box<dyn Error>> {
    let mut wtr = csv::Writer::from_path(path)?;

    // Write headers
    wtr.write_record(&table.headers)?;

    // Write rows
    for row in &table.rows {
        // Convert CellValues to sanitized strings for CSV
        let row_strings: Vec<String> = row
            .iter()
            .map(|cell| match cell {
                CellValue::Text(s) => sanitize_cell(s.clone()),
                _ => cell.to_string(),
            })
            .collect();
        wtr.write_record(&row_strings)?;
    }

    wtr.flush()?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_cell() {
        assert_eq!(sanitize_cell("=1+1".to_string()), "'=1+1");
        assert_eq!(sanitize_cell("+100".to_string()), "'+100");
        assert_eq!(sanitize_cell("-20".to_string()), "'-20");
        assert_eq!(sanitize_cell("@SUM".to_string()), "'@SUM");
        assert_eq!(sanitize_cell("Normal Text".to_string()), "Normal Text");
    }
}
