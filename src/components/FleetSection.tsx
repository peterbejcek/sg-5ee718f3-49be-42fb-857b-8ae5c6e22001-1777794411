import { useState } from "react";
import { Users, Wind, Zap, Phone, Calendar, Baby, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function FleetSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const vehicles = [
  {
    id: "1",
    name: "VW Passat GTE",
    type: "kombi" as const,
    capacity: 4,
    isEco: true,
    features: [
    { icon: Wind, label: "Klimatizácia" },
    { icon: Zap, label: "Ekologický" }],

    image: "/VW_Kosice.PNG",
    description: "Ekologické plug-in hybrid kombi s veľkým batožinovým priestorom"
  },
  {
    id: "2",
    name: "Toyota Corolla",
    type: "sedan" as const,
    capacity: 4,
    isEco: true,
    features: [
    { icon: Wind, label: "Klimatizácia" },
    { icon: Baby, label: "Detská sedačka" }],

    image: "/corolla_krakov.PNG",
    description: "Spoľahlivý sedan s nízkou spotrebou"
  },
  {
    id: "3",
    name: "Tesla Model 3",
    type: "sedan" as const,
    capacity: 4,
    isEco: true,
    features: [
    { icon: Wind, label: "Klimatizácia" },
    { icon: Zap, label: "Elektrické" }],

    image: "/tesla_Budapest.PNG",
    description: "Prémiové elektrické vozidlo"
  },
  {
    id: "4",
    name: "VW Golf VII Variant",
    type: "kombi" as const,
    capacity: 4,
    isEco: false,
    features: [
    { icon: Wind, label: "Klimatizácia" }],

    image: "/VW_Golf_VII.png",
    description: "Komfortné kombi pre mestskú aj medzimestkú dopravu"
  },
  {
    id: "5",
    name: "VW Jetta",
    type: "sedan" as const,
    capacity: 4,
    isEco: false,
    features: [
    { icon: Wind, label: "Klimatizácia" },
    { icon: Baby, label: "Detská sedačka" }],

    image: "/VW_Jetta.png",
    description: "Praktické vozidlo pre rodiny a väčšie skupiny"
  },
  {
    id: "6",
    name: "Ďalšie vozidlá",
    type: "van" as const,
    capacity: 4,
    isEco: false,
    features: [
    { icon: Wind, label: "Klimatizácia" },
    { icon: Baby, label: "Detská sedačka" }],

    image: "/auta.png",
    description: "Celkovo 14 vozidiel k dispozícii"
  }];


  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "eco") return vehicle.isEco;
    return false;
  });

  return (
    <section 
      id="vozovy-park"
      className="py-24 bg-muted/30"
    >
      
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-foreground">
            Náš vozový park
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Moderné a udržiavané vozidlá pre váš komfort a bezpečnosť
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="font-display">
            
            Všetky vozidlá
          </Button>
          <Button
            variant={activeFilter === "eco" ? "default" : "outline"}
            onClick={() => setActiveFilter("eco")}
            className="font-display">
            
            <Zap className="w-4 h-4 mr-2" />
            Ekologické
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredVehicles.map((vehicle) =>
          <div key={vehicle.id}>
            
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-48 bg-muted">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                
                  {vehicle.isEco &&
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                      Ekologické
                    </Badge>
                }
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="font-display font-semibold text-xl mb-3">
                    {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Kapacita: {vehicle.capacity} osoby</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle.features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-sm">
                        
                          <Icon className="w-4 h-4" />
                          {feature.label}
                        </span>);

                  })}
                  </div>

                  {vehicle.description &&
                <p className="text-sm text-muted-foreground italic mt-auto pt-2">Celkovo 14 vozidiel k dispozícii, všetky klimatizované, čisté a v dobrom technickom stave

                </p>
                }
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <a href="#objednavka">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Objednať jazdu teraz
            </Button>
          </a>
          <a href="tel:+421911606206">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-white/90 text-primary border-2 border-primary font-display font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Zavolať +421 911 606 206
            </Button>
          </a>
        </div>
      </div>
    </section>);

}