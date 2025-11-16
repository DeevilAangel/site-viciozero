"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { BookOpen, Clock } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "5 Técnicas Comprovadas Para Controlar a Vontade de Fumar",
      excerpt: "Descubra estratégias práticas e cientificamente validadas para superar os momentos de crise.",
      category: "Cigarro",
      readTime: "5 min",
      image: "from-red-500 to-orange-500"
    },
    {
      title: "Como o Uso Excessivo do Celular Afeta Seu Cérebro",
      excerpt: "Entenda os impactos neurológicos do vício digital e como reverter os danos.",
      category: "Celular",
      readTime: "7 min",
      image: "from-blue-500 to-cyan-500"
    },
    {
      title: "Recuperação do Alcoolismo: O Que Esperar nos Primeiros 30 Dias",
      excerpt: "Um guia completo sobre as mudanças físicas e mentais durante o primeiro mês sóbrio.",
      category: "Álcool",
      readTime: "10 min",
      image: "from-purple-500 to-pink-500"
    },
    {
      title: "Vício em Jogos: Sinais de Alerta e Como Buscar Ajuda",
      excerpt: "Identifique os sintomas do vício em jogos e conheça os primeiros passos para a recuperação.",
      category: "Jogos",
      readTime: "6 min",
      image: "from-green-500 to-emerald-500"
    },
    {
      title: "A Ciência Por Trás da Formação de Hábitos",
      excerpt: "Como nosso cérebro cria vícios e como podemos usar esse conhecimento a nosso favor.",
      category: "Geral",
      readTime: "8 min",
      image: "from-indigo-500 to-purple-500"
    },
    {
      title: "Histórias Reais: 1 Ano Sem Vícios",
      excerpt: "Depoimentos inspiradores de pessoas que completaram um ano de recuperação.",
      category: "Inspiração",
      readTime: "12 min",
      image: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Blog{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                VícioZero
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conteúdo validado por especialistas para te ajudar em cada etapa da sua jornada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${post.image} flex items-center justify-center`}>
                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-emerald-600">{post.category}</span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
