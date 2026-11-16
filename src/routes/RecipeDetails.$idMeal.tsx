import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getIngredients, mealByIdQuery, normalizeMealId } from "@/lib/mealdb";
import { useFavorites } from "@/lib/favorites";
import { SiteShell, PanelMessage } from "@/components/site/SiteShell";

export const Route = createFileRoute("/RecipeDetails/$idMeal")({
  loader: async ({ context, params }) => {
    const id = normalizeMealId(params.idMeal);
    const meal = await context.queryClient.ensureQueryData(mealByIdQuery(id));
    if (!meal) throw notFound();
    return { id, name: meal.strMeal, thumb: meal.strMealThumb, category: meal.strCategory, area: meal.strArea };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — The Recipe` : "Recipe — The Recipe";
    const description = loaderData
      ? `How to make ${loaderData.name}${loaderData.area ? `, a ${loaderData.area}` : ""}${
          loaderData.category ? ` ${loaderData.category.toLowerCase()} dish` : " dish"
        }: ingredients, instructions and video.`
      : "Recipe ingredients, instructions and video.";
    const meta: { title?: string; name?: string; property?: string; content?: string }[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData?.thumb?.startsWith("https://")) {
      meta.push({ property: "og:image", content: loaderData.thumb }, { name: "twitter:image", content: loaderData.thumb });
    }
    return { meta };
  },
  component: RecipeDetails,
  pendingComponent: () => (
    <SiteShell>
      <PanelMessage>Loading...</PanelMessage>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <PanelMessage>This recipe could not be found.</PanelMessage>
      <div className="text-center">
        <Link to="/" className="text-link hover:text-link-hover">
          Back to search
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <PanelMessage tone="destructive">Couldn't load this recipe: {error instanceof Error ? error.message : "Unknown error"}</PanelMessage>
    </SiteShell>
  ),
});

function RecipeDetails() {
  const { id } = Route.useLoaderData();
  const { data: meal } = useSuspenseQuery(mealByIdQuery(id));
  const { favorites, add, remove } = useFavorites();
  if (!meal) return null;

  const isFavorite = favorites.some((m) => m.idMeal === meal.idMeal);
  const ingredients = getIngredients(meal);

  const onAdd = () => {
    if (add(meal)) toast.success(`“${meal.strMeal}” added to your fav list`);
    else toast(`“${meal.strMeal}” is already in your fav list`);
  };
  const onRemove = () => {
    if (remove(meal.idMeal)) toast(`“${meal.strMeal}” removed from your fav list`);
    else toast(`“${meal.strMeal}” is not in your fav list`);
  };

  return (
    <SiteShell>
      <div className="flex flex-wrap items-center justify-around gap-5">
        <div className="glass-panel-strong flex flex-col items-center rounded-md p-2 text-[12px] tracking-[1px] hover:ring-2 hover:ring-brand">
          <h1 className="mx-auto w-fit p-2 text-xl font-semibold">{meal.strMeal}</h1>
          <p className="p-2">
            Category : <i className="font-thin text-brand">{meal.strCategory}</i>
          </p>
          <p className="p-2">
            Area : <i className="font-thin text-brand">{meal.strArea}</i>
          </p>
          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              className="p-2 text-xl font-semibold text-link hover:text-link-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              Youtube
            </a>
          )}
          {meal.strSource && (
            <a
              href={meal.strSource}
              className="p-2 text-xl font-semibold text-link hover:text-link-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          )}
          <div className="flex gap-4 p-2">
            <button
              type="button"
              title="Add to your fav list"
              className="rounded-lg bg-success p-2 text-success-foreground hover:opacity-60 disabled:opacity-50"
              onClick={onAdd}
            >
              {isFavorite ? "Saved ✓" : "Add"}
            </button>
            <button
              type="button"
              title="Remove from your fav list"
              className="rounded-lg bg-destructive p-2 text-destructive-foreground hover:opacity-60"
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        </div>

        {meal.strMealThumb && (
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="glass-panel-strong my-3 h-64 rounded-3xl p-2 hover:ring-2 hover:ring-brand"
          />
        )}

        <div className="glass-panel-strong rounded-md p-2 text-[12px] tracking-[1px] hover:ring-2 hover:ring-brand">
          <p className="p-2 text-[18px] font-semibold text-brand">Ingredients :</p>
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {ingredients.map(({ ingredient, measure }, i) => (
              <li key={`${ingredient}-${i}`} className="p-1.5">
                {String.fromCharCode(65 + i)} . {ingredient}
                {measure && <span className="text-brand"> — {measure}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-panel-strong mt-6 rounded-md p-3 tracking-[1px]">
        <p className="py-2 text-xl font-semibold text-brand">Instructions :</p>
        <p className="whitespace-pre-line">{meal.strInstructions}</p>
      </div>
    </SiteShell>
  );
}
