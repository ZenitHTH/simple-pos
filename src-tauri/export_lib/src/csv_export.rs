use super::{CellValue, ExportTable, sanitize_cell_text};
use std::error::Error;
use std::path::Path;

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
                CellValue::Text(s) => sanitize_cell_text(s),
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
        assert_eq!(sanitize_cell_text("=1+1"), "'=1+1");
        assert_eq!(sanitize_cell_text("+100"), "'+100");
        assert_eq!(sanitize_cell_text("-20"), "'-20");
        assert_eq!(sanitize_cell_text("@SUM"), "'@SUM");
        assert_eq!(sanitize_cell_text("Normal Text"), "Normal Text");
    }
}
