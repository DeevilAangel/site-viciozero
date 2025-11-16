"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Calculator, Calendar, TrendingUp, Brain, Heart, Clock } from "lucide-react";

export default function FerramentasPage() {
  const tools = [
    {
      icon: Calculator,
      title: "Calculadora de Economia",
      description: "Veja quanto dinheiro você economiza ao superar seu vício",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Calendar,
      title: "Registro Diário",
      description: "Acompanhe seu progresso dia a dia com registros detalhados",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Gráficos de Progresso",
      description: "Visualize sua evolução com gráficos e estatísticas",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Brain,
      title: "Técnicas de Controle",
      description: "Aprenda técnicas comprovadas para controlar impulsos",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Heart,
      title: "Monitor de Saúde",
      description: "Acompanhe melhorias na sua saúde física e mental",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "Contador de Tempo Limpo",
      description: "Celebre cada dia, hora e minuto de vitória",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Ferramentas Para Sua{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Transformação
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos práticos e comprovados para te ajudar em cada etapa da sua jornada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-emerald-200"
              >
                <div className={`bg-gradient-to-br ${tool.color} p-4 rounded-xl w-fit mb-4`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
