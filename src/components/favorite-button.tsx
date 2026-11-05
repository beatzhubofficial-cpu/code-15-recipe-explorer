"use client";

import { useState, useTransition, useOptimistic } from "react";

import { setFavorite } from "@/app/actions";

interface FavoriteButtonProps {
  mealId: string;
  mealName: string;
  initialFavorite: boolean;
}

export function FavoriteButton({
  mealId,
  mealName,
  initialFavorite,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    isFavorite,
    (_current, next: boolean) => next,
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const nextFavorite = !optimisticFavorite;
    setError("");

    startTransition(async () => {
      setOptimisticFavorite(nextFavorite);
      const result = await setFavorite(mealId, nextFavorite);

      if (!result.success) {
        setError(result.error);
        return;
      }

      startTransition(() => setIsFavorite(result.isFavorite));
    });
  }

  return (
    <div>
      <button
        type="button"
        aria-label={
          optimisticFavorite
            ? `Remove ${mealName} from favourites`
            : `Add ${mealName} to favourites`
        }
        aria-pressed={optimisticFavorite}
        disabled={isPending}
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition disabled:cursor-wait disabled:opacity-70 ${
          optimisticFavorite
            ? "bg-tomato text-white hover:bg-ink"
            : "bg-white text-ink ring-1 ring-ink/10 hover:bg-cream"
        }`}
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ♥
        </span>
        {optimisticFavorite ? "Saved to favourites" : "Save to favourites"}
      </button>
      {error ? (
        <p role="status" className="mt-2 text-sm text-tomato">
          {error}
        </p>
      ) : null}
    </div>
  );
}
