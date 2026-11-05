import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MealCard } from "@/components/meal-card";
import { getCategories, getMealsByCategory } from "@/lib/mealdb";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    name: category.strCategory,
  }));
}

async function findCategory(name: string) {
  const categories = await getCategories();
  return categories.find(
    (category) => category.strCategory.toLowerCase() === name.toLowerCase(),
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: `${category.strCategory} recipes`,
    description: category.strCategoryDescription,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    notFound();
  }

  const meals = await getMealsByCategory(category.strCategory);

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        Browse by category
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        {category.strCategory} recipes
      </h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-600">
        {category.strCategoryDescription}
      </p>

      {meals.length > 0 ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {meals.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <p className="mt-9 rounded-2xl bg-white p-8 text-stone-600">
          No recipes were found in this category.
        </p>
      )}
    </main>
  );
}
