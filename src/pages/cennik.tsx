import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { pricingData } from "@/data/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Car, Info } from "lucide-react";

export default function CennikPage() {
  return (
    <>
      <SEO 
        title="Cenník taxislužby | E-TAXI Košice | Transparentné ceny"
        description="Aktuálny cenník E-TAXI Košice ✓ Mestská taxislužba od 0,80€/km ✓ Letiskové transfery Budapešť, Krakov, Viedeň ✓ Bez skrytých poplatkov ✓ Online objednávka"
        keywords="cenník taxi Košice, cena taxi Košice, cena za kilometer taxi, letiskový transfer cena, taxi Budapešť cena, taxi Krakov cena, taxi Viedeň cena, taxi z letiska Košice"
        url="https://etaxi-kosice.sk/cennik"
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Car className="w-10 h-10 text-primary" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl">
                Cenník
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12">
              Transparentné ceny bez skrytých poplatkov. Všetky ceny zahŕňajú DPH.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {pricingData.baseRates.map((rate, idx) => (
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
              {pricingData.specialRates.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      {section.title === "Letisko Košice" ? (
                        <Plane className="w-5 h-5 text-primary" />
                      ) : (
                        <Car className="w-5 h-5 text-primary" />
                      )}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.routes.map((route, routeIdx) => (
                        <div key={routeIdx} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                          <span className="text-sm">{route.from}</span>
                          <Info variant="secondary" className="font-display tabular-nums">
                            {route.price}
                          </Info>
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
                  <Info className="w-5 h-5 text-primary" />
                  Príplatky a doplnkové služby
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pricingData.surcharges.map((surcharge, idx) => (
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
                  <Car className="w-5 h-5" />
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