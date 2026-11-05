"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  FAVORITES_COOKIE_NAME,
  MAX_FAVORITES,
  parseFavoriteIds,
} from "@/lib/favorites";
import { getRandomMeal } from "@/lib/mealdb";

type FavoriteResult =
  | { success: true; isFavorite: boolean }
  | { success: false; isFavorite: boolean; error: string };

export async function setFavorite(
  mealId: string,
  shouldBeFavorite: boolean,
): Promise<FavoriteResult> {
  if (!/^\d{1,10}$/.test(mealId) || typeof shouldBeFavorite !== "boolean") {
    return {
      success: false,
      isFavorite: false,
      error: "That recipe cannot be saved as a favourite.",
    };
  }

  const cookieStore = await cookies();
  const ids = parseFavoriteIds(
    cookieStore.get(FAVORITES_COOKIE_NAME)?.value,
  );
  const isAlreadyFavorite = ids.includes(mealId);

  if (shouldBeFavorite && !isAlreadyFavorite && ids.length >= MAX_FAVORITES) {
    return {
      success: false,
      isFavorite: false,
      error: `You can save up to ${MAX_FAVORITES} favourites.`,
    };
  }

  const nextIds = shouldBeFavorite
    ? isAlreadyFavorite
      ? ids
      : [...ids, mealId]
    : ids.filter((id) => id !== mealId);

  cookieStore.set(FAVORITES_COOKIE_NAME, JSON.stringify(nextIds), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/favourites");

  return { success: true, isFavorite: nextIds.includes(mealId) };
}

type RandomMealResult =
  | { success: true; mealId: string }
  | { success: false; error: string };

export async function getRandomMealId(): Promise<RandomMealResult> {
  try {
    const meal = await getRandomMeal();
    if (!meal) {
      return { success: false, error: "No random recipe was returned." };
    }

    return { success: true, mealId: meal.idMeal };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "The random recipe could not be loaded.",
    };
  }
}
