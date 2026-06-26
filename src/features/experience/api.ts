import { invoke } from "@tauri-apps/api/core";
import type { Experience } from "./types";

export async function getExperiences() {
  return await invoke<Experience[] | null>("get_experiences");
}

export async function insertExperience(experience: Experience) {
  return await invoke<void>("insert_experience", { experience });
}

export async function updateExperience(experience: Experience, exp_id: number) {
  return await invoke<void>("update_experience", { experience, exp_id });
}

export async function deleteExperience(exp_id: number) {
  return await invoke<void>("delete_experience", { exp_id });
}
