import { useState, type SubmitEvent } from "react";
import { login } from "../services/authService";
import type { LoginCredentials, LoginResponse } from "../types/auth";

const inputClass =
  "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-ink " +
  "outline-none transition-shadow placeholder:text-ink-3 " +
  "focus:border-link focus:ring-[3px] focus:ring-link/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 place-items-center rounded-lg bg-accent font-display text-lg font-semibold text-white">
        D
      </div>
      <div className="leading-tight">
        <p className="font-display text-base font-semibold text-ink">DEPPI</p>
        <p className="text-xs text-ink-2">IFCE · Extensão</p>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<LoginResponse | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: email.trim(),
        senha: password,
      };

      const result = await login(credentials);
      setSession(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return (
      <main className="grid min-h-screen place-items-center bg-page p-6">
        <div className="w-full max-w-[380px] rounded-[10px] border border-line bg-surface p-5 text-center">
          <h1 className="font-display text-[26px] leading-[31px] font-semibold text-ink">
            Login realizado!
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Você foi autenticado com sucesso.
          </p>
          <button
            type="button"
            onClick={() => setSession(null)}
            className="mt-6 h-10 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
          >
            Voltar ao login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen bg-page lg:grid-cols-2">
      {/* Painel de capa */}
      <aside className="bg-stripes relative hidden flex-col justify-between border-r border-line p-12 lg:flex">
        <Logo />

        <p className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-xs text-ink-3">
          [ foto do campus / alunos em aula ]
        </p>

        <div className="relative max-w-[460px]">
          <h2 className="font-display text-[40px] leading-[44px] font-semibold text-ink">
            Cursos de extensão do IFCE, num só lugar.
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-ink-2">
            Inscreva-se, envie seus documentos e acompanhe a análise da sua
            inscrição.
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-[26px] leading-[31px] font-semibold text-ink">
            Entrar
          </h1>
          <p className="mt-1.5 text-sm text-ink-2">
            Use seu e-mail institucional.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2.5 rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-3 text-[13px] text-danger"
              >
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-ink">
                E-mail institucional
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-ink"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-link/20"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-accent text-[15px] font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-link/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-ink-3">
            <span className="h-px flex-1 bg-line" />
            ou
            <span className="h-px flex-1 bg-line" />
          </div>

          <p className="text-center text-[13.5px] text-ink-2">
            Ainda não tem conta?{" "}
            <a
              href="/cadastro"
              className="font-medium text-link underline underline-offset-2 transition-colors hover:text-link-hover"
            >
              Crie sua conta
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}