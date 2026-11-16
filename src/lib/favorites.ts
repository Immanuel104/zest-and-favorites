import { useCallback, useEffect, useState } from "react";
import type { Meal } from "./mealdb";

/** Same key the previous site used, so returning visitors keep their saved meals. */
export const FAVORITES_KEY = "favlist";
const CHANGE_EVENT = "favlist-change";

export function readFavorites(): Meal[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Meal[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: Meal[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Add a meal unless it is already saved. Returns false when it was already there. */
export function addFavorite(list: Meal[], meal: Meal): Meal[] | null {
  if (list.some((m) => m.idMeal === meal.idMeal)) return null;
  return [...list, meal];
}

/** Remove a meal. Returns null when it was not saved. */
export function removeFavorite(list: Meal[], idMeal: string): Meal[] | null {
  if (!list.some((m) => m.idMeal === idMeal)) return null;
  return list.filter((m) => m.idMeal !== idMeal);
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    setReady(true);
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((meal: Meal) => {
    const next = addFavorite(readFavorites(), meal);
    if (next) writeFavorites(next);
    return next !== null;
  }, []);

  const remove = useCallback((idMeal: string) => {
    const next = removeFavorite(readFavorites(), idMeal);
    if (next) writeFavorites(next);
    return next !== null;
  }, []);

  return { favorites, ready, add, remove };
}
