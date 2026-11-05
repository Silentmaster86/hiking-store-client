# Working on this client

- Use React, Context, React Router and styled-components already in the project.
- Use Node.js 24. Run npm test, npm run lint and npm run build after relevant changes.
- Follow the pinned Playwright setup in README.md for browser checks. They use
  controlled API fixtures; do not describe them as full live-provider integration.
- Keep category wording in src/constants/categories.js and contact information
  in src/config/site.js. Set route metadata through PageMetadata.
- Preserve modal keyboard behaviour, focus visibility and narrow-screen layouts.
- Keep the demo notice accurate. There are no real purchases or shipments.
- Do not expose credentials through VITE variables or commit private .env files.
