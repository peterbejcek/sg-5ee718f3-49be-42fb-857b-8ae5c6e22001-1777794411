import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xl mb-4">E-TAXI Košice</h3>
            <p className="text-primary-foreground/80 mb-4 max-w-sm">
              Profesionálna taxislužba v Košiciach s moderným vozovým parkom a skúsenými vodičmi.
            </p>
            <div className="flex items-start gap-2 text-primary-foreground/80 mt-4">
              <MapPin className="w-4 h-4 mt-1" />
              <div>
                <p>Košice a okolie</p>
                <p className="text-sm">+ diaľkové prepravy</p>
              </div>
            </div>
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
              <div className="flex items-start gap-2 text-primary-foreground/80 mt-2">
                <Clock className="w-4 h-4 mt-1" />
                <div>
                  <p className="font-semibold">24/7</p>
                  <p className="text-sm">Nonstop k dispozícii</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Informácie</h4>
            <div className="space-y-2">
              <Link href="/cennik" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Cenník
              </Link>
              <Link href="/prepravny-poriadok" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Prepravný poriadok
              </Link>
              <Link href="/#objednavka" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Objednať jazdu
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-4">O nás</h4>
            <div className="space-y-2">
              <Link href="/#o-nas" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                O spoločnosti
              </Link>
              <Link href="/#blog" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Blog a novinky
              </Link>
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