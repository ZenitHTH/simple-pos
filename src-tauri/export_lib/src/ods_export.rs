use super::{CellValue, ExportTable, sanitize_cell_text};

use spreadsheet_ods::{Sheet, WorkBook};
use calamine::{Reader, Ods, open_workbook, Data};
use std::error::Error;
use std::path::Path;

/// Exports an `ExportTable` to an ODS (OpenDocument Spreadsheet) file.
///
/// # Arguments
///
/// * `table` - The table to export.
/// * `path` - The destination file path.
pub fn export_to_ods<P: AsRef<Path>>(table: &ExportTable, path: P) -> Result<(), Box<dyn Error>> {
    let mut wb = WorkBook::new_empty();
    let mut sheet = Sheet::new("Receipts");

    // Headers
    for (i, header) in table.headers.iter().enumerate() {
        sheet.set_value(0, i as u32, header.clone());
    }

    // Rows
    for (row_idx, row) in table.rows.iter().enumerate() {
        let current_row = (row_idx + 1) as u32;
        for (col_idx, cell) in row.iter().enumerate() {
            let current_col = col_idx as u32;
            match cell {
                CellValue::Text(s) => {
                    let sanitized = sanitize_cell_text(s);
                    sheet.set_value(current_row, current_col, sanitized)
                }
                CellValue::Number(n) => sheet.set_value(current_row, current_col, *n),
                CellValue::Int(n) => sheet.set_value(current_row, current_col, *n),
                CellValue::Bool(b) => sheet.set_value(current_row, current_col, *b),
                CellValue::None => {} // Do nothing
            };
        }
    }

    wb.push_sheet(sheet);
    spreadsheet_ods::write_ods(&mut wb, path)?;
    Ok(())
}

/// Imports an `ExportTable` from the first sheet of an ODS file.
///
/// # Arguments
///
/// * `path` - The source file path.
///
/// # Returns
///
/// An `ExportTable` containing the data from the ODS file.
pub fn import_from_ods<P: AsRef<Path>>(path: P) -> Result<ExportTable, Box<dyn Error>> {
    let mut ods: Ods<_> = open_workbook(path)?;
    
    // Get the first sheet
    let sheet_name = ods.sheet_names().get(0).cloned()
        .ok_or_else(|| "No sheets found in ODS file")?;
    
    let range = ods.worksheet_range(&sheet_name)?;
    
    let mut rows = range.rows();
    
    // First row is header
    let headers: Vec<String> = rows.next()
        .ok_or_else(|| "ODS file is empty")?
        .iter()
        .map(|data: &Data| data.to_string())
        .collect();
        
    let mut table = ExportTable::new(headers);
    
    for row in rows {
        let cell_values: Vec<CellValue> = row.iter()
            .map(|data: &Data| match data {
                Data::String(s) => {
                    // Remove leading single quote if it was added for sanitization
                    if s.starts_with('\'') && (s.len() > 1) {
                        let inner = &s[1..];
                        if inner.starts_with('=') || inner.starts_with('+') || inner.starts_with('-') || inner.starts_with('@') {
                            return CellValue::Text(inner.to_string());
                        }
                    }
                    CellValue::Text(s.clone())
                }
                Data::Float(f) => CellValue::Number(*f),
                Data::Int(i) => CellValue::Int(*i),
                Data::Bool(b) => CellValue::Bool(*b),
                _ => CellValue::None,
            })
            .collect();
        table.add_row(cell_values);
    }
    
    Ok(table)
}
