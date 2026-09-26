import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

function LoginLoading() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-[32px] border border-[#f2dfe7] bg-white p-6 shadow-[0_18px_38px_rgba(18,18,18,0.04)] sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1b1b1b]">Connexion</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-11 rounded-2xl bg-[#f8edf2]" />
          <div className="h-11 rounded-2xl bg-[#f8edf2]" />
          <div className="h-12 rounded-full bg-[#f8edf2]" />
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <AdminLoginForm />
    </Suspense>
  );
}
