// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use career_kit_lib::database::init_db;

fn main() {
    match init_db() {
        Ok(_conn) => career_kit_lib::run(),
        Err(_e) => {}
    }
}
