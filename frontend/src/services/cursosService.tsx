import { API_URL } from "../config/api";
import { apiFetch } from "../lib/apiFetch";

import type { Curso, StatusCurso, TipoAcao } from "../types/cursos";

interface ListarMeusCursosFilters {
  status?: StatusCurso;
  tipoAcao?: TipoAcao;
}

export async function listarMeusCursos(
  filters: ListarMeusCursosFilters = {},
): Promise<Curso[]> {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.tipoAcao) {
    params.set("tipoAcao", filters.tipoAcao);
  }

  const queryString = params.toString();

  const url = `${API_URL}/cursos/meus${queryString ? `?${queryString}` : ""}`;

  const response = await apiFetch(url);

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Não foi possível carregar os cursos.";

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

  if (!Array.isArray(result)) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  return result as Curso[];
}
