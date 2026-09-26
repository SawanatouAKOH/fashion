"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@adisfashion.com");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou mot de passe invalide.");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const configError = searchParams.get("error");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-[32px] border border-[#f2dfe7] bg-white p-6 shadow-[0_18px_38px_rgba(18,18,18,0.04)] sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1b1b1b]">Connexion</h1>
        </div>

        {configError ? (
          <div className="mb-4 rounded-2xl border border-[#f0d0da] bg-[#fff7fa] px-3 py-2 text-sm text-[#b14d6c]">
            La configuration de l’authentification est incomplète.
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-[#f0d0da] bg-[#fff7fa] px-3 py-2 text-sm text-[#b14d6c]">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#3a3739]">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="admin@adisfashion.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#3a3739]">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
