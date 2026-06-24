use crate::database::AppDatabase;
use crate::models::profile;

#[tauri::command]
pub fn get_profile(state: tauri::State<AppDatabase>) -> Result<profile::Profile, String> {
    let conn = state.conn.lock().unwrap();
    profile::get_profile(&conn).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn upsert_profile(state: tauri::State<AppDatabase>, profile: profile::Profile) {
    let conn = state.conn.lock().unwrap();
    let count = profile::upsert_profile(&conn, profile).map_err(|err| err.to_string());

    println!("{count:?}");
}
