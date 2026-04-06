use super::{CellValue, ExportTable};
use rust_xlsxwriter::*;
use std::error::Error;
use std::path::Path;

pub fn export_to_xlsx<P: AsRef<Path>>(table: &ExportTable, path: P) -> Result<(), Box<dyn Error>> {
    export_to_xlsx_sheets(&[("Sheet1", table)], path)
}

/// Export multiple named sheets into a single xlsx workbook.
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
                        worksheet.write(current_row, current_col, s.as_str())?;
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
