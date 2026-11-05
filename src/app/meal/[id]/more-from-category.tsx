import { MealCard } from "@/components/meal-card";
import { getMealsByCategory } from "@/lib/mealdb";

interface MoreFromCategoryProps {
  category: string;
  currentMealId: string;
}

export async function MoreFromCategory({
  category,
  currentMealId,
}: MoreFromCategoryProps) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  const meals = await getMealsByCategory(category);
  const otherMeals = meals.filter((meal) => meal.idMeal !== currentMealId);

  return (
    <section className="mt-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        Keep exploring
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">
        More from {category}
      </h2>
      {otherMeals.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {otherMeals.slice(0, 4).map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-stone-600">No other recipes found.</p>
      )}
    </section>
  );
}
