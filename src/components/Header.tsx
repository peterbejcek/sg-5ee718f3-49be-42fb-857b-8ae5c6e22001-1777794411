"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          ? "bg-primary shadow-lg"
          : "bg-transparent"
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
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="#sluzby" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              Služby
            </Link>
            <Link 
              href="#cennik" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              Cenník
            </Link>
            <Link 
              href="#recenzie" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              Recenzie
            </Link>
            <Link 
              href="#faq" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              FAQ
            </Link>
            <Link 
              href="#blog" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              Blog
            </Link>
            <Link 
              href="#o-nas" 
              className={`font-medium transition-colors hover:text-accent ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              O nás
            </Link>
          </nav>

          {/* Phone + CTA - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone Number with Icon */}
            <a href="tel:+421911606206" className="flex items-center gap-2 text-white hover:text-accent transition-colors">
              <Phone className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-80">Dispečing 24/7</span>
                <span className="font-semibold tabular-nums">+421 911 606 206</span>
              </div>
            </a>
            
            {/* Order Button */}
            <Button 
              size="lg"
              className={`font-display font-semibold ${
                isScrolled 
                  ? "bg-white text-primary hover:bg-white/90" 
                  : "bg-white text-primary hover:bg-white/90"
              }`}
              asChild
            >
              <Link href="#objednavka">Objednať teraz</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className={`${isScrolled ? "text-white" : "text-white"}`}
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
                  href="#recenzie" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recenzie
                </Link>
                <Link 
                  href="#faq" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link 
                  href="#blog" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  href="#o-nas" 
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  O nás
                </Link>
                
                <div className="pt-6 border-t border-border">
                  <a href="tel:+421911606206">
                    <Button 
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      +421 911 606 206
                    </Button>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}