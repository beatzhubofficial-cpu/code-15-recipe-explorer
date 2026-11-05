import type { Metadata } from "next";
import Link from "next/link";

import { RandomRecipeButton } from "@/components/random-recipe-button";
import { SearchBox } from "@/components/search-form";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Savor - Recipe Explorer",
    template: "%s | Savor",
  },
  description: "Find something delicious to make with recipes from TheMealDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-ink/10 bg-cream">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-xl font-bold tracking-tight text-olive">
              savor<span className="text-tomato">.</span>
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-3">
              <Link
                href="/favourites"
                className="shrink-0 text-sm font-semibold text-olive hover:text-tomato"
              >
                Favourites
              </Link>
              <RandomRecipeButton />
              <SearchBox compact />
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-20 border-t border-ink/10">
          <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-stone-500">
            Recipes and images provided by{" "}
            <a
              href="https://www.themealdb.com/"
              className="font-medium text-olive underline underline-offset-4"
            >
              TheMealDB
            </a>
            .
          </div>
        </footer>
      </body>
    </html>
  );
}
