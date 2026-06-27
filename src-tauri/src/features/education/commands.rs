use crate::database::AppDatabase;
use crate::features::education::{db, Education};
use log::{error, info};

#[tauri::command]
pub fn get_education(state: tauri::State<AppDatabase>) -> Result<Vec<Education>, String> {
    info!("get_education called");
    let conn = state.conn.lock().unwrap();
    let result = db::get_education(&conn).map_err(|err| {
        error!("get_education failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_education succeeded");
    }
    result
}

#[tauri::command]
pub fn insert_education(
    state: tauri::State<AppDatabase>,
    education: Education,
) -> Result<(), String> {
    info!("insert_education called");
    let conn = state.conn.lock().unwrap();
    match db::insert_education(&conn, education) {
        Ok(_) => {
            info!("insert_education succeeded");
            Ok(())
        }
        Err(err) => {
            error!("insert_education failed: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn update_education(
    state: tauri::State<AppDatabase>,
    education: Education,
    edu_id: i64,
) -> Result<(), String> {
    info!("update_education called for id {}", edu_id);
    let conn = state.conn.lock().unwrap();
    match db::update_education(&conn, education, edu_id) {
        Ok(_) => {
            info!("update_education succeeded for id {}", edu_id);
            Ok(())
        }
        Err(err) => {
            error!("update_education failed for id {}: {}", edu_id, err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn delete_education(
    state: tauri::State<AppDatabase>,
    edu_id: i64,
) -> Result<(), String> {
    info!("delete_education called for id {}", edu_id);
    let conn = state.conn.lock().unwrap();
    match db::delete_education(&conn, edu_id) {
        Ok(_) => {
            info!("delete_education succeeded for id {}", edu_id);
            Ok(())
        }
        Err(err) => {
            error!("delete_education failed for id {}: {}", edu_id, err);
            Err(err.to_string())
        }
    }
}
