import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl font-semibold text-danger">403</h1>

        <h2 className="mt-3 text-xl font-semibold text-ink">Acesso negado</h2>

        <p className="mt-2 text-sm text-ink-2">
          Você está autenticado, mas não possui autorização para acessar esta
          página.
        </p>

        <Link
          to="/logout"
          className="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Sair da sessão
        </Link>
      </div>
    </main>
  );
}
