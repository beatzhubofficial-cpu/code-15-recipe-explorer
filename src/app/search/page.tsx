import type { Metadata } from "next";

import { MealCard } from "@/components/meal-card";
import { SearchBox } from "@/components/search-form";
import { searchMeals } from "@/lib/mealdb";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search recipes" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const meals = query ? await searchMeals(query) : [];

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        Find a favorite
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Search recipes
      </h1>
      <div className="mt-6">
        <SearchBox key={query} initialQuery={query} />
      </div>

      {query ? (
        <>
          <p className="mt-10 text-stone-600">
            {meals.length} {meals.length === 1 ? "recipe" : "recipes"} found for
            {" "}
            <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
          </p>
          {meals.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {meals.map((meal) => (
                <MealCard key={meal.idMeal} meal={meal} />
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white p-8 text-stone-600">
              Try another dish name, such as pasta, curry, or salmon.
            </p>
          )}
        </>
      ) : (
        <p className="mt-8 text-stone-600">
          Enter a dish name to discover recipes.
        </p>
      )}
    </main>
  );
}
