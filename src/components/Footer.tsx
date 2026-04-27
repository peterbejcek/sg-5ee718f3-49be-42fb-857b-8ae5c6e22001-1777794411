import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4">E-TAXI Košice</h3>
            <p className="text-primary-foreground/80 mb-4">
              Profesionálna taxislužba v Košiciach s moderným vozovým parkom a skúsenými vodičmi.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Kontakt</h4>
            <div className="space-y-3">
              <a
                href="tel:+421911606206"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="tabular-nums">+421 911 606 206</span>
              </a>
              <a
                href="mailto:info@etaxi-kosice.sk"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@etaxi-kosice.sk
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Prevádzkové hodiny</h4>
            <div className="flex items-start gap-2 text-primary-foreground/80">
              <Clock className="w-4 h-4 mt-1" />
              <div>
                <p className="font-semibold">24/7</p>
                <p className="text-sm">Nonstop k dispozícii</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Oblasť služieb</h4>
            <div className="flex items-start gap-2 text-primary-foreground/80">
              <MapPin className="w-4 h-4 mt-1" />
              <div>
                <p>Košice a okolie</p>
                <p className="text-sm">+ diaľkové prepravy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} E-TAXI Košice. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
}