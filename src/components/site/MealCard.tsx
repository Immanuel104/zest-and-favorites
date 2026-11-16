import { Link } from "@tanstack/react-router";
import type { Meal } from "@/lib/mealdb";

export function MealCard({ meal }: { meal: Meal }) {
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
        <p className="p-2">
          Area : <i className="text-brand">{meal.strArea}</i>
        </p>
      </div>
    </Link>
  );
}
