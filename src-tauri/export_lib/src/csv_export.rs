use super::ExportData;
use std::error::Error;
use std::path::Path;

pub fn export_to_csv<P: AsRef<Path>>(data: &[ExportData], path: P) -> Result<(), Box<dyn Error>> {
    let mut wtr = csv::Writer::from_path(path)?;

    for row in data {
        wtr.serialize(row)?;
    }

    wtr.flush()?;
    Ok(())
}
