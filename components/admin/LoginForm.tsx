"use client";

import { useState, useTransition } from "react";
import { login } from "@/lib/actions/admin";

const inputClass =
  "w-full rounded-md border border-navy/20 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await login(formData);
          // On success the action redirects, so we only get here on failure.
          if (result && !result.ok) setError(result.error);
        });
      }}
      className="mt-6 space-y-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-navy" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-navy" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-navy px-4 py-2.5 font-medium text-white hover:bg-navy-light disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
