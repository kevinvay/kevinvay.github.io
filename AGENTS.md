# Project instructions

- At the start of every new Codex task or after the Codex app restarts, ensure the local development site is running on port 3001 before doing other project work. If port 3001 is already serving this project, leave it running; otherwise start it with `npm run dev -- --port 3001`.
- For every website update, use this release order:
  1. Verify the affected page locally through the site running on port 3001.
  2. Run `npm run build` and require a successful complete-site build.
  3. Stop after local validation and tell the user the update is ready for their inspection. Do not publish automatically.
  4. Only after the user explicitly confirms the local version and asks to publish, publish the exact validated source to the existing `chatgpt.site` project and wait for a successful production deployment.
- Do not run `npm run export:edgeone` or update `out/` unless the user explicitly requests it. `out/` is not part of the normal release workflow and may intentionally remain unchanged.
- Do not use GitHub or EdgeOne Pages as the default publishing workflow.
