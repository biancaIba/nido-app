"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/hooks";
import { Button, Input } from "@/components/ui";
import { LogoNido } from "@/components/features";

export default function Register() {
  const { signUpWithEmail, loading, authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

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
          Crear una cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-shark-gray-900/60">
          ¿Ya tenés una cuenta?{" "}
          <Link
            href="/ingresar"
            className="font-medium text-lightning-yellow-600 hover:text-lightning-yellow-500"
          >
            Iniciar sesión
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
                autoComplete="new-password"
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
                      No es posible registrarse.
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
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
