import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  mode: "login" | "register" | "forgot";
};

const footerLinks = [
  { label: "Mentions légales", to: "/#" },
  { label: "CGV", to: "/#" },
  { label: "CGU", to: "/#" },
  { label: "Politique de données personnelles", to: "/#" },
  { label: "Contact", to: "/#" },
  { label: "Cookies", to: "/#" },
];

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-[calc(100vh-54px)] flex-col lg:flex-row">
        <section
          className={`flex min-h-[560px] w-full items-center bg-black px-6 py-12 sm:px-10 lg:min-h-[calc(100vh-54px)] lg:w-[44%] ${
            isLogin ? "justify-center" : "justify-center"
          }`}
        >
          <div className="w-full max-w-[360px]">{children}</div>
        </section>

        <section className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden lg:min-h-[calc(100vh-54px)] lg:w-[56%]">
          <img
            src="/connexion.png"
            alt="EasyWatch background"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-mono text-6xl font-black uppercase tracking-tight text-white sm:text-7xl xl:text-8xl">
              <span className="text-orange-500">EASY</span>WATCH
            </h1>

            {isLogin ? (
              <>
                <p className="mt-14 font-mono text-2xl font-black uppercase tracking-widest text-white sm:text-3xl">
                  Tu n&apos;as pas encore de compte ?
                </p>

                <Link
                  to="/inscription"
                  className="mt-9 border border-orange-500 px-16 py-4 font-mono text-sm font-black uppercase tracking-wide text-orange-500 transition hover:bg-orange-500 hover:text-black"
                >
                  Créer mon compte
                </Link>
              </>
            ) : (
              <>
                <p className="mt-14 font-mono text-2xl font-black uppercase tracking-widest text-white sm:text-3xl">
                  Tu as déjà un compte ?
                </p>

                <Link
                  to="/connexion"
                  className="mt-9 border border-orange-500 px-16 py-4 font-mono text-sm font-black uppercase tracking-wide text-orange-500 transition hover:bg-orange-500 hover:text-black"
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </section>
      </div>

      <footer className="flex min-h-[54px] flex-col items-center justify-center gap-3 border-t border-white/10 bg-black px-5 py-4 text-xs text-zinc-400 lg:flex-row lg:gap-10 lg:py-0">
        <Link to="/" className="font-mono font-black uppercase text-white">
          <span className="text-orange-500">Easy</span>Watch
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="transition hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}