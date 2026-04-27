"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#objednavka", label: "Objednávka" },
  { href: "#sluzby", label: "Služby" },
  { href: "#cennik", label: "Cenník" },
  { href: "#recenzie", label: "Recenzie" },
  { href: "#faq", label: "FAQ" },
  { href: "#blog", label: "Blog" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">E</span>
            </div>
            <span className="font-display font-bold text-xl text-primary hidden sm:inline">
              E-TAXI Košice
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Phone Number */}
            <a href="tel:+421911606206" className="hidden sm:block">
              <Button
                size="lg"
                variant="ghost"
                className="text-primary hover:text-primary/80 font-display font-semibold tabular-nums"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">+421 911 606 206</span>
                <span className="md:hidden">911 606 206</span>
              </Button>
            </a>

            {/* Order Button - Desktop */}
            <a href="#objednavka" className="hidden md:block">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Objednať teraz
              </Button>
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Otvoriť menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Phone Number */}
                  <a href="tel:+421911606206" onClick={() => setIsOpen(false)}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full justify-start text-primary border-primary font-display font-semibold tabular-nums"
                    >
                      <Phone className="w-5 h-5 mr-3" />
                      +421 911 606 206
                    </Button>
                  </a>

                  {/* Mobile Order Button */}
                  <a href="#objednavka" onClick={() => setIsOpen(false)}>
                    <Button
                      size="lg"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-primary font-display font-semibold"
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Objednať teraz
                    </Button>
                  </a>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-4 pt-4 border-t border-border">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}