import { useEffect, useState, type FormEvent } from "react";

export type UserProfile = {
  id?: string | number;
  nom?: string;
  name?: string;
  email?: string;
  mail?: string;
  role?: string;
  client?: {
    nom?: string;
    name?: string;
    email?: string;
    mail?: string;
  };
};

export type EditProfilePayload = {
  nom: string;
  email: string;
};

type EditProfileDialogProps = {
  open: boolean;
  me: UserProfile | null;
  onClose: () => void;
  onSave: (payload: EditProfilePayload) => void | Promise<void>;
};

export default function EditProfileDialog({
  open,
  me,
  onClose,
  onSave,
}: EditProfileDialogProps) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNom(me?.nom || me?.name || me?.client?.nom || me?.client?.name || "");
    setEmail(me?.email || me?.mail || me?.client?.email || me?.client?.mail || "");
  }, [me, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);

    try {
      await onSave({
        nom: nom.trim(),
        email: email.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Modifier mon profil</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Mets à jour tes informations personnelles.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">
              Nom
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white px-4 text-black outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white px-4 text-black outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              placeholder="votre@email.com"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}