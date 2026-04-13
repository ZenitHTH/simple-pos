use serde::{Deserialize, Serialize};
use std::error::Error;
use std::path::Path;

pub mod csv_export;
pub mod ods_export;
pub mod thai_accounting;
pub mod xlsx_export;

/// Represents a value in a spreadsheet cell.
/// Supports basic types like text, numbers, booleans, and empty cells.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum CellValue {
    /// A text string.
    Text(String),
    /// A floating-point number.
    Number(f64),
    /// An integer number.
    Int(i64),
    /// A boolean value.
    Bool(bool),
    /// An empty cell.
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
///
/// Prepends a single quote if the string starts with characters that could trigger
/// formula execution in spreadsheet applications (=, +, -, @).
///
/// # Arguments
///
/// * `s` - The string to sanitize.
///
/// # Returns
///
/// The sanitized string.
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

/// A generic representation of a spreadsheet table.
///
/// Contains headers and rows of `CellValue`s, providing methods to export to
/// different formats (CSV, XLSX, ODS).
#[derive(Debug, Serialize, Deserialize)]
pub struct ExportTable {
    /// The table headers.
    pub headers: Vec<String>,
    /// The table rows.
    pub rows: Vec<Vec<CellValue>>,
}

impl ExportTable {
    /// Creates a new `ExportTable` with the specified headers.
    pub fn new(headers: Vec<String>) -> Self {
        Self {
            headers,
            rows: Vec::new(),
        }
    }

    /// Adds a row of values to the table.
    pub fn add_row(&mut self, row: Vec<CellValue>) {
        if row.len() == self.headers.len() {
            self.rows.push(row);
        } else {
            // Log warning or handle error? For now, we'll allow it
            self.rows.push(row);
        }
    }

    /// Edits a specific cell in the table.
    ///
    /// # Returns
    ///
    /// `true` if the cell was successfully updated, `false` otherwise.
    pub fn edit_cell(&mut self, row_idx: usize, col_idx: usize, value: CellValue) -> bool {
        if let Some(row) = self.rows.get_mut(row_idx) {
            if col_idx < row.len() {
                row[col_idx] = value;
                return true;
            }
        }
        false
    }

    /// Exports the table to a CSV file.
    pub fn export_csv<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        csv_export::export_to_csv(self, path)
    }

    /// Exports the table to an XLSX file.
    pub fn export_xlsx<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        xlsx_export::export_to_xlsx(self, path)
    }

    /// Exports the table to an ODS file.
    pub fn export_ods<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {
        ods_export::export_to_ods(self, path)
    }

    /// Imports an `ExportTable` from a CSV file.
    pub fn import_csv<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn Error>> {
        csv_export::import_from_csv(path)
    }

    /// Imports an `ExportTable` from an XLSX file.
    pub fn import_xlsx<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn Error>> {
        xlsx_export::import_from_xlsx(path)
    }

    /// Imports an `ExportTable` from an ODS file.
    pub fn import_ods<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn Error>> {
        ods_export::import_from_ods(path)
    }
}

/// Export multiple named `ExportTable`s as separate sheets in one XLSX file.
///
/// # Arguments
///
/// * `sheets` - A slice of tuples containing the sheet name and the table reference.
/// * `path` - The destination file path.
pub fn export_xlsx_sheets<P: AsRef<Path>>(
    sheets: &[(&str, &ExportTable)],
    path: P,
) -> Result<(), Box<dyn Error>> {
    xlsx_export::export_to_xlsx_sheets(sheets, path)
}
