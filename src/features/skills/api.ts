import { invoke } from "@tauri-apps/api/core";
import type { Skill } from "./types";

export async function getSkills() {
  return await invoke<Skill[] | null>("get_skills");
}

export async function insertSkills(skills: Skill[]) {
  return await invoke<void>("insert_skills", { skills });
}

export async function deleteSkills(skills: Skill[]) {
  return await invoke<void>("delete_skills", { skills });
}
