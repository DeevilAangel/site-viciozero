"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Target, 
  Calendar, 
  TrendingUp, 
  Users,
  Cigarette,
  Smartphone,
  Wine,
  Gamepad2,
  ArrowRight,
  Clock,
  Award,
  BookOpen
} from "lucide-react";
import { useState } from "react";

export default function PlanosPage() {
  const [selectedAddiction, setSelectedAddiction] = useState<string | null>(null);

  const addictions = [
    { 
      id: "cigarro", 
      icon: Cigarette, 
      name: "Cigarro", 
      color: "from-red-500 to-orange-500",
      duration: "21-90 dias"
    },
    { 
      id: "celular", 
      icon: Smartphone, 
      name: "Celular", 
      color: "from-blue-500 to-cyan-500",
      duration: "30-60 dias"
    },
    { 
      id: "alcool", 
      icon: Wine, 
      name: "Álcool", 
      color: "from-purple-500 to-pink-500",
      duration: "90-180 dias"
    },
    { 
      id: "jogos", 
      icon: Gamepad2, 
      name: "Jogos", 
      color: "from-green-500 to-emerald-500",
      duration: "30-90 dias"
    },
  ];

  const plans = {
    cigarro: {
      phases: [
        {
          title: "Fase 1: Preparação (Dias 1-7)",
          goals: [
            "Identificar gatilhos e situações de risco",
            "Definir data para parar completamente",
            "Informar amigos e família sobre sua decisão",
            "Remover cigarros e isqueiros de casa e carro"
          ]
        },
        {
          title: "Fase 2: Desintoxicação (Dias 8-21)",
          goals: [
            "Parar completamente de fumar",
            "Gerenciar sintomas de abstinência com técnicas de respiração",
            "Substituir o hábito por atividades saudáveis",
            "Usar adesivos ou gomas de nicotina se necessário"
          ]
        },
        {
          title: "Fase 3: Consolidação (Dias 22-90)",
          goals: [
            "Manter-se firme em situações sociais",
            "Celebrar marcos importantes (30, 60, 90 dias)",
            "Desenvolver novos hobbies e rotinas",
            "Participar ativamente da comunidade de apoio"
          ]
        }
      ],
      tips: [
        "Beba muita água para eliminar toxinas",
        "Pratique exercícios físicos diariamente",
        "Evite álcool nas primeiras semanas",
        "Mantenha as mãos ocupadas com objetos anti-stress"
      ]
    },
    celular: {
      phases: [
        {
          title: "Fase 1: Consciência (Dias 1-7)",
          goals: [
            "Instalar app de monitoramento de tempo de tela",
            "Identificar apps que mais consomem seu tempo",
            "Definir metas realistas de redução",
            "Criar zonas livres de celular (quarto, refeições)"
          ]
        },
        {
          title: "Fase 2: Redução Gradual (Dias 8-30)",
          goals: [
            "Reduzir tempo de tela em 25% por semana",
            "Desativar notificações não essenciais",
            "Estabelecer horários específicos para redes sociais",
            "Substituir tempo de tela por atividades offline"
          ]
        },
        {
          title: "Fase 3: Novo Estilo (Dias 31-60)",
          goals: [
            "Manter uso saudável (máx 2h/dia)",
            "Usar modo escala de cinza para reduzir atração",
            "Praticar mindfulness e estar presente",
            "Ajudar outros com sua experiência"
          ]
        }
      ],
      tips: [
        "Deixe o celular em outro cômodo ao dormir",
        "Use despertador físico, não o celular",
        "Leia livros físicos em vez de scrollar",
        "Pratique o 'detox digital' aos finais de semana"
      ]
    },
    alcool: {
      phases: [
        {
          title: "Fase 1: Decisão e Preparação (Dias 1-14)",
          goals: [
            "Consultar médico para avaliação e orientação",
            "Remover todo álcool de casa",
            "Informar pessoas próximas sobre sua decisão",
            "Identificar gatilhos e situações de risco"
          ]
        },
        {
          title: "Fase 2: Desintoxicação (Dias 15-90)",
          goals: [
            "Abster-se completamente de álcool",
            "Gerenciar sintomas de abstinência com suporte médico",
            "Participar de grupos de apoio (AA ou similares)",
            "Desenvolver estratégias de enfrentamento"
          ]
        },
        {
          title: "Fase 3: Recuperação Contínua (Dias 91-180)",
          goals: [
            "Manter sobriedade e prevenir recaídas",
            "Reconstruir relacionamentos e confiança",
            "Estabelecer nova identidade sem álcool",
            "Ajudar outros em recuperação"
          ]
        }
      ],
      tips: [
        "Evite lugares e pessoas associados ao consumo",
        "Tenha sempre bebidas não alcoólicas disponíveis",
        "Pratique técnicas de relaxamento e meditação",
        "Busque terapia profissional se necessário"
      ]
    },
    jogos: {
      phases: [
        {
          title: "Fase 1: Reconhecimento (Dias 1-7)",
          goals: [
            "Registrar tempo gasto em jogos diariamente",
            "Identificar impactos negativos na vida",
            "Definir limites claros de tempo",
            "Comunicar decisão a amigos online"
          ]
        },
        {
          title: "Fase 2: Redução Controlada (Dias 8-30)",
          goals: [
            "Reduzir tempo de jogo em 50%",
            "Desinstalar jogos mais viciantes",
            "Estabelecer horários específicos para jogar",
            "Encontrar hobbies alternativos"
          ]
        },
        {
          title: "Fase 3: Equilíbrio (Dias 31-90)",
          goals: [
            "Manter uso recreativo saudável (máx 1h/dia)",
            "Priorizar responsabilidades e relacionamentos",
            "Jogar apenas jogos casuais, não competitivos",
            "Compartilhar progresso com a comunidade"
          ]
        }
      ],
      tips: [
        "Use timer para controlar tempo de jogo",
        "Pratique esportes ou atividades físicas",
        "Reconecte-se com amigos e família presencialmente",
        "Estabeleça metas de vida fora dos jogos"
      ]
    }
  };

  const selectedPlan = selectedAddiction ? plans[selectedAddiction as keyof typeof plans] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              Planos Personalizados
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Seu Caminho Para a{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Liberdade
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planos estruturados em fases com metas claras, adaptados ao seu tipo de vício e ritmo pessoal.
            </p>
          </div>

          {/* Seleção de Vício */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Selecione Seu Vício
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {addictions.map((addiction) => (
                <Card
                  key={addiction.id}
                  onClick={() => setSelectedAddiction(addiction.id)}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedAddiction === addiction.id
                      ? "border-4 border-emerald-500 shadow-xl"
                      : "border-2 hover:border-emerald-200"
                  }`}
                >
                  <div className={`bg-gradient-to-br ${addiction.color} p-3 rounded-xl w-fit mx-auto mb-3`}>
                    <addiction.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 text-center">{addiction.name}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{addiction.duration}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Plano Detalhado */}
          {selectedPlan && (
            <div className="animate-in fade-in slide-in-from-bottom duration-500">
              {/* Fases do Plano */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Fases do Seu Plano
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {selectedPlan.phases.map((phase, index) => (
                    <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{phase.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {phase.goals.map((goal, goalIndex) => (
                          <li key={goalIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Dicas Práticas */}
              <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Dicas Práticas</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedPlan.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                      <div className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* CTA */}
              <div className="mt-12 text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Começar Este Plano Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-gray-600 mt-4">
                  Junte-se a milhares de pessoas que já iniciaram sua jornada
                </p>
              </div>
            </div>
          )}

          {/* Recursos Inclusos */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              O Que Está Incluído
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Target,
                  title: "Metas Diárias",
                  description: "Objetivos claros para cada dia da sua jornada"
                },
                {
                  icon: Calendar,
                  title: "Tracker de Progresso",
                  description: "Acompanhe visualmente sua evolução"
                },
                {
                  icon: Users,
                  title: "Grupo de Apoio",
                  description: "Comunidade exclusiva do seu tipo de vício"
                },
                {
                  icon: Award,
                  title: "Certificados",
                  description: "Conquistas e badges por marcos alcançados"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl w-fit mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
