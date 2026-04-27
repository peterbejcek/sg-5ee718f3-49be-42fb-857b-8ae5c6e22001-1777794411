import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";
import { FleetSection } from "@/components/FleetSection";
import { Footer } from "@/components/Footer";
import {
  Phone,
  Clock,
  Shield,
  CreditCard,
  Plane,
  Calendar,
  Wine,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO
        title="E-TAXI Košice – Rýchla a spoľahlivá preprava"
        description="Profesionálna taxislužba v Košiciach. Objednajte si taxík online alebo zavolajte +421 911 606 206. Moderný vozový park, klimatizácia, WiFi."
      />
      <Header />
      <main className="pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 sm:py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg3.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                  Rýchla a spoľahlivá preprava v Košiciach
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8">
                  Profesionálna taxislužba dostupná 24/7. Moderný vozový park,
                  skúsení vodiči, konkurenčné ceny.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 lg:hidden">
                  <a href="tel:+421911606206" className="flex-1">
                    <button className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-lg rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Phone className="w-5 h-5" />
                      Zavolať teraz
                    </button>
                  </a>
                </div>
              </div>

              <div className="lg:block">
                <BookingForm />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                Naše služby
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Komplexné taxislužby pre každú príležitosť
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  Okamžitá preprava
                </h3>
                <p className="text-muted-foreground">
                  Zavolajte a taxík je u vás do 5-10 minút. Rýchla a spoľahlivá
                  služba kedykoľvek potrebujete.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  Časové objednávky
                </h3>
                <p className="text-muted-foreground">
                  Objednajte si taxík vopred bez príplatku. Garantovaná preprava
                  presne podľa vášho plánu.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wine className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  Drink Taxi
                </h3>
                <p className="text-muted-foreground">
                  Bezpečný odvoz po večierku. Váš osobný vodič vás bezpečne
                  dovezie domov.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  Letisková preprava
                </h3>
                <p className="text-muted-foreground mb-3">
                  Pohodlný transfer na letisko a späť. Preprava do viacerých
                  destinácií:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Budapest",
                    "Krakov",
                    "Debrecín",
                    "Bratislava",
                    "Viedeň",
                    "Katowice",
                  ].map((city) => (
                    <span
                      key={city}
                      className="text-xs px-2 py-1 bg-muted rounded-md"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  Platba kartou
                </h3>
                <p className="text-muted-foreground">
                  Platba kartou dostupná v každom aute. Žiadne poplatky, žiadne
                  starosti s hotovosťou.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FleetSection />
      </main>
      <Footer />
    </>
  );
}