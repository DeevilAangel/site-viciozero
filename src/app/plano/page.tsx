"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Star,
  Zap,
  Heart,
  Brain,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
  Cigarette,
  Smartphone,
  Wine,
  Gamepad2,
  Lightbulb,
  Users,
  AlertCircle,
  BarChart3,
  TrendingDown,
  DollarSign,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Edit
} from "lucide-react";

// Tipos para vícios
type Addiction = "fumar" | "beber" | "celular" | "jogos";
type ViewMode = Addiction | "metas" | "tracker" | "configuracao";

interface UserConsumptionData {
  fumar?: {
    cigarettesPerDayBefore: number; // Antes de começar
    cigarettePackPrice: number;
  };
  beber?: {
    drinksPerWeekBefore: number; // Antes de começar
    drinkPrice: number;
  };
  celular?: {
    screenTimeHoursBefore: number; // Antes de começar
  };
  jogos?: {
    gameTimeHoursBefore: number; // Antes de começar
  };
}

interface DailyLog {
  date: string;
  fumar?: {
    cigarettesSmoked: number;
    moneySpent: number;
  };
  beber?: {
    drinksConsumed: number;
    moneySpent: number;
  };
  celular?: {
    screenTimeHours: number;
  };
  jogos?: {
    gameTimeHours: number;
  };
}

interface AddictionData {
  id: Addiction;
  name: string;
  icon: any;
  color: string;
  dailyGoals: Goal[];
  weeklyGoals: WeeklyGoal[];
  tips: string[];
}

interface Goal {
  id: number;
  title: string;
  completed: boolean;
  points: number;
}

interface WeeklyGoal {
  id: number;
  title: string;
  progress: number;
  total: number;
  current: number;
  points: number;
}

interface DayProgress {
  day: string;
  status: "success" | "partial" | "failed";
  date: string;
  isToday: boolean;
  activities: {
    addiction: Addiction;
    completed: boolean;
    note?: string;
  }[];
}

