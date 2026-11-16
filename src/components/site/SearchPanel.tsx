import { useState, type FormEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { allMealsQuery, searchMeals } from "@/lib/mealdb";
import { MealCard } from "./MealCard";

export function SearchPanel() {
  const { data: meals } = useSuspenseQuery(allMealsQuery());
  const [text, setText] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  const results = query ? searchMeals(meals, query) : [];

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

      {query && results.length === 0 && (
        <div className="glass-panel-strong max-w-md rounded-2xl p-4 text-sm">
          <p className="font-semibold text-brand">“{query}” was not found. Try one of these:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {meals.map((m) => (
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
        <div className="flex w-full flex-col gap-4">
          {results.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
