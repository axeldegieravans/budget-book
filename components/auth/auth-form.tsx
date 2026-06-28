"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { useState } from "react";

import { login, register } from "@/lib/services/auth-service";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }

      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authenticatie mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
        {isRegister ? "Nieuw account" : "Welkom terug"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {isRegister ? "Maak een account aan" : "Inloggen"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isRegister
          ? "Registreer met je e-mailadres en een wachtwoord."
          : "Log in om je boekjes en transacties te bekijken."}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isRegister ? (
          <div>
            <label htmlFor="displayName" className="text-sm font-medium text-slate-700">
              Naam
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mailadres
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Bezig..." : isRegister ? "Account aanmaken" : "Inloggen"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        {isRegister ? "Al een account?" : "Nog geen account?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          {isRegister ? "Inloggen" : "Registreer hier"}
        </Link>
      </p>
    </div>
  );
}
