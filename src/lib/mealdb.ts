import { queryOptions } from "@tanstack/react-query";

/** A meal as returned by TheMealDB (only the fields the app reads are typed). */
export type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null;
};

const API = "https://www.themealdb.com/api/json/v1/1";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Recipe service responded with ${res.status}`);
  return (await res.json()) as T;
}

export const allMealsQuery = () =>
  queryOptions({
    queryKey: ["meals"],
    queryFn: async () => {
      const data = await getJson<{ meals: Meal[] | null }>(`${API}/search.php?s=`);
      return data.meals ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

export const mealByIdQuery = (idMeal: string) =>
  queryOptions({
    queryKey: ["meal", idMeal],
    queryFn: async () => {
      const data = await getJson<{ meals: Meal[] | null }>(
        `${API}/lookup.php?i=${encodeURIComponent(idMeal)}`,
      );
      return data.meals?.[0] ?? null;
    },
    staleTime: 1000 * 60 * 10,
  });

/** Old links from the previous site were built as /RecipeDetails/:52772 — strip the stray colon. */
export function normalizeMealId(raw: string): string {
  return raw.replace(/^:+/, "").trim();
}

/**
 * Search meals by name. An exact (case-insensitive) name match comes first,
 * followed by every other meal whose name contains the query.
 */
export function searchMeals(meals: Meal[], query: string): Meal[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const exact = meals.filter((m) => m.strMeal.toLowerCase() === q);
  const partial = meals.filter(
    (m) => m.strMeal.toLowerCase() !== q && m.strMeal.toLowerCase().includes(q),
  );
  return [...exact, ...partial];
}

/** Every non-empty ingredient with its measure. */
export function getIngredients(meal: Meal): { ingredient: string; measure: string }[] {
  const out: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = (meal[`strIngredient${i}`] ?? "").trim();
    const measure = (meal[`strMeasure${i}`] ?? "").trim();
    if (ingredient) out.push({ ingredient, measure });
  }
  return out;
}
