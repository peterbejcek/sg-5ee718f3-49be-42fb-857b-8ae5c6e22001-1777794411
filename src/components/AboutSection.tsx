import { aboutData } from "@/data/about";
import { Shield, Leaf, ShieldCheck, Eye, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  Shield,
  Leaf,
  ShieldCheck,
  Eye
};

export function AboutSection() {
  return (
    <section id="o-nas" className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {aboutData.title}
          </h2>
          <p className="text-xl text-primary font-semibold mb-4">
            {aboutData.subtitle}
          </p>
          <p className="text-muted-foreground text-lg">
            {aboutData.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {aboutData.stats.map((stat, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="p-6">
                <div className="font-display font-bold text-3xl sm:text-4xl text-primary mb-2 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {aboutData.values.map((value, idx) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap];
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h3 className="font-display font-bold text-2xl mb-6 text-center">
              Kontaktujte nás
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Telefón</div>
                  <a href={`tel:${aboutData.contact.phone.replace(/\s/g, '')}`} className="font-semibold tabular-nums hover:underline">
                    {aboutData.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Email</div>
                  <a href={`mailto:${aboutData.contact.email}`} className="font-semibold hover:underline">
                    {aboutData.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Adresa</div>
                  <div className="font-semibold">
                    {aboutData.contact.address}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}