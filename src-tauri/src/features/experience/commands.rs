use crate::database::AppDatabase;
use crate::features::experience::{db, Experience};
use log::{error, info};

#[tauri::command]
pub fn get_experiences(state: tauri::State<AppDatabase>) -> Result<Vec<Experience>, String> {
    info!("get_experiences called");
    let conn = state.conn.lock().unwrap();
    let result = db::get_experiences(&conn).map_err(|err| {
        error!("get_experiences failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_experiences succeeded");
    }
    result
}

#[tauri::command]
pub fn insert_experience(
    state: tauri::State<AppDatabase>,
    experience: Experience,
) -> Result<(), String> {
    info!("insert_experience called");
    let conn = state.conn.lock().unwrap();
    match db::insert_experience(&conn, experience) {
        Ok(_) => {
            info!("insert_experience succeeded");
            Ok(())
        }
        Err(err) => {
            error!("insert_experience failed: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn update_experience(
    state: tauri::State<AppDatabase>,
    experience: Experience,
    exp_id: i64,
) -> Result<(), String> {
    info!("update_experience called for id {}", exp_id);
    let conn = state.conn.lock().unwrap();
    match db::update_experience(&conn, experience, exp_id) {
        Ok(_) => {
            info!("update_experience succeeded for id {}", exp_id);
            Ok(())
        }
        Err(err) => {
            error!("update_experience failed for id {}: {}", exp_id, err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn delete_experience(
    state: tauri::State<AppDatabase>,
    exp_id: i64,
) -> Result<(), String> {
    info!("delete_experience called for id {}", exp_id);
    let conn = state.conn.lock().unwrap();
    match db::delete_experience(&conn, exp_id) {
        Ok(_) => {
            info!("delete_experience succeeded for id {}", exp_id);
            Ok(())
        }
        Err(err) => {
            error!("delete_experience failed for id {}: {}", exp_id, err);
            Err(err.to_string())
        }
    }
}
