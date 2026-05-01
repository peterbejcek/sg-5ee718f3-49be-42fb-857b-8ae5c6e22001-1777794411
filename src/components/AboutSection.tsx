import { aboutData } from "@/data/about";
import { Shield, Leaf, ShieldCheck, Eye, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const iconMap = {
  Shield,
  Leaf,
  ShieldCheck,
  Eye
};

export function AboutSection() {
  return (
    <section 
      className="py-16 sm:py-20 bg-muted/30"
    >
      <div className="container">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {aboutData.title}
          </h2>
          <p className="text-xl text-primary font-semibold mb-4">
            {aboutData.subtitle}
          </p>
          <p className="text-muted-foreground text-lg">
            {aboutData.description}
          </p>
        </motion.div>

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

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {aboutData.values.map((value, idx) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={idx}
                className="text-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <Card className="hover:shadow-lg transition-shadow">
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
              </motion.div>
            );
          })}
        </motion.div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <h3 className="font-display font-bold text-2xl mb-6 text-center">
              Kontaktujte nás
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">Telefonický kontakt</h3>
                  <p className="text-muted-foreground mb-2">Dispečing k dispozícii 24 hodín denne, 7 dní v týždni</p>
                  <a href="tel:+421911606206" className="text-primary font-semibold hover:text-accent transition-colors">
                    +421 911 606 206
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">Emailový kontakt</h3>
                  <p className="text-muted-foreground mb-2">Odpovieme do 24 hodín</p>
                  <a href="mailto:dispecing@e-taxike.sk" className="text-primary font-semibold hover:text-accent transition-colors">
                    dispecing@e-taxike.sk
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}