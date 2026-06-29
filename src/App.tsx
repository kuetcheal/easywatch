// src/App.tsx

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Inscription from "./components/Authentification/inscription";
import Connexion from "./components/Authentification/connexion";
import ForgetPassword from "./components/Authentification/forgetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Authentification */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />

        {/* Redirection si la route n'existe pas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}