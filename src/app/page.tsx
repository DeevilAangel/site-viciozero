"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Cigarette, 
  Smartphone, 
  Wine, 
  Gamepad2,
  Star,
  ArrowRight,
  Shield,
  Clock,
  Award
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const addictions = [
    { icon: Cigarette, name: "Cigarro", color: "from-red-500 to-orange-500" },
    { icon: Smartphone, name: "Celular", color: "from-blue-500 to-cyan-500" },
    { icon: Wine, name: "Álcool", color: "from-purple-500 to-pink-500" },
    { icon: Gamepad2, name: "Jogos", color: "from-green-500 to-emerald-500" },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Planos Personalizados",
      description: "Estratégias adaptadas ao seu perfil e tipo de vício para resultados reais."
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento Diário",
      description: "Ferramentas para monitorar seu progresso e manter a motivação alta."
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com pessoas que entendem sua jornada e celebram suas vitórias."
    },
    {
      icon: Shield,
      title: "Suporte Profissional",
      description: "Conteúdo validado por especialistas em dependência e saúde mental."
    },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      addiction: "Cigarro - 15 anos",
      days: 127,
      text: "Depois de 15 anos fumando, finalmente consegui parar. O suporte da comunidade foi essencial!",
      avatar: "CS"
    },
    {
      name: "Ana Rodrigues",
      addiction: "Celular - 8h/dia",
      days: 89,
      text: "Recuperei minha vida! Agora tenho tempo para família, hobbies e sinto que vivo de verdade.",
      avatar: "AR"
    },
    {
      name: "Pedro Santos",
      addiction: "Álcool - 10 anos",
      days: 365,
      text: "1 ano limpo! O VícioZero me deu as ferramentas e o apoio que eu precisava. Gratidão eterna!",
      avatar: "PS"
    },
  ];

  const stats = [
    { number: "10.000+", label: "Vidas Transformadas" },
    { number: "85%", label: "Taxa de Sucesso" },
    { number: "24/7", label: "Suporte Disponível" },
    { number: "50+", label: "Ferramentas Práticas" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-top duration-500">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-semibold">Mais de 10.000 pessoas já transformaram suas vidas</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom duration-700">
              Supere Seus Vícios.{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Transforme Sua Vida.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              Plataforma completa com planos personalizados, ferramentas práticas e uma comunidade que te apoia em cada passo da sua jornada de libertação.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <Link href="/quiz">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Começar Minha Jornada
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              >
                Ver Como Funciona
              </Button>
            </div>

            {/* Vícios Suportados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              {addictions.map((addiction, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-emerald-200">
                  <div className={`bg-gradient-to-br ${addiction.color} p-3 rounded-xl w-fit mx-auto mb-3`}>
                    <addiction.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-800">{addiction.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-emerald-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por Que Escolher o VícioZero?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma abordagem completa e comprovada para te ajudar a vencer seus vícios de uma vez por todas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-emerald-200">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl w-fit mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Histórias de Sucesso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pessoas reais que transformaram suas vidas com o VícioZero.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.addiction}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-600">{testimonial.days} dias limpo</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Três passos simples para começar sua transformação hoje mesmo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Crie Seu Plano",
                description: "Responda um questionário rápido e receba um plano personalizado para o seu tipo de vício.",
                icon: Target
              },
              {
                step: "2",
                title: "Use as Ferramentas",
                description: "Acesse calculadoras, trackers e recursos práticos para acompanhar seu progresso diariamente.",
                icon: TrendingUp
              },
              {
                step: "3",
                title: "Conecte-se",
                description: "Participe da comunidade, compartilhe experiências e receba apoio de quem entende sua jornada.",
                icon: Users
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-4 rounded-xl w-fit mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Mudar Sua Vida?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a milhares de pessoas que já deram o primeiro passo rumo à liberdade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Falar com Especialista
            </Button>
          </div>
          <p className="text-emerald-100 mt-6 text-sm">
            ✓ Sem cartão de crédito necessário  ✓ Cancelamento a qualquer momento  ✓ 100% confidencial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
