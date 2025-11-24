"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/hooks";
import { Button, Input } from "@/components/ui";
import { LogoNido } from "@/components/features";

export default function LoginPage() {
  const {
    signInWithEmail,
    signInWithGoogle,
    clearAuthError,
    loading,
    authError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // La función retornada en useEffect se ejecuta cuando el componente se desmonta
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setIsSubmitting(true);

    const user = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (user) {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-shark-gray-900/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
        <LogoNido className="h-20 w-20" />
        <h2 className="text-center text-3xl font-bold tracking-tight text-shark-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-shark-gray-900/60">
          O{" "}
          <Link
            href="/registrarse"
            className="font-medium text-lightning-yellow-600 hover:text-lightning-yellow-500"
          >
            crear una cuenta nueva
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <h3 className="text-shark-gray-900 mb-2 text-sm font-medium">
                Correo electrónico
              </h3>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@jardin.com"
              />
            </div>

            <div>
              <h3 className="text-shark-gray-900 mb-2 text-sm font-medium">
                Contraseña
              </h3>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      No es posible iniciar sesión.
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lightning-yellow-600 hover:bg-lightning-yellow-600/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  O continuar con
                </span>
              </div>
            </div>

            <div className="mt-6">
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
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
