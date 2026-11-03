import { API_URL } from "../config/api";
import { getAccessToken } from "../lib/auth";
import type { AdminDashboardResponse } from "../types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Sessão não encontrada. Faça login novamente.");
  }

  const response = await fetch(`${API_URL}/dashboard/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
