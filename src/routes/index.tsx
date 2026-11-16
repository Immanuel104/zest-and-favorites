import { createFileRoute } from "@tanstack/react-router";
import { allMealsQuery } from "@/lib/mealdb";
import { SiteShell, PanelMessage } from "@/components/site/SiteShell";
import { Intro } from "@/components/site/Intro";
import { SearchPanel } from "@/components/site/SearchPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Recipe — Find recipes by dish name" },
      {
        name: "description",
        content: "Search a collection of global recipes by dish name and see ingredients, instructions and videos.",
      },
      { property: "og:title", content: "The Recipe — Find recipes by dish name" },
      {
        property: "og:description",
        content: "Search a collection of global recipes by dish name and see ingredients, instructions and videos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(allMealsQuery()),
  component: Home,
  pendingComponent: () => (
    <SiteShell>
      <PanelMessage>Loading...</PanelMessage>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <PanelMessage tone="destructive">Couldn't load recipes: {error instanceof Error ? error.message : "Unknown error"}</PanelMessage>
    </SiteShell>
  ),
});

function Home() {
  return (
    <SiteShell>
      <main className="justify-between gap-8 lg:flex">
        <Intro />
        <div className="lg:min-w-[380px] lg:max-w-[520px]">
          <SearchPanel />
        </div>
      </main>
    </SiteShell>
  );
}
