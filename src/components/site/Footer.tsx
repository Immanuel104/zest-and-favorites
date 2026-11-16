import { Link } from "@tanstack/react-router";
import logo from "@/assets/recipe-logo.jpg.asset.json";
import github from "@/assets/github.webp.asset.json";
import x from "@/assets/x.jpeg.asset.json";

export function Footer() {
  return (
    <footer className="items-center gap-5 lg:flex">
      <div className="glass-panel lift-hover h-fit rounded-3xl p-5 text-center lg:rounded-l-none lg:rounded-r-full">
        <p>
          Developed by : <i className="text-brand">Omar Albaz</i> / Front End Web Dev
        </p>
      </div>
      <div className="glass-panel lift-hover mt-3 justify-around rounded-3xl p-5 sm:flex lg:ml-auto lg:mt-0 lg:w-[60%] lg:justify-between lg:rounded-l-full lg:rounded-r-none">
        <Link to="/" className="group flex items-center justify-center gap-3">
          <img
            src={logo.url}
            alt="The Recipe logo"
            className="h-16 w-16 rounded-full opacity-80 transition group-hover:-rotate-90 group-hover:scale-110 group-hover:opacity-100 group-hover:shadow-xl sm:h-20 sm:w-20"
          />
          <span className="text-sm group-hover:text-brand md:text-2xl">The Recipe</span>
        </Link>
        <div className="glass-panel glow-hover mt-3 flex items-center justify-center gap-5 rounded-xl p-3 text-sm sm:gap-6 md:text-lg">
          <p>Contact us :</p>
          <a href="https://github.com/omar96163" title="GitHub" target="_blank" rel="noopener noreferrer">
            <img src={github.url} alt="GitHub" className="h-9 w-9 rounded-full transition hover:scale-125" />
          </a>
          <a href="https://x.com/omaralbaz444" title="X" target="_blank" rel="noopener noreferrer">
            <img src={x.url} alt="X" className="h-9 w-9 rounded-full transition hover:scale-125" />
          </a>
        </div>
      </div>
    </footer>
  );
}