export default function PlanoPage() {
  const [selectedAddictions, setSelectedAddictions] = useState<Addiction[]>(["fumar", "celular", "beber"]);
  const [activeView, setActiveView] = useState<ViewMode>("configuracao");
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const [showDailyLogForm, setShowDailyLogForm] = useState(false);
  
  // Dados de consumo do usuário
  const [userConsumption, setUserConsumption] = useState<UserConsumptionData>({
    fumar: { cigarettesPerDayBefore: 20, cigarettePackPrice: 12 },
    beber: { drinksPerWeekBefore: 14, drinkPrice: 15 },
    celular: { screenTimeHoursBefore: 8 },
    jogos: { gameTimeHoursBefore: 6 }
  });

  // Logs diários
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([
    {
      date: "2024-01-15",
      fumar: { cigarettesSmoked: 5, moneySpent: 3 },
      celular: { screenTimeHours: 4 },
      beber: { drinksConsumed: 0, moneySpent: 0 }
    },
    {
      date: "2024-01-16",
      fumar: { cigarettesSmoked: 3, moneySpent: 2 },
      celular: { screenTimeHours: 3.5 },
      beber: { drinksConsumed: 1, moneySpent: 15 }
    },
    {
      date: "2024-01-17",
      fumar: { cigarettesSmoked: 0, moneySpent: 0 },
      celular: { screenTimeHours: 2 },
      beber: { drinksConsumed: 0, moneySpent: 0 }
    }
  ]);

  // Form para log diário
  const [todayLog, setTodayLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    fumar: { cigarettesSmoked: 0, moneySpent: 0 },
    celular: { screenTimeHours: 0 },
    beber: { drinksConsumed: 0, moneySpent: 0 },
    jogos: { gameTimeHours: 0 }
  });

  const addictionsData: Record<Addiction, AddictionData> = {
    fumar: {
      id: "fumar",
      name: "Parar de Fumar",
      icon: Cigarette,
      color: "from-red-500 to-orange-500",
      dailyGoals: [
        { id: 1, title: "Não fumar por 24 horas", completed: true, points: 10 },
        { id: 2, title: "Beber 2L de água", completed: true, points: 5 },
        { id: 3, title: "15 min de respiração profunda", completed: false, points: 8 },
        { id: 4, title: "Evitar gatilhos conhecidos", completed: false, points: 10 },
      ],
      weeklyGoals: [
        { id: 1, title: "7 dias sem fumar", progress: 71, total: 7, current: 5, points: 50 },
        { id: 2, title: "Participar de 3 sessões de apoio", progress: 66, total: 3, current: 2, points: 30 },
        { id: 3, title: "Economizar R$ 100", progress: 75, total: 100, current: 75, points: 40 },
      ],
      tips: [
        "Quando sentir vontade, beba água gelada e respire fundo 5 vezes",
        "Mantenha as mãos ocupadas com objetos pequenos",
        "Evite café e álcool nas primeiras semanas",
        "Celebre cada dia sem fumar como uma vitória"
      ]
    },
    celular: {
      id: "celular",
      name: "Reduzir Uso do Celular",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500",
      dailyGoals: [
        { id: 1, title: "Máximo 3h de tela hoje", completed: false, points: 10 },
        { id: 2, title: "1h sem celular antes de dormir", completed: true, points: 8 },
        { id: 3, title: "Desativar notificações não essenciais", completed: true, points: 5 },
        { id: 4, title: "Ler 30 min sem tela", completed: false, points: 10 },
      ],
      weeklyGoals: [
        { id: 1, title: "Reduzir tempo de tela em 20%", progress: 45, total: 100, current: 45, points: 50 },
        { id: 2, title: "5 dias com menos de 3h de tela", progress: 40, total: 5, current: 2, points: 40 },
        { id: 3, title: "Completar 3 atividades offline", progress: 66, total: 3, current: 2, points: 30 },
      ],
      tips: [
        "Use modo escala de cinza para tornar o celular menos atraente",
        "Deixe o celular em outro cômodo durante refeições",
        "Substitua tempo de tela por caminhadas ou exercícios",
        "Configure limites de tempo para apps mais viciantes"
      ]
    },
    beber: {
      id: "beber",
      name: "Controlar Consumo de Álcool",
      icon: Wine,
      color: "from-purple-500 to-pink-500",
      dailyGoals: [
        { id: 1, title: "Dia sem álcool", completed: true, points: 15 },
        { id: 2, title: "Beber 2L de água", completed: true, points: 5 },
        { id: 3, title: "Atividade física 30 min", completed: false, points: 10 },
        { id: 4, title: "Evitar ambientes com bebida", completed: true, points: 8 },
      ],
      weeklyGoals: [
        { id: 1, title: "5 dias sem álcool", progress: 60, total: 5, current: 3, points: 60 },
        { id: 2, title: "Economizar R$ 150", progress: 53, total: 150, current: 80, points: 40 },
        { id: 3, title: "Participar de 2 atividades sociais sem álcool", progress: 50, total: 2, current: 1, points: 35 },
      ],
      tips: [
        "Substitua bebidas alcoólicas por água com gás e limão",
        "Pratique dizer 'não' educadamente em eventos sociais",
        "Identifique emoções que levam você a beber",
        "Tenha sempre uma bebida não alcoólica na mão em festas"
      ]
    },
    jogos: {
      id: "jogos",
      name: "Equilibrar Tempo de Jogo",
      icon: Gamepad2,
      color: "from-green-500 to-emerald-500",
      dailyGoals: [
        { id: 1, title: "Máximo 1h de jogo hoje", completed: false, points: 10 },
        { id: 2, title: "Completar tarefas antes de jogar", completed: true, points: 12 },
        { id: 3, title: "30 min de atividade física", completed: false, points: 8 },
        { id: 4, title: "Tempo de qualidade com família", completed: true, points: 10 },
      ],
      weeklyGoals: [
        { id: 1, title: "Reduzir jogo para 5h/semana", progress: 60, total: 5, current: 3, points: 50 },
        { id: 2, title: "Completar 5 dias de tarefas prioritárias", progress: 80, total: 5, current: 4, points: 40 },
        { id: 3, title: "Explorar 2 hobbies alternativos", progress: 50, total: 2, current: 1, points: 30 },
      ],
      tips: [
        "Use jogos como recompensa após completar tarefas importantes",
        "Configure alarmes para limitar sessões de jogo",
        "Explore jogos educativos ou produtivos",
        "Encontre comunidades com interesses além de jogos"
      ]
    }
  };

  // Calcular economia real baseada nos logs
  const calculateRealSavings = (): number => {
    let totalSavings = 0;
    
    dailyLogs.forEach(log => {
      // Economia de cigarros
      if (log.fumar && userConsumption.fumar) {
        const cigarettesNotSmoked = userConsumption.fumar.cigarettesPerDayBefore - log.fumar.cigarettesSmoked;
        const savingsPerCigarette = userConsumption.fumar.cigarettePackPrice / 20;
        totalSavings += cigarettesNotSmoked * savingsPerCigarette;
      }
      
      // Economia de bebidas
      if (log.beber && userConsumption.beber) {
        const drinksPerDay = userConsumption.beber.drinksPerWeekBefore / 7;
        const drinksNotConsumed = drinksPerDay - log.beber.drinksConsumed;
        totalSavings += drinksNotConsumed * userConsumption.beber.drinkPrice;
      }
    });
    
    return Math.round(totalSavings);
  };

  // Calcular tempo economizado real
  const calculateRealTimeSaved = (): number => {
    let totalTimeSaved = 0;
    
    dailyLogs.forEach(log => {
      // Tempo economizado no celular
      if (log.celular && userConsumption.celular) {
        const timeSaved = userConsumption.celular.screenTimeHoursBefore - log.celular.screenTimeHours;
        totalTimeSaved += Math.max(0, timeSaved);
      }
      
      // Tempo economizado em jogos
      if (log.jogos && userConsumption.jogos) {
        const timeSaved = userConsumption.jogos.gameTimeHoursBefore - log.jogos.gameTimeHours;
        totalTimeSaved += Math.max(0, timeSaved);
      }
    });
    
    return Math.round(totalTimeSaved);
  };

  const stats = {
    streak: 5,
    totalPoints: 385,
    level: 3,
    nextLevelPoints: 500,
    daysClean: dailyLogs.length,
    moneySaved: calculateRealSavings(),
    timeSaved: calculateRealTimeSaved(),
    healthImprovement: 12
  };

  const getCurrentDayOfWeek = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[new Date().getDay()];
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getDayStatus = (activities: DayProgress["activities"]): "success" | "partial" | "failed" => {
    const completed = activities.filter(a => a.completed).length;
    const total = activities.length;
    
    if (completed === total) return "success";
    if (completed > 0) return "partial";
    return "failed";
  };

  const generateWeekProgress = (): DayProgress[] => {
    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const weekDates = getWeekDates();
    const currentDay = getCurrentDayOfWeek();

    return days.map((day, index) => {
      const date = weekDates[index];
      const isToday = day === currentDay;
      const isPast = date < new Date() && !isToday;

      const activities = [
        {
          addiction: "fumar" as Addiction,
          completed: isPast ? Math.random() > 0.2 : isToday,
          note: isPast ? "Consegui resistir às tentações!" : isToday ? "Dia está indo bem!" : undefined
        },
        {
          addiction: "celular" as Addiction,
          completed: isPast ? Math.random() > 0.4 : isToday,
          note: isPast ? "Reduzi 2h de uso hoje" : undefined
        },
        {
          addiction: "beber" as Addiction,
          completed: isPast ? Math.random() > 0.3 : isToday,
          note: isPast ? "Dia limpo, me sinto ótimo!" : undefined
        }
      ];

      return {
        day,
        status: getDayStatus(activities),
        date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        isToday,
        activities
      };
    });
  };

  const [weekProgress, setWeekProgress] = useState<DayProgress[]>(generateWeekProgress());

  const addictionProgress = {
    fumar: [100, 100, 100, 50, 100, 100, 100],
    celular: [75, 50, 100, 75, 50, 75, 100],
    beber: [100, 100, 75, 100, 100, 100, 100],
  };

  const savingsData = (() => {
    const weeks = [];
    for (let i = 1; i <= 4; i++) {
      const savings = Math.round(calculateRealSavings() * (i / (dailyLogs.length / 7)));
      weeks.push({ week: `Sem ${i}`, amount: savings });
    }
    return weeks;
  })();

  const [goalsState, setGoalsState] = useState<Record<Addiction, Goal[]>>(
    Object.fromEntries(
      Object.entries(addictionsData).map(([key, data]) => [key, data.dailyGoals])
    ) as Record<Addiction, Goal[]>
  );

  const toggleDailyGoal = (addiction: Addiction, goalId: number) => {
    setGoalsState(prev => ({
      ...prev,
      [addiction]: prev[addiction].map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const achievements = [
    { icon: Flame, title: "Sequência de 5 dias", color: "from-orange-500 to-red-500", unlocked: true },
    { icon: Trophy, title: "Primeira semana", color: "from-yellow-500 to-amber-500", unlocked: false },
    { icon: Star, title: "100 pontos", color: "from-purple-500 to-pink-500", unlocked: true },
    { icon: Award, title: "30 dias limpo", color: "from-blue-500 to-cyan-500", unlocked: false },
  ];

  const getStatusColor = (status: DayProgress["status"]) => {
    switch (status) {
      case "success":
        return "from-emerald-500 to-teal-600";
      case "partial":
        return "from-yellow-500 to-amber-500";
      case "failed":
        return "from-red-500 to-rose-600";
    }
  };

  const getStatusIcon = (status: DayProgress["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-white" />;
      case "partial":
        return <AlertCircle className="w-6 h-6 text-white" />;
      case "failed":
        return <X className="w-6 h-6 text-white" />;
    }
  };

  const saveDailyLog = () => {
    setDailyLogs(prev => [...prev, todayLog]);
    setShowDailyLogForm(false);
    setTodayLog({
      date: new Date().toISOString().split('T')[0],
      fumar: { cigarettesSmoked: 0, moneySpent: 0 },
      celular: { screenTimeHours: 0 },
      beber: { drinksConsumed: 0, moneySpent: 0 },
      jogos: { gameTimeHours: 0 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Meu Plano Personalizado
            </h1>
            <p className="text-gray-600">
              Continue assim! Você está fazendo um trabalho incrível 🎉
            </p>
          </div>

          <div className="flex gap-6">
            {/* SIDEBAR */}
            <div className="w-64 flex-shrink-0 space-y-3">
              <button
                onClick={() => setActiveView("configuracao")}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all text-left
                  ${activeView === "configuracao" 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400 shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Edit className={`w-5 h-5 ${activeView === "configuracao" ? 'text-white' : 'text-purple-600'}`} />
                  <span className={`font-semibold ${activeView === "configuracao" ? 'text-white' : 'text-gray-900'}`}>
                    Configuração Inicial
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveView("metas")}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all text-left
                  ${activeView === "metas" 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Target className={`w-5 h-5 ${activeView === "metas" ? 'text-white' : 'text-emerald-600'}`} />
                  <span className={`font-semibold ${activeView === "metas" ? 'text-white' : 'text-gray-900'}`}>
                    Metas Gerais
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView("tracker");
                  setSelectedDay(null);
                }}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all text-left
                  ${activeView === "tracker" 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-5 h-5 ${activeView === "tracker" ? 'text-white' : 'text-blue-600'}`} />
                  <span className={`font-semibold ${activeView === "tracker" ? 'text-white' : 'text-gray-900'}`}>
                    Tracker de Progresso
                  </span>
                </div>
              </button>

              <div className="border-t-2 border-gray-200 my-4"></div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Meus Vícios</p>

              {selectedAddictions.map((addictionId) => {
                const addiction = addictionsData[addictionId];
                return (
                  <button
                    key={addictionId}
                    onClick={() => setActiveView(addictionId)}
                    className={`
                      w-full p-4 rounded-xl border-2 transition-all text-left
                      ${activeView === addictionId 
                        ? `bg-gradient-to-br ${addiction.color} border-opacity-0 shadow-lg` 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <addiction.icon className={`w-5 h-5 ${activeView === addictionId ? 'text-white' : 'text-gray-700'}`} />
                      <span className={`font-semibold text-sm ${activeView === addictionId ? 'text-white' : 'text-gray-900'}`}>
                        {addiction.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="flex-1 space-y-6">
              {/* VIEW: CONFIGURAÇÃO INICIAL */}
              {activeView === "configuracao" && (
                <>
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl">
                        <Edit className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Configuração Inicial</h2>
                        <p className="text-gray-600 text-sm">Configure seus dados para cálculos precisos</p>
                      </div>
                    </div>
                  </Card>

                  {/* Formulário de Dados Iniciais */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Dados Antes de Começar</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Informe seus hábitos ANTES de começar o programa para calcularmos sua economia e progresso real.
                    </p>

                    <div className="space-y-6">
                      {/* Fumar */}
                      {selectedAddictions.includes("fumar") && (
                        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                          <div className="flex items-center gap-2 mb-4">
                            <Cigarette className="w-5 h-5 text-red-600" />
                            <h4 className="font-bold text-gray-900">Cigarro</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cigarettes">Quantos cigarros fumava por dia?</Label>
                              <Input
                                id="cigarettes"
                                type="number"
                                value={userConsumption.fumar?.cigarettesPerDayBefore || 0}
                                onChange={(e) => setUserConsumption(prev => ({
                                  ...prev,
                                  fumar: { ...prev.fumar!, cigarettesPerDayBefore: parseInt(e.target.value) || 0 }
                                }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="packPrice">Preço do maço (R$)</Label>
                              <Input
                                id="packPrice"
                                type="number"
                                value={userConsumption.fumar?.cigarettePackPrice || 0}
                                onChange={(e) => setUserConsumption(prev => ({
                                  ...prev,
                                  fumar: { ...prev.fumar!, cigarettePackPrice: parseFloat(e.target.value) || 0 }
                                }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Beber */}
                      {selectedAddictions.includes("beber") && (
                        <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50">
                          <div className="flex items-center gap-2 mb-4">
                            <Wine className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-gray-900">Álcool</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="drinks">Quantas bebidas por semana?</Label>
                              <Input
                                id="drinks"
                                type="number"
                                value={userConsumption.beber?.drinksPerWeekBefore || 0}
                                onChange={(e) => setUserConsumption(prev => ({
                                  ...prev,
                                  beber: { ...prev.beber!, drinksPerWeekBefore: parseInt(e.target.value) || 0 }
                                }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="drinkPrice">Preço médio por bebida (R$)</Label>
                              <Input
                                id="drinkPrice"
                                type="number"
                                value={userConsumption.beber?.drinkPrice || 0}
                                onChange={(e) => setUserConsumption(prev => ({
                                  ...prev,
                                  beber: { ...prev.beber!, drinkPrice: parseFloat(e.target.value) || 0 }
                                }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Celular */}
                      {selectedAddictions.includes("celular") && (
                        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                          <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-gray-900">Celular</h4>
                          </div>
                          <div>
                            <Label htmlFor="screenTime">Quantas horas de tela por dia?</Label>
                            <Input
                              id="screenTime"
                              type="number"
                              step="0.5"
                              value={userConsumption.celular?.screenTimeHoursBefore || 0}
                              onChange={(e) => setUserConsumption(prev => ({
                                ...prev,
                                celular: { screenTimeHoursBefore: parseFloat(e.target.value) || 0 }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Jogos */}
                      {selectedAddictions.includes("jogos") && (
                        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50">
                          <div className="flex items-center gap-2 mb-4">
                            <Gamepad2 className="w-5 h-5 text-green-600" />
                            <h4 className="font-bold text-gray-900">Jogos</h4>
                          </div>
                          <div>
                            <Label htmlFor="gameTime">Quantas horas de jogo por dia?</Label>
                            <Input
                              id="gameTime"
                              type="number"
                              step="0.5"
                              value={userConsumption.jogos?.gameTimeHoursBefore || 0}
                              onChange={(e) => setUserConsumption(prev => ({
                                ...prev,
                                jogos: { gameTimeHoursBefore: parseFloat(e.target.value) || 0 }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      onClick={() => setActiveView("metas")}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </Card>

                  {/* Formulário de Log Diário */}
                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Registro Diário</h3>
                        <p className="text-sm text-gray-600">Como foi seu dia hoje?</p>
                      </div>
                      <Button
                        onClick={() => setShowDailyLogForm(!showDailyLogForm)}
                        variant={showDailyLogForm ? "destructive" : "default"}
                        size="sm"
                      >
                        {showDailyLogForm ? "Cancelar" : "Adicionar Registro"}
                      </Button>
                    </div>

                    {showDailyLogForm && (
                      <div className="space-y-4 mt-4">
                        {selectedAddictions.includes("fumar") && (
                          <div className="p-3 bg-white rounded-lg">
                            <Label htmlFor="todayCigarettes">Quantos cigarros fumou hoje?</Label>
                            <Input
                              id="todayCigarettes"
                              type="number"
                              value={todayLog.fumar?.cigarettesSmoked || 0}
                              onChange={(e) => setTodayLog(prev => ({
                                ...prev,
                                fumar: { 
                                  cigarettesSmoked: parseInt(e.target.value) || 0,
                                  moneySpent: ((parseInt(e.target.value) || 0) / 20) * (userConsumption.fumar?.cigarettePackPrice || 0)
                                }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        )}

                        {selectedAddictions.includes("beber") && (
                          <div className="p-3 bg-white rounded-lg">
                            <Label htmlFor="todayDrinks">Quantas bebidas consumiu hoje?</Label>
                            <Input
                              id="todayDrinks"
                              type="number"
                              value={todayLog.beber?.drinksConsumed || 0}
                              onChange={(e) => setTodayLog(prev => ({
                                ...prev,
                                beber: { 
                                  drinksConsumed: parseInt(e.target.value) || 0,
                                  moneySpent: (parseInt(e.target.value) || 0) * (userConsumption.beber?.drinkPrice || 0)
                                }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        )}

                        {selectedAddictions.includes("celular") && (
                          <div className="p-3 bg-white rounded-lg">
                            <Label htmlFor="todayScreenTime">Quantas horas de tela hoje?</Label>
                            <Input
                              id="todayScreenTime"
                              type="number"
                              step="0.5"
                              value={todayLog.celular?.screenTimeHours || 0}
                              onChange={(e) => setTodayLog(prev => ({
                                ...prev,
                                celular: { screenTimeHours: parseFloat(e.target.value) || 0 }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        )}

                        {selectedAddictions.includes("jogos") && (
                          <div className="p-3 bg-white rounded-lg">
                            <Label htmlFor="todayGameTime">Quantas horas de jogo hoje?</Label>
                            <Input
                              id="todayGameTime"
                              type="number"
                              step="0.5"
                              value={todayLog.jogos?.gameTimeHours || 0}
                              onChange={(e) => setTodayLog(prev => ({
                                ...prev,
                                jogos: { gameTimeHours: parseFloat(e.target.value) || 0 }
                              }))}
                              className="mt-1"
                            />
                          </div>
                        )}

                        <Button 
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                          onClick={saveDailyLog}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Registro do Dia
                        </Button>
                      </div>
                    )}

                    {/* Histórico de Logs */}
                    <div className="mt-6">
                      <h4 className="font-bold text-gray-900 mb-3">Últimos Registros</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {dailyLogs.slice(-5).reverse().map((log, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-gray-900">{log.date}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              {log.fumar && <div>🚬 {log.fumar.cigarettesSmoked} cigarros</div>}
                              {log.beber && <div>🍷 {log.beber.drinksConsumed} bebidas</div>}
                              {log.celular && <div>📱 {log.celular.screenTimeHours}h tela</div>}
                              {log.jogos && <div>🎮 {log.jogos.gameTimeHours}h jogos</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* VIEW: TRACKER DE PROGRESSO */}
              {activeView === "tracker" && (
                <>
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Progresso Semanal</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-semibold text-gray-600 px-3">Semana Atual</span>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                        <span className="text-xs font-medium text-gray-600">Todos objetivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-amber-500"></div>
                        <span className="text-xs font-medium text-gray-600">Alguns objetivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-rose-600"></div>
                        <span className="text-xs font-medium text-gray-600">Nenhum objetivo</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-3 mb-6">
                      {weekProgress.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDay(day)}
                          className={`
                            text-center transition-all hover:scale-105
                            ${day.isToday ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
                          `}
                        >
                          <div className="text-xs font-semibold text-gray-600 mb-2">
                            {day.day}
                            {day.isToday && <span className="ml-1 text-blue-600">•</span>}
                          </div>
                          <div 
                            className={`
                              w-full aspect-square rounded-xl flex items-center justify-center transition-all
                              bg-gradient-to-br ${getStatusColor(day.status)} shadow-lg hover:shadow-xl
                              ${day.isToday ? 'ring-2 ring-white' : ''}
                            `}
                          >
                            {getStatusIcon(day.status)}
                          </div>
                          <div className={`text-xs mt-1 ${day.isToday ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                            {day.date}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedDay && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-10 h-10 rounded-xl flex items-center justify-center
                              bg-gradient-to-br ${getStatusColor(selectedDay.status)}
                            `}>
                              {getStatusIcon(selectedDay.status)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {selectedDay.day}, {selectedDay.date}
                                {selectedDay.isToday && <span className="ml-2 text-blue-600">(Hoje)</span>}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {selectedDay.status === "success" && "Dia de sucesso - todos objetivos!"}
                                {selectedDay.status === "partial" && "Progresso parcial - continue assim!"}
                                {selectedDay.status === "failed" && "Dia difícil - amanhã é um novo dia!"}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedDay(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Atividades do dia:</p>
                          {selectedDay.activities.map((activity, idx) => {
                            const addiction = addictionsData[activity.addiction];
                            return (
                              <div 
                                key={idx}
                                className={`
                                  flex items-start gap-3 p-3 rounded-lg
                                  ${activity.completed 
                                    ? 'bg-white border-2 border-emerald-300' 
                                    : 'bg-white border-2 border-gray-200'
                                  }
                                `}
                              >
                                <div className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                  bg-gradient-to-br ${addiction.color}
                                `}>
                                  <addiction.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                      {addiction.name}
                                    </span>
                                    {activity.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  {activity.note && (
                                    <p className="text-xs text-gray-600 italic">\"{activity.note}\"</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-gray-900">Taxa de Sucesso</span>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {Math.round((weekProgress.filter(d => d.status === "success").length / weekProgress.length) * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {weekProgress.filter(d => d.status === "success").length} de {weekProgress.length} dias com todos objetivos esta semana
                      </p>
                    </div>
                  </Card>

                  {/* Grid: Economia + Tempo */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Economia Real</h3>
                      </div>

                      <div className="text-4xl font-bold text-green-600 mb-2">
                        R$ {stats.moneySaved}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Baseado nos seus registros diários
                      </p>

                      <div className="space-y-2">
                        {savingsData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.week}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-white rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full"
                                  style={{ width: `${(item.amount / savingsData[savingsData.length - 1].amount) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                                R$ {item.amount}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">Tempo Economizado Real</h3>
                      </div>

                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {stats.timeSaved}h
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Baseado nos seus registros diários
                      </p>

                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">Celular</span>
                            <span className="text-sm font-bold text-blue-600">
                              {Math.round(stats.timeSaved * 0.6)}h
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Tempo recuperado</p>
                        </div>

                        <div className="p-3 bg-white rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">Jogos</span>
                            <span className="text-sm font-bold text-blue-600">
                              {Math.round(stats.timeSaved * 0.4)}h
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Tempo recuperado</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t-2 border-blue-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Equivalente a</span>
                          <span className="font-bold text-blue-600">
                            {Math.round(stats.timeSaved / 24)} dias completos
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {/* VIEW: METAS GERAIS */}
              {activeView === "metas" && (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-gray-600">Dias Limpo</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.daysClean}</div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-gray-600">Pontos</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-semibold text-gray-600">Nível</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.level}</div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-semibold text-gray-600">Economizado</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">R$ {stats.moneySaved}</div>
                    </Card>
                  </div>

                  <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
                          <Flame className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{stats.streak} dias</div>
                          <div className="text-sm text-gray-600">Sequência atual</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Próximo nível</div>
                        <Progress value={(stats.totalPoints / stats.nextLevelPoints) * 100} className="h-2 w-32" />
                        <div className="text-xs text-gray-500 mt-1">{stats.totalPoints}/{stats.nextLevelPoints}</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Resumo dos Seus Vícios
                    </h3>
                    <div className="space-y-3">
                      {selectedAddictions.map((addictionId) => {
                        const addiction = addictionsData[addictionId];
                        const currentGoals = goalsState[addictionId];
                        const completed = currentGoals.filter(g => g.completed).length;
                        const total = currentGoals.length;
                        const percentage = Math.round((completed / total) * 100);

                        return (
                          <div 
                            key={addictionId}
                            className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                            onClick={() => setActiveView(addictionId)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`bg-gradient-to-br ${addiction.color} p-2 rounded-lg`}>
                                  <addiction.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900">{addiction.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-600">{completed}/{total} objetivos</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Conquistas
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`
                            p-4 rounded-xl text-center transition-all duration-300
                            ${achievement.unlocked 
                              ? `bg-gradient-to-br ${achievement.color} shadow-md` 
                              : 'bg-gray-100 opacity-50 grayscale'
                            }
                          `}
                        >
                          <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                          <p className={`font-semibold text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                            {achievement.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* VIEW: VÍCIO ESPECÍFICO */}
              {activeView !== "metas" && activeView !== "tracker" && activeView !== "configuracao" && (() => {
                const addiction = addictionsData[activeView as Addiction];
                const currentGoals = goalsState[activeView as Addiction];

                return (
                  <>
                    <Card className={`p-6 bg-gradient-to-br ${addiction.color}`}>
                      <div className="flex items-center gap-4 text-white">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          <addiction.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{addiction.name}</h2>
                          <p className="text-white/90 text-sm">Seus objetivos e progresso</p>
                        </div>
                      </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-emerald-600" />
                          <h3 className="text-lg font-bold text-gray-900">Objetivos Diários</h3>
                          <div className="ml-auto text-xs font-semibold text-emerald-600">
                            {currentGoals.filter(g => g.completed).length}/{currentGoals.length}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {currentGoals.map((goal) => (
                            <div
                              key={goal.id}
                              onClick={() => toggleDailyGoal(activeView as Addiction, goal.id)}
                              className={`
                                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${goal.completed 
                                  ? 'bg-emerald-50 border-emerald-300' 
                                  : 'bg-white border-gray-200 hover:border-emerald-200'
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center
                                  ${goal.completed ? 'bg-emerald-500' : 'bg-gray-200'}
                                `}>
                                  {goal.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <p className={`text-sm font-medium ${goal.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                  {goal.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-bold text-yellow-600">+{goal.points}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">Objetivos Semanais</h3>
                        </div>

                        <div className="space-y-3">
                          {addiction.weeklyGoals.map((goal) => (
                            <div key={goal.id} className="p-3 rounded-lg border-2 border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-bold text-gray-900">{goal.title}</h4>
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs font-bold text-yellow-600">+{goal.points}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Progresso</span>
                                  <span className="font-semibold text-gray-900">
                                    {goal.current}/{goal.total}
                                  </span>
                                </div>
                                <Progress value={goal.progress} className="h-2" />
                                <div className="text-right text-xs font-semibold text-blue-600">
                                  {goal.progress}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-bold text-gray-900">Dicas Personalizadas</h4>
                      </div>
                      <ul className="space-y-2">
                        {addiction.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
