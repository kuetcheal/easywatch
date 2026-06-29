type AgeGateProps = {
  onConfirm: () => void;
};

export default function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
          Accès réservé
        </p>

        <h1 className="mt-5 text-4xl font-black uppercase sm:text-5xl">
          Contenu adulte
        </h1>

        <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
          Ce site contient des vidéos réservées aux personnes majeures. En
          continuant, vous confirmez avoir au moins 18 ans et être autorisé à
          accéder à ce type de contenu dans votre pays.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("easywatch_age_confirmed", "true");
              onConfirm();
            }}
            className="flex-1 rounded-xl bg-orange-500 px-5 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-orange-400"
          >
            J’ai plus de 18 ans
          </button>

          <a
            href="https://www.google.com"
            className="flex-1 rounded-xl border border-white/15 px-5 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            Quitter
          </a>
        </div>
      </section>
    </main>
  );
}