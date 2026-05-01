import { useState } from "react";
import { Users, Wifi, Wind, Zap, Phone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type VehicleType = "all" | "sedan" | "kombi" | "van";
type FilterType = VehicleType | "1-4" | "5-8" | "eco";

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
        { icon: Zap, label: "Ekologický" }
      ],
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
        { icon: Users, label: "Detská sedačka" }
      ],
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
        { icon: Zap, label: "Elektrické" }
      ],
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
        { icon: Wind, label: "Klimatizácia" }
      ],
      image: "/VW_Golf_VII.png",
      description: "Komfortné kombi pre mestskú aj medzimestkú dopravu"
    },
    {
      id: "5",
      name: "Škoda Octavia Combi",
      type: "kombi" as const,
      capacity: 4,
      isEco: false,
      features: [
        { icon: Wind, label: "Klimatizácia" },
        { icon: Users, label: "Detská sedačka" }
      ],
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop",
      description: "Praktické kombi pre rodiny a väčšie skupiny"
    },
    {
      id: "6",
      name: "Mercedes-Benz Vito",
      type: "van" as const,
      capacity: 4,
      isEco: false,
      features: [
        { icon: Wind, label: "Klimatizácia" },
        { icon: Users, label: "Detská sedačka" }
      ],
      image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&auto=format&fit=crop",
      description: "Priestranný van pre väčšie skupiny a batožinu"
    }
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "eco") return vehicle.isEco;
    return false;
  });

  return (
    <motion.section 
      id="sluzby" 
      className="py-16 sm:py-20 bg-background"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-foreground">
            Náš vozový park
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Moderné a udržiavané vozidlá pre váš komfort a bezpečnosť
          </p>
        </motion.div>

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

        {/* Vehicle Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
            >
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
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </motion.section>
  );
}