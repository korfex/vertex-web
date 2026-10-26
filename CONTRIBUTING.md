# Contributing to Vertex

This document describes the process of contributing to Vertex. For technical
details on building and running the app, see ["Developing Vertex"](HACKING.md).

## The Critical Rule

**The most important rule: you must understand your code.** If you can't
explain what your changes do and how they interact with the greater system,
do not submit them.

## AI Usage

AI-assisted contributions are allowed and don't need to be disclosed. AI is
treated like any other tool: you are responsible for every line you submit.
That means you have reviewed and tested it, you can explain it (see the
Critical Rule above), and you have no reason to believe it reproduces code
under a license incompatible with the AGPL.

## Legal Notice

Vertex is licensed under the [AGPL-3.0-only](LICENSE). By contributing, you
agree that your contribution is provided under that license.

Every commit must be signed off to certify the
[Developer Certificate of Origin](https://developercertificate.org/):

```
Signed-off-by: Your Name <you@example.com>
```

`git commit -s` adds this line for you.

## Workflow

- **Bugs and feature ideas:** open an issue. For bugs, include clear steps to
  reproduce, your browser and OS, and your homeserver.
- **Pull requests:** target the `dev` branch and reference the issue they
  resolve. Pull request titles follow
  [Conventional Commits](https://www.conventionalcommits.org/)
  (e.g. `fix: ...`, `feat: ...`); this is checked in CI.
- **Before opening a pull request:** make sure `npm run build` succeeds.

## Upstream

Vertex is a fork of [Cinny](https://github.com/cinnyapp/cinny). Fixes from
upstream are merged in from time to time. Please do not open issues or pull
requests about Vertex on the Cinny repository.
