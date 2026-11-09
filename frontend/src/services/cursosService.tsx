import { API_URL } from "../config/api";
import { apiFetch } from "../lib/apiFetch";
import type { Curso } from "../types/cursos";

export async function listarCursos(): Promise<Curso[]> {
  const response = await apiFetch(`${API_URL}/cursos`);

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
