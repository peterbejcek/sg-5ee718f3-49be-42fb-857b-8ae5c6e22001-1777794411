import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";
import { FleetSection } from "@/components/FleetSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { AboutSection } from "@/components/AboutSection";
import { BlogSection } from "@/components/BlogSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FAQSection } from "@/components/FAQSection";
import { Phone, Calendar, Shield, Clock, Zap, CheckCircle2, Wine, Plane, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://etaxi-kosice.sk",
    "name": "E-TAXI Košice",
    "image": "https://etaxi-kosice.sk/og-image.png",
    "description": "Profesionálna taxislužba v Košiciach dostupná 24/7. Letiskové transfery, firemné objednávky, moderný vozový park.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Košice",
      "addressCountry": "SK"
    },
    "telephone": "+421911606206",
    "email": "info@etaxi-kosice.sk",
    "url": "https://etaxi-kosice.sk",
    "priceRange": "€€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.7164",
      "longitude": "21.2611"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "48.7164",
        "longitude": "21.2611"
      },
      "geoRadius": "100000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Taxislužby",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mestská taxislužba",
            "description": "Taxislužba v rámci mesta Košice"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Letiskové transfery",
            "description": "Transfer na letisko Košice, Budapešť, Krakov, Viedeň"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Firemné transfery",
            "description": "Pravidelné firemné objednávky a transfery"
          }
        }
      ]
    }
  };

  return (
    <>
      <SEO 
        title="E-TAXI Košice | Taxislužba 24/7 | Letiskové transfery Budapešť, Krakov, Viedeň"
        description="Profesionálna taxislužba v Košiciach ✓ Online objednávka ✓ Letiskové transfery ✓ Moderný vozový park ✓ Transparentné ceny ✓ Volajte: +421 911 606 206"
        keywords="taxi Košice, taxík Košice, taxislužba Košice, letiskový transfer, Košice letisko, taxi na letisko, transfer Budapešť, transfer Krakov, transfer Viedeň, online objednávka taxi, taxi 24/7"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: "url('/hero-bg3.png')",
                filter: "brightness(1.15) saturate(1.1) sepia(0.15)"
              }}
            />
            {/* Warm Golden Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/20" />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
            {/* Bottom Fade Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
          </div>
          {/* Content */}
          <div className="relative z-10 container py-20 sm:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Hero Text */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                    E-TAXI Košice<br />
                    <span className="text-yellow-400">rýchlo, </span>
                    <span className="text-white">spoľahlivo</span>
                    <span className="text-yellow-400">, pohodlne</span>
                  </h1>
                  <p className="text-xl text-white/90 max-w-2xl mx-auto lg:mx-0">
                    Zavolajte na <a href="tel:+421911606206" className="font-semibold hover:text-accent transition-colors">+421 911 606 206</a> a auto bude pri vás do 10 minút.<br />
                    Letiská, dlhé trasy, firemné transfery – vždy načas.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold text-lg px-8"
                    asChild
                  >
                    <Link href="#objednavka">
                      <Calendar className="w-5 h-5 mr-2" />
                      Objednať teraz
                    </Link>
                  </Button>
                  <Button 
                    size="lg"
                    className="bg-white hover:bg-white/90 text-primary font-display font-semibold text-lg px-8"
                    asChild
                  >
                    <a href="tel:+421911606206">
                      <Phone className="w-5 h-5 mr-2" />
                      +421 911 606 206
                    </a>
                  </Button>
                </div>

                {/* Social Proof Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm text-white/80">Dispečing</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">15 min</div>
                    <div className="text-sm text-white/80">Príchod</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">6 €</div>
                    <div className="text-sm text-white/80">Min. cena</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm text-white/80">Spoľahlivosť</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-12">
              Naše služby
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3">
                    Okamžitá preprava
                  </h3>
                  <p className="text-muted-foreground">
                    Zavolajte nám a taxík je u vás do niekoľkých minút. Dostupní 24/7.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3">
                    Časové objednávky
                  </h3>
                  <p className="text-muted-foreground">
                    Naplánujte si cestu vopred. 0€ príplatok za včasnú objednávku.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Wine className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3">
                    Drink Taxi
                  </h3>
                  <p className="text-muted-foreground">
                    Bezpečná cesta domov po oslave. Váš vodič aj váš alkohol v bezpečí.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Plane className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3">
                    Letisková preprava
                  </h3>
                  <p className="text-muted-foreground">
                    Budapest, Krakov, Debrecín, Bratislava, Viedeň, Katowice - pohodlne a za férové ceny.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <CreditCard className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3">
                    Platba kartou
                  </h3>
                  <p className="text-muted-foreground">
                    V každom našom vozidle môžete platiť kartou. Žiadne starosti s hotovosťou.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <a href="#objednavka">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Objednať jazdu teraz
                </Button>
              </a>
              <a href="tel:+421911606206">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary border-2 border-primary font-display font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Zavolať +421 911 606 206
                </Button>
              </a>
            </div>
          </div>
        </section>

        <FleetSection />

        <PricingSection />

        <AboutSection />

        <BlogSection />

        <ReviewsSection />

        <FAQSection />

        {/* Booking Form Section */}
        <section id="objednavka" className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-4">
                Objednať prepravu
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Vyplňte formulár a my sa vám ozveme. Alebo nám rovno zavolajte na{" "}
                <a href="tel:+421911606206" className="text-accent font-semibold hover:underline">
                  +421 911 606 206
                </a>
              </p>
              <BookingForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}