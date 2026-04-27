import { useState } from "react";
import { Users, Wifi, Wind, Zap, Fuel } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type VehicleType = "sedan" | "hatchback" | "suv";

interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  capacity: number;
  features: string[];
  image: string;
  eco: boolean;
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Tesla Model 3",
    type: "sedan",
    capacity: 4,
    features: ["Plne elektrické", "WiFi", "Klimatizácia", "Premium audio"],
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    eco: true,
  },
  {
    id: "2",
    name: "VW Passat GTE",
    type: "sedan",
    capacity: 4,
    features: ["Plug-in hybrid", "WiFi", "Klimatizácia", "Veľký kufor"],
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    eco: true,
  },
  {
    id: "3",
    name: "Toyota Corolla Hybrid",
    type: "sedan",
    capacity: 4,
    features: ["Hybrid", "WiFi", "Klimatizácia", "Nízka spotreba"],
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
    eco: true,
  },
  {
    id: "4",
    name: "VW Golf VII",
    type: "hatchback",
    capacity: 4,
    features: ["Benzín", "WiFi", "Klimatizácia", "Kompaktné"],
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
    eco: false,
  },
  {
    id: "5",
    name: "Škoda Superb III",
    type: "sedan",
    capacity: 4,
    features: ["Diesel", "WiFi", "Klimatizácia", "Premium priestor"],
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop",
    eco: false,
  },
];

export function FleetSection() {
  const [showEcoOnly, setShowEcoOnly] = useState(false);

  const filteredVehicles = showEcoOnly
    ? vehicles.filter((v) => v.eco)
    : vehicles;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Náš vozový park
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moderné a ekologické vozidlá s plazbou kartou v každom aute
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setShowEcoOnly(false)}
            className={`px-4 py-2 rounded-lg font-display font-medium transition-colors ${
              !showEcoOnly
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border hover:border-primary"
            }`}
          >
            Všetky vozidlá
          </button>
          <button
            onClick={() => setShowEcoOnly(true)}
            className={`px-4 py-2 rounded-lg font-display font-medium transition-colors ${
              showEcoOnly
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border hover:border-primary"
            }`}
          >
            Ekologické (Hybrid/Elektro)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {vehicle.eco && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    ECO
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-xl mb-1">
                      {vehicle.name}
                    </h3>
                    <Badge variant="outline" className="capitalize">
                      {vehicle.type === "sedan"
                        ? "Sedan"
                        : vehicle.type === "hatchback"
                        ? "Hatchback"
                        : "SUV"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-display font-semibold text-lg">
                    <Users className="w-5 h-5" />
                    <span className="tabular-nums">{vehicle.capacity}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}