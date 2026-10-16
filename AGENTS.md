# AGENTS.md

## What this repo is

Personal blog + portfolio (`tomercury.github.io`, live at https://tomercury.github.io) built **directly from the
[jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) theme source (v7.6.0)** — not the
"starter" template. There is no separate site repo vs theme repo:

- Site content/config: `_posts/`, `_tabs/`, `_config.yml` (lang `en`, timezone `Asia/Shanghai`)
- Theme code you can edit in place: `_layouts/`, `_includes/`, `_sass/`, `_javascript/`, `_data/`
- The sidebar is a portfolio nav: HOME (`index.md` = 关于我; must stay `.md` — root `.html` pages don't get
  Markdown-converted) + `_tabs/` = research / internships / skills / projects / posts (`_tabs/posts.md`
  uses `layout: home` and lists all posts at `/posts/`). UI chrome is English (`lang: en`); page
  bodies stay Chinese.
- Root `categories.html` / `tags.html` / `archives.html` are NOT tabs — archive indexes kept out of the
  sidebar. The `Posts` page shows a `Browse: Archives · Categories · Tags` row via
  `_includes/browse-links.html` + front matter `browse_links: true` (rendered by `_layouts/home.html`).
  Don't delete them.
- Site-structure / "which file do I edit" guide for humans: `ARCHITECTURE.md` (root, excluded from output).
- Upstream theme docs (README, `docs/`, the Chirpy wiki) describe the upstream project; trust the code here.

The upstream CI, issue/PR templates, `tools/init.sh`, and `tools/release.sh` were deliberately deleted.
Do not restore them. The `semantic-release` config in `package.json` is vestigial (its `tools/release.sh`
no longer exists) — ignore it.

## Commands

```sh
bundle install                # Ruby ~> 3.1 required by gemspec; CI builds on Ruby 3.4
npm install

bash tools/run.sh             # dev server: jekyll serve -l at 127.0.0.1 (add -p for production)
npm run watch:js              # rebuild JS on change during development
npm run build                 # production asset build: purgecss + rollup (see below)
npm test                      # lint only: eslint (_javascript) + stylelint (_sass)
npm run lint:fix:scss         # auto-fix SCSS lint issues

bash tools/test.sh            # what CI runs: production Jekyll build + htmlproofer
                              # (external links skipped; accepts -c "<config>[,<config>]")
```

There are no unit tests. `npm test` does not build anything.

## The #1 gotcha: JS/CSS artifacts are committed, CI does not build them

- `npm run build` generates `_sass/vendors/_bootstrap.scss` (purged Bootstrap) and
  `assets/js/dist/*.min.js` (rollup from `_javascript/`).
- Upstream gitignores these; **this fork deliberately commits them** because the deploy workflow
  (`.github/workflows/pages-deploy.yml`) only runs `bundle exec jekyll b` — it never runs npm.
- So: after changing anything in `_javascript/` or anything that adds/removes Bootstrap classes
  (layouts, includes, JS), run `npm run build` and **commit the regenerated artifacts**,
  or your change silently won't deploy.
- Note `rollup.config.js` deletes `assets/js/dist/` at startup; `app.min.js` and `sw.min.js`
  get Jekyll front matter injected (PWA files, served at `/app.min.js` and `/sw.min.js`).

## Deployment & verification

- Push to `master` triggers `.github/workflows/pages-deploy.yml`: production Jekyll build →
  htmlproofer (`--disable-external`) → GitHub Pages. Run `bash tools/test.sh` locally before pushing.
- Verify JS/SCSS with `npm test` (lint) — nothing else checks them.

## Conventions

- Commit messages must follow Conventional Commits (`fix(ui): ...`, `chore(deps): ...`);
  husky `commit-msg` hook runs commitlint and rejects anything else.
- Posts live in `_posts/` as `YYYY-M-D-title.md`; default permalink is `/posts/:title/` (don't change
  the permalink pattern — existing links depend on it). Tags are conventionally lowercase.
- `_tabs/` pages are ordered by their `order` front matter (`collections.tabs` in `_config.yml`).
- New files under `_includes/`, `_layouts/`, `_sass/`, `assets/`, `_data/locales`, `_data/origin`
  must be `git add`ed: the gemspec packages only `git ls-files` output.

## Other quirks

- `assets/js/vendor/*` must stay tracked — the patched search library lives there. The `.gitignore`
  keeps this working by scoping the Bundler exclude to `/vendor/` (root only); re-adding a bare
  `vendor` line would silently untrack it (`git add .` skips it, CI builds a site with a missing
  script → htmlproofer fails).
- **Search library is a locally patched fork** — `assets/js/vendor/simple-jekyll-search.min.js` is
  simple-jekyll-search v1.10.0 with literal (phrase) matching fixed (upstream never recompiled `dest/`
  after PR #166, so the CDN build splits queries into words and produces false hits). Referenced from
  `_data/origin/{cors,basic}.yml`. Don't "upgrade" it from npm/CDN — the bug is still there.
  `buildSnippet()` in `_includes/search-loader.html` adds keyword-in-context highlighting.
- `_layouts/home.html` has a no-paginator fallback so the `/posts/` tab lists all posts. Pagination is
  disabled in `_config.yml` (`paginate` commented out): jekyll-paginate v1 only paginates a root
  `index.html` template, and the root is now `index.md` (关于我). Restoring paginated posts to `/`
  requires an `index.html` template (plain HTML or renamed back) plus re-enabling `paginate`.
- Right-sidebar modules live in `_layouts/default.html` (`.access` block).
- `assets/lib` is a git submodule (chirpy-static-assets) used only when
  `assets.self_host.enabled: true` in `_config.yml` (currently off; the site loads libs from CDN).
  CI does not check it out — don't enable self-hosting without adding `submodules: true` to the
  workflow checkout.
- `_plugins/posts-lastmod-hook.rb` computes `last_modified_at` from `git log`, so it needs real git
  history (CI uses `fetch-depth: 0`); it yields nothing useful in shallow clones.
- **Future-dated posts are silently excluded from the build** (Jekyll default): with timezone
  `Asia/Shanghai`, a post dated "today evening" while the machine clock is afternoon will be skipped.
  If a new test post doesn't appear in the build, check its `date:` first.
- `.devcontainer/` exists (Jekyll image; `post-create.sh` runs `npm i && npm run build`) but the host
  machine setup above is the primary path.
- `_config.yml`'s `exclude` list keeps `docs/`, `tools/`, and build configs out of the site output —
  add new non-content root files there if they shouldn't be published.
