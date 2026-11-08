import { API_URL } from "../config/api";
import { apiFetch } from "../lib/apiFetch";
import type { AdminDashboardResponse } from "../types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await apiFetch(`${API_URL}/dashboard/admin`, {
    method: "GET",
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Não foi possível carregar o dashboard.";

    if (typeof result === "object" && result !== null) {
      const body = result as Record<string, unknown>;

      if (typeof body.error === "string") {
        message = body.error;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    }

    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("estatisticas" in result) ||
    !("inscricoesPorSituacao" in result) ||
    !("cursosPorSituacao" in result)
  ) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  return result as AdminDashboardResponse;
}
