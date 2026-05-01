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
        url="https://etaxi-kosice.sk/cennik" />
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 mt-8">
              <Car className="w-10 h-10 text-[#282462]" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#282462]">
                {pricingData.title}
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12">Transparentné ceny bez skrytých poplatkov. Nie sme platci DPH. Konkrétnu cenu určuje aplikácia vopred.

            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Základný cenník */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-[#282462] text-white rounded-t-lg">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    Základný cenník
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {pricingData.basicPricing.map((item, index) =>
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-foreground">{item.label}</span>
                        <span className="font-semibold text-[#282462] tabular-nums">
                          {item.price}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Transfery */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-[#282462] text-white rounded-t-lg">
                  <CardTitle className="font-display flex items-center gap-2">
                    <Plane className="w-5 h-5 text-accent" />
                    Letiskové transfery
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {pricingData.transfers.map((item, index) =>
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-foreground">{item.destination}</span>
                        <span className="font-semibold text-[#282462] tabular-nums">
                          {item.price}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-400/10 border-yellow-400">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  Dôležité informácie
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Ceny sú orientačné a môžu sa líšiť podľa aktuálnej dopravnej situácie</li>
                  <li>• Pri dlhších trasách možnosť dohodnutia paušálnej ceny vopred</li>
                  <li>• Pre firmy vystavujeme faktúry s platbou prevodom</li>
                  
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>);

}