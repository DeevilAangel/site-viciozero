"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2, Heart } from "lucide-react";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pegar o código de confirmação da URL
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          setStatus("error");
          setMessage(errorDescription || "Ocorreu um erro ao confirmar seu email.");
          return;
        }

        if (code) {
          // Trocar o código por uma sessão
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Erro ao trocar código:", exchangeError);
            setStatus("error");
            setMessage("Erro ao confirmar email. O link pode ter expirado.");
            return;
          }

          if (data.session) {
            setStatus("success");
            setMessage("Email confirmado com sucesso! Redirecionando...");
            
            // Redirecionar para a página inicial após 2 segundos
            setTimeout(() => {
              router.push("/");
            }, 2000);
          }
        } else {
          // Verificar se já existe uma sessão (caso o usuário já esteja logado)
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            setStatus("success");
            setMessage("Você já está autenticado! Redirecionando...");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            setStatus("error");
            setMessage("Link de confirmação inválido ou expirado.");
          }
        }
      } catch (err) {
        console.error("Erro no callback:", err);
        setStatus("error");
        setMessage("Ocorreu um erro inesperado. Tente fazer login novamente.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-gray-900">VícioZero</span>
          </Link>
        </div>

        {/* Card de Status */}
        <Card className="p-8 shadow-xl">
          <div className="text-center space-y-4">
            {status === "loading" && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirmando seu email...
                </h2>
                <p className="text-gray-600">
                  Por favor, aguarde enquanto processamos sua confirmação.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center">
                  <div className="bg-emerald-100 p-4 rounded-full">
                    <CheckCircle className="w-16 h-16 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Email confirmado!
                </h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center">
                  <div className="bg-red-100 p-4 rounded-full">
                    <AlertCircle className="w-16 h-16 text-red-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Erro na confirmação
                </h2>
                <p className="text-gray-600">{message}</p>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Ir para Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Link para home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
