import type { Metadata } from "next";
import { cookies } from "next/headers";

import { MealCard } from "@/components/meal-card";
import { FAVORITES_COOKIE_NAME, parseFavoriteIds } from "@/lib/favorites";
import { getMeal } from "@/lib/mealdb";

export const metadata: Metadata = {
  title: "Your favourites",
  description: "Recipes you have saved to your favourites.",
};

export default async function FavouritesPage() {
  const cookieStore = await cookies();
  const mealIds = parseFavoriteIds(
    cookieStore.get(FAVORITES_COOKIE_NAME)?.value,
  );
  const meals = (await Promise.all(mealIds.map((id) => getMeal(id)))).filter(
    (meal) => meal !== null,
  );

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        Your collection
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Favourites</h1>
      {meals.length > 0 ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl bg-white p-8 text-stone-600">
          You have not saved any recipes yet. Open a recipe and select “Save to
          favourites” to keep it here.
        </p>
      )}
    </main>
  );
}
