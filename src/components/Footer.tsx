import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img src="/etaxi_logo_svg.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-xl">E-TAXI Košice</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Profesionálna taxislužba v Košiciach a okolí. Spoľahlivosť, komfort a bezpečnosť sú naše priority.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/etaxikosice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/etaxikosice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/421911606206" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Služby</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#objednavka" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Objednať jazdu
                </Link>
              </li>
              <li>
                <Link href="/#fleet" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Vozový park
                </Link>
              </li>
              <li>
                <Link href="/#cennik" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Letiskové transfery
                </Link>
              </li>
              <li>
                <Link href="/#fleet" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                  Firemné transfery
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-4 text-white">
                Informácie
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cennik" className="text-white hover:text-accent transition-colors">
                    Cenník
                  </Link>
                </li>
                <li>
                  <Link href="/prepravny-poriadok" className="text-white hover:text-accent transition-colors">
                    Prepravný poriadok
                  </Link>
                </li>
                <li>
                  <Link href="/ochrana-osobnych-udajov" className="text-white hover:text-accent transition-colors">
                    Ochrana osobných údajov
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-white hover:text-accent transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#recenzie" className="text-white hover:text-accent transition-colors">
                    Recenzie zákazníkov
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="text-white hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+421911606206" 
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="tabular-nums">+421 911 606 206</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@etaxi-kosice.sk" 
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>info@etaxi-kosice.sk</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-primary-foreground/80 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Košice, Slovensko</span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-primary-foreground/80 text-sm">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>24/7 Dispečing</span>
                </div>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-primary-foreground/20">
              <a href="tel:+421911606206">
                <Button 
                  size="sm" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Zavolať teraz
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col justify-center items-center">
            <p className="text-primary-foreground/70 text-sm text-center">
              © {currentYear} E-TAXI Košice. Všetky práva vyhradené.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}