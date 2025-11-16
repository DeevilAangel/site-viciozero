"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/custom/auth-provider";

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStart = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/meu-plano");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Comece Sua Jornada de{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Transformação
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Responda algumas perguntas para criar seu plano personalizado de superação.
          </p>

          <Card className="p-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              O que você vai descobrir:
            </h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-1 mt-1">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">Seu perfil de dependência e gatilhos principais</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-1 mt-1">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">Estratégias personalizadas para seu caso específico</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-1 mt-1">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">Ferramentas práticas para acompanhar seu progresso</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-100 rounded-full p-1 mt-1">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700">Economia estimada ao superar seu vício</span>
              </li>
            </ul>

            <Button 
              onClick={handleStart}
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {user ? "Ir para Meu Plano" : "Fazer Login para Começar"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
