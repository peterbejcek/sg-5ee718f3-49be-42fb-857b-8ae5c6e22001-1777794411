import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/etaxi_logo_svg.svg" 
            alt="E-TAXI Košice" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <a href="#objednavka" className="hidden md:block">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Objednať teraz
            </Button>
          </a>
          
          <a href="tel:+421911606206">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">+421 911 606 206</span>
              <span className="sm:hidden tabular-nums">911 606 206</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}