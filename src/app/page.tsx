import Image from "next/image";
import Link from "next/link";

import { SearchBox } from "@/components/search-form";
import { getCategories } from "@/lib/mealdb";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main>
      <section className="bg-olive text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Cook something wonderful
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Find your next favorite recipe.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Browse comforting classics, discover new flavors, and make
              tonight a little more delicious.
            </p>
            <div className="mt-8">
              <SearchBox />
            </div>
          </div>
          <div className="hidden justify-self-end rounded-[2rem] bg-white/10 p-4 md:block">
            <div className="relative h-72 w-72 overflow-hidden rounded-[1.5rem]">
              <Image
                src="https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg"
                alt="A freshly prepared meal"
                fill
                priority
                sizes="288px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
              Pick a direction
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Explore categories
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-500">
            From quick weeknight meals to slow-cooked favorites, there&apos;s
            something for every craving.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.idCategory}
                href={`/category/${encodeURIComponent(category.strCategory)}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image
                    src={category.strCategoryThumb}
                    alt={`${category.strCategory} dishes`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-semibold">{category.strCategory}</h3>
                  <span
                    aria-hidden="true"
                    className="text-xl text-olive transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-stone-600">
            No categories are available right now. Please try again later.
          </p>
        )}
      </section>
    </main>
  );
}
