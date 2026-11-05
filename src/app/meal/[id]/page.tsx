import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FavoriteButton } from "@/components/favorite-button";
import { IngredientsChecklist } from "@/components/ingredients-checklist";
import { Skeleton } from "@/components/skeletons";
import { FAVORITES_COOKIE_NAME, parseFavoriteIds } from "@/lib/favorites";
import { getMeal } from "@/lib/mealdb";
import { MoreFromCategory } from "./more-from-category";

interface MealPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MealPageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await getMeal(id);

  return meal
    ? {
        title: meal.strMeal,
        description: `${meal.strMeal} - ${meal.strArea} ${meal.strCategory} recipe.`,
      }
    : { title: "Recipe not found" };
}

export default async function MealPage({ params }: MealPageProps) {
  const { id } = await params;
  const [meal, cookieStore] = await Promise.all([getMeal(id), cookies()]);

  if (!meal) {
    notFound();
  }

  const favoriteIds = parseFavoriteIds(
    cookieStore.get(FAVORITES_COOKIE_NAME)?.value,
  );
  const instructions = meal.strInstructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  const tags = meal.strTags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(meal.strYoutube);

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-stone-100">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
            {meal.strArea} · {meal.strCategory}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {meal.strMeal}
          </h1>
          <div className="mt-5">
            <FavoriteButton
              mealId={meal.idMeal}
              mealName={meal.strMeal}
              initialFavorite={favoriteIds.includes(meal.idMeal)}
            />
          </div>
          {tags && tags.length > 0 ? (
            <ul aria-label="Recipe tags" className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-olive/10 px-3 py-1 text-sm font-medium text-olive"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <h2 className="mt-8 text-xl font-bold">Ingredients</h2>
          <IngredientsChecklist ingredients={meal.ingredients} />
        </div>
      </div>

      <section className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-bold">How to make it</h2>
        <ol className="mt-5 space-y-4">
          {instructions.map((step, index) => (
            <li
              key={`${index}-${step}`}
              className="flex gap-4 rounded-2xl bg-white p-5 leading-7 text-stone-700"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive text-sm font-bold text-white">
                {index + 1}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        {youtubeEmbedUrl ? (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">Watch the recipe</h2>
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink">
              <iframe
                src={youtubeEmbedUrl}
                title={`${meal.strMeal} recipe video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </section>
        ) : null}
      </section>

      <Suspense fallback={<Skeleton />}>
        <MoreFromCategory
          category={meal.strCategory}
          currentMealId={meal.idMeal}
        />
      </Suspense>
    </main>
  );
}

function getYouTubeEmbedUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com"
  ) {
    const segments = url.pathname.split("/").filter(Boolean);
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else if (segments[0] === "embed" || segments[0] === "shorts") {
      videoId = segments[1] ?? null;
    }
  }

  return videoId && /^[\w-]{11}$/.test(videoId)
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : null;
}
