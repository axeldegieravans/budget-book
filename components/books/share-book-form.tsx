"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";
import { getErrorMessage } from "@/lib/utils/errors";
import { useToast } from "@/providers/toast-provider";

export function ShareBookForm({
  onShare,
}: {
  onShare: (email: string) => Promise<void>;
}) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await onShare(email);
      setMessage("Boekje succesvol gedeeld.");
      toast.success(`Boekje is gedeeld met ${email}.`);
      setEmail("");
    } catch (shareError) {
      const message = getErrorMessage(shareError, "Delen mislukt.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="flex-1 rounded-full border border-sky-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
          placeholder="teamgenoot@student.nl"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? "Delen..." : "Deel boekje"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-sky-800">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
