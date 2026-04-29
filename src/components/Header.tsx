"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background shadow-md"
          : "bg-primary"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isScrolled ? "" : "bg-white"
            }`}>
              <img
                src="/etaxi_logo_svg.svg"
                alt="E-TAXI Košice"
                className="h-12 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="#sluzby" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Služby
            </Link>
            <Link 
              href="#cennik" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Cenník
            </Link>
            <Link 
              href="#kontakt" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Kontakt
            </Link>
          </nav>

          {/* Order Button - Desktop */}
          <Button 
            size="lg"
            className={`hidden md:flex font-display font-semibold ${
              isScrolled 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "bg-white hover:bg-white/90 text-primary"
            }`}
            asChild
          >
            <Link href="#objednavka">Objednať teraz</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className={isScrolled ? "text-primary" : "text-white"}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                <Link 
                  href="#sluzby" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Služby
                </Link>
                <Link 
                  href="#cennik" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cenník
                </Link>
                <Link 
                  href="#kontakt" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Link>
                
                <div className="pt-6 border-t border-border">
                  <Button 
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
                    asChild
                  >
                    <Link href="#objednavka" onClick={() => setIsMenuOpen(false)}>
                      Objednať teraz
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}