"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Users, MessageCircle, Award, Heart } from "lucide-react";

export default function ComunidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Comunidade{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                VícioZero
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conecte-se com pessoas que entendem sua jornada e celebram suas vitórias.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <Users className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Grupos de Apoio</h3>
              <p className="text-gray-600">
                Participe de grupos específicos para cada tipo de vício e compartilhe experiências com quem realmente entende.
              </p>
            </Card>

            <Card className="p-8">
              <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fórum de Discussão</h3>
              <p className="text-gray-600">
                Tire dúvidas, compartilhe conquistas e receba apoio de uma comunidade ativa e acolhedora.
              </p>
            </Card>

            <Card className="p-8">
              <Award className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Conquistas Compartilhadas</h3>
              <p className="text-gray-600">
                Celebre cada marco alcançado e inspire outros membros com sua história de superação.
              </p>
            </Card>

            <Card className="p-8">
              <Heart className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Suporte 24/7</h3>
              <p className="text-gray-600">
                Sempre que precisar, encontre alguém disponível para conversar e te apoiar nos momentos difíceis.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
