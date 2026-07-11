import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      id="faq"
      className="py-16 sm:py-20 bg-muted/30"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            {t.faq.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {t.faq.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left font-display font-semibold hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t.faq.noAnswer}
            </p>
            <a href={t.common.phoneHref}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t.faq.callUs}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
