use crate::database::AppDatabase;
use crate::features::application::{db, Application};
use log::{error, info};

#[tauri::command]
pub fn get_applications(state: tauri::State<AppDatabase>) -> Result<Vec<Application>, String> {
    info!("get_applications called");
    let conn = state.conn.lock().unwrap();
    let result = db::get_applications(&conn).map_err(|err| {
        error!("get_applications failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_applications succeeded");
    }
    result
}

#[tauri::command]
pub fn get_application(state: tauri::State<AppDatabase>, id: i64) -> Result<Application, String> {
    info!("get_application called for id {}", id);
    let conn = state.conn.lock().unwrap();
    let result = db::get_application(&conn, id).map_err(|err| {
        error!("get_application failed for id {}: {}", id, err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_application succeeded for id {}", id);
    }
    result
}

#[tauri::command]
pub fn insert_application(
    state: tauri::State<AppDatabase>,
    application: Application,
) -> Result<(), String> {
    info!("insert_application called");
    let conn = state.conn.lock().unwrap();
    match db::insert_application(&conn, application) {
        Ok(_) => {
            info!("insert_application succeeded");
            Ok(())
        }
        Err(err) => {
            error!("insert_application failed: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn update_application(
    state: tauri::State<AppDatabase>,
    application: Application,
    id: i64,
) -> Result<(), String> {
    info!("update_application called for id {}", id);
    let conn = state.conn.lock().unwrap();
    match db::update_application(&conn, application, id) {
        Ok(_) => {
            info!("update_application succeeded for id {}", id);
            Ok(())
        }
        Err(err) => {
            error!("update_application failed for id {}: {}", id, err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn delete_application(state: tauri::State<AppDatabase>, id: i64) -> Result<(), String> {
    info!("delete_application called for id {}", id);
    let conn = state.conn.lock().unwrap();
    match db::delete_application(&conn, id) {
        Ok(_) => {
            info!("delete_application succeeded for id {}", id);
            Ok(())
        }
        Err(err) => {
            error!("delete_application failed for id {}: {}", id, err);
            Err(err.to_string())
        }
    }
}
