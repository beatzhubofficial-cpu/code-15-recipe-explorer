"use client";

import { useState } from "react";

import type { MealIngredient } from "@/lib/mealdb";

export function IngredientsChecklist({
  ingredients,
}: {
  ingredients: MealIngredient[];
}) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    ingredients.map(() => false),
  );

  return (
    <ul className="mt-4 divide-y divide-ink/10 rounded-2xl bg-white px-5">
      {ingredients.map(({ ingredient, measure }, index) => (
        <li key={`${ingredient}-${measure}`} className="py-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() =>
                setChecked((current) =>
                  current.map((isChecked, itemIndex) =>
                    itemIndex === index ? !isChecked : isChecked,
                  ),
                )
              }
              className="h-4 w-4 accent-olive"
            />
            <span
              className={`flex flex-1 justify-between gap-4 ${
                checked[index] ? "text-stone-400 line-through" : ""
              }`}
            >
              <span>{ingredient}</span>
              <span className="text-right text-stone-500">{measure}</span>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
