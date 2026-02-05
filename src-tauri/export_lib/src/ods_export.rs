use super::ExportData;
use spreadsheet_ods::default_styles::DefaultStyles;
use spreadsheet_ods::{Sheet, WorkBook};
use std::error::Error;
use std::path::Path;

pub fn export_to_ods<P: AsRef<Path>>(data: &[ExportData], path: P) -> Result<(), Box<dyn Error>> {
    let mut wb = WorkBook::new_empty();
    let mut sheet = Sheet::new("Receipts");

    // Headers
    sheet.set_value(0, 0, "Receipt ID");
    sheet.set_value(0, 1, "Date");
    sheet.set_value(0, 2, "Product Name");
    sheet.set_value(0, 3, "Quantity");
    sheet.set_value(0, 4, "Price");
    sheet.set_value(0, 5, "Total");

    for (i, row) in data.iter().enumerate() {
        let row_idx = (i + 1) as u32;
        sheet.set_value(row_idx, 0, row.receipt_id);
        sheet.set_value(row_idx, 1, &row.date);
        sheet.set_value(row_idx, 2, &row.product_name);
        sheet.set_value(row_idx, 3, row.quantity);
        sheet.set_value(row_idx, 4, row.price);
        sheet.set_value(row_idx, 5, row.total);
    }

    wb.push_sheet(sheet);
    spreadsheet_ods::write_ods(&mut wb, path)?;
    Ok(())
}
