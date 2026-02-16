import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "admin_session";

export const isAdminAuthenticated = () => {
  const cookieStore = cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "true";
};

export const requireAdmin = () => {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
};

export const setAdminSession = () => {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
};

export const clearAdminSession = () => {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};
