import { pricingData } from "@/data/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Car, Info } from "lucide-react";
import { motion } from "framer-motion";

export function PricingSection() {
  return (
    <motion.section 
      id="cennik" 
      className="py-16 sm:py-20 bg-muted/30"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-foreground">
            {pricingData.title}
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            {pricingData.subtitle}
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Ľavý stĺpec: Základný cenník */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-display text-primary">
                  <Car className="w-5 h-5" />
                  Základný cenník
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {pricingData.basicPricing.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-foreground/80">{item.label}</span>
                      <span className="font-bold tabular-nums whitespace-nowrap ml-4">{item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-border flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <Info className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                  <p className="font-medium">{pricingData.note}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pravý stĺpec: Transfery */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-display text-primary-foreground">
                  <Plane className="w-5 h-5" />
                  Letiskové a diaľkové transfery
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {pricingData.transfers.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-foreground/80 pr-4">{item.destination}</span>
                      <span className="font-bold tabular-nums text-primary whitespace-nowrap">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}