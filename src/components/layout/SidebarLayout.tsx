import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarLayoutProps = {
  children: ReactNode;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

const libraryLinks = [
  { label: "Mon historique", to: "/" },
  { label: "Mes favoris", to: "/favoris" },
  { label: "Toutes les vidéos", to: "/" },
];

const categories = [
  "Tous",
  "Nouveautés",
  "Tendances",
  "Premium",
  "Web séries",
  "Lives",
  "Romance",
  "Populaires",
];

export default function SidebarLayout({
  children,
  activeCategory,
  onCategoryChange,
}: SidebarLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 pb-10 lg:grid-cols-[260px_1fr] lg:px-6">
      <aside className="hidden lg:block">
        <div className="sticky top-4 rounded-3xl border border-white/10 bg-zinc-950/80 p-5 text-white">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wide">
              Bibliothèque
            </h2>

            <div className="mt-4 space-y-2">
              {libraryLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-orange-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="my-6 h-px bg-white/10" />

          <div>
            <h2 className="text-lg font-black uppercase tracking-wide">
              Catégories
            </h2>

            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                    activeCategory === category
                      ? "bg-orange-500 text-black"
                      : "text-zinc-300 hover:bg-white/10 hover:text-orange-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}