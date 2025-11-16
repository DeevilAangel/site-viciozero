"use client";

import { Navbar } from "@/components/custom/navbar";
import { Footer } from "@/components/custom/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Entre em{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Contato
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais breve possível.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie sua mensagem</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo
                      </label>
                      <Input placeholder="Seu nome" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <Input placeholder="Como podemos ajudar?" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <Textarea 
                      placeholder="Conte-nos mais sobre sua situação..."
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <Mail className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
                <p className="text-gray-600">contato@viciozero.com</p>
              </Card>

              <Card className="p-6">
                <Phone className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600">0800 123 4567</p>
                <p className="text-sm text-gray-500 mt-1">Seg-Sex, 8h-20h</p>
              </Card>

              <Card className="p-6">
                <MapPin className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Endereço</h3>
                <p className="text-gray-600">
                  Rua da Esperança, 123<br />
                  São Paulo - SP<br />
                  CEP 01234-567
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
