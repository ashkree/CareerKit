use crate::database::AppDatabase;
use crate::models::skill;
use log::{error, info};

#[tauri::command]
pub fn get_skills(state: tauri::State<AppDatabase>) -> Result<Vec<skill::Skill>, String> {
    info!("get_skills called");
    let conn = state.conn.lock().unwrap();
    let result = skill::get_skills(&conn).map_err(|err| {
        error!("get_skills failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_skills succeeded");
    }
    result
}

#[tauri::command]
pub fn insert_skills(
    state: tauri::State<AppDatabase>,
    skills: Vec<skill::Skill>,
) -> Result<(), String> {
    info!("insert_skills called with {} skills", skills.len());
    let mut conn = state.conn.lock().unwrap();
    match skill::insert_skills(&mut conn, skills) {
        Ok(_) => {
            info!("insert_skills succeeded");
            Ok(())
        }
        Err(err) => {
            error!("insert_skills failed: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn delete_skills(
    state: tauri::State<AppDatabase>,
    skills: Vec<skill::Skill>,
) -> Result<(), String> {
    info!("delete_skills called with {} skills", skills.len());
    let mut conn = state.conn.lock().unwrap();
    match skill::delete_skills(&mut conn, skills) {
        Ok(_) => {
            info!("delete_skills succeeded");
            Ok(())
        }
        Err(err) => {
            error!("delete_skills failed: {}", err);
            Err(err.to_string())
        }
    }
}
