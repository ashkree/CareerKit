import { invoke } from "@tauri-apps/api/core";
import type { Profile } from "./types";

export async function getProfile() {
  return await invoke<Profile | null>("get_profile");
}

export async function upsertProfile(profile: Profile) {
  return await invoke<void>("upsert_profile", { profile });
}
