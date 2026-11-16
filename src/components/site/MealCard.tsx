import { Link } from "@tanstack/react-router";
import type { Meal } from "@/lib/mealdb";

type CardMeal = Pick<Meal, "idMeal" | "strMeal" | "strCategory" | "strArea" | "strMealThumb">;

export function MealCard({ meal }: { meal: CardMeal }) {
  return (
    <Link
      to="/RecipeDetails/$idMeal"
      params={{ idMeal: meal.idMeal }}
      className="glass-panel lift-hover glow-hover flex items-center justify-center rounded-md"
    >
      {meal.strMealThumb && (
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-28 rounded-2xl p-2 sm:w-52" loading="lazy" />
      )}
      <div className="flex flex-col items-center text-[13px] sm:text-xl">
        <p className="mx-auto w-fit p-2 text-center font-semibold">{meal.strMeal}</p>
        <p className="p-2">
          Category : <i className="text-brand">{meal.strCategory}</i>
        </p>
        {meal.strArea && (
          <p className="p-2">
            Area : <i className="text-brand">{meal.strArea}</i>
          </p>
        )}
      </div>
    </Link>
  );
}

/** Small photo tile used in the home page starter collection. */
export function MealTile({ meal }: { meal: CardMeal }) {
  return (
    <Link
      to="/RecipeDetails/$idMeal"
      params={{ idMeal: meal.idMeal }}
      className="glass-panel lift-hover glow-hover flex flex-col overflow-hidden rounded-2xl"
    >
      {meal.strMealThumb && (
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      )}
      <div className="p-3">
        <p className="font-semibold leading-snug">{meal.strMeal}</p>
        <p className="mt-1 text-xs">
          <i className="text-brand">{[meal.strArea, meal.strCategory].filter(Boolean).join(" · ")}</i>
        </p>
      </div>
    </Link>
  );
}
