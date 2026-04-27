"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#sluzby", label: "Služby" },
    { href: "/#cennik", label: "Cenník" },
    { href: "/#recenzie", label: "Recenzie" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#blog", label: "Blog" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background text-primary border-border shadow-sm" 
          : "bg-primary text-primary-foreground border-transparent"
      )}
    >
      <div className="container h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/etaxi_logo_svg.svg"
            alt="E-TAXI Košice"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled 
                  ? "text-foreground/80 hover:text-primary" 
                  : "text-primary-foreground/90 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a href="tel:+421911606206" className="hidden sm:flex items-center gap-2 group">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isScrolled ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
            )}>
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium opacity-80 leading-none">Dispečing 24/7</span>
              <span className="font-display font-bold text-lg tabular-nums leading-none mt-1">
                +421 911 606 206
              </span>
            </div>
          </a>

          <a href="tel:+421911606206" className="sm:hidden">
            <Button size="icon" variant={isScrolled ? "default" : "secondary"} className={!isScrolled ? "bg-white text-primary hover:bg-white/90" : ""}>
              <Phone className="w-5 h-5" />
            </Button>
          </a>

          <a href="/#objednavka" className="hidden md:block">
            <Button 
              className={cn(
                "font-display font-bold px-6",
                isScrolled 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "bg-white text-primary hover:bg-white/90"
              )}
            >
              Objednať teraz
            </Button>
          </a>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    isScrolled 
                      ? "text-primary hover:bg-primary/10" 
                      : "text-white hover:bg-white/20"
                  )}
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Otvoriť menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background">
                <div className="flex flex-col h-full mt-6">
                  <nav className="flex flex-col gap-4 text-lg font-medium text-foreground">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-auto flex flex-col gap-4 pb-8">
                    <a href="tel:+421911606206" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg">
                        <Phone className="w-5 h-5 mr-2" />
                        +421 911 606 206
                      </Button>
                    </a>
                    <a href="/#objednavka" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 h-12 text-lg">
                        Objednať online
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}