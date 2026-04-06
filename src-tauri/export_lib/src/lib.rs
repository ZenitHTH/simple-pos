pub mod csv_export;
pub mod ods_export;
pub mod thai_accounting;
pub mod xlsx_export;

use serde::{Deserialize, Serialize};
use std::error::Error;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum CellValue {
    Text(String),
    Number(f64),
    Int(i64),
    Bool(bool),
    None,
}

impl std::fmt::Display for CellValue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CellValue::Text(s) => write!(f, "{}", s),
            CellValue::Number(n) => write!(f, "{}", n),
            CellValue::Int(n) => write!(f, "{}", n),
            CellValue::Bool(b) => write!(f, "{}", b),
            CellValue::None => write!(f, ""),
        }
    }
}

/// Sanitizes a string to prevent Formula Injection (CSV/XLSX/ODS).
/// Prepends a single quote if the string starts with =, +, -, or @.
pub fn sanitize_cell_text(s: &str) -> String {
    if s.starts_with('=') || s.starts_with('+') || s.starts_with('-') || s.starts_with('@') {
        format!("'{}", s)
    } else {
        s.to_string()
    }
}

// Helper implementations for easy conversion
impl From<&str> for CellValue {
    fn from(s: &str) -> Self {
        CellValue::Text(s.to_string())
    }
}

impl From<String> for CellValue {
    fn from(s: String) -> Self {
        CellValue::Text(s)
    }
}

impl From<f64> for CellValue {
    fn from(n: f64) -> Self {
        CellValue::Number(n)
    }
}

impl From<i32> for CellValue {
    fn from(n: i32) -> Self {
        CellValue::Int(n as i64)
    }
}

impl From<i64> for CellValue {
    fn from(n: i64) -> Self {
        CellValue::Int(n)
    }
}

impl From<bool> for CellValue {
    fn from(b: bool) -> Self {
        CellValue::Bool(b)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportTable {
    pub headers: Vec<String>,
    pub rows: Vec<Vec<CellValue>>,
}

impl ExportTable {
    pub fn new(headers: Vec<String>) -> Self {
        Self {
            headers,
            rows: Vec::new(),
        }
    }

    pub fn add_row(&mut self, row: Vec<CellValue>) {
        if row.len() == self.headers.len() {
            self.rows.push(row);
        } else {
            // Log warning or handle error? For now, we'll allow it but it might cause export issues if headers don't match
            self.rows.push(row);
        }
    }

    pub fn edit_cell(&mut self, row_idx: usize, col_idx: usize, value: CellValue) -> bool {
        if let Some(row) = self.rows.get_mut(row_idx) {
            if col_idx < row.len() {
                row[col_idx] = value;
                return true;
            }
        }
        false
    }

    pub fn export_csv<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        csv_export::export_to_csv(self, path)
    }

    pub fn export_xlsx<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        xlsx_export::export_to_xlsx(self, path)
    }

    pub fn export_ods<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        ods_export::export_to_ods(self, path)
    }
}

/// Export multiple named ExportTables as separate sheets in one xlsx file.
pub fn export_xlsx_sheets<P: AsRef<Path>>(
    sheets: &[(&str, &ExportTable)],
    path: P,
) -> Result<(), Box<dyn Error>> {
    xlsx_export::export_to_xlsx_sheets(sheets, path)
}
