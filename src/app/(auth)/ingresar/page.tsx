"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, user, loading, authError } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/maestro/eventos");
    }
  }, [user, loading, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);

    const user = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (user) {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium">Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      <div className="space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl dark:text-white text-center">
          Iniciar sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tu correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          {authError && (
            <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {authError}
            </p>
          )}

          <Button
            disabled={loading || isSubmitting}
            className="mt-4 w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        <div className="flex justify-center"> - o - </div>

        <Button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-3 py-2 px-6 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition w-full max-w-sm"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.04l7.6 5.92c3.08-4.8 8.44-8.1 13.84-8.1z"
            />
            <path
              fill="#4285F4"
              d="M46.7 24.5c0-1.47-.13-2.85-.38-4.14H24v7.87h12.42c-.52 2.62-2.19 4.88-4.6 6.36l6.81 5.3c3.96-3.7 6.29-9.15 6.29-16.14z"
            />
            <path
              fill="#FBBC05"
              d="M9.7 28.5c-.71-2.1-1.12-4.38-1.12-6.75s.41-4.65 1.12-6.75l-7.6-5.92C1.56 14.86 0 19.33 0 24s1.56 9.14 4.09 13.33l7.6-5.92z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.47 0 12.1-2.38 16.5-6.36l-6.81-5.3c-2.4 1.48-4.07 3.74-4.6 6.36H24v-7.87h7.84c.52-1.78.84-3.56.84-5.5s-.32-3.72-.84-5.5H24V16.5h8.92c1.76 4.02 1.76 8.5 0 12.52H24z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Iniciar Sesión con Google
        </Button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          No tenés una cuenta?
          <Link
            href="/registrarse"
            className="ml-1 font-medium text-gray-600 hover:underline dark:text-gray-500"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </main>
  );
}
