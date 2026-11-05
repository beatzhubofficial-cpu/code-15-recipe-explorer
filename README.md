# Savor - Recipe Explorer

A recipe discovery app built with Next.js 15 App Router, React, TypeScript, and Tailwind CSS. It uses TheMealDB for categories, search results, and recipe details.

## Features

- Browse categories and search for recipes.
- View recipe instructions, ingredients, tags, and videos.
- Save up to 50 recipe IDs in a validated, HTTP-only JSON cookie.
- Use the optimistic heart control on a recipe page to add or remove a favourite.
- Open `/favourites` to fetch saved recipes in parallel.
- Choose **Surprise me** to look up a random recipe without caching the random result.

Favourites are stored in the browser cookie, not in an account or database. Clearing the cookie clears the saved list.

## Local development

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

The production build prints the route rendering table. In the current build:

| Marker | Route | Why |
| --- | --- | --- |
| `○` | `/` | Prerendered and revalidated daily. |
| `○` | `/_not-found` | Static not-found page. |
| `ƒ` | `/api/search` | Reads the request URL for its query. |
| `●` | `/category/[name]` | Static generation through `generateStaticParams`; 14 known categories are prerendered and revalidated hourly. |
| `ƒ` | `/favourites` | Reads the visitor's cookie with `cookies()`. |
| `ƒ` | `/meal/[id]` | Reads the visitor's favourites cookie to render the heart state. |
| `ƒ` | `/search` | Reads request-specific `searchParams`. |

`○` is static prerendering, `●` is static generation for a parameterized route, and `ƒ` is rendering on demand. The distinction between `○` and `●` is how the build describes the category route, not a difference in whether known category pages are prerendered.

## Caching

TheMealDB requests use explicit Next.js fetch settings in `src/lib/mealdb.ts`:

- `next: { revalidate: 86400 }` caches categories for one day.
- `next: { revalidate: 3600 }` caches category meals, search results, and recipe details for one hour.
- `next: { revalidate: 0 }` fetches the random recipe without reusing a cached response.
- `cache: "force-cache"` explicitly opts a request into the Data Cache. `cache: "no-store"` opts out and fetches fresh data on each request. The random endpoint uses `revalidate: 0` as its explicit no-cache policy.

Next.js 15 changed `fetch` from the Next.js 14 default of `force-cache` to an uncached-by-default behavior. This app sets revalidation explicitly for shared TheMealDB data so it does not depend on either version's default. Request-specific pages are dynamic because they use `searchParams` or `cookies()`.

## Deploy to Vercel

Import the project into Vercel or deploy with the Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

The app does not require environment variables. Production builds use secure HTTP-only cookies automatically.

## Project plan

The confirmed requirements and implementation plan are recorded in `.azure/requirements.json` and `.azure/project-plan.md`.
