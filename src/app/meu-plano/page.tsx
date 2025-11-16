"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Target,
  Cigarette,
  Smartphone,
  Wine,
  Gamepad2,
  DollarSign,
  Save,
  LogIn,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
  Wallet,
  Check,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/custom/auth-provider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface InitialConfig {
  cigarettes_per_day: number;
  cigarette_price: number;
  quit_date: string;
  motivation?: string;
}

interface ExtendedConfig {
  selected_vices: string[];
  // Cigarro
  cigarettes_per_day: number;
  cigarette_price: number;
  cigarette_motivation: string;
  cigarette_time_smoking: string;
  cigarette_tried_quitting: string;
  // Bebida
  drinks_per_week: number;
  drink_price: number;
  drink_motivation: string;
  drink_frequency: string;
  drink_type: string;
  // Celular
  phone_hours_per_day: number;
  phone_motivation: string;
  phone_main_use: string;
  phone_impact: string;
  // Jogos
  gaming_hours_per_day: number;
  gaming_motivation: string;
  gaming_type: string;
  gaming_impact: string;
}

export default function MeuPlano() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<InitialConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExtendedConfig>({
    selected_vices: [],
    // Cigarro
    cigarettes_per_day: 0,
    cigarette_price: 0,
    cigarette_motivation: "",
    cigarette_time_smoking: "",
    cigarette_tried_quitting: "",
    // Bebida
    drinks_per_week: 0,
    drink_price: 0,
    drink_motivation: "",
    drink_frequency: "",
    drink_type: "",
    // Celular
    phone_hours_per_day: 0,
    phone_motivation: "",
    phone_main_use: "",
    phone_impact: "",
    // Jogos
    gaming_hours_per_day: 0,
    gaming_motivation: "",
    gaming_type: "",
    gaming_impact: "",
  });

  const viceOptions = [
    { id: "cigarette", label: "Cigarro", icon: Cigarette, color: "from-red-500 to-orange-600" },
    { id: "drink", label: "Bebida", icon: Wine, color: "from-purple-500 to-pink-600" },
    { id: "phone", label: "Celular", icon: Smartphone, color: "from-blue-500 to-cyan-600" },
    { id: "gaming", label: "Jogos", icon: Gamepad2, color: "from-green-500 to-emerald-600" },
  ];

  // Calcula o total de etapas dinamicamente baseado nos vícios selecionados
  const getTotalSteps = () => {
    let steps = 1; // Etapa de seleção de vícios
    
    // Para cada vício selecionado, adiciona 3 etapas (quantidade, pergunta 1, pergunta 2)
    formData.selected_vices.forEach(() => {
      steps += 3;
    });
    
    // Adiciona 1 etapa final para o resumo
    if (formData.selected_vices.length > 0) {
      steps += 1;
    }
    
    return steps;
  };

  const totalSteps = getTotalSteps();

  useEffect(() => {
    if (!loading && user) {
      loadConfig();
    }
  }, [user, loading]);

  const loadConfig = async () => {
    if (!user) return;

    try {
      // Verificar se completou as perguntas (tem configuração estendida)
      const savedExtendedData = localStorage.getItem(`extended_config_${user.id}`);
      if (savedExtendedData) {
        const extendedData = JSON.parse(savedExtendedData);
        
        // Se já tem configuração completa, redireciona para o dashboard
        if (extendedData.selected_vices && extendedData.selected_vices.length > 0) {
          router.push("/dashboard");
          return;
        }
      }

      const { data } = await supabase
        .from("initial_config")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setConfig(data);
        
        if (savedExtendedData) {
          const extendedData = JSON.parse(savedExtendedData);
          
          setFormData({
            selected_vices: extendedData.selected_vices || [],
            cigarettes_per_day: data.cigarettes_per_day,
            cigarette_price: data.cigarette_price,
            cigarette_motivation: extendedData.cigarette_motivation || "",
            cigarette_time_smoking: extendedData.cigarette_time_smoking || "",
            cigarette_tried_quitting: extendedData.cigarette_tried_quitting || "",
            drinks_per_week: extendedData.drinks_per_week || 0,
            drink_price: extendedData.drink_price || 0,
            drink_motivation: extendedData.drink_motivation || "",
            drink_frequency: extendedData.drink_frequency || "",
            drink_type: extendedData.drink_type || "",
            phone_hours_per_day: extendedData.phone_hours_per_day || 0,
            phone_motivation: extendedData.phone_motivation || "",
            phone_main_use: extendedData.phone_main_use || "",
            phone_impact: extendedData.phone_impact || "",
            gaming_hours_per_day: extendedData.gaming_hours_per_day || 0,
            gaming_motivation: extendedData.gaming_motivation || "",
            gaming_type: extendedData.gaming_type || "",
            gaming_impact: extendedData.gaming_impact || "",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
    }
  };

  const toggleVice = (viceId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_vices: prev.selected_vices.includes(viceId)
        ? prev.selected_vices.filter(v => v !== viceId)
        : [...prev.selected_vices, viceId]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase.from("initial_config").upsert({
        user_id: user.id,
        cigarettes_per_day: formData.cigarettes_per_day,
        cigarette_price: formData.cigarette_price,
        quit_date: new Date().toISOString().split('T')[0],
        motivation: formData.selected_vices.join(", ") || "Melhorar minha saúde e qualidade de vida",
      });

      if (error) throw error;

      const extendedData = {
        selected_vices: formData.selected_vices,
        cigarette_motivation: formData.cigarette_motivation,
        cigarette_time_smoking: formData.cigarette_time_smoking,
        cigarette_tried_quitting: formData.cigarette_tried_quitting,
        drinks_per_week: formData.drinks_per_week,
        drink_price: formData.drink_price,
        drink_motivation: formData.drink_motivation,
        drink_frequency: formData.drink_frequency,
        drink_type: formData.drink_type,
        phone_hours_per_day: formData.phone_hours_per_day,
        phone_motivation: formData.phone_motivation,
        phone_main_use: formData.phone_main_use,
        phone_impact: formData.phone_impact,
        gaming_hours_per_day: formData.gaming_hours_per_day,
        gaming_motivation: formData.gaming_motivation,
        gaming_type: formData.gaming_type,
        gaming_impact: formData.gaming_impact,
      };
      localStorage.setItem(`extended_config_${user.id}`, JSON.stringify(extendedData));

      alert("✅ Configuração salva com sucesso!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro ao salvar configuração. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const calculateMonthlySavings = () => {
    let total = 0;
    
    if (formData.selected_vices.includes("cigarette")) {
      const cigarettesPerMonth = formData.cigarettes_per_day * 30;
      total += (cigarettesPerMonth / 20) * formData.cigarette_price;
    }
    
    if (formData.selected_vices.includes("drink")) {
      total += (formData.drinks_per_week * 4) * formData.drink_price;
    }
    
    return total;
  };

  const calculateMonthlyTimeWasted = () => {
    let total = 0;
    
    if (formData.selected_vices.includes("phone")) {
      total += formData.phone_hours_per_day * 30;
    }
    
    if (formData.selected_vices.includes("gaming")) {
      total += formData.gaming_hours_per_day * 30;
    }
    
    return total;
  };

  // Função para gerar mensagem personalizada baseada nas motivações
  const getPersonalizedMessage = () => {
    const motivations = [];
    
    if (formData.cigarette_motivation === "saude") motivations.push("sua saúde");
    if (formData.cigarette_motivation === "economia") motivations.push("suas finanças");
    if (formData.cigarette_motivation === "familia") motivations.push("sua família");
    if (formData.cigarette_motivation === "aparencia") motivations.push("sua aparência");
    
    if (formData.drink_motivation === "saude") motivations.push("sua saúde");
    if (formData.drink_motivation === "economia") motivations.push("suas finanças");
    if (formData.drink_motivation === "clareza_mental") motivations.push("sua clareza mental");
    if (formData.drink_motivation === "produtividade") motivations.push("sua produtividade");
    
    if (formData.phone_motivation === "produtividade") motivations.push("sua produtividade");
    if (formData.phone_motivation === "familia") motivations.push("sua família");
    if (formData.phone_motivation === "saude_mental") motivations.push("sua saúde mental");
    if (formData.phone_motivation === "foco") motivations.push("seu foco");
    
    if (formData.gaming_motivation === "produtividade") motivations.push("sua produtividade");
    if (formData.gaming_motivation === "saude") motivations.push("sua saúde");
    if (formData.gaming_motivation === "familia") motivations.push("sua família");
    if (formData.gaming_motivation === "objetivos") motivations.push("seus objetivos");

    // Remove duplicatas
    const uniqueMotivations = [...new Set(motivations)];
    
    if (uniqueMotivations.length === 0) {
      return "Você está no caminho certo para uma vida melhor!";
    }
    
    if (uniqueMotivations.length === 1) {
      return `Você está investindo em ${uniqueMotivations[0]}. Continue firme!`;
    }
    
    if (uniqueMotivations.length === 2) {
      return `Você está investindo em ${uniqueMotivations[0]} e ${uniqueMotivations[1]}. Continue firme!`;
    }
    
    const last = uniqueMotivations.pop();
    return `Você está investindo em ${uniqueMotivations.join(", ")} e ${last}. Continue firme!`;
  };

  // Função para gerar sugestões personalizadas
  const getPersonalizedSuggestions = () => {
    const suggestions = [];
    
    // Sugestões baseadas em cigarro
    if (formData.selected_vices.includes("cigarette")) {
      if (formData.cigarette_motivation === "saude") {
        suggestions.push("💚 Acompanhe melhorias na sua respiração e energia");
      } else if (formData.cigarette_motivation === "economia") {
        suggestions.push("💰 Veja quanto você economiza a cada dia sem fumar");
      } else if (formData.cigarette_motivation === "familia") {
        suggestions.push("👨‍👩‍👧‍👦 Compartilhe seu progresso com sua família");
      }
    }
    
    // Sugestões baseadas em bebida
    if (formData.selected_vices.includes("drink")) {
      if (formData.drink_motivation === "clareza_mental") {
        suggestions.push("🧠 Note como sua mente fica mais clara a cada dia");
      } else if (formData.drink_motivation === "produtividade") {
        suggestions.push("⚡ Use o tempo livre para alcançar suas metas");
      }
    }
    
    // Sugestões baseadas em celular
    if (formData.selected_vices.includes("phone")) {
      if (formData.phone_motivation === "produtividade") {
        suggestions.push("📊 Use o tempo recuperado para seus projetos");
      } else if (formData.phone_motivation === "familia") {
        suggestions.push("❤️ Aproveite momentos de qualidade com quem ama");
      } else if (formData.phone_motivation === "saude_mental") {
        suggestions.push("🧘 Pratique mindfulness nos momentos livres");
      }
    }
    
    // Sugestões baseadas em jogos
    if (formData.selected_vices.includes("gaming")) {
      if (formData.gaming_motivation === "objetivos") {
        suggestions.push("🎯 Direcione sua energia para seus sonhos");
      } else if (formData.gaming_motivation === "saude") {
        suggestions.push("💪 Use o tempo para exercícios físicos");
      }
    }
    
    return suggestions.slice(0, 3); // Máximo 3 sugestões
  };

  // Função para determinar qual conteúdo mostrar baseado no step atual
  const getCurrentStepContent = () => {
    if (currentStep === 1) {
      return "selection";
    }

    let stepCounter = 1;
    
    for (const vice of formData.selected_vices) {
      stepCounter++;
      if (currentStep === stepCounter) {
        return `${vice}_quantity`;
      }
      
      stepCounter++;
      if (currentStep === stepCounter) {
        return `${vice}_question1`;
      }
      
      stepCounter++;
      if (currentStep === stepCounter) {
        return `${vice}_question2`;
      }
    }
    
    return "summary";
  };

  const currentContent = getCurrentStepContent();

  // Função auxiliar para renderizar botões de múltipla escolha
  const MultipleChoiceButton = ({ 
    value, 
    currentValue, 
    onChange, 
    label 
  }: { 
    value: string; 
    currentValue: string; 
    onChange: (value: string) => void; 
    label: string;
  }) => {
    const isSelected = currentValue === value;
    return (
      <button
        type="button"
        onClick={() => onChange(value)}
        className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
          isSelected
            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg"
            : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected 
              ? "border-emerald-500 bg-emerald-500" 
              : "border-gray-300 bg-white"
          }`}>
            {isSelected && (
              <Check className="w-4 h-4 text-white" />
            )}
          </div>
          <span className={`font-medium text-base ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
            {label}
          </span>
        </div>
      </button>
    );
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
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Faça Login para Continuar
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Para configurar seu plano, você precisa estar logado.
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

  const monthlySavings = calculateMonthlySavings();
  const monthlyTimeWasted = calculateMonthlyTimeWasted();
  const yearlyTimeWasted = monthlyTimeWasted * 12;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {config ? "Editar Configuração" : "Configure seu Plano"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meu Plano de Mudança
            </h1>
            <p className="text-xl text-gray-600">
              {config
                ? "Atualize suas metas e valores para cálculos precisos"
                : "Configure seus hábitos atuais para começar sua jornada"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Etapa {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {Math.round((currentStep / totalSteps) * 100)}% completo
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 shadow-xl mb-6">
            {/* Etapa 1: Seleção de Vícios */}
            {currentContent === "selection" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual vício você quer melhorar?
                  </h2>
                  <p className="text-gray-600">
                    Selecione um ou mais hábitos que deseja mudar
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {viceOptions.map((vice) => {
                    const Icon = vice.icon;
                    const isSelected = formData.selected_vices.includes(vice.id);
                    
                    return (
                      <button
                        key={vice.id}
                        type="button"
                        onClick={() => toggleVice(vice.id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 shadow-lg scale-105"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`bg-gradient-to-br ${vice.color} p-4 rounded-full`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {vice.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formData.selected_vices.length === 0 && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Selecione pelo menos um vício para continuar
                  </p>
                )}
              </div>
            )}

            {/* CIGARRO - Quantidade */}
            {currentContent === "cigarette_quantity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Cigarette className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Cigarro - Consumo Atual
                  </h2>
                  <p className="text-gray-600">
                    Nos ajude a entender seu consumo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cigarettes" className="text-base font-semibold">
                    Quantos cigarros você fuma por dia?
                  </Label>
                  <Input
                    id="cigarettes"
                    type="number"
                    min="0"
                    value={formData.cigarettes_per_day}
                    onChange={(e) =>
                      setFormData({ ...formData, cigarettes_per_day: parseInt(e.target.value) || 0 })
                    }
                    className="text-lg p-6"
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pack_price" className="text-base font-semibold">
                    Qual o preço de um maço (20 cigarros)?
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="pack_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cigarette_price}
                      onChange={(e) =>
                        setFormData({ ...formData, cigarette_price: parseFloat(e.target.value) || 0 })
                      }
                      className="text-lg p-6 pl-10"
                      placeholder="Ex: 10.00"
                    />
                  </div>
                </div>

                {formData.cigarettes_per_day > 0 && formData.cigarette_price > 0 && (
                  <Card className="p-4 bg-red-50 border-red-200">
                    <p className="text-sm text-gray-700">
                      💰 Você gasta aproximadamente{" "}
                      <span className="font-bold text-red-600">
                        R$ {((formData.cigarettes_per_day * 30 / 20) * formData.cigarette_price).toFixed(2)}
                      </span>{" "}
                      por mês em cigarros
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* CIGARRO - Pergunta 1 */}
            {currentContent === "cigarette_question1" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Cigarette className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual é sua principal motivação para parar?
                  </h2>
                  <p className="text-gray-600">
                    Entender sua motivação nos ajuda a personalizar sua experiência
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="saude"
                    currentValue={formData.cigarette_motivation}
                    onChange={(value) => setFormData({ ...formData, cigarette_motivation: value })}
                    label="💚 Melhorar minha saúde"
                  />
                  <MultipleChoiceButton
                    value="economia"
                    currentValue={formData.cigarette_motivation}
                    onChange={(value) => setFormData({ ...formData, cigarette_motivation: value })}
                    label="💰 Economizar dinheiro"
                  />
                  <MultipleChoiceButton
                    value="familia"
                    currentValue={formData.cigarette_motivation}
                    onChange={(value) => setFormData({ ...formData, cigarette_motivation: value })}
                    label="👨‍👩‍👧‍👦 Por minha família"
                  />
                  <MultipleChoiceButton
                    value="aparencia"
                    currentValue={formData.cigarette_motivation}
                    onChange={(value) => setFormData({ ...formData, cigarette_motivation: value })}
                    label="✨ Melhorar minha aparência"
                  />
                </div>
              </div>
            )}

            {/* CIGARRO - Pergunta 2 */}
            {currentContent === "cigarette_question2" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Cigarette className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Há quanto tempo você fuma?
                  </h2>
                  <p className="text-gray-600">
                    Isso nos ajuda a entender melhor seu histórico
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="menos_1_ano"
                    currentValue={formData.cigarette_time_smoking}
                    onChange={(value) => setFormData({ ...formData, cigarette_time_smoking: value })}
                    label="Menos de 1 ano"
                  />
                  <MultipleChoiceButton
                    value="1_3_anos"
                    currentValue={formData.cigarette_time_smoking}
                    onChange={(value) => setFormData({ ...formData, cigarette_time_smoking: value })}
                    label="1 a 3 anos"
                  />
                  <MultipleChoiceButton
                    value="3_5_anos"
                    currentValue={formData.cigarette_time_smoking}
                    onChange={(value) => setFormData({ ...formData, cigarette_time_smoking: value })}
                    label="3 a 5 anos"
                  />
                  <MultipleChoiceButton
                    value="5_10_anos"
                    currentValue={formData.cigarette_time_smoking}
                    onChange={(value) => setFormData({ ...formData, cigarette_time_smoking: value })}
                    label="5 a 10 anos"
                  />
                  <MultipleChoiceButton
                    value="mais_10_anos"
                    currentValue={formData.cigarette_time_smoking}
                    onChange={(value) => setFormData({ ...formData, cigarette_time_smoking: value })}
                    label="Mais de 10 anos"
                  />
                </div>
              </div>
            )}

            {/* BEBIDA - Quantidade */}
            {currentContent === "drink_quantity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Wine className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bebida - Consumo Atual
                  </h2>
                  <p className="text-gray-600">
                    Nos ajude a entender seu consumo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drinks" className="text-base font-semibold">
                    Quantos copos/doses você toma por semana?
                  </Label>
                  <Input
                    id="drinks"
                    type="number"
                    min="0"
                    value={formData.drinks_per_week}
                    onChange={(e) =>
                      setFormData({ ...formData, drinks_per_week: parseInt(e.target.value) || 0 })
                    }
                    className="text-lg p-6"
                    placeholder="Ex: 7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drink_price" className="text-base font-semibold">
                    Qual o preço médio que você gasta por copo/dose?
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="drink_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.drink_price}
                      onChange={(e) =>
                        setFormData({ ...formData, drink_price: parseFloat(e.target.value) || 0 })
                      }
                      className="text-lg p-6 pl-10"
                      placeholder="Ex: 5.00"
                    />
                  </div>
                </div>

                {formData.drinks_per_week > 0 && formData.drink_price > 0 && (
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <p className="text-sm text-gray-700">
                      💰 Você gasta aproximadamente{" "}
                      <span className="font-bold text-purple-600">
                        R$ {(formData.drinks_per_week * 4 * formData.drink_price).toFixed(2)}
                      </span>{" "}
                      por mês em bebidas
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* BEBIDA - Pergunta 1 */}
            {currentContent === "drink_question1" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Wine className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual é sua principal motivação para reduzir?
                  </h2>
                  <p className="text-gray-600">
                    Entender sua motivação nos ajuda a personalizar sua experiência
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="saude"
                    currentValue={formData.drink_motivation}
                    onChange={(value) => setFormData({ ...formData, drink_motivation: value })}
                    label="💚 Melhorar minha saúde"
                  />
                  <MultipleChoiceButton
                    value="economia"
                    currentValue={formData.drink_motivation}
                    onChange={(value) => setFormData({ ...formData, drink_motivation: value })}
                    label="💰 Economizar dinheiro"
                  />
                  <MultipleChoiceButton
                    value="clareza_mental"
                    currentValue={formData.drink_motivation}
                    onChange={(value) => setFormData({ ...formData, drink_motivation: value })}
                    label="🧠 Ter mais clareza mental"
                  />
                  <MultipleChoiceButton
                    value="produtividade"
                    currentValue={formData.drink_motivation}
                    onChange={(value) => setFormData({ ...formData, drink_motivation: value })}
                    label="⚡ Aumentar minha produtividade"
                  />
                </div>
              </div>
            )}

            {/* BEBIDA - Pergunta 2 */}
            {currentContent === "drink_question2" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Wine className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Com que frequência você bebe?
                  </h2>
                  <p className="text-gray-600">
                    Isso nos ajuda a entender melhor seu padrão de consumo
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="diariamente"
                    currentValue={formData.drink_frequency}
                    onChange={(value) => setFormData({ ...formData, drink_frequency: value })}
                    label="Diariamente"
                  />
                  <MultipleChoiceButton
                    value="varios_dias_semana"
                    currentValue={formData.drink_frequency}
                    onChange={(value) => setFormData({ ...formData, drink_frequency: value })}
                    label="Vários dias por semana"
                  />
                  <MultipleChoiceButton
                    value="finais_semana"
                    currentValue={formData.drink_frequency}
                    onChange={(value) => setFormData({ ...formData, drink_frequency: value })}
                    label="Apenas nos finais de semana"
                  />
                  <MultipleChoiceButton
                    value="ocasionalmente"
                    currentValue={formData.drink_frequency}
                    onChange={(value) => setFormData({ ...formData, drink_frequency: value })}
                    label="Ocasionalmente (eventos sociais)"
                  />
                </div>
              </div>
            )}

            {/* CELULAR - Quantidade */}
            {currentContent === "phone_quantity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Celular - Uso Atual
                  </h2>
                  <p className="text-gray-600">
                    Nos ajude a entender seu uso
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Quantas horas por dia você fica no celular?
                  </Label>
                  <Input
                    id="phone"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.phone_hours_per_day}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_hours_per_day: parseFloat(e.target.value) || 0 })
                    }
                    className="text-lg p-6"
                    placeholder="Ex: 6"
                  />
                </div>

                {formData.phone_hours_per_day > 0 && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm text-gray-700">
                      ⏰ Você passa aproximadamente{" "}
                      <span className="font-bold text-blue-600">
                        {(formData.phone_hours_per_day * 30).toFixed(0)} horas por mês
                      </span>{" "}
                      no celular
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Isso equivale a {(formData.phone_hours_per_day * 365 / 24).toFixed(0)} dias por ano!
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* CELULAR - Pergunta 1 */}
            {currentContent === "phone_question1" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual é sua principal motivação para reduzir?
                  </h2>
                  <p className="text-gray-600">
                    Entender sua motivação nos ajuda a personalizar sua experiência
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="produtividade"
                    currentValue={formData.phone_motivation}
                    onChange={(value) => setFormData({ ...formData, phone_motivation: value })}
                    label="⚡ Ser mais produtivo"
                  />
                  <MultipleChoiceButton
                    value="familia"
                    currentValue={formData.phone_motivation}
                    onChange={(value) => setFormData({ ...formData, phone_motivation: value })}
                    label="👨‍👩‍👧‍👦 Passar mais tempo com família"
                  />
                  <MultipleChoiceButton
                    value="saude_mental"
                    currentValue={formData.phone_motivation}
                    onChange={(value) => setFormData({ ...formData, phone_motivation: value })}
                    label="🧘 Melhorar minha saúde mental"
                  />
                  <MultipleChoiceButton
                    value="foco"
                    currentValue={formData.phone_motivation}
                    onChange={(value) => setFormData({ ...formData, phone_motivation: value })}
                    label="🎯 Ter mais foco nos meus objetivos"
                  />
                </div>
              </div>
            )}

            {/* CELULAR - Pergunta 2 */}
            {currentContent === "phone_question2" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual é o principal uso do seu celular?
                  </h2>
                  <p className="text-gray-600">
                    Isso nos ajuda a entender melhor seu padrão de uso
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="redes_sociais"
                    currentValue={formData.phone_main_use}
                    onChange={(value) => setFormData({ ...formData, phone_main_use: value })}
                    label="📱 Redes sociais"
                  />
                  <MultipleChoiceButton
                    value="videos"
                    currentValue={formData.phone_main_use}
                    onChange={(value) => setFormData({ ...formData, phone_main_use: value })}
                    label="🎥 Assistir vídeos (YouTube, TikTok, etc)"
                  />
                  <MultipleChoiceButton
                    value="jogos"
                    currentValue={formData.phone_main_use}
                    onChange={(value) => setFormData({ ...formData, phone_main_use: value })}
                    label="🎮 Jogos"
                  />
                  <MultipleChoiceButton
                    value="trabalho"
                    currentValue={formData.phone_main_use}
                    onChange={(value) => setFormData({ ...formData, phone_main_use: value })}
                    label="💼 Trabalho/Estudos"
                  />
                </div>
              </div>
            )}

            {/* JOGOS - Quantidade */}
            {currentContent === "gaming_quantity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Jogos - Tempo Atual
                  </h2>
                  <p className="text-gray-600">
                    Nos ajude a entender seu tempo jogando
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gaming" className="text-base font-semibold">
                    Quantas horas por dia você joga?
                  </Label>
                  <Input
                    id="gaming"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.gaming_hours_per_day}
                    onChange={(e) =>
                      setFormData({ ...formData, gaming_hours_per_day: parseFloat(e.target.value) || 0 })
                    }
                    className="text-lg p-6"
                    placeholder="Ex: 4"
                  />
                </div>

                {formData.gaming_hours_per_day > 0 && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-gray-700">
                      🎮 Você passa aproximadamente{" "}
                      <span className="font-bold text-green-600">
                        {(formData.gaming_hours_per_day * 30).toFixed(0)} horas por mês
                      </span>{" "}
                      jogando
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Isso equivale a {(formData.gaming_hours_per_day * 365 / 24).toFixed(0)} dias por ano!
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* JOGOS - Pergunta 1 */}
            {currentContent === "gaming_question1" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Qual é sua principal motivação para reduzir?
                  </h2>
                  <p className="text-gray-600">
                    Entender sua motivação nos ajuda a personalizar sua experiência
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="produtividade"
                    currentValue={formData.gaming_motivation}
                    onChange={(value) => setFormData({ ...formData, gaming_motivation: value })}
                    label="⚡ Ser mais produtivo"
                  />
                  <MultipleChoiceButton
                    value="saude"
                    currentValue={formData.gaming_motivation}
                    onChange={(value) => setFormData({ ...formData, gaming_motivation: value })}
                    label="💚 Cuidar melhor da minha saúde"
                  />
                  <MultipleChoiceButton
                    value="familia"
                    currentValue={formData.gaming_motivation}
                    onChange={(value) => setFormData({ ...formData, gaming_motivation: value })}
                    label="👨‍👩‍👧‍👦 Passar mais tempo com família"
                  />
                  <MultipleChoiceButton
                    value="objetivos"
                    currentValue={formData.gaming_motivation}
                    onChange={(value) => setFormData({ ...formData, gaming_motivation: value })}
                    label="🎯 Focar em meus objetivos pessoais"
                  />
                </div>
              </div>
            )}

            {/* JOGOS - Pergunta 2 */}
            {currentContent === "gaming_question2" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Que tipo de jogos você mais joga?
                  </h2>
                  <p className="text-gray-600">
                    Isso nos ajuda a entender melhor seu perfil
                  </p>
                </div>

                <div className="space-y-3">
                  <MultipleChoiceButton
                    value="competitivos"
                    currentValue={formData.gaming_type}
                    onChange={(value) => setFormData({ ...formData, gaming_type: value })}
                    label="🏆 Jogos competitivos (LoL, CS, Valorant, etc)"
                  />
                  <MultipleChoiceButton
                    value="casuais"
                    currentValue={formData.gaming_type}
                    onChange={(value) => setFormData({ ...formData, gaming_type: value })}
                    label="🎮 Jogos casuais"
                  />
                  <MultipleChoiceButton
                    value="mobile"
                    currentValue={formData.gaming_type}
                    onChange={(value) => setFormData({ ...formData, gaming_type: value })}
                    label="📱 Jogos mobile"
                  />
                  <MultipleChoiceButton
                    value="rpg_aventura"
                    currentValue={formData.gaming_type}
                    onChange={(value) => setFormData({ ...formData, gaming_type: value })}
                    label="⚔️ RPG/Aventura"
                  />
                </div>
              </div>
            )}

            {/* RESUMO FINAL - Nova Aba Separada com Cards Menores */}
            {currentContent === "summary" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    📊 Seu Impacto Anual
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Veja quanto você está gastando com seus hábitos
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Resumo Financeiro - Compacto */}
                  {monthlySavings > 0 && (
                    <Card className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          💰 Dinheiro Gasto
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Por Mês:</p>
                          <div className="text-2xl font-bold text-emerald-600">
                            R$ {monthlySavings.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Por Ano:</p>
                          <div className="text-2xl font-bold text-emerald-700">
                            R$ {(monthlySavings * 12).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Detalhes:</p>
                        <div className="space-y-1 text-xs text-gray-600">
                          {formData.selected_vices.includes("cigarette") && (
                            <div className="flex justify-between items-center p-1.5 bg-red-50 rounded">
                              <span>🚬 Cigarros</span>
                              <span className="font-semibold">R$ {((formData.cigarettes_per_day * 30 / 20) * formData.cigarette_price).toFixed(2)}/mês</span>
                            </div>
                          )}
                          {formData.selected_vices.includes("drink") && (
                            <div className="flex justify-between items-center p-1.5 bg-purple-50 rounded">
                              <span>🍷 Bebidas</span>
                              <span className="font-semibold">R$ {(formData.drinks_per_week * 4 * formData.drink_price).toFixed(2)}/mês</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Resumo de Tempo - Compacto */}
                  {monthlyTimeWasted > 0 && (
                    <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          ⏰ Tempo Gasto
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Por Mês:</p>
                          <div className="text-2xl font-bold text-blue-600">
                            {monthlyTimeWasted.toFixed(0)}h
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                            ({(monthlyTimeWasted / 24).toFixed(1)} dias)
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Por Ano:</p>
                          <div className="text-2xl font-bold text-blue-700">
                            {yearlyTimeWasted.toFixed(0)}h
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                            ({(yearlyTimeWasted / 24).toFixed(1)} dias)
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Detalhes:</p>
                        <div className="space-y-1 text-xs text-gray-600">
                          {formData.selected_vices.includes("phone") && (
                            <div className="flex justify-between items-center p-1.5 bg-blue-50 rounded">
                              <span>📱 Celular</span>
                              <span className="font-semibold">{(formData.phone_hours_per_day * 30).toFixed(0)} horas/mês</span>
                            </div>
                          )}
                          {formData.selected_vices.includes("gaming") && (
                            <div className="flex justify-between items-center p-1.5 bg-green-50 rounded">
                              <span>🎮 Jogos</span>
                              <span className="font-semibold">{(formData.gaming_hours_per_day * 30).toFixed(0)} horas/mês</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Mensagem Personalizada - Compacta */}
                  {(monthlySavings > 0 || monthlyTimeWasted > 0) && (
                    <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-orange-500 p-2 rounded-lg flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {getPersonalizedMessage()}
                          </h3>
                          {getPersonalizedSuggestions().length > 0 && (
                            <div className="space-y-1 mt-2">
                              {getPersonalizedSuggestions().map((suggestion, index) => (
                                <p key={index} className="text-xs text-gray-700">
                                  {suggestion}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 py-6 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 1 && formData.selected_vices.length === 0}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {config ? "Atualizar Configuração" : "Salvar Configuração"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* CTA para Registro Diário */}
          {config && (
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Pronto para começar?</h3>
                  <p className="text-gray-600 text-sm">
                    Agora que configurou seu plano, comece a registrar seu progresso diário!
                  </p>
                </div>
                <Link href="/registro-diario">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ir para Registro
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
