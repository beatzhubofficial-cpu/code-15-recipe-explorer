export function Skeleton() {
  return (
    <section aria-label="Loading more recipes" className="mt-16">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-stone-200" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryLoadingSkeleton() {
  return (
    <main
      aria-label="Loading category"
      className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14"
    >
      <div className="h-4 w-40 animate-pulse rounded bg-stone-200" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded bg-stone-200" />
      <div className="mt-4 h-5 max-w-3xl animate-pulse rounded bg-stone-200" />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function MealLoadingSkeleton() {
  return (
    <main
      aria-label="Loading recipe"
      className="mx-auto min-h-[60vh] max-w-7xl px-6 py-14"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-stone-200" />
        <div>
          <div className="h-4 w-48 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-12 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="mt-10 h-7 w-40 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-64 animate-pulse rounded-2xl bg-stone-200" />
        </div>
      </div>
      <div className="mt-12 h-8 w-56 animate-pulse rounded bg-stone-200" />
      <div className="mt-5 h-48 max-w-4xl animate-pulse rounded-2xl bg-stone-200" />
    </main>
  );
}
