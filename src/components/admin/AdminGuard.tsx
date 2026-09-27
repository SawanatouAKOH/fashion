"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
      return;
    }

    if (status === "authenticated" && !session?.user?.role) {
      router.replace("/admin/login");
      return;
    }

    if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.replace("/admin/login?error=forbidden");
    }
  }, [router, session?.user?.role, status]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20 text-sm text-[#5f5a5c]">
        Vérification de l’accès administrateur...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20 text-sm text-[#5f5a5c]">
        Redirection vers la page de connexion admin...
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-20 text-sm text-[#5f5a5c]">
        Accès refusé. Vérification des droits administrateur...
      </div>
    );
  }

  return <>{children}</>;
}
