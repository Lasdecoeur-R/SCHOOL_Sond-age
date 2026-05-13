"use client";

import { useActionState } from "react";
import { FormField } from "@/components/ui/form-field";
import {
  submitMagicLinkRequest,
  type LoginActionState,
} from "@/lib/connexion-server-actions";

const initialState: LoginActionState = { ok: null, message: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(submitMagicLinkRequest, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" aria-busy={isPending}>
      <FormField
        id="full_name"
        name="name"
        label="Nom complet"
        icon="person"
        placeholder="Jean Dupont"
        autoComplete="name"
        required
      />
      <FormField
        id="email"
        name="email"
        label="Adresse E-mail"
        icon="mail"
        type="email"
        placeholder="jean.dupont@example.com"
        autoComplete="email"
        required
      />
      {state.message ? (
        <p
          className={`text-center text-sm ${state.ok ? "text-secondary" : "text-red-700"}`.trim()}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <div className="mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-lg bg-primary py-3.5 text-lg font-semibold text-on-primary shadow-lg transition-all duration-200 hover:bg-on-primary-fixed-variant active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          Connexion / inscription
        </button>
      </div>
    </form>
  );
}
