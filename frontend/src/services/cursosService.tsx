import { API_URL } from "../config/api";
import { apiFetch } from "../lib/apiFetch";

import type {
  StatusCurso,
  TipoAcao,
  TipoCurso,
  ListarMeusCursosResponse,
} from "../types/cursos";

export interface ListarMeusCursosFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusCurso;
  tipo?: TipoCurso;
  tipoAcao?: TipoAcao;
  instituicaoId?: string;
}

export async function listarMeusCursos(
  filters: ListarMeusCursosFilters = {},
): Promise<ListarMeusCursosResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 6));

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.tipo) {
    params.set("tipo", filters.tipo);
  }

  if (filters.instituicaoId) {
    params.set("instituicaoId", filters.instituicaoId);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.tipoAcao) {
    params.set("tipoAcao", filters.tipoAcao);
  }

  const url = `${API_URL}/cursos/meus?${params.toString()}`;

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

  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    !("pagination" in result) ||
    !Array.isArray(result.data)
  ) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  return result as ListarMeusCursosResponse;
}
