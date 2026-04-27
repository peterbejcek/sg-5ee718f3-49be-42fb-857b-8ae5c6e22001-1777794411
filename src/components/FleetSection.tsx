import { useState } from "react";
import { Users, Wifi, Wind, Zap, Fuel, Phone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FleetSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const vehicles = [
    {
      id: 1,
      name: "Tesla Model 3",
      type: "sedan",
      capacity: 4,
      features: [
        { icon: Zap, label: "Elektrický pohon" },
        { icon: Wind, label: "Klimatizácia" },
        { icon: Wifi, label: "WiFi" },
      ],
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      isEco: true,
    },
    {
      id: 2,
      name: "VW Passat GTE",
      type: "sedan",
      capacity: 4,
      features: [
        { icon: Zap, label: "Plug-in hybrid" },
        { icon: Wind, label: "Klimatizácia" },
        { icon: Wifi, label: "WiFi" },
      ],
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
      isEco: true,
    },
    {
      id: 3,
      name: "Toyota Corolla Hybrid",
      type: "sedan",
      capacity: 4,
      features: [
        { icon: Fuel, label: "Hybrid pohon" },
        { icon: Wind, label: "Klimatizácia" },
      ],
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      isEco: true,
    },
    {
      id: 4,
      name: "VW Golf VII",
      type: "sedan",
      capacity: 4,
      features: [
        { icon: Wind, label: "Klimatizácia" },
        { icon: Wifi, label: "WiFi" },
      ],
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      isEco: false,
    },
    {
      id: 5,
      name: "Škoda Superb III",
      type: "sedan",
      capacity: 4,
      features: [
        { icon: Wind, label: "Klimatizácia" },
        { icon: Wifi, label: "WiFi" },
      ],
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      isEco: false,
    },
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "eco") return vehicle.isEco;
    return false;
  });

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-center mb-4">
          Náš vozový park
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Moderné a udržiavané vozidlá pre váš komfort a bezpečnosť
        </p>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className="font-display"
          >
            Všetky vozidlá
          </Button>
          <Button
            variant={activeFilter === "eco" ? "default" : "outline"}
            onClick={() => setActiveFilter("eco")}
            className="font-display"
          >
            <Zap className="w-4 h-4 mr-2" />
            Ekologické
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {vehicle.isEco && (
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    Ekologické
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-xl mb-3">
                  {vehicle.name}
                </h3>
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Kapacita: {vehicle.capacity} osoby</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      <feature.icon className="w-3 h-3" />
                      {feature.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#objednavka">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Objednať teraz
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
    </section>
  );
}