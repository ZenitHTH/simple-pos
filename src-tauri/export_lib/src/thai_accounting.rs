use crate::{CellValue, ExportTable};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxReportRow {
    pub date: String,
    pub invoice_no: String,
    pub customer_name: String,
    pub tax_id: String,
    pub branch_address: String,
    pub amount_before_vat: f64,
    pub vat_amount: f64,
    pub grand_total: f64,
}

pub fn build_thai_sales_tax_report(rows: Vec<TaxReportRow>) -> ExportTable {
    let headers = vec![
        "ลำดับที่".to_string(),
        "วัน เดือน ปี".to_string(),
        "เล่มที่/เลขที่".to_string(),
        "ชื่อผู้ซื้อ/ผู้รับบริการ".to_string(),
        "เลขประจำตัวผู้เสียภาษีอากร".to_string(),
        "สถานประกอบการ".to_string(),
        "มูลค่าสินค้าหรือบริการ".to_string(),
        "จำนวนเงินภาษีมูลค่าเพิ่ม".to_string(),
        "จำนวนเงินรวม".to_string(),
    ];

    let mut table = ExportTable::new(headers);

    for (index, row) in rows.into_iter().enumerate() {
        let mut row_cells = Vec::new();
        row_cells.push(CellValue::Int((index + 1) as i64));
        row_cells.push(CellValue::Text(row.date));
        row_cells.push(CellValue::Text(row.invoice_no));
        row_cells.push(CellValue::Text(row.customer_name));
        row_cells.push(CellValue::Text(row.tax_id));
        row_cells.push(CellValue::Text(row.branch_address));
        row_cells.push(CellValue::Number(row.amount_before_vat));
        row_cells.push(CellValue::Number(row.vat_amount));
        row_cells.push(CellValue::Number(row.grand_total));
        table.add_row(row_cells);
    }

    table
}
