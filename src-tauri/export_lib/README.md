# Export Library Module

The `export_lib` crate provides a flexible and extensible framework for exporting tabular data from the Vibe POS application into multiple professional formats.

## Supported Formats

- **CSV**: Standard comma-separated values for universal compatibility.
- **XLSX**: Microsoft Excel format, supporting multiple sheets and formatted data.
- **ODS**: OpenDocument Spreadsheet format for open-source alternatives like LibreOffice.
- **Thai Accounting**: Specialized export logic tailored for Thai accounting standards and reporting requirements.

## Core Concepts

### `ExportTable`
The primary data structure used for exports. It consists of:
- **Headers**: A list of column names.
- **Rows**: A collection of rows, where each row is a vector of `CellValue`.

### `CellValue`
A type-safe enum representing different kinds of spreadsheet data:
- `Text(String)`
- `Number(f64)`
- `Int(i64)`
- `Bool(bool)`
- `None` (Empty cell)

## Usage Example

```rust
use export_lib::{ExportTable, CellValue};

let mut table = ExportTable::new(vec!["ID".to_string(), "Name".to_string(), "Price".to_string()]);
table.add_row(vec![
    CellValue::Int(1),
    CellValue::Text("Iced Coffee".to_string()),
    CellValue::Number(45.0)
]);

// Export to different formats
table.export_csv("report.csv")?;
table.export_xlsx("report.xlsx")?;
```

## Features

- **Multi-Sheet Export**: Support for creating Excel workbooks with multiple named sheets.
- **Generic Interface**: Add new formats easily by implementing a new writer module.
- **Automatic Formatting**: Handles date and number conversion as required by the target format.
