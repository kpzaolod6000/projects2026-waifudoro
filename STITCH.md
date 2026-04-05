# Stitch + Agent Skills — WaifuDoro

This project is integrated with **Google Labs Stitch** (AI UI design tool) and the **Agent Skills** open standard. The `.stitch/` and `.agents/` directories at the project root are managed by these tools.

---

## Directory Layout

```
waifudoro/
├── .stitch/
│   └── designs/          # Downloaded Stitch design files (.html, .png)
└── .agents/
    └── skills/           # Installed agent skills
        ├── react-components/
        ├── design-md/
        ├── enhance-prompt/
        ├── remotion/
        ├── shadcn-ui/
        └── stitch-loop/
```

---

## Prerequisites

- **Node.js 20+**
- **Claude Code CLI** (or any MCP-compatible AI agent)
- **Stitch MCP Server** configured and running
- Access to a Stitch project (Google Labs)

---

## Installing Skills

Skills are installed globally via the `skills` CLI and land in `.agents/skills/`. All skills used in this project come from `google-labs-code/stitch-skills`.

```bash
# Install all skills used in this project
npx skills add google-labs-code/stitch-skills --skill react:components --global
npx skills add google-labs-code/stitch-skills --skill design-md --global
npx skills add google-labs-code/stitch-skills --skill enhance-prompt --global
npx skills add google-labs-code/stitch-skills --skill remotion --global
npx skills add google-labs-code/stitch-skills --skill shadcn-ui --global
npx skills add google-labs-code/stitch-skills --skill stitch-loop --global
```

---

## Installed Skills

### `react:components`
Converts a Stitch screen into modular Vite + React + TypeScript components following the project's design system.

**Use when:** You have a new screen in Stitch and want to scaffold it as React components.

**Example prompt:**
```
Convert the Tasks screen from the WaifuDoro Stitch project to React components.
```

**Pipeline:**
1. Fetches design JSON and screenshot from Stitch via MCP
2. Maps Stitch tokens to `tailwind.config` values via `style-guide.json`
3. Scaffolds components using Atomic Design (`src/components/`, `src/hooks/`, `src/data/`)
4. Runs AST validation (`npm run validate`) to catch hardcoded values or missing interfaces
5. Starts dev server for a live review

---

### `design-md`
Analyzes Stitch screens and generates (or updates) `DESIGN.md` — the project's design system documentation.

**Use when:** Design tokens, colors, or component patterns have changed in Stitch and `DESIGN.md` needs updating.

**Example prompt:**
```
Analyze the WaifuDoro Stitch project screens and regenerate DESIGN.md.
```

---

### `enhance-prompt`
Rewrites a vague Stitch generation prompt into a precise, token-rich prompt that produces better screen outputs.

**Use when:** You're about to generate a new screen in Stitch and want higher-fidelity results.

**Example prompt:**
```
Enhance my prompt "add a leaderboard page" for Stitch generation.
```

---

### `shadcn-ui`
Expert guidance for installing, customizing, and composing shadcn/ui components in the React frontend.

**Use when:** Adding a shadcn/ui component to the project or migrating existing UI to shadcn patterns.

**Example prompt:**
```
Add a shadcn/ui data table with sorting to the Tasks page.
```

---

### `remotion`
Generates a Remotion video walkthrough from Stitch app screens — useful for demos and documentation.

**Use when:** You need a screen-by-screen walkthrough video of the app.

**Example prompt:**
```
Generate a Remotion walkthrough video for the WaifuDoro app screens from Stitch.
```

---

### `stitch-loop`
Autonomous iterative build loop: reads a task from `next-prompt.md`, generates the next screen via Stitch, integrates it, then writes the next task — repeating until the site is complete.

**Use when:** You want the agent to autonomously build out multiple screens end-to-end.

**Prerequisites:** Requires `DESIGN.md` (generate with `design-md` skill) and a `SITE.md` file.

**Example prompt:**
```
Read next-prompt.md and run the Stitch build loop for the next iteration.
```

---

## Typical Workflow

```
1. Design screen in Stitch (Google Labs)
      ↓
2. [enhance-prompt] → refine the generation prompt
      ↓
3. Generate screen in Stitch
      ↓
4. [react:components] → scaffold as React components in frontend/src/
      ↓
5. [design-md] → keep DESIGN.md in sync if tokens changed
      ↓
6. Review in browser: npm run dev (inside frontend/)
```

---

## Design Files

Downloaded Stitch designs are cached locally under `.stitch/designs/` as `.html` and `.png` files.
The agent will ask before re-downloading if a cached version already exists.

The current `DESIGN.md` at the project root was generated from the WaifuDoro Stitch project and is the authoritative source for the visual design system.
