# Package update template (agent & human reference)

This file is a template and checklist for converting Homebrew `brew info` output into the
repository `data/packages.yaml` entries. It is intentionally a template-style document with
placeholder tokens to be filled by the agent or a human maintainer.

Purpose
-------

Give a single source-of-truth for how package updates should be structured:

- Field names and semantics (`desc` vs `info`).
- Required heuristics (category selection, tag assignment, id format).
- The rule: always visit the package homepage for new packages; if homepage is missing,
	search the web and prefer authoritative sources (official project page, GitHub repo,
	or Homebrew formula page).

Field definitions (placeholders)
-------------------------------

- `name`: display name (string)
- `desc`: short one-line description (string). Use `desc` for a one-line short summary.
- `info`: longer multi-line description (block). Generate this from the homepage / repo
	README content and the formula description — make it helpful and not just a copy of
	the one-line summary.
- `homepage`: canonical URL to the project home or repo
- `id`: normalized Homebrew id (e.g., `homebrew/core/bash` or `homebrew/cask/brave-browser`)
- `tags`: array of existing tags from `data/packages.yaml` (prefer reuse)
- `cask`: true when the package is a cask (omit when false)
- `license`: SPDX id if available

Template example (YAML node)
---------------------------

Fill the placeholders and follow style used elsewhere in `data/packages.yaml`.

```yaml
- name: [NAME]
  desc: [SHORT_DESC]
  homepage: [HOMEPAGE_URL]
  id: [homebrew/core|homebrew/cask|project/repo]/[name]
  tags: [tag1, tag2]
  license: [SPDX]
  info: >-
		[LONG_FORM_INFO (2-4 sentences). Prefer curated text from the homepage README.]

```

Canonical YAML schema reference
-------------------------------

```yaml
- name: string                           # required; display name
  desc: string                           # required; one-line (<=120 chars)
  homepage: https://example.com          # required; canonical project URL
  id: [homebrew/core|homebrew/cask|project/repo]/formula-name  # required; normalized Homebrew id
  tags: [tag-a, tag-b, tag-c]            # required; 3–6 existing tags
  cask: true                             # optional; omit when false/not a cask (deprecated)
  license: SPDX-ID                       # optional when unknown
  info: >-                               # required; 2–4 sentence summary
    Long-form narrative with provenance note when sourced externally.
```

Notes:
- Maintain two-space indentation and inline arrays for `tags`.
- `dependencies` should list canonical Homebrew names; combine build/runtime unless clarity demands separation.
- Always place `info` last for consistent diffs and readability.

Agent step-by-step checklist (use this when implementing `/update`)
-----------------------------------------------------------------

1. Input normalization
	 - Split multiple `brew info` blocks. Trim whitespace and normalize newlines.

2. Parse required fields from the `brew info` block:
	- name, version, short description, homepage, license, "From:" line
		 (to infer id), analytics (optional), and whether installed.

3. Homepage policy (CRITICAL)
	 - For any NEW package (not found in `data/packages.yaml`): attempt to visit the
		 homepage URL and extract a canonical long description (first paragraph of README,
		 project tagline, or GitHub repo description). If homepage is missing in the block,
		 perform a web search for the package name + "homepage" or use the `formulae.brew.sh`
		 API to find the official page. Record the source used.

4. Category selection
	 - Load `data/packages.yaml` and try to match by name/keywords. If user provided
		 explicit category argument, validate and use it. Otherwise pick best-fit from
		 existing categories using deterministic heuristics:
		 - Signals like "cli", "command", "shell", "terminal" → category `command-line`; tags `command-line`, `terminal`, `shell`.
		 - Mentions of languages ("python", "rust", "javascript") or SDK/tooling → category `development` or the language-specific bucket; tags `development`, `<language>`.
		 - Packaging/build automation references ("brew", "installer", "package manager") → category `package-management`; tags `packaging`, `automation`.
		 - Desktop/macOS utilities, browsers, productivity apps → category `applications` or `browsers`; tags `productivity`, `macos`, `gui` as appropriate.
		 - Networking/cloud/server terms → category `networking` or `infrastructure`; tags `network`, `cloud`, `server`.
		 - Documentation or static site generators → category `documentation` or `web`; tags `documentation`, `static-sites`.
		 - If confidence is ≤80%, fall back to `uncategorized` and mark `REVIEW_REQUIRED` with rationale.

5. Tag assignment
	 - Map common keywords to existing tags. Prefer existing tags; limit tags to 3–6.

6. Duplicate detection and mode
	 - Find existing entry by `id` or case-insensitive `name`.
	 - If exists and `mode=insert-only` → skip with reason.
	 - If exists and `mode=upsert` → prepare a minimal patch updating only changed fields.

7. Build the YAML payload following repository ordering and quoting conventions.

8. Validation
	 - Lint the YAML (valid syntax, 2-space indentation, no tabs).
	 - Ensure `desc` is one line and `info` is a block scalar.
	 - No placeholder brackets remain in final payload.

9. Produce output
	 - `---ACTION---` machine block with ops (insert/update/skip), file path, category, and
		 the exact YAML payload(s).
	 - `---REPORT---` human-friendly summary listing inserts/updates/skips and any
		 `REVIEW_REQUIRED` items.
	 - `---COMMIT---` suggested commit message and PR bullets.

Quality guidance for `info` generation
-------------------------------------

- Prefer authoritative text from the project's homepage, README or GitHub description.
- Rephrase — do not copy large verbatim blocks from the README; summarize into 2–4
	sentences focusing on primary audience and use cases.
- If homepage content is ambiguous, include a one-line provenance note: "(source: <url>)".

Examples (concrete)
-------------------

Example: bash (suggested payload)

```yaml
- name: bash
	desc: Bourne-Again SHell, a UNIX command interpreter
	homepage: https://www.gnu.org/software/bash/
	id: homebrew/core/bash
	tags: [shell, command-line, system]
	license: GPL-3.0-or-later
	info: >-
		The GNU Bourne-Again SHell (bash) is a widely used POSIX-compatible shell providing
		interactive and scripting features for systems administration and automation. (source: GNU project)
```

Example: fisher (suggested payload)

```yaml
- name: fisher
	desc: Plugin manager for the Fish shell
	homepage: https://github.com/jorgebucaran/fisher
	id: homebrew/core/fisher
	tags: [shell, command-line]
	license: MIT
	info: >-
		Fisher is a fast, dependency-free plugin manager for the Fish shell. It simplifies
		installing, updating and managing packages for Fish and integrates with the shell's
		function autoloading. (source: GitHub)
```

Checklist before creating a patch
--------------------------------

- [ ] `homepage` visited and `info` extracted or web search noted
- [ ] Category validated against `data/packages.yaml`
- [ ] Tags selected from existing tag set
- [ ] License set to SPDX id if known
- [ ] YAML lint passes
- [ ] `REVIEW_REQUIRED` flagged for ambiguous choices

Commit message template
-----------------------

docs: add/update package [name] to data/packages.yaml (category: [id])

Notes
-----

This file is a template and human-readable checklist for maintainers and agents. When an
agent runs the `/update` prompt it should follow these rules strictly and produce the
three-section output (`---ACTION---`, `---REPORT---`, `---COMMIT---`).

Last updated: 2025-09-25

