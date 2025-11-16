"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Cigarette,
  Smartphone,
  Wine,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Clock,
  Save,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/components/custom/auth-provider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DailyRecord {
  id: string;
  record_date: string;
  cigarettes: number;
  phone_time: number;
  drinks: number;
  money_spent: number;
}

interface InitialConfig {
  cigarettes_per_day: number;
  cigarette_pack_price: number;
  drinks_per_week: number;
  drink_price: number;
  phone_hours_per_day: number;
}

export default function RegistroDiario() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [pendingDays, setPendingDays] = useState<string[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [initialConfig, setInitialConfig] = useState<InitialConfig | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    cigarettes: 0,
    phoneTime: 0,
    drinks: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, loading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Carregar configuração inicial
      const { data: config } = await supabase
        .from("initial_config")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (config) {
        setInitialConfig(config);
      }

      // Carregar registros existentes
      const { data: existingRecords } = await supabase
        .from("daily_records")
        .select("*")
        .eq("user_id", user.id)
        .order("record_date", { ascending: false })
        .limit(5);

      if (existingRecords) {
        setRecords(existingRecords);
      }

      // Verificar dias pendentes
      await checkPendingDays();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const checkPendingDays = async () => {
    if (!user) return;

    try {
      const { data: lastRecord } = await supabase
        .from("daily_records")
        .select("record_date")
        .eq("user_id", user.id)
        .order("record_date", { ascending: false })
        .limit(1);

      const today = new Date();
      const pending: string[] = [];

      if (!lastRecord || lastRecord.length === 0) {
        // Nenhum registro ainda - adicionar apenas hoje
        pending.push(today.toISOString().split("T")[0]);
      } else {
        const lastDate = new Date(lastRecord[0].record_date + "T00:00:00");
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Adicionar dias pendentes
        for (let i = diffDays; i > 0; i--) {
          const pendingDate = new Date(today);
          pendingDate.setDate(today.getDate() - i);
          pending.push(pendingDate.toISOString().split("T")[0]);
        }

        // Adicionar hoje se ainda não registrou
        const todayStr = today.toISOString().split("T")[0];
        const { data: todayRecord } = await supabase
          .from("daily_records")
          .select("id")
          .eq("user_id", user.id)
          .eq("record_date", todayStr)
          .single();

        if (!todayRecord) {
          pending.push(todayStr);
        }
      }

      setPendingDays(pending);
    } catch (error) {
      console.error("Erro ao verificar dias pendentes:", error);
    }
  };

  const calculateMoneySpent = (cigarettes: number, drinks: number): number => {
    if (!initialConfig) return 0;

    const cigaretteCost = (cigarettes / 20) * initialConfig.cigarette_pack_price;
    const drinkCost = drinks * initialConfig.drink_price;

    return cigaretteCost + drinkCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || pendingDays.length === 0) return;

    setSaving(true);

    try {
      const currentDate = pendingDays[currentDayIndex];
      const moneySpent = calculateMoneySpent(formData.cigarettes, formData.drinks);

      const { error } = await supabase.from("daily_records").upsert({
        user_id: user.id,
        record_date: currentDate,
        cigarettes: formData.cigarettes,
        phone_time: formData.phoneTime,
        drinks: formData.drinks,
        money_spent: moneySpent,
      });

      if (error) throw error;

      // Limpar formulário
      setFormData({
        cigarettes: 0,
        phoneTime: 0,
        drinks: 0,
      });

      // Se é o último dia pendente
      if (currentDayIndex === pendingDays.length - 1) {
        await loadUserData(); // Recarregar dados
      } else {
        // Ir para o próximo dia pendente
        setCurrentDayIndex(currentDayIndex + 1);
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      alert("Erro ao salvar registro. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = () => {
    if (!initialConfig || records.length === 0) return null;

    const lastRecord = records[0];

    const cigaretteProgress =
      initialConfig.cigarettes_per_day > 0
        ? ((initialConfig.cigarettes_per_day - lastRecord.cigarettes) /
            initialConfig.cigarettes_per_day) *
          100
        : 0;

    const phoneProgress =
      initialConfig.phone_hours_per_day > 0
        ? ((initialConfig.phone_hours_per_day - lastRecord.phone_time) /
            initialConfig.phone_hours_per_day) *
          100
        : 0;

    return {
      cigaretteProgress: Math.max(0, Math.min(100, cigaretteProgress)),
      phoneProgress: Math.max(0, Math.min(100, phoneProgress)),
    };
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
              Para acessar o registro diário, você precisa estar logado.
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

  const progress = calculateProgress();

  if (pendingDays.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo em Dia! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Você está em dia com seus registros. Continue assim!
            </p>
            <p className="text-gray-500">
              Volte amanhã às 20:00 para fazer seu próximo registro diário.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentDate = pendingDays[currentDayIndex];
  const isToday = currentDate === new Date().toISOString().split("T")[0];
  const moneySpent = calculateMoneySpent(formData.cigarettes, formData.drinks);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {pendingDays.length} {pendingDays.length === 1 ? "dia pendente" : "dias pendentes"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Registro Diário
            </h1>
            <p className="text-xl text-gray-600">
              {isToday ? "Como foi seu dia hoje?" : "Vamos recuperar os registros pendentes"}
            </p>
          </div>

          {/* Progress Indicator */}
          {pendingDays.length > 1 && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Progresso de Recuperação
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {currentDayIndex + 1} de {pendingDays.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentDayIndex + 1) / pendingDays.length) * 100}%` }}
                />
              </div>
            </Card>
          )}

          {/* Form Card */}
          <Card className="p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formatDate(currentDate)}</h2>
                <p className="text-sm text-gray-600">{isToday ? "Hoje" : "Registro pendente"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cigarros */}
              <div className="space-y-2">
                <Label htmlFor="cigarettes" className="flex items-center gap-2 text-base font-semibold">
                  <Cigarette className="w-5 h-5 text-red-600" />
                  Quantos cigarros você fumou?
                </Label>
                {initialConfig && (
                  <p className="text-sm text-gray-500">
                    Antes você fumava {initialConfig.cigarettes_per_day} por dia
                  </p>
                )}
                <Input
                  id="cigarettes"
                  type="number"
                  min="0"
                  value={formData.cigarettes}
                  onChange={(e) =>
                    setFormData({ ...formData, cigarettes: parseInt(e.target.value) || 0 })
                  }
                  className="text-lg p-6"
                  placeholder="0"
                  required
                />
              </div>

              {/* Tempo no Celular */}
              <div className="space-y-2">
                <Label htmlFor="phoneTime" className="flex items-center gap-2 text-base font-semibold">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  Quantas horas no celular/jogos?
                </Label>
                {initialConfig && (
                  <p className="text-sm text-gray-500">
                    Antes você passava {initialConfig.phone_hours_per_day}h por dia
                  </p>
                )}
                <Input
                  id="phoneTime"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.phoneTime}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneTime: parseFloat(e.target.value) || 0 })
                  }
                  className="text-lg p-6"
                  placeholder="0"
                  required
                />
              </div>

              {/* Bebidas */}
              <div className="space-y-2">
                <Label htmlFor="drinks" className="flex items-center gap-2 text-base font-semibold">
                  <Wine className="w-5 h-5 text-purple-600" />
                  Quantas bebidas alcoólicas?
                </Label>
                {initialConfig && (
                  <p className="text-sm text-gray-500">
                    Antes você bebia {initialConfig.drinks_per_week} por semana
                  </p>
                )}
                <Input
                  id="drinks"
                  type="number"
                  min="0"
                  value={formData.drinks}
                  onChange={(e) =>
                    setFormData({ ...formData, drinks: parseInt(e.target.value) || 0 })
                  }
                  className="text-lg p-6"
                  placeholder="0"
                  required
                />
              </div>

              {/* Cálculo Automático de Gastos */}
              {initialConfig && (formData.cigarettes > 0 || formData.drinks > 0) && (
                <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                    💰 Gasto Calculado Automaticamente
                  </h3>
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    R$ {moneySpent.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {formData.cigarettes > 0 && (
                      <p>
                        • Cigarros: R${" "}
                        {((formData.cigarettes / 20) * initialConfig.cigarette_pack_price).toFixed(2)}
                      </p>
                    )}
                    {formData.drinks > 0 && (
                      <p>• Bebidas: R$ {(formData.drinks * initialConfig.drink_price).toFixed(2)}</p>
                    )}
                  </div>
                </Card>
              )}

              {/* Progress Preview */}
              {progress && (
                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    Seu Progresso
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Redução de Cigarros</span>
                        <span className="font-bold text-emerald-600">
                          {progress.cigaretteProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                          style={{ width: `${progress.cigaretteProgress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Redução de Tempo no Celular</span>
                        <span className="font-bold text-emerald-600">
                          {progress.phoneProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                          style={{ width: `${progress.phoneProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {pendingDays.length > 1 && currentDayIndex < pendingDays.length - 1
                      ? "Salvar e Próximo Dia"
                      : "Salvar Registro"}
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Recent Records */}
          {records.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Registros Recentes</h3>
              <div className="space-y-3">
                {records.map((record) => (
                  <Card key={record.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatDate(record.record_date)}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Cigarette className="w-4 h-4" />
                            {record.cigarettes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {record.phone_time}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Wine className="w-4 h-4" />
                            {record.drinks}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-amber-600">
                            💰 R$ {record.money_spent.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
