import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { SensetBookingForm } from "@/components/SensetBookingForm";
import { FleetSection } from "@/components/FleetSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { AboutSection } from "@/components/AboutSection";
import { BlogSection } from "@/components/BlogSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FAQSection } from "@/components/FAQSection";
import { Phone, Calendar, Clock, Zap, Wine, Plane, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Head from "next/head";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

export default function Home() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    // Force language change based on URL locale parameter
    const locale = router.query.locale as string || "sk";
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [router.query.locale, i18n]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
      
      const preventScroll = () => {
        if (!window.location.hash) {
          window.scrollTo(0, 0);
        }
      };
      
      const timeoutId = setTimeout(() => {
        window.removeEventListener("scroll", preventScroll);
      }, 2000);
      
      window.addEventListener("scroll", preventScroll);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("scroll", preventScroll);
      };
    }
  }, []);

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
    "email": "dispecing@e-taxike.sk",
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
    }
  };

  return (
    <>
      <SEO 
        title="E-TAXI Košice | Taxislužba 24/7 | Transfery Budapešť, Krakov, Viedeň"
        description="Profesionálna taxislužba v Košiciach dostupná 24/7 ✓ Letiskové transfery Budapešť, Krakov, Viedeň ✓ Online objednávka ✓ Moderné vozidlá ✓ Dispečing +421 911 606 206"
        url="https://etaxi-kosice.sk"
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
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: "url('/hero-bg3.png')",
                filter: "brightness(1.15) saturate(1.1) sepia(0.15)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4" suppressHydrationWarning>
                  {t("hero.title")}<br />
                  <span className="text-yellow-400">{t("hero.fast")}</span>, {t("hero.reliable")},<br />
                  <span className="text-yellow-400">{t("hero.comfortable")}</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-8" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: t("hero.description") }} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#objednavka">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold shadow-lg"
                      suppressHydrationWarning
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {t("buttons.orderNow")}
                    </Button>
                  </a>
                  <a href="tel:+421911606206">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary font-display font-semibold shadow-lg"
                      suppressHydrationWarning
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      <span className="tabular-nums">{t("contact.phone")}</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="sluzby" className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-12" suppressHydrationWarning>
              {t("services.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3" suppressHydrationWarning>
                    {t("services.instant.title")}
                  </h3>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {t("services.instant.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3" suppressHydrationWarning>
                    {t("services.scheduled.title")}
                  </h3>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {t("services.scheduled.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Wine className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3" suppressHydrationWarning>
                    {t("services.drink.title")}
                  </h3>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {t("services.drink.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Plane className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3" suppressHydrationWarning>
                    {t("services.airport.title")}
                  </h3>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {t("services.airport.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <CreditCard className="w-12 h-12 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-xl mb-3" suppressHydrationWarning>
                    {t("services.card.title")}
                  </h3>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {t("services.card.description")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <a href="#objednavka">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
                  suppressHydrationWarning
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {t("buttons.bookRide")}
                </Button>
              </a>
              <a href="tel:+421911606206">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary border-2 border-primary font-display font-semibold"
                  suppressHydrationWarning
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t("buttons.callNow")} {t("contact.phone")}
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
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-4" suppressHydrationWarning>
                {t("booking.title")}
              </h2>
              <p className="text-center text-muted-foreground mb-8" suppressHydrationWarning>
                {t("booking.description")}{" "}
                <a href="tel:+421911606206" className="text-accent font-semibold hover:underline">
                  {t("contact.phone")}
                </a>
              </p>
              <SensetBookingForm />
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