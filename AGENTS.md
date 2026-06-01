# My AskAI documentation — agent instructions

Instructions for AI agents working in this repository.

## About this project

- This is the **My AskAI** help center (`support.myaskai.com`), a [Mintlify](https://mintlify.com) site migrated from GitBook.
- Pages are **MDX** files with YAML frontmatter (~155 pages). `index.mdx` is the home page.
- Configuration and the full navigation tree live in **`docs.json`**. A page does not appear in the site until it is registered under `navigation.pages` in `docs.json`.
- Reusable content lives in `snippets/`. Image assets live in `images/`; logo assets in `logo/`.
- For Mintlify product knowledge (components, config, syntax), use the Mintlify MCP servers: `https://mcp.mintlify.com` (edit content/settings) and `https://www.mintlify.com/docs/mcp` (query Mintlify docs).

## Local preview (important: Node version)

The `mint` CLI **rejects Node 25+**, and this machine's default `node` is v26. An LTS is installed at `/usr/local/opt/node@22`. Always put it on `PATH` first:

```bash
export PATH="/usr/local/opt/node@22/bin:$PATH"
npx -y mint@latest dev            # local preview at http://localhost:3000
npx -y mint@latest broken-links   # validate pages + internal links
```

Verify with `/usr/local/opt/node@22/bin/node -v` (should print v22.x). If node@22 is gone, install any LTS ≤ 24.

## Content structure

Top-level groups (each a directory of MDX pages, mirrored in `docs.json`):

- `start-here/` — onboarding, setup, adding the agent to a site
- `features/` — product features (channels, connections, tasks, insights, …)
- `security-+-privacy/` — security and privacy/compliance
- `account-management/` — pricing, billing, profile, user access
- `troubleshooting/` — common issues
- `faq/` — frequently asked questions
- `api-documentation/` — Query, Chat, and User Data APIs

## Do not touch

- `scripts/` and `MIGRATION_REPORT.md` — GitBook→Mintlify migration tooling, not docs content (already excluded via `.mintignore`).
- `drafts/` and `*.draft.mdx` are intentionally ignored.

## Branding (in `docs.json`)

- **Brand red:** `#EA3609` — used for all three `colors` slots (`primary`, `light`, `dark`). Keep reds on this exact value; avoid lighter/darker tints.
- **Font:** Inter.
- **Logo:** `logo/wordmark.png` (light mode) and `logo/wordmark-white.png` (dark mode). The icon-only mark is at `logo/icon.png`; `favicon.png` is the same speech-bubble icon.
- Brand name is written **"My AskAI"**.

## Style preferences

- Active voice and second person ("you").
- Concise sentences — one idea per sentence.
- Sentence case for headings.
- Bold for UI elements: Click **Settings**.
- Code formatting for file names, commands, paths, and code references.
