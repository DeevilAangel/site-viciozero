"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Target,
  TrendingUp,
  Lightbulb,
  Heart,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowRight,
  BookOpen,
  Users,
  Zap,
  Brain,
  Activity,
} from "lucide-react";
import { useAuth } from "@/components/custom/auth-provider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ExtendedConfig {
  selected_vices: string[];
  cigarettes_per_day: number;
  cigarette_price: number;
  cigarette_motivation: string;
  cigarette_time_smoking: string;
  cigarette_tried_quitting: string;
  drinks_per_week: number;
  drink_price: number;
  drink_motivation: string;
  drink_frequency: string;
  drink_type: string;
  phone_hours_per_day: number;
  phone_motivation: string;
  phone_main_use: string;
  phone_impact: string;
  gaming_hours_per_day: number;
  gaming_motivation: string;
  gaming_type: string;
  gaming_impact: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<ExtendedConfig | null>(null);

  useEffect(() => {
    if (!loading && user) {
      loadConfig();
    }
  }, [user, loading]);

  const loadConfig = async () => {
    if (!user) return;

    try {
      const savedExtendedData = localStorage.getItem(`extended_config_${user.id}`);
      if (savedExtendedData) {
        const extendedData = JSON.parse(savedExtendedData);
        setConfig(extendedData);
      } else {
        // Se não tem configuração, redireciona para as perguntas
        router.push("/meu-plano");
      }
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
      router.push("/meu-plano");
    }
  };

  // Funções de cálculo
  const calculateMonthlySavings = () => {
    if (!config) return 0;
    let total = 0;
    
    if (config.selected_vices.includes("cigarette")) {
      const cigarettesPerMonth = config.cigarettes_per_day * 30;
      total += (cigarettesPerMonth / 20) * config.cigarette_price;
    }
    
    if (config.selected_vices.includes("drink")) {
      total += (config.drinks_per_week * 4) * config.drink_price;
    }
    
    return total;
  };

  const calculateMonthlyTimeWasted = () => {
    if (!config) return 0;
    let total = 0;
    
    if (config.selected_vices.includes("phone")) {
      total += config.phone_hours_per_day * 30;
    }
    
    if (config.selected_vices.includes("gaming")) {
      total += config.gaming_hours_per_day * 30;
    }
    
    return total;
  };

  // Gerar metas personalizadas
  const getPersonalizedGoals = () => {
    if (!config) return [];
    const goals = [];

    if (config.selected_vices.includes("cigarette")) {
      goals.push({
        title: "Reduzir cigarros gradualmente",
        description: `Diminua de ${config.cigarettes_per_day} para ${Math.max(0, config.cigarettes_per_day - 5)} cigarros por dia`,
        icon: Target,
        color: "from-red-500 to-orange-600",
        progress: 0,
      });
    }

    if (config.selected_vices.includes("drink")) {
      goals.push({
        title: "Dias sem beber",
        description: `Estabeleça ${config.drink_frequency === "diariamente" ? "3 dias" : "5 dias"} sem álcool por semana`,
        icon: Award,
        color: "from-purple-500 to-pink-600",
        progress: 0,
      });
    }

    if (config.selected_vices.includes("phone")) {
      goals.push({
        title: "Reduzir tempo de tela",
        description: `Diminua de ${config.phone_hours_per_day}h para ${Math.max(1, config.phone_hours_per_day - 2)}h por dia`,
        icon: Clock,
        color: "from-blue-500 to-cyan-600",
        progress: 0,
      });
    }

    if (config.selected_vices.includes("gaming")) {
      goals.push({
        title: "Equilibrar tempo de jogo",
        description: `Reduza de ${config.gaming_hours_per_day}h para ${Math.max(1, config.gaming_hours_per_day - 1)}h por dia`,
        icon: Activity,
        color: "from-green-500 to-emerald-600",
        progress: 0,
      });
    }

    return goals;
  };

  // Gerar dicas personalizadas
  const getPersonalizedTips = () => {
    if (!config) return [];
    const tips = [];

    // Dicas para cigarro
    if (config.selected_vices.includes("cigarette")) {
      if (config.cigarette_motivation === "saude") {
        tips.push({
          title: "Respire fundo",
          description: "Quando sentir vontade de fumar, faça 5 respirações profundas. Isso oxigena seu corpo e acalma a ansiedade.",
          icon: Heart,
        });
      } else if (config.cigarette_motivation === "economia") {
        tips.push({
          title: "Visualize suas economias",
          description: "A cada dia sem fumar, coloque o dinheiro que gastaria em um cofrinho. Veja o valor crescer!",
          icon: Wallet,
        });
      }
      
      tips.push({
        title: "Substitua o hábito",
        description: "Quando sentir vontade, mastigue uma goma, beba água ou faça uma caminhada rápida.",
        icon: Zap,
      });
    }

    // Dicas para bebida
    if (config.selected_vices.includes("drink")) {
      if (config.drink_motivation === "clareza_mental") {
        tips.push({
          title: "Hidrate-se bem",
          description: "Beba pelo menos 2 litros de água por dia. Isso melhora sua clareza mental e reduz a vontade de beber.",
          icon: Brain,
        });
      }
      
      tips.push({
        title: "Alternativas saudáveis",
        description: "Substitua bebidas alcoólicas por sucos naturais, água com gás ou chás gelados em eventos sociais.",
        icon: Sparkles,
      });
    }

    // Dicas para celular
    if (config.selected_vices.includes("phone")) {
      if (config.phone_motivation === "produtividade") {
        tips.push({
          title: "Modo foco",
          description: "Use o modo 'Não Perturbe' durante trabalho/estudos. Configure horários específicos para redes sociais.",
          icon: Target,
        });
      }
      
      tips.push({
        title: "Zona livre de celular",
        description: "Deixe o celular fora do quarto à noite e longe da mesa durante refeições.",
        icon: CheckCircle2,
      });
    }

    // Dicas para jogos
    if (config.selected_vices.includes("gaming")) {
      if (config.gaming_motivation === "objetivos") {
        tips.push({
          title: "Recompense-se com jogos",
          description: "Use o tempo de jogo como recompensa após completar tarefas importantes do dia.",
          icon: Award,
        });
      }
      
      tips.push({
        title: "Defina limites claros",
        description: "Use alarmes para limitar sessões de jogo. Faça pausas de 10 minutos a cada hora.",
        icon: Clock,
      });
    }

    return tips.slice(0, 6); // Máximo 6 dicas
  };

  // Gerar recursos de ajuda personalizados
  const getPersonalizedResources = () => {
    if (!config) return [];
    const resources = [];

    if (config.selected_vices.includes("cigarette")) {
      resources.push({
        title: "Grupo de Apoio - Tabagismo",
        description: "Conecte-se com pessoas que estão na mesma jornada",
        icon: Users,
        link: "#",
      });
      resources.push({
        title: "Guia: Primeiros 30 Dias Sem Fumar",
        description: "Estratégias comprovadas para superar os primeiros dias",
        icon: BookOpen,
        link: "#",
      });
    }

    if (config.selected_vices.includes("drink")) {
      resources.push({
        title: "Comunidade de Sobriedade",
        description: "Compartilhe experiências e receba apoio",
        icon: Users,
        link: "#",
      });
    }

    if (config.selected_vices.includes("phone") || config.selected_vices.includes("gaming")) {
      resources.push({
        title: "Técnicas de Mindfulness Digital",
        description: "Aprenda a ter uma relação saudável com tecnologia",
        icon: Brain,
        link: "#",
      });
    }

    return resources;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Faça Login para Continuar
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Para acessar seu dashboard personalizado, você precisa estar logado.
            </p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-6">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const monthlySavings = calculateMonthlySavings();
  const monthlyTimeWasted = calculateMonthlyTimeWasted();
  const goals = getPersonalizedGoals();
  const tips = getPersonalizedTips();
  const resources = getPersonalizedResources();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Sua Jornada Personalizada</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Minha Jornada
            </h1>
            <p className="text-xl text-gray-600">
              Acompanhe seu progresso e receba suporte personalizado
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {monthlySavings > 0 && (
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500 p-3 rounded-xl">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Economia Potencial</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      R$ {(monthlySavings * 12).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">por ano</p>
                  </div>
                </div>
              </Card>
            )}

            {monthlyTimeWasted > 0 && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Tempo Recuperável</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {(monthlyTimeWasted * 12 / 24).toFixed(0)} dias
                    </p>
                    <p className="text-xs text-gray-500">por ano</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Metas Personalizadas */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Suas Metas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br ${goal.color} p-3 rounded-xl flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${goal.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{goal.progress}% completo</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dicas Personalizadas */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Dicas para Você</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">{tip.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recursos de Ajuda */}
          {resources.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recursos de Apoio</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{resource.title}</h3>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA para Registro Diário */}
          <Card className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Registre seu Progresso Hoje</h3>
                  <p className="text-emerald-50">
                    Acompanhe seu dia a dia e veja sua evolução em tempo real
                  </p>
                </div>
              </div>
              <Link href="/registro-diario">
                <Button className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Fazer Registro
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Link para editar configuração */}
          <div className="text-center mt-8">
            <Link href="/meu-plano">
              <Button variant="outline" className="text-gray-600">
                Editar Minhas Respostas
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
