"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-dark disabled:opacity-60"
    >
      {pending ? "Входим…" : "Войти"}
    </button>
  );
}
