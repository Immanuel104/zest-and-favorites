import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMealsQuery } from "@/lib/mealdb";
import { STARTER_SECTIONS } from "@/data/starter-recipes";
import { MealCard } from "./MealCard";

const SUGGESTIONS = ["Ugali", "Pilau", "Jollof", "Chapati", "Rice", "Sushi"];

export function SearchPanel() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  const search = useQuery({ ...searchMealsQuery(query ?? ""), enabled: !!query });
  const results = search.data ?? [];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(text.trim() || null);
    setText("");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search with meal"
          aria-label="Meal name"
          className="rounded-xl bg-field p-3 text-brand outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-field p-[6px] px-3 text-foreground hover:text-brand hover:ring-1 hover:ring-brand"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span>Try :</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="glass-panel rounded-full px-3 py-0.5 hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>

      {query && search.isFetching && <p className="text-brand">Searching...</p>}

      {query && search.isError && (
        <p className="text-destructive">Couldn't reach the recipe service. Please try again.</p>
      )}

      {query && search.isSuccess && results.length === 0 && (
        <div className="glass-panel-strong max-w-md rounded-2xl p-4 text-sm">
          <p className="font-semibold text-brand">“{query}” was not found. Try one of these:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STARTER_SECTIONS.flatMap((s) => s.recipes).map((m) => (
              <button
                key={m.idMeal}
                type="button"
                onClick={() => setQuery(m.strMeal)}
                className="rounded-full border px-2 py-0.5 hover:text-brand"
              >
                {m.strMeal}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex max-h-[70vh] w-full flex-col gap-4 overflow-y-auto pr-1">
          {results.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
