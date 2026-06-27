import { invoke } from "@tauri-apps/api/core";
import type { Education } from "./types";

export async function getEducation() {
  return await invoke<Education[] | null>("get_education");
}

export async function insertEducation(education: Education) {
  return await invoke<void>("insert_education", { education });
}

export async function updateEducation(education: Education, edu_id: number) {
  return await invoke<void>("update_education", { education, edu_id });
}

export async function deleteEducation(edu_id: number) {
  return await invoke<void>("delete_education", { edu_id });
}
