use crate::database::init_db;

mod commands;
pub mod database;
mod models;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(database::AppDatabase {
            conn: init_db(false).unwrap().into(),
        })
        .invoke_handler(tauri::generate_handler![
            commands::profile::get_profile,
            commands::profile::upsert_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
