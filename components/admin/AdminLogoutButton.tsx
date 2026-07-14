"use client";

import { useRouter } from "next/navigation";
import { setDemoAdminLoggedIn } from "@/lib/leads/demo";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  function logout() {
    setDemoAdminLoggedIn(false);
    router.replace("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-pill border border-luxury-dark/15 bg-white/60 px-3 py-1.5 text-sm text-luxury-text/80 transition hover:border-luxury-dark/30 hover:text-luxury-dark"
    >
      <LogOut size={14} />
      Cerrar sesión
    </button>
  );
}
