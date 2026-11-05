"use client";

export default function MealError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        Recipe unavailable
      </p>
      <h1 className="mt-3 text-4xl font-bold">We couldn&apos;t load this recipe.</h1>
      <p className="mt-4 text-stone-600">
        Please try again. If the problem continues, come back in a little while.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-stone-400">Reference: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-7 rounded-full bg-olive px-6 py-3 font-semibold text-white transition hover:bg-ink"
      >
        Try again
      </button>
    </main>
  );
}
