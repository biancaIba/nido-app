"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui";

export default function Register() {
  const { signUpWithEmail, loading, authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);

    const user = await signUpWithEmail(email, password);
    setIsSubmitting(false);

    if (user) {
      setEmail("");
      setPassword("");
      router.push("/maestro/eventos");
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
    <div className="flex flex-col">
      <div className="space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl dark:text-white text-center">
          Registrarse
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Tu correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-3 py-3 sm:text-sm sm:px-2.5 sm:py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ejemplo@jardin.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          {authError && (
            <p className="p-2 bg-red-100 text-red-700 border-l-4 border-red-500">
              {authError}
            </p>
          )}
          <Button className="mt-4 w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-4 py-3 text-center sm:text-sm sm:px-5 sm:py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800">
            {isSubmitting ? "Creando cuenta..." : "Crear una cuenta"}
          </Button>
          <p className="text-base font-light text-gray-500 dark:text-gray-400 text-center sm:text-sm">
            ¿Ya tenés una cuenta?
            <Link
              href="/ingresar"
              className="ml-1 font-medium text-gray-600 hover:underline dark:text-gray-500"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
