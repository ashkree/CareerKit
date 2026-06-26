# CareerKit

A desktop application for managing your career profile and job applications — built with Tauri, React, and SQLite.

> **Status:** Work in progress

---

## What it does

CareerKit keeps all your career information in one place so you can quickly tailor applications without starting from scratch each time. Think of it as a local-first personal CRM for your job search.

**Planned features:**
- Manage your personal details, skills, experience, education, projects, and certifications
- Track job applications
- Generate tailored resumes and cover letters from your stored profile

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
├── src/                        # React frontend
│   ├── components/
│   │   ├── common/             # Reusable UI (buttons, badges, forms, cards)
│   │   ├── layout/             # Sidebar, navigation
│   │   └── profile/            # Feature components (PersonalDetailsCard, SkillsCard, etc.)
│   ├── pages/                  # Page-level components
│   ├── types/                  # Shared TypeScript types
│   └── utilities/              # Helper functions
│
└── src-tauri/                  # Rust backend
    └── src/
        ├── commands/           # Tauri command handlers (IPC endpoints)
        ├── models/             # Database query logic
        ├── database.rs         # Connection setup and migrations
        └── lib.rs              # App entry point and command registration
```

---

## Database schema

CareerKit uses a local SQLite file (`careerkit.db`) created automatically on first run.

### `profile`

Stores a single user profile (always `id = 1`).

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, always `1` |
| `first_name` | TEXT | |
| `last_name` | TEXT | |
| `email` | TEXT | Unique |
| `phone_country_code` | TEXT | e.g. `"971"` |
| `phone_number` | TEXT | |
| `city` | TEXT | |
| `country` | TEXT | |
| `links` | TEXT | JSON array of `{ name, url }` objects |
| `languages` | TEXT | JSON array of strings |

### `skills`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Auto-increment primary key |
| `name` | TEXT | |
| `category` | TEXT | |
| `proficiency` | TEXT | |

---

## How the frontend and backend communicate

Tauri exposes Rust functions to the frontend as **commands** via IPC (no HTTP server involved). The frontend calls them using `invoke` from `@tauri-apps/api`:

```ts
// src/components/profile/PersonalDetailsCard.tsx
import { invoke } from "@tauri-apps/api/core";

const profile = await invoke<Profile | null>("get_profile");
await invoke<void>("upsert_profile", { profile });
```

On the Rust side, commands are registered in `src-tauri/src/lib.rs` and implemented in `src-tauri/src/commands/`:

```rust
// src-tauri/src/lib.rs
.invoke_handler(tauri::generate_handler![
    commands::profile::get_profile,
    commands::profile::upsert_profile
])
```

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

The database model layer has unit tests that run against an in-memory SQLite instance — no app window needed.

```bash
cd src-tauri
cargo test
```

---

## Contributing

This is a personal project in active development, but contributions are welcome. A few things to know before diving in:

- The design system lives in `src/index.css` as CSS custom properties — use those tokens rather than hardcoding colours
- UI components use inline `style` props for theme colours (Tailwind doesn't have access to the CSS vars at build time for dynamic values)
- Keep Tauri commands thin — put query logic in `src-tauri/src/models/` and call it from `commands/`

---

## License

To be decided.
