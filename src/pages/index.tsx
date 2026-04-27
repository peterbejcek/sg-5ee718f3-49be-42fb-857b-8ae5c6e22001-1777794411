import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import { Phone, Calendar, Clock, Wine, Plane, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <SEO
        title="E-TAXI Košice - Rýchla a spoľahlivá taxislužba 24/7"
        description="Profesionálna taxislužba v Košiciach. Moderný vozový park, letisková preprava, Drink Taxi. Zavolajte +421 911 606 206"
        image="/og-image.png"
      />
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 sm:py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg3.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                  E-TAXI Košice –<br />
                  <span className="text-yellow-400">rýchlo</span>, spoľahlivo,<br />
                  <span className="text-yellow-400">pohodlne</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8">
                  Zavolajte na <strong className="font-bold">+421 911 606 206</strong> a auto bude pri vás do 10 minút. Letiská, dlhé trasy, firemné transfery – vždy načas.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#objednavka">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold shadow-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Objednať teraz
                  </Button>
                </a>
                <a href="tel:+421911606206">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary font-display font-semibold shadow-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="tabular-nums">+421 911 606 206</span>
                  </Button>
                </a>
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
                  Objednať teraz
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