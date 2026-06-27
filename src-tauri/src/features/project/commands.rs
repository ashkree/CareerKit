use crate::database::AppDatabase;
use crate::features::project::{db, Project};
use log::{error, info};

#[tauri::command]
pub fn get_projects(state: tauri::State<AppDatabase>) -> Result<Vec<Project>, String> {
    info!("get_projects called");
    let conn = state.conn.lock().unwrap();
    let result = db::get_projects(&conn).map_err(|err| {
        error!("get_projects failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_projects succeeded");
    }
    result
}

#[tauri::command]
pub fn insert_project(
    state: tauri::State<AppDatabase>,
    project: Project,
) -> Result<(), String> {
    info!("insert_project called");
    let conn = state.conn.lock().unwrap();
    match db::insert_project(&conn, project) {
        Ok(_) => {
            info!("insert_project succeeded");
            Ok(())
        }
        Err(err) => {
            error!("insert_project failed: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn update_project(
    state: tauri::State<AppDatabase>,
    project: Project,
    proj_id: i64,
) -> Result<(), String> {
    info!("update_project called for id {}", proj_id);
    let conn = state.conn.lock().unwrap();
    match db::update_project(&conn, project, proj_id) {
        Ok(_) => {
            info!("update_project succeeded for id {}", proj_id);
            Ok(())
        }
        Err(err) => {
            error!("update_project failed for id {}: {}", proj_id, err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn delete_project(
    state: tauri::State<AppDatabase>,
    proj_id: i64,
) -> Result<(), String> {
    info!("delete_project called for id {}", proj_id);
    let conn = state.conn.lock().unwrap();
    match db::delete_project(&conn, proj_id) {
        Ok(_) => {
            info!("delete_project succeeded for id {}", proj_id);
            Ok(())
        }
        Err(err) => {
            error!("delete_project failed for id {}: {}", proj_id, err);
            Err(err.to_string())
        }
    }
}
