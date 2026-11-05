"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useState,
  useTransition,
  type FormEvent,
  type KeyboardEvent,
} from "react";

interface SearchResult {
  id: string;
  name: string;
  thumb: string;
}

interface SearchBoxProps {
  initialQuery?: string;
  compact?: boolean;
}

export function SearchBox({
  initialQuery = "",
  compact = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [autocompleteError, setAutocompleteError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasEdited, setHasEdited] = useState(false);
  const instanceId = useId();
  const inputId = `${instanceId}-meal-search`;
  const listboxId = `${instanceId}-meal-search-suggestions`;

  useEffect(() => {
    if (!hasEdited) {
      return;
    }

    const timer = window.setTimeout(() => {
      const trimmedQuery = query.trim();
      const destination = trimmedQuery
        ? `/search?q=${encodeURIComponent(trimmedQuery)}`
        : "/search";

      startTransition(() => {
        router.replace(destination, { scroll: false });
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [hasEdited, query, router]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setActiveIndex(-1);
      setAutocompleteError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setAutocompleteError("");
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as
          | { results: SearchResult[] }
          | { error: string };

        if ("error" in payload) {
          throw new Error(payload.error);
        }
        if (!response.ok) {
          throw new Error("Search suggestions failed.");
        }

        setResults(payload.results);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setResults([]);
        setAutocompleteError(
          error instanceof Error
            ? error.message
            : "Search suggestions failed.",
        );
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function chooseResult(result: SearchResult) {
    setResults([]);
    router.push(`/meal/${encodeURIComponent(result.id)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = results[activeIndex];
    if (selected) {
      chooseResult(selected);
      return;
    }

    const trimmedQuery = query.trim();
    const destination = trimmedQuery
      ? `/search?q=${encodeURIComponent(trimmedQuery)}`
      : "/search";

    setHasEdited(true);
    startTransition(() => {
      router.replace(destination, { scroll: false });
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActiveIndex(
        (index) => (index <= 0 ? results.length : index) - 1,
      );
    } else if (event.key === "Escape") {
      setResults([]);
      setActiveIndex(-1);
    }
  }

  return (
    <form
      action="/search"
      onSubmit={handleSubmit}
      className={`relative flex w-full gap-2 ${compact ? "max-w-md" : "max-w-xl"}`}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search recipes
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={results.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0
            ? `${instanceId}-meal-suggestion-${activeIndex}`
            : undefined
        }
        autoComplete="off"
        value={query}
        onChange={(event) => {
          setHasEdited(true);
          setQuery(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search a dish or ingredient..."
        className={`min-w-0 flex-1 rounded-full border border-ink/10 bg-white text-ink outline-none transition placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/20 ${
          compact ? "px-4 py-2 text-sm" : "px-5 py-3"
        }`}
      />
      {isPending ? (
        <span
          role="status"
          aria-live="polite"
          className="shrink-0 self-center text-xs text-stone-500"
        >
          Updating…
        </span>
      ) : null}
      <button
        type="submit"
        className={`shrink-0 rounded-full bg-olive font-semibold text-white transition hover:bg-ink ${
          compact ? "px-4 py-2 text-sm" : "px-6 py-3"
        }`}
      >
        Search
      </button>
      {results.length > 0 || autocompleteError ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
          {autocompleteError ? (
            <p role="status" className="px-4 py-3 text-sm text-tomato">
              {autocompleteError}
            </p>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Recipe suggestions"
              className="max-h-80 overflow-y-auto py-2"
            >
              {results.map((result, index) => (
                <li
                  key={result.id}
                  id={`${instanceId}-meal-suggestion-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => chooseResult(result)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left transition ${
                      index === activeIndex ? "bg-olive/10" : "hover:bg-cream"
                    }`}
                  >
                    <Image
                      src={result.thumb}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-ink">{result.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
      {query.trim().length === 1 ? (
        <p className="sr-only" role="status">
          Type at least two characters for suggestions.
        </p>
      ) : null}
    </form>
  );
}
