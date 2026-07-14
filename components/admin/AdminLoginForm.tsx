"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DEMO_ADMIN_PASSWORD,
  setDemoAdminLoggedIn,
} from "@/lib/leads/demo";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Demo gate — fixed password, no backend.
    if (password.trim() !== DEMO_ADMIN_PASSWORD) {
      setError("Contraseña incorrecta (demo: 123)");
      setLoading(false);
      return;
    }

    setDemoAdminLoggedIn(true);
    const next = searchParams.get("next") || "/admin/dashboard";
    router.replace(next);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-5">
      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-sm font-medium text-luxury-dark"
        >
          Contraseña de acceso
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="luxury-input w-full"
          placeholder="••••••••"
          required
        />
        <p className="mt-2 text-xs text-luxury-text/45">
          Modo demo — usa la contraseña <span className="font-medium">123</span>
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-700/90" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="btn-luxury-gold w-full disabled:opacity-40"
      >
        {loading ? "Verificando…" : "Entrar al panel"}
      </button>
    </form>
  );
}
