"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitTeamApplication, type ApplicationFormState } from "@/lib/actions/applications";

const initialState: ApplicationFormState = {};

export default function JoinForm() {
  const [state, formAction] = useFormState(submitTeamApplication, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-blue/30 bg-blue/5 p-8 text-center">
        <h3 className="text-xl font-semibold text-navy">Заявка отправлена!</h3>
        <p className="mt-2 text-slate-600">Мы свяжемся с капитаном команды в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5 rounded-2xl border border-slate-200 p-6 md:p-8">
      <Field label="Название команды" name="teamName" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Капитан (ФИО)" name="captainName" required />
        <Field label="Телефон капитана" name="captainPhone" type="tel" required />
      </div>
      <Field label="Город / район" name="city" defaultValue="Актобе" />
      <div>
        <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-slate-700">
          Комментарий
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
          placeholder="Опыт команды, пожелания по расписанию и т.д."
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
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
      className="justify-self-start rounded-full bg-blue px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-dark disabled:opacity-60"
    >
      {pending ? "Отправляем…" : "Отправить заявку"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-blue"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
}
