import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <SEO
        title="E-TAXI Košice – Rýchla a spoľahlivá preprava"
        description="Profesionálna taxislužba v Košiciach. Objednajte si taxík online alebo zavolajte +421 911 606 206. Moderný vozový park, klimatizácia, WiFi."
      />
      <Header />
      <main className="pt-16">
        <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-muted flex items-center">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
                Rýchla a spoľahlivá preprava v Košiciach
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Profesionálna taxislužba dostupná 24/7. Moderný vozový park, skúsení vodiči, konkurenčné ceny.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+421911606206" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-lg h-14"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Zavolať teraz
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-display font-semibold text-lg h-14"
                >
                  Objednať online
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">24/7 Dostupnosť</h3>
                <p className="text-muted-foreground">
                  Sme tu pre vás kedykoľvek, deň i noc
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Moderný vozový park</h3>
                <p className="text-muted-foreground">
                  Komfortné vozidlá s klimatizáciou a WiFi
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Férové ceny</h3>
                <p className="text-muted-foreground">
                  Transparentné cenníky bez skrytých poplatkov
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}