# CareerKit

A desktop application for managing your career profile and job applications — built with Tauri, React, and SQLite.

> **Status:** Work in progress

---

## What it does

CareerKit keeps all your career information in one place so you can quickly tailor applications without starting from scratch each time. Think of it as a local-first personal CRM for your job search.

**Implemented:**
- Manage your personal details, skills, experience, education, and projects
- Track job applications — save, mark applied, log interviews, record outcomes

**Planned:**
- Certifications
- Generate tailored resumes and cover letters from your stored profile (a local-model scaffold exists in `src-tauri/src/features/ai_generation`, but it isn't wired up to any command or UI yet)

---

## Why Tauri (and not a web server)

An earlier design used FastAPI as a backend, which meant anyone running the app had to set up a Python environment and manage a running server. That's a significant barrier.

With Tauri, CareerKit compiles to a single native binary. No server to run, no runtime to install — just download and open it. Your data stays local in a SQLite database on your own machine.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Desktop shell | Tauri v2 |
| Backend logic | Rust |
| Database | SQLite via `rusqlite` |

---

## Project structure

```
career-kit/
├── src/                            # React frontend
│   ├── features/                   # One folder per domain feature
│   │   ├── profile/
│   │   │   ├── types.ts            # Feature-local TypeScript types
│   │   │   ├── api.ts              # Thin wrappers around `invoke(...)`
│   │   │   └── components/         # e.g. PersonalDetailsCard.tsx
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── education/
│   │   ├── project/
│   │   └── application/            # status.ts also lives here (status → icon/label/color)
│   ├── shared/
│   │   ├── components/
│   │   │   ├── forms/              # TextField, TextArea, Dropdown, FormField
│   │   │   ├── badges/             # Badge, IconBadge, RemovableBadge, IconPill
│   │   │   ├── buttons/            # IconButton
│   │   │   ├── cards/              # Card (compound: Card.Section / .View / .Edit)
│   │   │   └── sections/           # SectionHeader, BadgeSection, LinksSection
│   │   └── utils/                  # data_updates.ts (updateProp), helpers.ts (diffArrays)
│   ├── layout/
│   │   └── Sidebar.tsx
│   └── pages/
│       ├── profile/                # CareerProfile.tsx
│       └── applications/           # ApplicationDashboard.tsx
│
└── src-tauri/                      # Rust backend
    ├── migrations/                 # Numbered folders, one `up.sql` each
    └── src/
        ├── features/
        │   ├── profile/            # model.rs, db.rs, commands.rs, mod.rs
        │   ├── skills/
        │   ├── experience/
        │   ├── education/
        │   ├── project/
        │   ├── application/
        │   └── ai_generation/      # providers/local_provider.rs — scaffolded, not yet a command
        ├── shared/                 # Duration, Location, Phone, Link types; junctions.rs; utilities.rs
        ├── database.rs             # Connection setup, runs migrations on startup
        ├── seed.rs                 # Demo data, gated behind the `seed` Cargo feature
        └── lib.rs                  # App entry point and command registration
```

Each feature's `db.rs` also carries its own unit tests, run against an
in-memory SQLite connection — see [Running Rust tests](#running-rust-tests).

---

## Database schema

CareerKit uses a local SQLite file (`careerkit.db`) created and migrated
automatically on first run. Full column-level detail lives in the
`Database Schema` doc; summary below.

### `profile`
Singleton row (always `id = 1`) — `first_name`, `last_name`, `email`
(unique), `phone_country_code`, `phone_number`, `city`, `country`, `links`
(JSON array of `{ name, url }`), `languages` (JSON array of strings).

### `skill`
`id`, `name` (unique). Shared across experience/education/project via
junction tables — there's no `category` or `proficiency` column at the
moment, just the name.

### `experience`
`id`, `role`, `company`, `city`, `country`, `description`, `highlights`
(JSON array), `start_date`, `end_date`. Skills via `experience_skill`.

### `education`
`id`, `school`, `qualification`, `specializations` (JSON array), `city`,
`country`, `coursework` (JSON array), `start_date`, `end_date`. Skills via
`education_skill`.

### `project`
`id`, `name`, `description`, `status`, `highlights` (JSON array),
`start_date`, `end_date`, `links` (JSON array). Skills via `project_skill`.

### `application`
`id`, `job_title`, `job_url`, `company`, `company_website`, `status`,
`date_saved`, `date_applied`, `description`, `contact`, `contact_email`,
`contact_linkedin_url`. Company and contact info are plain columns here
rather than separate normalized tables.

There's no `certification` table yet — see Planned above.

---
## How the frontend and backend communicate

Tauri exposes Rust functions to the frontend as **commands** via IPC (no HTTP server involved). The frontend calls them using `invoke` from `@tauri-apps/api`:

```ts
// src/features/profile/api.ts
import { invoke } from "@tauri-apps/api/core";
import type { Profile } from "./types";

export async function getProfile() {
  return await invoke<Profile | null>("get_profile");
}

export async function upsertProfile(profile: Profile) {
  return await invoke<void>("upsert_profile", { profile });
}
```

On the Rust side, commands are implemented per-feature in
`src-tauri/src/features/<feature>/commands.rs`, re-exported through that
feature's `mod.rs`, and registered together in `src-tauri/src/lib.rs`:

```rust
// src-tauri/src/lib.rs
.invoke_handler(tauri::generate_handler![
    features::profile::get_profile,
    features::profile::upsert_profile,
    features::skills::get_skills,
    // ...one entry per command, across every feature module
])
```

Each Rust command returns `Result<T, String>`, which surfaces on the
frontend as a resolved value or a rejected promise.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Rust](https://rustup.rs/)
- Tauri CLI prerequisites for your OS — see the [Tauri setup guide](https://tauri.app/start/prerequisites/)

### Development

```bash
# Install frontend dependencies
npm install

# Start in development mode (hot reload)
npm run tauri:dev
```

### Build

```bash
npm run tauri:build
```

This produces a native installer/binary in `src-tauri/target/release/bundle/`.

---

## Running Rust tests

The database layer has unit tests in each feature's `db.rs` that run
against an in-memory SQLite instance — no app window needed.

```bash
cd src-tauri
cargo test
```

---

## Contributing

This is a personal project in active development, but contributions are welcome. A few things to know before diving in:

- The design system lives in `src/index.css` as CSS custom properties — use those tokens rather than hardcoding colours
- UI components use inline `style` props for theme colours (Tailwind doesn't have access to the CSS vars at build time for dynamic values)
- Keep Tauri commands thin — put query logic in each feature's `db.rs` and call it from `commands.rs`
- New entities generally get their own `src-tauri/src/features/<name>/` module (`model.rs`, `db.rs`, `commands.rs`) and a matching `src/features/<name>/` folder (`types.ts`, `api.ts`, `components/`) — follow an existing feature (e.g. `experience`) as a template

---

## License
 
To Be Determined
