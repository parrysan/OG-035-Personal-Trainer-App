---
title: "OG-035-Personal-Trainer-App — Personal Trainer App"
type: project-bootstrap
created: "2026-07-18"
---

# OG-035-Personal-Trainer-App — Personal Trainer App

> **Bootstrap order — read these in order before doing any work in this project:**
>
> 1. `~/.claude/CLAUDE.md` → `Open-Memory-Vault/system/identity/MASTER-PROMPT.md` — Phil's identity (auto-loaded via symlink in Claude Code; other tools should mirror this).
> 2. `~/AGENT.md` → `agent-config/AGENT.md` — global operating manual (work style, skills routing, secrets policy, layering rules in §2.10).
> 3. `Open-Memory-Vault/AGENTS.md` — vault operating contract (read **only** if you will write to the vault during this session).
> 4. `Open-Memory-Vault/projects/OG-035-Personal-Trainer-App/README.md` — durable project page (status, decisions, recent activity, vault-side context).
> 5. **This file (`AGENTS.md`)** — project-specific overrides and live operational references (below). `CLAUDE.md` in this folder is a one-line `@AGENTS.md` shim so Claude Code loads it too.
>
> **The project's `AGENTS.md` is a bootstrap manifest, not a knowledge dump.** It points at everything else. Durable knowledge lives in the vault project page. Do not duplicate.

---

## At a glance

- **Code**: `OG-035`
- **Name**: Personal Trainer App
- **Stakeholder**: Phil (self)
- **Type**: `product`
- **Status**: `active`
- **Priority**: `medium`
- **Revenue lane**: `2-pod`
- **Autonomy mode**: `co-pilot` — autopilot = agent runs it end-to-end with checkpoint reviews; co-pilot = Phil drives, agent assists. See master prompt.
- **Purpose** (one sentence): An app for personal trainers in Poland that helps them manage their business.
- **Client dashboard**: _(not deployed yet — paste the Client Area URL here after deploying; the AIOS project card links it automatically)_
- **Last touched**: `2026-07-18`

---

## Where things live

| Resource | Location |
|---|---|
| **Code root** | this folder (`dev/OG-035-Personal-Trainer-App/`) |
| **Project docs** | `./docs/` |
| **Vault project page** | `Open-Memory-Vault/projects/OG-035-Personal-Trainer-App/README.md` |
| **GitHub repo** | https://github.com/parrysan/OG-035-Personal-Trainer-App |
| **External systems** | none yet — OG-Research Drive store pending |

---

## Live references

> **Operational facts that should never have to be re-discovered.** Deployed URLs, store handles, theme IDs, API endpoints, credentials *location* (never the credentials themselves — those live in the global `.env`, see global AGENT.md §2.5). Update this section whenever a fact changes — it is the canonical source.

- **Production URL**: (tbd)
- **Staging / preview URL**: (tbd)
- **Platform handle / project ID**: (tbd)
- **Other identifiers**: (tbd)
- **Credentials**: stored in global `.env` under `OG_035_*` (none yet)

---

## Tech stack

Inherits OS-000-Design-System defaults (see global AGENT.md §2.7):
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 + OS-000 design tokens
- **Components**: OS-000 shared component library
- **Hosting**: Firebase Hosting
- **Design viewer**: /design-system route

Overrides: none yet — add project-specific overrides here as they emerge.

---

## Project-specific rules

> Domain rules, naming conventions, "do not" lists. Anything an LLM working in this project must know that isn't true globally. If empty, write "None — global rules apply" and stop.

- None — global rules apply

---

## Skills

> List any project-specific skills in `./.claude/skills/`. If none, the project uses the global library at `~/OG/shared-skills/`. Do not duplicate the global skills inventory here — see global AGENT.md §2.2.

- **Project-local skills**: none — uses global library
- **Most relevant global skills for this project**: `frontend-design`, `ui-ux-pro-max`, `vercel-react-best-practices`

---

## Notes for the next session

> **Optional, ephemeral.** A 2–3 line free-form scratch pad of "where I left off" — not durable knowledge. Durable decisions belong in the vault project page. Wipe and rewrite freely.

Last action: project scaffolded via og-project skill. Next action: define MVP scope (client management, scheduling, payments for PL personal trainers).
