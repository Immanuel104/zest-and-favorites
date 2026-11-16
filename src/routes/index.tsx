import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PanelMessage } from "@/components/site/SiteShell";
import { Intro } from "@/components/site/Intro";
import { SearchPanel } from "@/components/site/SearchPanel";
import { StarterCollection } from "@/components/site/StarterCollection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Recipe — African & everyday recipes" },
      {
        name: "description",
        content: "Find African favourites like ugali, pilau and jollof rice, plus everyday basics, with ingredients and step-by-step instructions.",
      },
      { property: "og:title", content: "The Recipe — African & everyday recipes" },
      {
        property: "og:description",
        content: "Find African favourites like ugali, pilau and jollof rice, plus everyday basics, with ingredients and step-by-step instructions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
      <StarterCollection />
    </SiteShell>
  );
}
