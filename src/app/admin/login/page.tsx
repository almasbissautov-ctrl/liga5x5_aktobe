import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue">Лига 5×5 Актобе</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Вход в админ-панель</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
