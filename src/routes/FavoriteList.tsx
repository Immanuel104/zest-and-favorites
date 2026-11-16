import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useFavorites } from "@/lib/favorites";
import { SiteShell, PanelMessage } from "@/components/site/SiteShell";

export const Route = createFileRoute("/FavoriteList")({
  head: () => ({
    meta: [
      { title: "Your Favorite Meals — The Recipe" },
      { name: "description", content: "The meals you saved on The Recipe, ready to cook again." },
      { property: "og:title", content: "Your Favorite Meals — The Recipe" },
      { property: "og:description", content: "The meals you saved on The Recipe, ready to cook again." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FavoriteList,
});

function FavoriteList() {
  const { favorites, ready, remove } = useFavorites();

  return (
    <SiteShell>
      <h1 className="glass-panel-strong mx-auto my-5 w-fit rounded-md p-3 text-center text-[20px]">
        Your Favorite Meals
      </h1>
      <div className="min-h-[290px]">
        {!ready ? null : favorites.length > 0 ? (
          <div className="glass-panel rounded-md p-5 lg:mx-20">
            {favorites.map((meal) => (
              <div
                key={meal.idMeal}
                className="glass-panel-strong lift-hover my-2 flex items-center justify-between rounded-md p-4 lg:mx-4"
              >
                <Link
                  to="/RecipeDetails/$idMeal"
                  params={{ idMeal: meal.idMeal }}
                  className="flex flex-wrap items-center justify-start gap-10"
                >
                  {meal.strMealThumb && (
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="h-20 rounded-md hover:ring-2 hover:ring-brand"
                    />
                  )}
                  <p className="text-center">“{meal.strMeal}”</p>
                  <p className="text-[12px]">
                    Category : <i className="font-thin text-brand">{meal.strCategory}</i>
                  </p>
                  <p className="text-[12px]">
                    Area : <i className="font-thin text-brand">{meal.strArea}</i>
                  </p>
                </Link>
                <button
                  type="button"
                  title="Remove from your fav list"
                  className="ml-2 rounded-lg bg-destructive p-2 text-destructive-foreground hover:opacity-60"
                  onClick={() => {
                    remove(meal.idMeal);
                    toast(`“${meal.strMeal}” removed from favorites!`);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <PanelMessage>No favorite meals yet !</PanelMessage>
        )}
      </div>
    </SiteShell>
  );
}
