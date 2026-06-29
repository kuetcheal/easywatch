import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { authApi } from "../../api/authApi";
import AuthLayout from "./AuthLayout";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

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

export default function Inscription() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const passwordIsValid =
      registerData.password.length >= 8 &&
      /\d/.test(registerData.password) &&
      /[a-zA-Z]/.test(registerData.password);

    if (!passwordIsValid) {
      const message =
        "Le mot de passe doit contenir au moins 8 caractères, avec lettres et chiffres.";

      setPasswordError(message);

      Swal.fire({
        icon: "error",
        title: "Oups !!!",
        text: message,
      });

      return;
    }

    setPasswordError("");
    setIsRegistering(true);

    try {
      const payload = {
        nom: registerData.name,
        email: registerData.email,
        password: registerData.password,
      };

      const response = await authApi.register(payload);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("pending_email", registerData.email);

        Swal.fire({
          icon: "success",
          title: "Compte créé",
          text: "Votre compte a bien été créé.",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate("/connexion");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(
          error,
          "Impossible de créer le compte. Réessaie plus tard."
        ),
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <h1 className="mb-7 font-mono text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
        Je crée mon compte !
      </h1>

      <form onSubmit={handleRegisterSubmit} className="space-y-5">
        <input
          className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
          placeholder="Nom utilisateur *"
          type="text"
          required
          value={registerData.name}
          onChange={(event) =>
            setRegisterData((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          disabled={isRegistering}
        />

        <input
          className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
          placeholder="Adresse e-mail *"
          type="email"
          required
          value={registerData.email}
          onChange={(event) =>
            setRegisterData((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
          disabled={isRegistering}
        />

        <div>
          <input
            className="h-[58px] w-full border-0 bg-white px-5 font-mono text-sm font-bold text-black outline-none placeholder:uppercase placeholder:text-black focus:ring-2 focus:ring-orange-500"
            placeholder="Mot de passe *"
            type="password"
            required
            value={registerData.password}
            onChange={(event) =>
              setRegisterData((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            disabled={isRegistering}
          />

          {passwordError && (
            <p className="mt-2 text-xs font-semibold text-red-400">
              {passwordError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="h-[54px] w-full border border-orange-500 bg-transparent font-mono text-sm font-black uppercase tracking-wide text-orange-500 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRegistering}
        >
          {isRegistering ? "Inscription..." : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          to="/connexion"
          className="text-sm font-semibold italic text-white transition hover:text-orange-500"
        >
          J&apos;ai déjà un compte
        </Link>
      </div>

      <div className="mt-6 h-px w-full bg-white/70" />
    </AuthLayout>
  );
}