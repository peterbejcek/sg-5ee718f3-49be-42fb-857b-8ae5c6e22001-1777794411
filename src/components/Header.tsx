"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Header becomes white after scrolling past hero (approximately 100vh)
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#sluzby", label: "Služby" },
    { href: "/cennik", label: "Cenník" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#recenzie", label: "Recenzie" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md" 
          : "bg-white/10 backdrop-blur-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isScrolled ? "bg-primary/5" : "bg-white"
            }`}>
              <img
                src="/etaxi_logo_svg.svg"
                alt="E-TAXI Košice"
                className="h-12 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? "text-foreground hover:text-primary" 
                    : "text-white hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Call Button - Desktop */}
          <div className="hidden md:block">
            <Link href="tel:+421911606206" className="flex items-center gap-3 group">
              <div className={`p-3 rounded-full transition-all ${
                isScrolled 
                  ? "bg-accent text-white" 
                  : "bg-white text-primary"
              }`}>
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className={`text-xs font-medium transition-colors ${
                  isScrolled ? "text-muted-foreground" : "text-white/80"
                }`}>
                  Dispečing 24/7
                </div>
                <div className={`text-lg font-bold tabular-nums transition-colors ${
                  isScrolled 
                    ? "text-foreground group-hover:text-primary" 
                    : "text-white group-hover:text-accent"
                }`}>
                  +421 911 606 206
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/20 bg-white">
            <nav className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-border pt-4 mt-4 px-4">
                <Link 
                  href="tel:+421911606206" 
                  className="flex items-center gap-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="p-3 rounded-full bg-accent text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium text-muted-foreground">
                      Dispečing 24/7
                    </div>
                    <div className="text-lg font-bold tabular-nums text-foreground">
                      +421 911 606 206
                    </div>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}