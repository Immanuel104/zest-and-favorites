import type { CSSProperties, ReactNode } from "react";
import bgLight from "@/assets/bg-w.webp.asset.json";
import bgDark from "@/assets/bg-b.avif.asset.json";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const backdropVars = {
  "--backdrop-light": `url('${bgLight.url}')`,
  "--backdrop-dark": `url('${bgDark.url}')`,
} as CSSProperties;

export function Divider({ className = "my-10" }: { className?: string }) {
  return <div className={`h-[2px] bg-rule ${className}`} />;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-backdrop font-serif" style={backdropVars}>
      <div className="min-h-screen bg-scrim px-3 py-5 text-foreground sm:px-16">
        <Nav />
        <Divider />
        {children}
        <Divider />
        <Footer />
      </div>
    </div>
  );
}

export function PanelMessage({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "destructive" }) {
  return (
    <p
      className={`glass-panel-strong mx-auto my-5 w-fit rounded-2xl p-3 text-center text-base sm:text-xl ${
        tone === "brand" ? "text-brand" : "text-destructive"
      }`}
    >
      {children}
    </p>
  );
}
