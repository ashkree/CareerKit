use crate::database::init_db;
mod commands;
pub mod database;
mod models;
mod seed;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut conn = init_db(false).unwrap();
    // seed::seed(&mut conn).expect("seeding faild");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .level(log::LevelFilter::Info)
                .format(|out, message, record| {
                    out.finish(format_args!("[{}] {}", record.level(), message))
                })
                .build(),
        )
        .manage(database::AppDatabase { conn: conn.into() })
        .invoke_handler(tauri::generate_handler![
            commands::profile::get_profile,
            commands::profile::upsert_profile,
            commands::skills::get_skills,
            commands::skills::insert_skills,
            commands::skills::delete_skills,
            commands::experience::get_experiences,
            commands::experience::insert_experience,
            commands::experience::update_experience,
            commands::experience::delete_experience
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
