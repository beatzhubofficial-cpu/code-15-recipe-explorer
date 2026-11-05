import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tomato">
        404 · Not found
      </p>
      <h1 className="mt-3 text-4xl font-bold">That recipe escaped the kitchen.</h1>
      <p className="mt-4 text-stone-600">
        The page may have moved, or that category or recipe does not exist.
      </p>
      <Link
        href="/"
        className="mt-7 rounded-full bg-olive px-6 py-3 font-semibold text-white transition hover:bg-ink"
      >
        Back to exploring
      </Link>
    </main>
  );
}
