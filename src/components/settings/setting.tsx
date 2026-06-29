import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { authApi } from "../../api/authApi";
import ConfirmDialog from "./ConfirmDialog";
import EditProfileDialog, {
  type EditProfilePayload,
  type UserProfile,
} from "./EditProfileDialog";

type SettingProps = {
  handleClose?: () => void;
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

const getUserName = (me: UserProfile | null): string => {
  return me?.nom || me?.name || me?.client?.nom || me?.client?.name || "Utilisateur";
};

const getUserEmail = (me: UserProfile | null): string => {
  return me?.email || me?.mail || me?.client?.email || me?.client?.mail || "";
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export default function Setting({ handleClose }: SettingProps) {
  const navigate = useNavigate();

  const [me, setMe] = useState<UserProfile | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMe = async () => {
      setLoadingMe(true);

      try {
        const response = await authApi.me();

        if (isMounted) {
          setMe(response.data as UserProfile);
        }
      } catch {
        localStorage.removeItem("access_token");
        navigate("/connexion");
      } finally {
        if (isMounted) {
          setLoadingMe(false);
        }
      }
    };

    loadMe();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const logoutNow = async () => {
    setIsLoggingOut(true);

    localStorage.removeItem("access_token");

    await Swal.fire({
      icon: "success",
      title: "Déconnecté",
      timer: 900,
      showConfirmButton: false,
    });

    setIsLoggingOut(false);
    handleClose?.();
    navigate("/connexion");
  };

  const deleteNow = async () => {
    setIsDeleting(true);

    try {
      await authApi.deleteMe();

      localStorage.removeItem("access_token");

      await Swal.fire({
        icon: "success",
        title: "Compte supprimé",
        timer: 1200,
        showConfirmButton: false,
      });

      handleClose?.();
      navigate("/connexion");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "Impossible de supprimer le compte."),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const saveProfile = async (payload: EditProfilePayload) => {
    try {
      const response = await authApi.updateMe(payload);

      setMe(response.data as UserProfile);
      setOpenEdit(false);

      Swal.fire({
        icon: "success",
        title: "Modifications enregistrées",
        timer: 900,
        showConfirmButton: false,
      });

      handleClose?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "Impossible de mettre à jour le profil."),
      });
    }
  };

  const userName = getUserName(me);
  const userEmail = getUserEmail(me);
  const initials = getInitials(userName) || "U";

  return (
    <>
      <div className="w-[320px] rounded-2xl border border-white/10 bg-zinc-950 p-4 text-white shadow-2xl">
        {loadingMe ? (
          <div className="flex min-h-[150px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{userName}</p>
                <p className="truncate text-xs text-zinc-400">
                  {userEmail || "Email non renseigné"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setOpenEdit(true)}
                className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <span>Modifier mon profil</span>
                <span className="text-zinc-500">›</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenLogout(true)}
                className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <span>Déconnexion</span>
                <span className="text-zinc-500">›</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenDelete(true)}
                className="flex w-full items-center justify-between rounded-xl bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                <span>Supprimer mon compte</span>
                <span>›</span>
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={openLogout}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
        cancelText="Annuler"
        isLoading={isLoggingOut}
        onClose={() => setOpenLogout(false)}
        onConfirm={async () => {
          setOpenLogout(false);
          await logoutNow();
        }}
      />

      <ConfirmDialog
        open={openDelete}
        title="Suppression du compte"
        message="Attention : cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        danger
        isLoading={isDeleting}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          setOpenDelete(false);
          await deleteNow();
        }}
      />

      <EditProfileDialog
        open={openEdit}
        me={me}
        onClose={() => setOpenEdit(false)}
        onSave={saveProfile}
      />
    </>
  );
}