import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plane, Check } from "lucide-react";
import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";

const airportRoutes = [
  {
    destination: "Letisko Budapešť (BUD)",
    distance: "250 km",
    duration: "2.5 - 3 hodiny",
    price: "250 €",
    includes: [
      "Čakanie na letisku zadarmo",
      "Pomoc so zavazadlami",
      "Platba kartou",
      "Detské sedačky na požiadanie"
    ]
  },
  {
    destination: "Letisko Krakov (KRK)",
    distance: "280 km",
    duration: "3 - 3.5 hodiny",
    price: "290 €",
    includes: [
      "Čakanie na letisku zadarmo",
      "Pomoc so zavazadlami",
      "Platba kartou",
      "Detské sedačky na požiadanie"
    ]
  },
  {
    destination: "Letisko Viedeň (VIE)",
    distance: "400 km",
    duration: "4 - 4.5 hodiny",
    price: "450 €",
    includes: [
      "Čakanie na letisku zadarmo",
      "Pomoc so zavazadlami",
      "Platba kartou",
      "Detské sedačky na požiadanie"
    ]
  },
  {
    destination: "Letisko Debrecín (DEB)",
    distance: "180 km",
    duration: "2 hodiny",
    price: "200 €",
    includes: [
      "Čakanie na letisku zadarmo",
      "Pomoc so zavazadlami",
      "Platba kartou",
      "Detské sedačky na požiadanie"
    ]
  },
  {
    destination: "Letisko Katowice (KTW)",
    distance: "220 km",
    duration: "2.5 hodiny",
    price: "240 €",
    includes: [
      "Čakanie na letisku zadarmo",
      "Pomoc so zavazadlami",
      "Platba kartou",
      "Detské sedačky na požiadanie"
    ]
  }
];

export default function Cennik() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PriceSpecification",
    "name": "Cenník letiškových transferov E-TAXI Košice",
    "description": "Cenník transferov z Košíc na európske letiská",
    "priceCurrency": "EUR",
    "offers": airportRoutes.map(route => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": `Transfer ${route.destination}`,
        "description": `${route.distance}, ${route.duration}`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "E-TAXI Košice"
        }
      },
      "price": route.price.replace(" €", ""),
      "priceCurrency": "EUR"
    }))
  };

  return (
    <>
      <SEO 
        title="Cenník - Letiskové transfery | E-TAXI Košice"
        description="Cenník letiškových transferov z Košíc: Budapešť 250€, Krakov 290€, Viedeň 450€, Debrecín 200€, Katowice 240€. Firemné zľavy dostupné."
        url="https://etaxi-kosice.sk/cennik"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-center mb-4">
                Cenník letiškových transferov
              </h1>
              <p className="text-center text-muted-foreground text-lg mb-12">
                Transparentné ceny bez skrytých poplatkov. Cena zahŕňa čakanie na letisku, pomoc so zavazadlami a platbu kartou.
              </p>

              <div className="grid gap-6">
                {airportRoutes.map((route, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl font-display mb-2 flex items-center gap-2">
                            <Plane className="w-6 h-6 text-primary" />
                            {route.destination}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {route.distance}
                            </span>
                            <span>•</span>
                            <span>{route.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">{route.price}</div>
                          <div className="text-sm text-muted-foreground">pevná cena</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {route.includes.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted rounded-lg">
                <h2 className="font-display font-semibold text-xl mb-4">Dôležité informácie</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ceny platia pre štandardné vozidlo (1-4 osoby + batožina)</li>
                  <li>• Pre väčšie vozidlá (5-8 osôb) kontaktujte dispečing</li>
                  <li>• Firemné zľavy pre pravidelné objednávky</li>
                  <li>• Ceny sú konečné - bez skrytých poplatkov</li>
                  <li>• Platba v hotovosti alebo kartou</li>
                  <li>• Rezervácia: +421 911 606 206 alebo online formulár</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locales = ['sk', 'en', 'de', 'ru', 'uk', 'he', 'hu', 'ar'];
  
  return {
    paths: locales.map((locale) => ({
      params: { locale },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      locale: params?.locale || 'sk',
    },
  };
};