use rusqlite::{Connection, Error, Row, ToSql};

pub fn query_rows<T, F>(
    conn: &Connection,
    sql: &str,
    params: &[&dyn ToSql],
    f: F,
) -> Result<Vec<T>, Error>
where
    F: Fn(&Row) -> Result<T, Error>,
{
    let mut stmt = conn.prepare(sql)?;
    let iter = stmt.query_map(params, |row| f(row))?;
    iter.collect::<Result<Vec<T>, _>>()
}

pub fn deserialize_json_col<T: serde::de::DeserializeOwned>(
    json: &str,
    col_index: usize,
) -> rusqlite::Result<T> {
    serde_json::from_str(json).map_err(|e| {
        rusqlite::Error::FromSqlConversionFailure(
            col_index,
            rusqlite::types::Type::Text,
            Box::new(e),
        )
    })
}

pub fn to_json_string<T: serde::Serialize>(value: &T) -> rusqlite::Result<String> {
    serde_json::to_string(value).map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))
}
