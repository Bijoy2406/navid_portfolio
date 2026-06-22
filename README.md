# Navid's Portfolio

Single-page portfolio for a Photographer & Cinematographer based in Atlanta. Built with Next.js 15, Tailwind CSS v4, and GSAP. Content is driven by YAML files so the site owner can update copy without touching code.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **GSAP 3** + **Motion**
- **TypeScript**
- Content via `js-yaml` from `/content/*.yaml`

## Getting started

**Prerequisites:** Node.js 18+

```bash
npm install
```

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env.local
# then set GEMINI_API_KEY in .env.local
```

```bash
npm run dev     # dev server at localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

## Customising content

All copy lives in [`/content`](content/) — edit the YAML files to update the site without touching any component code.

| File | What it controls |
|------|-----------------|
| `hero.yaml` | Name, title, email, phone, LinkedIn, location, background image |
| `summary.yaml` | Bio / about text |
| `experience.yaml` | Work history |
| `education.yaml` | Education |
| `skills.yaml` | Skills list |
| `languages.yaml` | Languages |
| `links.yaml` | Social links |

Drop replacement images into [`/public/assets/`](public/assets/) and reference them by filename in `hero.yaml`.

## Project structure

```
app/              Next.js App Router pages & layout
components/       Reusable UI components
content/          YAML content files
hooks/            Custom React hooks
lib/              Utilities (content loader, image resolver)
public/assets/    Static images
```
