use super::{CellValue, ExportTable, sanitize_cell_text};

use spreadsheet_ods::{Sheet, WorkBook};
use std::error::Error;
use std::path::Path;

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
