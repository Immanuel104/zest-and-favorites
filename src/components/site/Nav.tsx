import { useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/recipe-logo.jpg.asset.json";
import { useTheme } from "@/lib/theme";

const linkClass =
  "rounded-xl p-2 hover:bg-nav-hover hover:text-brand";
const menuLinkClass =
  "my-4 block rounded-xl p-2 hover:bg-menu-hover hover:text-brand";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <nav className="relative flex items-center justify-between gap-3">
      <Link to="/" className="group flex items-center">
        <img
          src={logo.url}
          alt="The Recipe logo"
          className="h-16 w-16 rounded-full opacity-80 transition group-hover:rotate-90 group-hover:scale-110 group-hover:opacity-100 group-hover:shadow-xl sm:h-24 sm:w-24"
        />
        <span className="ml-3 text-sm font-bold text-foreground group-hover:text-brand sm:text-2xl">
          The Recipe
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="glass-panel glow-hover hidden space-x-7 rounded-2xl p-4 md:block">
          <Link to="/" className={linkClass} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/FavoriteList" className={linkClass}>
            Favorite List
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="p-1 md:hidden"
        >
          <span className="m-1 block h-[2px] w-[20px] bg-foreground" />
          <span className="m-1 block h-[2px] w-[25px] bg-foreground" />
          <span className="m-1 block h-[2px] w-[15px] bg-foreground" />
        </button>

        <button
          type="button"
          onClick={toggle}
          title={dark ? "Light mode" : "Dark mode"}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-lg border-2 px-1.5 py-0.5 text-foreground"
        >
          {dark ? "☀" : "☁"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 rounded-lg bg-menu p-5 text-menu-foreground shadow-lg md:hidden">
          <Link to="/" className={menuLinkClass} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/FavoriteList" className={menuLinkClass} onClick={() => setMenuOpen(false)}>
            Favorite List
          </Link>
        </div>
      )}
    </nav>
  );
}
