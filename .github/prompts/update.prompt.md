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

How to Apply the Update
=======================

1. Review the `---ACTION---` block:
   - If no entries are marked `REVIEW_REQUIRED`, apply the changes directly to `data/packages.yaml` and commit using the suggested message.
   - If any entries are marked `REVIEW_REQUIRED`, review the category/tag alternatives provided. Edit the payload as needed, then apply.

2. For ambiguous entries:
   - Confirm the correct category/tag with a maintainer, or select one of the suggested alternatives.
   - Once resolved, update the payload and proceed with the patch.

3. Apply the patch:
   - Use your editor or a script to insert/update the YAML nodes in `data/packages.yaml` as specified.
   - Commit the changes using the suggested commit message.

4. Update any UI/docs referencing category lists if categories are changed.

Helper script
-------------

We include a helper script at `bin/apply-packages-patch` that can apply an `---ACTION---` payload
to `data/packages.yaml` deterministically. Usage:

```sh
# apply from a file
bin/apply-packages-patch -a action.yaml

# or pipe the `---ACTION---` block into the script
cat action.yaml | bin/apply-packages-patch
```

Behavior when creating categories/tags
-------------------------------------

- If the payload requires creating new categories or tags, the script will prompt interactively
   for confirmation and provide up to 3 suggested alternatives with scores (1-4). Use `--allow-create`
   to skip prompts and allow creation in non-interactive runs. The agent must not create categories/tags
   automatically without either an explicit `--allow-create` flag or interactive approval.

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
 - Provenance formatting: when `info` is sourced from an external homepage/repo, append a short provenance note at the end of the `info` block using the format `(source: <url>)`.

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
       c) If no confident match (≤80%), assign `uncategorized` and set `REVIEW_REQUIRED`. Do NOT create new categories automatically; creation requires explicit human approval or a runtime `--allow-create` flag.

Resolution & application loop (explicit)
---------------------------------------

- After generating the `---ACTION---` block, do a pass for `REVIEW_REQUIRED` flags:
   - If any entries are `REVIEW_REQUIRED`, summarise each open question (why it's ambiguous and the suggested alternatives) and pause execution. The agent MUST wait for explicit human confirmation specifying either:
      * `approve <entry-id> <chosen-category> [<tags>]` to resolve that entry, or
      * `reject <entry-id>` to skip it, or
      * `edit <entry-id>` with a modified payload.
   - Only once all `REVIEW_REQUIRED` entries are resolved by explicit responses should the agent proceed to apply changes.

- If there are no `REVIEW_REQUIRED` entries (confidence high for all), the agent SHOULD apply the inserts/updates directly to `data/packages.yaml`. When applying changes the agent MUST:
   - Write the updated `data/packages.yaml` file contents (do not perform git commits or pushes).
   - Include the resulting unified diff (or the exact changed YAML nodes) inside the `---ACTION---` block so humans and automation can review the applied edits.
   - Still emit the `---REPORT---` and `---COMMIT---` sections: the latter is a suggested commit message that a human or CI may use to commit the changes.

- Do not perform git operations (commit/push); only write files locally and surface diffs. This preserves auditability and adheres to repository safety rules.

4) Tag assignment
   - Prefer tags already used in the repository. Map common keywords to tags (e.g. "documentation" -> `documentation`, "shell" -> `command-line`/`terminal`, "fish" -> `shell`, "bash" -> `shell`, "cli" -> `command-line`, "dev" -> `development`).  
      - Limit tags to a sensible number (3–6). Avoid inventing new tags unless necessary; if no existing tags fit, add a single `uncategorized` tag and flag `REVIEW_REQUIRED` so a maintainer can refine tags later.

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
