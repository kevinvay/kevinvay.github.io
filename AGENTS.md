# Project instructions

- At the start of every new Codex task or after the Codex app restarts, ensure the local development site is running on port 3001 before doing other project work. If port 3001 is already serving this project, leave it running; otherwise start it with `npm run dev -- --port 3001`.
- For every website update, use this release order:
  1. Verify the affected page locally through the site running on port 3001.
  2. Build the complete site, publish the validated source to the existing `chatgpt.site` project, and wait for a successful production deployment.
  3. After the production deployment succeeds, run `npm run export:edgeone` to replace `out/` with the current static files from `dist/client/`.
  4. Confirm that both the `chatgpt.site` deployment and the `out/` EdgeOne upload folder are current before reporting completion.
- Treat `out/` as the EdgeOne direct-upload package. Never hand off a stale `out/` directory from an earlier build.
