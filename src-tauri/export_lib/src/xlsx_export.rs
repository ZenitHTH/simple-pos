use super::ExportData;
use rust_xlsxwriter::*;
use std::error::Error;
use std::path::Path;

pub fn export_to_xlsx<P: AsRef<Path>>(data: &[ExportData], path: P) -> Result<(), Box<dyn Error>> {
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    // Headers
    worksheet.write(0, 0, "Receipt ID")?;
    worksheet.write(0, 1, "Date")?;
    worksheet.write(0, 2, "Product Name")?;
    worksheet.write(0, 3, "Quantity")?;
    worksheet.write(0, 4, "Price")?;
    worksheet.write(0, 5, "Total")?;

    for (i, row) in data.iter().enumerate() {
        let row_idx = (i + 1) as u32;
        worksheet.write(row_idx, 0, row.receipt_id)?;
        worksheet.write(row_idx, 1, &row.date)?;
        worksheet.write(row_idx, 2, &row.product_name)?;
        worksheet.write(row_idx, 3, row.quantity)?;
        worksheet.write(row_idx, 4, row.price)?;
        worksheet.write(row_idx, 5, row.total)?;
    }

    workbook.save(path)?;
    Ok(())
}
