import { STARTER_SECTIONS } from "@/data/starter-recipes";
import { MealTile } from "./MealCard";

export function StarterCollection() {
  return (
    <section className="mt-12 space-y-10">
      {STARTER_SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="glass-panel-strong mb-5 inline-block rounded-xl px-4 py-2 text-xl sm:text-2xl">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {section.recipes.map((meal) => (
              <MealTile key={meal.idMeal} meal={meal} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
