// src/pages/home.tsx

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-extrabold sm:text-6xl">
          Bienvenue sur <span className="text-orange-300">EasyWatch</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-300 sm:text-xl">
          La plateforme pour explorer, regarder et partager des vidéos autour de
          l’univers du web africain.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/connexion"
            className="bg-orange-300 px-8 py-4 font-semibold text-white transition hover:bg-orange-400"
          >
            Se connecter
          </Link>

          <Link
            to="/inscription"
            className="border border-white/20 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Créer un compte
          </Link>
        </div>
        
      </section>
    </main>
  );
}