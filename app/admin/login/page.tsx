import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/admin-auth";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error === "1";

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    if (!process.env.ADMIN_PASSWORD) {
      redirect("/admin/login?error=1");
    }
    if (password === process.env.ADMIN_PASSWORD) {
      setAdminSession();
      redirect("/admin");
    }
    redirect("/admin/login?error=1");
  }

  return (
    <div className="container pb-20 pt-10">
      <div className="mx-auto max-w-md rounded-3xl p-8 shadow-sm surface card-hover">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter the admin password to manage products and settings.
        </p>
        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            Invalid password or missing configuration.
          </p>
        )}
        <form action={login} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase text-[var(--muted)]">Password</label>
            <input
              type="password"
              name="password"
              className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
              required
            />
          </div>
          <button className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
