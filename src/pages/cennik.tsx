import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Banknote, Clock, MapPin, Plane, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Cennik() {
  const baseRates = [
    { label: "Základná sadzba (1. km)", price: "3,50 €", icon: MapPin },
    { label: "Každý ďalší km", price: "1,20 €", icon: MapPin },
    { label: "Čakanie (za minútu)", price: "0,30 €", icon: Clock },
    { label: "Minimálna cena jazdy", price: "5,00 €", icon: Banknote }
  ];

  const specialRates = [
    {
      title: "Letisko Košice",
      routes: [
        { from: "Košice centrum", price: "15 - 20 €" },
        { from: "Prešov", price: "25 - 30 €" },
        { from: "Michalovce", price: "45 - 50 €" }
      ]
    },
    {
      title: "Medzimestské trasy",
      routes: [
        { from: "Košice - Prešov", price: "30 - 35 €" },
        { from: "Košice - Spišská Nová Ves", price: "40 - 45 €" },
        { from: "Košice - Michalovce", price: "50 - 55 €" }
      ]
    }
  ];

  const surcharges = [
    { label: "Nočný poplatok (22:00 - 06:00)", amount: "+ 20%" },
    { label: "Víkendy a sviatky", amount: "+ 15%" },
    { label: "Nadrozmerná batožina", amount: "+ 3 €" },
    { label: "Detská sedačka", amount: "Zdarma" },
    { label: "Platba kartou", amount: "Zdarma" }
  ];

  return (
    <>
      <SEO
        title="Cenník - E-TAXI Košice"
        description="Aktuálny cenník taxislužby E-TAXI Košice. Základné sadzby, letiská, medzimestské trasy a príplatky."
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Banknote className="w-10 h-10 text-primary" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl">
                Cenník
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12">
              Transparentné ceny bez skrytých poplatkov. Všetky ceny zahŕňajú DPH.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {baseRates.map((rate, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <rate.icon className="w-6 h-6 text-primary" />
                      <span className="font-medium">{rate.label}</span>
                    </div>
                    <span className="font-display font-bold text-2xl text-primary tabular-nums">
                      {rate.price}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {specialRates.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      {section.title === "Letisko Košice" ? (
                        <Plane className="w-5 h-5 text-primary" />
                      ) : (
                        <MapPin className="w-5 h-5 text-primary" />
                      )}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.routes.map((route, routeIdx) => (
                        <div key={routeIdx} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                          <span className="text-sm">{route.from}</span>
                          <Badge variant="secondary" className="font-display tabular-nums">
                            {route.price}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Príplatky a doplnkové služby
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {surcharges.map((surcharge, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{surcharge.label}</span>
                      <span className="font-display font-semibold text-primary tabular-nums">
                        {surcharge.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8 bg-yellow-400/10 border-yellow-400">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                  <Banknote className="w-5 h-5" />
                  Dôležité informácie
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Ceny sú orientačné a môžu sa líšiť podľa aktuálnej dopravnej situácie</li>
                  <li>• Pri dlhších trasách možnosť dohodnutia paušálnej ceny vopred</li>
                  <li>• Pre firmy vystavujeme faktúry s platbou prevodom</li>
                  <li>• Pri pravidelných jazdách ponúkame zľavové karty a mesačné paušály</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}