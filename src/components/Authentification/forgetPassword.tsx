import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { authApi } from "../../api/authApi";
import AuthLayout from "./AuthLayout";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.response?.data?.error || fallback;
  }

  return fallback;
};

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [resetEmail, setResetEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);

    try {
      await authApi.forgotPassword(resetEmail);

      localStorage.setItem("pending_reset_email", resetEmail);
      navigate("/alertPassword");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(
          error,
          "Impossible d'envoyer l'email. Réessaie plus tard."
        ),
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthLayout mode="forgot">
      <h1 className="mb-7 font-mono text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
        Mot de passe oublié
      </h1>

      <p className="mb-6 text-sm font-semibold leading-relaxed text-zinc-300">
        Renseigne ton adresse e-mail. Nous allons t&apos;envoyer les
        instructions pour réinitialiser ton mot de passe.
      </p>

      <form onSubmit={handleForgotSubmit} className="space-y-5">
        <input
          className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
          placeholder="Adresse e-mail *"
          type="email"
          required
          value={resetEmail}
          onChange={(event) => setResetEmail(event.target.value)}
          disabled={isSending}
        />

        <button
          type="submit"
          className="h-[54px] w-full border border-orange-500 bg-transparent font-mono text-sm font-black uppercase tracking-wide text-orange-500 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSending}
        >
          {isSending ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to="/connexion"
          className="text-sm font-semibold italic text-white transition hover:text-orange-500"
        >
          Je me rappelle, connexion
        </Link>
      </div>

      <div className="mt-6 h-px w-full bg-white/70" />
    </AuthLayout>
  );
}