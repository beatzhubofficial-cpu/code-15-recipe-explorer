"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getRandomMealId } from "@/app/actions";

export function RandomRecipeButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError("");
    startTransition(async () => {
      const result = await getRandomMealId();
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/meal/${encodeURIComponent(result.mealId)}`);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="shrink-0 rounded-full border border-olive/20 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/10 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Finding a recipe..." : "Surprise me"}
      </button>
      {error ? (
        <p role="status" className="mt-2 text-xs text-tomato">
          {error}
        </p>
      ) : null}
    </div>
  );
}
