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
      setIsScrolled(window.scrollY > 50);
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
          ? "bg-primary shadow-lg"
          : "bg-primary/95 backdrop-blur-sm"
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-accent transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Call Button - Desktop */}
          <div className="hidden md:block">
            <Link href="tel:+421911606206">
              <Button className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2">
                <Phone className="h-4 w-4" />
                +421 911 606 206
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-accent transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/20 pt-4 mt-4">
                <Link href="tel:+421911606206" className="w-full block">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold gap-2">
                    <Phone className="h-4 w-4" />
                    +421 911 606 206
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}