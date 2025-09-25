---
description: Slash-command prompt to parse Homebrew `brew info` output and update `data/packages.yaml` safely and idempotently.
scope: repository
usage: |
  Trigger: `/update` followed by one or more Homebrew `brew info` blocks (plaintext). The agent MUST consider any optional $ARGUMENTS passed alongside the command.
  Primary goal: produce a validated, ready-to-apply YAML fragment and a small sync report describing exactly where and how to insert or update entries in `data/packages.yaml`.
---

Quick-start TL;DR
=================
- Collect `/update` input → split into individual `brew info` blocks.
- For each block → parse fields → visit homepage (new packages) → enrich desc/info.
- Choose category & tags using repo heuristics → detect duplicates respecting `mode`.
- Emit ordered YAML node per package → lint formatting → assemble action/report/commit sections.
- Return the three-section response (`---ACTION---`, `---REPORT---`, `---COMMIT---`).

Overview
========
This prompt defines the exact algorithm and output format for the `/update` slash command used to update the Brewiz package list (`data/packages.yaml`). The agent receiving this prompt will:

- Parse one or more Homebrew formula/cask blocks (the text returned by `brew info` or `formulae.brew.sh` API).  
- For each package block, produce a best-effort YAML representation matching the repository's existing package schema.  
- Decide the best-fitting category and tags using existing categories/tags in `data/packages.yaml`.  
- Detect duplicates and decide whether to INSERT (new) or UPDATE (existing).  
- Produce a small Sync Impact Report and a suggested commit message.

Canonical YAML schema reference
===============================
YAML nodes MUST follow this ordering and shape:

```yaml
- name: string                           # required; display name
   desc: string                           # required; one-line (<=120 chars)
   homepage: https://example.com          # required; canonical project URL
   id: homebrew/[core|cask]/formula-name  # required; normalized Homebrew id
   tags: [tag-a, tag-b, tag-c]            # required; 3–6 existing tags
   cask: true                             # optional; omit when false/not a cask
   license: SPDX-ID                       # optional when unknown
   info: >-                               # required; 2–4 sentence summary
      Long-form narrative with provenance note when sourced externally.
```

Notes:
- Keep two-space indentation, no tabs, and inline arrays for `tags`.
- Place `info` last to preserve readability in diffs.

Preconditions / Inputs
----------------------

1. The command input is plaintext containing one or more `brew info` blocks.  
2. Optional $ARGUMENTS may include explicit category, tags, idempotency mode (`insert-only` vs `upsert`), or `visit_homepage: true`.

Execution flow (strict, step-by-step)
-------------------------------------

1) Normalize input
   - Split the input into independent package blocks. Typical separators: a blank line followed by "==> <name>:" or a line matching /^==>\s+\w+:/.
   - Trim and canonicalize whitespace and line endings.

2) For each package block, extract structured fields
   - Required fields to parse (if present): formula/cask name, stable version, status (Installed / Not installed), short description, homepage URL, license, options, caveats, source URL (From: ...), analytics (30/90/365 day installs), id (prefer `homebrew/core/<name>` or `homebrew/cask/<name>` when the `From:` line includes the repo), bottle status, and whether it's a cask (if `cask` / `Cask` or cask-like URL is present).
   - Field semantics (MANDATORY):
     * `desc`: a concise one-line summary used for lists and UI thumbnails (<=120 characters). This should directly reflect the formula's short description or the project's tagline.
     * `info`: a longer human-friendly block (2–4 sentences) synthesized from the package homepage, README, or other authoritative sources. The agent MUST prefer the homepage content and rephrase/summarize; do not paste long verbatim blocks.
   - If parsing fails for a specific optional field, set it to null or omit it in output (do NOT leave bracket tokens).

3) Category selection (heuristic)
   - Load `data/packages.yaml` and collect existing category ids, names, and tags.
   - Use this priority to choose category:
     a) If user provided explicit category via $ARGUMENTS, use it (validate it exists; if not, warn).  
     b) Apply deterministic keyword heuristics—match on formula name, description, and homepage contents. Examples:
        | Signal                                               | Preferred category          | Suggested tags                     |
        | ---------------------------------------------------- | --------------------------- | ---------------------------------- |
        | Contains "cli", "command", "shell", "terminal"      | `command-line`              | `command-line`, `terminal`, `shell`|
        | Mentions "library", "sdk", specific language names  | `development` or language-specific | `development`, `<language>` |
        | Provides packaging or brew automation tooling        | `package-management`        | `packaging`, `automation`          |
        | Desktop/macOS apps (GUI, productivity, browsers)     | `applications` or `browsers`| `productivity`, `macos`            |
        | Networking/servers/cloud keywords                    | `networking` or `infrastructure` | `network`, `cloud`          |
        | Documentation generators/static site tooling         | `documentation` or `web`    | `documentation`, `static-sites`    |
     c) If no confident match (≤80%), fall back to `uncategorized` and flag `REVIEW_REQUIRED`.
   - Do NOT create new categories unless the package clearly belongs nowhere and user explicitly allows category creation.

4) Tag assignment
   - Prefer tags already used in the repository. Map common keywords to tags (e.g. "documentation" -> `documentation`, "shell" -> `command-line`/`terminal`, "fish" -> `shell`, "bash" -> `shell`, "cli" -> `command-line`, "dev" -> `development`).  
   - Limit tags to a sensible number (3–6). Avoid inventing new tags unless necessary; if none fit, add a single `uncategorized` tag.

