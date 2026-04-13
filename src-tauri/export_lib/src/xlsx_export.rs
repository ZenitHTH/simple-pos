use super::{CellValue, ExportTable, sanitize_cell_text};
use rust_xlsxwriter::*;
use calamine::{Reader, Xlsx, open_workbook, Data};
use std::error::Error;
use std::path::Path;

/// Exports an `ExportTable` to an XLSX file.
///
/// # Arguments
///
/// * `table` - The table to export.
/// * `path` - The destination file path.
pub fn export_to_xlsx<P: AsRef<Path>>(table: &ExportTable, path: P) -> Result<(), Box<dyn Error>> {
    export_to_xlsx_sheets(&[("Sheet1", table)], path)
}

/// Exports multiple named sheets into a single XLSX workbook.
///
/// # Arguments
///
/// * `sheets` - A slice of tuples containing the sheet name and the table reference.
/// * `path` - The destination file path.
pub fn export_to_xlsx_sheets<P: AsRef<Path>>(
    sheets: &[(&str, &ExportTable)],
    path: P,
) -> Result<(), Box<dyn Error>> {
    let mut workbook = Workbook::new();

    for (sheet_name, table) in sheets {
        let worksheet = workbook.add_worksheet();
        worksheet.set_name(*sheet_name)?;

        // Headers
        for (i, header) in table.headers.iter().enumerate() {
            worksheet.write(0, i as u16, header.clone())?;
        }

        // Rows
        for (row_idx, row) in table.rows.iter().enumerate() {
            let current_row = (row_idx + 1) as u32;
            for (col_idx, cell) in row.iter().enumerate() {
                let current_col = col_idx as u16;
                match cell {
                    CellValue::Text(s) => {
                        let sanitized = sanitize_cell_text(s);
                        worksheet.write(current_row, current_col, sanitized.as_str())?;
                    }
                    CellValue::Number(n) => {
                        worksheet.write(current_row, current_col, *n)?;
                    }
                    CellValue::Int(n) => {
                        worksheet.write(current_row, current_col, *n)?;
                    }
                    CellValue::Bool(b) => {
                        worksheet.write(current_row, current_col, *b)?;
                    }
                    CellValue::None => {}
                };
            }
        }
    }

    workbook.save(path)?;
    Ok(())
}

/// Imports an `ExportTable` from the first sheet of an XLSX file.
///
/// # Arguments
///
/// * `path` - The source file path.
///
/// # Returns
///
/// An `ExportTable` containing the data from the XLSX file.
pub fn import_from_xlsx<P: AsRef<Path>>(path: P) -> Result<ExportTable, Box<dyn Error>> {
    let mut excel: Xlsx<_> = open_workbook(path)?;
    
    // Get the first sheet
    let sheet_name = excel.sheet_names().get(0).cloned()
        .ok_or_else(|| "No sheets found in XLSX file")?;
    
    let range = excel.worksheet_range(&sheet_name)?;
    
    let mut rows = range.rows();
    
    // First row is header
    let headers: Vec<String> = rows.next()
        .ok_or_else(|| "XLSX file is empty")?
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
