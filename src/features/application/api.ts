import { invoke } from "@tauri-apps/api/core";
import { Application } from "./types";

export async function getApplications() {
  return await invoke<Application[] | null>("get_applications");
}

export async function getApplication(id: number) {
  return await invoke<Application[] | null>("get_application", { id });
}

export async function insertApplication(application: Application) {
  return await invoke<void>("insert_application", { application });
}

export async function updateApplication(id: number, application: Application) {
  return await invoke<void>("update_application", { id, application });
}

export async function deleteApplication(id: number) {
  return await invoke<Application[] | null>("delete_application", { id });
}
