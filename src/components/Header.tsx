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
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link 
            href="#sluzby" 
            className={`font-medium text-base lg:text-lg transition-colors hover:text-accent ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          >
            Služby
          </Link>
          <Link 
            href="#cennik" 
            className={`font-medium text-base lg:text-lg transition-colors hover:text-accent ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          >
            Cenník
          </Link>
          <Link 
            href="#kontakt" 
            className={`font-medium text-base lg:text-lg transition-colors hover:text-accent ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          >
            Kontakt
          </Link>
        </nav>

        {/* Call Button - Desktop */}
        <a href="tel:+421911606206" className="hidden md:block">
          <Button 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-12 px-6 text-base"
          >
            <Phone className="w-5 h-5 mr-2" />
            +421 911 606 206
          </Button>
        </a>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-12 w-12 ${isScrolled ? "text-primary" : "text-white"}`}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-8">
              <Link 
                href="#sluzby" 
                className="text-xl font-medium text-foreground hover:text-accent transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                Služby
              </Link>
              <Link 
                href="#cennik" 
                className="text-xl font-medium text-foreground hover:text-accent transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                Cenník
              </Link>
              <Link 
                href="#kontakt" 
                className="text-xl font-medium text-foreground hover:text-accent transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>
              
              <div className="pt-6 border-t border-border">
                <a href="tel:+421911606206">
                  <Button 
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14 text-lg"
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
    </header>
  );
}