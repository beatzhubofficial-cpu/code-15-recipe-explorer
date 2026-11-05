# Project Plan

**Status**: Planning
**Created**: 2026-11-05
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build a TypeScript-powered recipe explorer that discovers meals from TheMealDB, supports search and category browsing, and provides a fast, resilient browsing experience for recipe discovery, favourites, and random suggestions. The project is designed so that every module is independently testable.

**App Type**: Full-stack SSR

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Runtime** | Node |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure Static Web Apps | Hosts the Next.js experience and serves SSR pages for recipe browsing | `NEXT_PUBLIC_APP_ENV` | `development` | Essential |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js 20+ | Frontend | ✅ | 26.13.0 |
| npm | Frontend | ✅ | 11.20.0 |
| Git | * | ✅ | 2.56.0.windows.4 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | Frontend | ❓ | Unknown |
| Docker Compose | Frontend | ❓ | Unknown |
| VS Code JavaScript Debugger | Frontend | ❓ | Unknown |

---

## 5. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: Warm, recipe-first, and highly scannable, with layered cards, generous spacing, and clear emphasis on quick discovery, ingredient clarity, and accessibility.
**Typography**: Inter, system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#F97316` | Primary actions, category highlights, and active recipe links |
| `accent` | `#FBBF24` | Secondary accents, badges, and quick search emphasis |
| `surface` | `#FFF7ED` | Page and card background for a warm, light recipe experience |
| `text` | `#1F2937` | Primary body text for recipe names, metadata, and instructions |
| `muted` | `#6B7280` | Secondary labels, durations, and nutritional hints |
| `border` | `#F4D7B5` | Dividers, input boundaries, and subtle recipe card edges |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Home | `/` | Browse categories and kick off recipe discovery | `hero + card-list + actions` |
| Search Results | `/search` | Find meals by keyword and review matches | `header + list + actions` |
| Category | `/category/[name]` | Explore recipes within a single category | `header + card-list` |
| Recipe Detail | `/meal/[id]` | Review ingredients, steps, and related meals | `two-column(media+meta) + action-bar` |
| Favourites | `/favourites` | Revisit saved recipes | `header + card-list` |

### Sample Content

Home — Recipes:
| Title | Category | Time | Status |
| Spicy Chicken Tikka | Dinner | 35 min | Trending |
| Lemon Herb Pasta | Dinner | 25 min | New |
| Veggie Buddha Bowl | Lunch | 20 min | Popular |
| Berry Pancakes | Breakfast | 15 min | Featured |

Search Results — Recipes:
| Title | Category | Match Score | Status |
| Chicken Caesar Wrap | Lunch | 98% | Ready |
| Coconut Curry Noodles | Dinner | 91% | Featured |
| Mango Salsa Salmon | Dinner | 87% | Fresh |
| Apple Oat Muffins | Breakfast | 82% | Seasonal |

Category — Dinner:
| Title | Prep | Calories | Status |
| Chicken Korma | 45 min | 540 | Popular |
| Thai Basil Noodles | 30 min | 470 | Top Rated |
| Mushroom Risotto | 40 min | 490 | Recommended |
| Crispy Tofu Tacos | 25 min | 420 | Vegan |

Recipe Detail — Chicken Korma:
| Field | Value |
| Ingredients | 12 ingredients |
| Difficulty | Medium |
| Servings | 4 |
| Rating | 4.8/5 |

Recipe search — query: "pasta" · cuisine: "Italian" · max time: "30 min"

---

## 6. Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts
│   ├── category/
│   │   └── [name]/
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── favourites/
│   │   └── page.tsx
│   ├── meal/
│   │   └── [id]/
│   │       ├── error.tsx
│   │       ├── loading.tsx
│   │       ├── more-from-category.tsx
│   │       └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── favorite-button.tsx
│   ├── ingredients-checklist.tsx
│   ├── meal-card.tsx
│   ├── random-recipe-button.tsx
│   ├── search-form.tsx
│   └── skeletons.tsx
├── lib/
│   ├── favorites.ts
│   └── mealdb.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|--------------|
| 1 | GET | `/` | Landing page with category tiles and user search entry | — | `{ categories, featuredMeals }` | 200 |
| 2 | GET | `/search` | Search results page for meals by keyword | `?q=...` | `{ query, results }` | 200, 404 |
| 3 | GET | `/category/[name]` | Category browsing page for a recipe area | — | `{ category, meals }` | 200, 404 |
| 4 | GET | `/meal/[id]` | Detailed recipe page with ingredients and instructions | — | `{ meal, ingredients, instructions, related }` | 200, 404 |
| 5 | GET | `/favourites` | Page that reads the saved cookie and loads favourite meals | — | `{ meals }` | 200 |
| 6 | POST | `/api/search` | Search route used by the app to query TheMealDB | `{ q: string }` | `{ results }` | 200, 400, 500 |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, and deployment validation
