# AGENTS.md

Instructions for AI coding agents working on Vertex. Human contributors may
find them useful too; [CONTRIBUTING.md](CONTRIBUTING.md) still applies.

## Project

Vertex is the korfex team's Matrix web client, a fork of
[Cinny](https://github.com/cinnyapp/cinny). Upstream is fetched from the
`upstream` remote and merged in from time to time, so keep diffs against
upstream small:

- Don't reformat, rename or reorder code you aren't otherwise changing.
- Keep the `in.cinny.*` Matrix identifiers and `cinny_*` localStorage keys.
  Renaming them loses users' account data and sessions.
- Keep internal names such as `makeCinnySpacesContent`; they aren't
  user-facing.

## Stack

- React 18 function components in TypeScript, built with Vite.
- UI components from [`folds`](https://github.com/cinnyapp/folds); styles in
  vanilla-extract `*.css.ts` files.
- State in Jotai atoms (`src/app/state`), server data via `matrix-js-sdk` and
  TanStack Query.
- Layout: `src/app/components` (reusable UI), `features` (feature screens),
  `pages` (routes), `hooks`, `state`, `utils`, `plugins`.

## Code style

Match the code around you. Formatting is Prettier (`.prettierrc.json`: 100
columns, single quotes); lint rules are in `.eslintrc.cjs` (Airbnb-based).

### Comments

Write few comments. The default is none.

- Comment only to explain _why_: a non-obvious constraint, a workaround, a
  spec or server quirk. Link the issue or spec section when there is one.
- Don't restate what the code does, and don't label obvious blocks
  (`// Handle submit`, `// State`, `// Render`).
- Don't describe the change you're making (`// now uses X`, `// changed to`,
  `// fixed`). That belongs in the commit message.
- No commented-out code, section banners, or decorative separators.
- JSDoc only on exported helpers whose behaviour isn't clear from the name and
  types.

### Code

- Don't add defensive checks, `try`/`catch` blocks or fallbacks for states
  that can't happen. Let real errors surface.
- No `console.log` left behind; the lint config warns on `console`.
- No new abstractions, options or files for a single use. Inline it.
- No new dependencies without a clear reason given in the commit message.
- Reuse existing hooks and components (`useAsyncCallback`, `SettingTile`,
  `SequenceCard`, `ActionUIA`, ...) before writing new ones.
- User-facing names say "Vertex", never "Cinny", except where crediting
  upstream.

## Verification

The repo has known pre-existing failures. Don't try to fix them as part of an
unrelated change. Check that you didn't add new ones:

- `npm run build` must pass. It is the only check CI runs on pull requests.
- `npx tsc --noEmit` currently reports hundreds of errors, almost all from
  `matrix-js-sdk` imports not resolving under TypeScript 4.9. Compare the
  error count before and after your change, and read any errors in files you
  touched.
- `npx eslint <files>` and `npx prettier --check <files>`: run them on the
  files you changed rather than the whole tree.

## Testing

There is no automated test suite yet. Vitest unit tests and Playwright
end-to-end tests against a throwaway Tuwunel homeserver are planned; update
this section with how to run them when they land.

## Commits

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`); pull
  request titles are checked in CI.
- Sign off every commit (`git commit -s`) per the DCO in CONTRIBUTING.md.
- Group related changes into separate commits, and keep each commit building.
- Merges of upstream pull requests keep the original commits; put fixes in a
  separate follow-up commit.
