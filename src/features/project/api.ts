import { invoke } from "@tauri-apps/api/core";
import type { Project } from "./types";

export async function getProjects() {
  return await invoke<Project[] | null>("get_projects");
}

export async function insertProject(project: Project) {
  return await invoke<void>("insert_project", { project });
}

export async function updateProject(project: Project, proj_id: number) {
  return await invoke<void>("update_project", { project, proj_id });
}

export async function deleteProject(proj_id: number) {
  return await invoke<void>("delete_project", { proj_id });
}
