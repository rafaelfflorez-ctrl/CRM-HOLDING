import { getSupabaseClient } from "./supabase";

/**
 * fetch() con la sesión de Supabase adjunta (Bearer token).
 * Todas las rutas /api/* del servidor exigen autenticación (seguridad B1).
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let hasAuth = false;
  try {
    const supabase = await getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      headers.set("Authorization", `Bearer ${data.session.access_token}`);
      hasAuth = true;
    }
  } catch (e) {
    // Supabase no configurado o no disponible
  }

  if (!hasAuth && typeof window !== "undefined") {
    try {
      const local = JSON.parse(localStorage.getItem("holding_session") || "{}");
      if (local?.token) {
        headers.set("Authorization", `Bearer ${local.token}`);
      } else if (local?.user?.email) {
        headers.set("Authorization", `Bearer local-${local.user.email}`);
      }
    } catch {
      // Ignorar error al parsear local storage
    }
  }

  return fetch(path, { ...options, headers });
}
