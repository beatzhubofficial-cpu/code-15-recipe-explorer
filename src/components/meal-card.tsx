import Image from "next/image";
import Link from "next/link";

import type { MealSummary } from "@/lib/mealdb";

export function MealCard({ meal }: { meal: MealSummary }) {
  return (
    <Link
      href={`/meal/${meal.idMeal}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-ink">{meal.strMeal}</h2>
        <span className="mt-2 inline-block text-sm font-medium text-olive">
          View recipe <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
