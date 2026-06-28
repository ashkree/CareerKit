use crate::database::init_db;
mod features;
pub mod database;
mod shared;
mod seed;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = init_db(false).unwrap();
    // seed::seed(&mut conn).expect("seeding faild");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    tauri_plugin_log::Target::new(
                        tauri_plugin_log::TargetKind::Stdout,
                    )
                    .filter(|metadata| metadata.target().starts_with("career_kit")),
                ])
                .level(log::LevelFilter::Info)
                .format(|out, message, record| {
                    out.finish(format_args!("[{}] {}", record.level(), message))
                })
                .build(),
        )
        .manage(database::AppDatabase { conn: conn.into() })
        .invoke_handler(tauri::generate_handler![
            features::profile::get_profile,
            features::profile::upsert_profile,
            features::skills::get_skills,
            features::skills::insert_skills,
            features::skills::delete_skills,
            features::experience::get_experiences,
            features::experience::insert_experience,
            features::experience::update_experience,
            features::experience::delete_experience,
            features::project::get_projects,
            features::project::insert_project,
            features::project::update_project,
            features::project::delete_project,
            features::education::get_education,
            features::education::insert_education,
            features::education::update_education,
            features::education::delete_education,
            features::application::get_applications,
            features::application::get_application,
            features::application::insert_application,
            features::application::update_application,
            features::application::delete_application
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
