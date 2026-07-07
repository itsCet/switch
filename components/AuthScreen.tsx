"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Mode = "signin" | "signup";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setInfo("Compte cree. Verifie ta boite mail pour confirmer, puis connecte-toi.");
        setMode("signin");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Switch</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {mode === "signin" ? "Connecte-toi pour retrouver tes espaces." : "Cree un compte pour synchroniser tes donnees."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {info && <p className="text-xs text-emerald-600">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 text-white text-sm font-semibold py-2 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Se connecter" : "Creer un compte"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-4 text-xs text-neutral-500 hover:text-neutral-800 underline w-full text-center"
        >
          {mode === "signin" ? "Pas de compte ? Creer un compte" : "Deja un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
