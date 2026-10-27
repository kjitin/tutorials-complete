# StackWise

A learning site for **Java 21**, **Spring Boot 4** and **design patterns** — lessons with runnable Java examples, UML diagrams, interview Q&A and quizzes. Built with [Astro](https://astro.build) + MDX.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321 (search is only available after a build)
npm run build     # static site in dist/ + Pagefind search index
npm run preview   # serve the production build
```

## Project layout

```text
src/
  site.config.ts            # site name, URL, analytics, ads, playground runner, tracks & modules
  content/
    java/                   # lessons (MDX) — one file per lesson
    spring-boot/
    design-patterns/
    interview/              # interview Q&A pages (MDX with <QA> blocks)
  data/quizzes/             # quiz banks (TypeScript) — register new ones in index.ts
  components/               # layout, search, sidebar, quiz engine…
  components/mdx/           # components usable in MDX without imports
```

## Writing content

Lesson frontmatter:

```yaml
---
title: Records
description: One-sentence summary shown in cards and search.
group: Modern Java (17–21)     # must match a group in site.config.ts
order: 2                       # position within the group
level: beginner                # beginner | intermediate | advanced
---
```

Available in every MDX file:

- `<Callout type="tip|info|warn|danger|interview" title="…">…</Callout>`
- `<CodeTabs labels={["Before", "After"]}>` wrapping one fenced code block per tab
- `<Playground title="Demo.java">` wrapping a ```` ```java ```` block — runnable in the browser. Put `main` in a class called `Main`.
- ```` ```mermaid ```` fenced blocks — rendered as diagrams, themed for light/dark
- `<QA q="Question?" level="easy|medium|hard">answer markdown</QA>` (interview pages)

MDX treats `{` and `<` in prose as JSX — wrap code such as `List<String>` in backticks.

## Configuration

Everything lives in `src/site.config.ts`:

- **Name / URL** — `SITE.name`, `SITE.url` (used for canonical links and the sitemap)
- **Analytics** — set `analytics.provider` to `'ga4'` or `'plausible'` and fill in the id/domain
- **Ads** — set `ads.enabled = true` with your AdSense client and slot ids
- **Code runner** — `playground.endpoint` defaults to the free [Wandbox](https://wandbox.org) API (Java 21). Point it at a self-hosted runner with the same API to remove the third-party dependency.

## Deployment

The site is hosted on Vercel at <https://stackwise-rosy.vercel.app>. The project is connected to this GitHub repo: every push to `main` deploys to production, and other branches and pull requests get preview URLs. `vercel.json` makes Vercel run `npm run build` so the Pagefind index is included.

## Progress tracking

Completed lessons, bookmarks, quiz scores and "I know this" interview marks are stored in the visitor's browser (`localStorage`); nothing is sent to a server.