5) Duplicate detection and idempotency
   - Search `data/packages.yaml` for an existing entry by `id` if available, otherwise by `name` (case-insensitive).  
   - If found:
     * If `mode=insert-only` → report "exists, skipped".  
     * Otherwise `upsert` mode: compute a minimal patch that updates only changed fields (homepage, info/desc, tags, id, license). Preserve existing `id` when present.
   - If not found → prepare an INSERT YAML node consistent with surrounding entries.

6) Output formatting rules (machine-friendly AND human-reviewable)
   - For each package produce a YAML node that matches the repository style. Required keys:
     - `name`: canonical package display name (string)
     - `desc` or `info`: short description / longer info (use `desc` for a one-line short summary and `info` for the long-form block if repo uses it)
     - `homepage`: URL
     - `id`: prefer value from `From:` line normalized to `homebrew/core/<name>` or `homebrew/cask/<name>` when available; else `homebrew/core/<name>` is acceptable.
     - `tags`: array of tag strings
     - `cask`: true when it's a cask (omit when false)
     - `license`: SPDX identifier when available
   - Keep ordering of keys consistent with repository examples (look at neighboring entries in the chosen category).

7) Validation
   - Ensure generated YAML is syntactically valid (no tab characters for indentation, consistent 2-space indent, proper quoting when needed).  
   - Ensure no bracket tokens `[SOMETHING]` remain.  
   - Provide a short lint result: `YAML valid: true/false` and list parsing warnings.

8) Sync Impact Report
   - For the whole command produce a single report containing:
     * `version`: timestamped edit id (e.g., `update:2025-09-25T12:34:56Z`)  
     * `processed`: number of package blocks parsed  
     * `inserts`: list of inserted package names and category  
     * `updates`: list of updated package names and changed fields  
     * `skipped`: list of skipped packages and reason  
     * `templates_needing_attention`: any templates or docs that might reference package lists (best-effort)
     * `suggested_commit`: a short commit message

9) Final output sections (exact order)
   - A compact machine-readable YAML/JSON action block labelled: `---ACTION---` containing operations to apply (insert/update/skip) with file path `data/packages.yaml` and the exact YAML fragment(s). This block MUST be valid YAML/JSON and parsable programmatically.
   - A human-friendly Sync Impact Report (as above).  
   - A suggested commit message and recommended PR description bullet points.

10) Post-steps and safety
   - Homepage-first rule (REQUIRED for NEW packages): For any package not already present in `data/packages.yaml`, the agent MUST attempt to visit the `homepage` URL and extract a short, authoritative description to populate `info`. If the `homepage` field is missing in the input block, the agent MUST perform a web search to find an authoritative homepage (prefer the `formulae.brew.sh` API, the Homebrew formula page, the project's official site, or the GitHub repository). Record the provenance URL used in the `info` provenance note.
   - If the agent cannot reach the network or fails to locate a homepage, it MUST set the operation to `REVIEW_REQUIRED`, include a clear note `TODO: homepage lookup failed for <name>`, and still produce a conservative `desc` using the `brew info` short description.
   - If `visit_homepage: true` was explicitly requested and the environment allows network access, the agent should also fetch the homepage and extract a one-line clarification (e.g., official description or homepage title). If network access is unavailable, note that.
   - Do not perform git operations. Only output the exact changes and the suggested commit message.
   - If uncertain about a category/tag choice, annotate the choice with `REVIEW_REQUIRED` and provide 2 alternative categories/tags with rationale.

Examples (two minimal examples matching repository style)
--------------------------------------------------

Example INSERT for `bash` (recommended style):

```yaml
- name: bash
  desc: Bourne-Again SHell, a UNIX command interpreter
  homepage: https://www.gnu.org/software/bash/
  id: homebrew/core/bash
  tags: [shell, command-line, system]
  license: GPL-3.0-or-later
  info: >-
    The GNU Bourne-Again SHell (bash) is a POSIX-compatible shell with many interactive features
    and scripting extensions used for system administration and scripting. Build-time deps: ncurses,
    readline, gettext.
```

Example INSERT for `fisher` (Fish plugin manager):

```yaml
- name: fisher
  desc: Plugin manager for the Fish shell
  homepage: https://github.com/jorgebucaran/fisher
  id: homebrew/core/fisher
  tags: [shell, command-line]
  license: MIT
  info: >-
    Fisher is a plugin manager for the Fish shell. It simplifies installing, updating and managing
    packages for Fish.
```

Agent response rules (must follow exactly)
----------------------------------------

1. Always produce the three output sections in order: `---ACTION---` (machine), `---REPORT---` (human), `---COMMIT---` (suggested commit message).  
2. The `---ACTION---` block must contain a list of operations with explicit `op: insert|update|skip`, `path: data/packages.yaml`, `category: <id>`, and `payload: <yaml-node>`.
3. If any ambiguous choices were made, include `REVIEW_REQUIRED` next to the operation and provide alternatives.
4. If the input is empty or unparsable, respond with a clear, actionable error and a short example of expected input.
5. Limit the total size of the YAML fragments to what would be reasonably included in a single PR (no more than ~100 new entries at once). If more, split into multiple batches and request confirmation.

Security & Privacy
------------------

- Never attempt to fetch or expose secrets.  
- Do not modify files other than `data/packages.yaml` without explicit instruction.  
- If the parsed `From:` URL indicates an external repo, prefer using that to construct `id` but do not access private repos.

Notes for implementers / integrators
----------------------------------

- This prompt is designed to be idempotent and programmatic-friendly; CI or a bot can run an agent with this prompt and apply the `---ACTION---` block automatically after human review.
- The agent should be tolerant of slightly different `brew info` formats (old/new). Use regexes to extract values robustly.
- Keep match heuristics conservative to avoid miscategorization; prefer `REVIEW_REQUIRED` when confidence < 80%.

End of prompt.
