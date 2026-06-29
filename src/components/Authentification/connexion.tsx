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

export default function Connexion() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userEmail || !userPassword) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir email et mot de passe.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.login(userEmail, userPassword);
      const token = response.data.token || response.data.access_token;

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Token introuvable. Vérifie la réponse backend /api/login.",
        });

        return;
      }

      localStorage.setItem("access_token", token);

      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        timer: 900,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(
          error,
          "Les identifiants fournis sont incorrects."
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <h1 className="mb-7 font-mono text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
        Je me connecte !
      </h1>

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-[11px] font-black uppercase tracking-widest text-black">
            .
          </label>

          <input
            className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
            placeholder="Adresse e-mail *"
            type="email"
            required
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <input
            className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
            placeholder="Mot de passe *"
            type="password"
            required
            value={userPassword}
            onChange={(event) => setUserPassword(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="h-[54px] w-full border border-orange-500 bg-transparent font-mono text-sm font-black uppercase tracking-wide text-orange-500 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Connexion"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to="/forgetPassword"
          className="text-sm font-semibold italic text-white transition hover:text-orange-500"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <div className="mt-6 h-px w-full bg-white/70" />
    </AuthLayout>
  );
}