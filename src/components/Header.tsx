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

  const menuItems = [
    { label: "Služby", href: "#sluzby" },
    { label: "Vozový park", href: "#vozovy-park" },
    { label: "O nás", href: "#o-nas" },
    { label: "Recenzie", href: "#recenzie" },
    { label: "FAQ", href: "#faq" },
    { label: "Cenník", href: "/cennik" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md" 
          : "bg-[#282462]"
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
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  isScrolled
                    ? "text-[#282462] hover:text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Call Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="tel:+421911606206" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-accent rounded-full p-3">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-medium ${
                  isScrolled ? "text-muted-foreground" : "text-white/80"
                }`}>
                  Dispečing 24/7
                </span>
                <span className={`font-bold tabular-nums ${
                  isScrolled ? "text-[#282462]" : "text-white"
                }`}>
                  +421 911 606 206
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-[#282462]" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t ${
            isScrolled ? "border-border bg-white" : "border-white/20 bg-[#282462]"
          }`}>
            <nav className="py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 font-medium transition-colors ${
                    isScrolled
                      ? "text-[#282462] hover:bg-muted"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className={`border-t pt-4 mt-4 px-4 ${
                isScrolled ? "border-border" : "border-white/20"
              }`}>
                <Link href="tel:+421911606206" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="bg-accent rounded-full p-3">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-medium ${
                      isScrolled ? "text-muted-foreground" : "text-white/80"
                    }`}>
                      Dispečing 24/7
                    </span>
                    <span className={`font-bold tabular-nums ${
                      isScrolled ? "text-[#282462]" : "text-white"
                    }`}>
                      +421 911 606 206
                    </span>
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