use crate::database::AppDatabase;
use crate::features::profile::{db, Profile};
use log::{error, info};

#[tauri::command]
pub fn get_profile(state: tauri::State<AppDatabase>) -> Result<Profile, String> {
    info!("get_profile called");
    let conn = state.conn.lock().unwrap();
    let result = db::get_profile(&conn).map_err(|err| {
        error!("get_profile failed: {}", err);
        err.to_string()
    });
    if result.is_ok() {
        info!("get_profile succeeded");
    }
    result
}

#[tauri::command]
pub fn upsert_profile(
    state: tauri::State<AppDatabase>,
    profile: Profile,
) -> Result<(), String> {
    info!("upsert_profile called");
    let conn = state.conn.lock().unwrap();
    match db::upsert_profile(&conn, profile) {
        Ok(_) => {
            info!("upsert_profile succeeded");
            Ok(())
        }
        Err(err) => {
            error!("upsert_profile failed: {}", err);
            Err(err.to_string())
        }
    }
}
