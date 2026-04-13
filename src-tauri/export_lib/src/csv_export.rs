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

pub fn import_from_csv<P: AsRef<Path>>(path: P) -> Result<ExportTable, Box<dyn Error>> {
    let mut rdr = csv::Reader::from_path(path)?;
    
    // Get headers
    let headers = rdr.headers()?.iter().map(|s| s.to_string()).collect();
    let mut table = ExportTable::new(headers);

    // Read records
    for result in rdr.records() {
        let record = result?;
        let row: Vec<CellValue> = record.iter()
            .map(|s| {
                // Try to parse as number or bool, default to text
                if let Ok(n) = s.parse::<f64>() {
                    CellValue::Number(n)
                } else if let Ok(b) = s.parse::<bool>() {
                    CellValue::Bool(b)
                } else {
                    // Remove leading single quote if it was added for sanitization
                    if s.starts_with('\'') && (s.len() > 1) {
                        let inner = &s[1..];
                        if inner.starts_with('=') || inner.starts_with('+') || inner.starts_with('-') || inner.starts_with('@') {
                            return CellValue::Text(inner.to_string());
                        }
                    }
                    CellValue::Text(s.to_string())
                }
            })
            .collect();
        table.add_row(row);
    }

    Ok(table)
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
