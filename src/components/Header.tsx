import { useState, useEffect } from "react";
import Link from "next/link";
import { PhoneCall, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

  const navItems = [
    { href: "#vozovy-park", label: "Vozový park" },
    { href: "#o-nas", label: "O nás" },
    { href: "#cennik", label: "Cenník" },
    { href: "#recenzie", label: "Recenzie" },
    { href: "#faq", label: "FAQ" },
    { href: "#blog", label: "Blog" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-primary"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/etaxi_logo_svg.svg"
                alt="E-TAXI Košice"
                fill
                className={`object-contain transition-all duration-300 ${
                  isScrolled ? "" : "brightness-0 invert"
                }`}
              />
            </div>
            <span
              className={`font-display font-bold text-xl transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              E-TAXI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-display font-medium transition-colors hover:text-accent ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Phone Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Phone Button - Always visible */}
            <a
              href="tel:+421911606206"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-3"
            >
              <PhoneCall className="h-5 w-5 flex-shrink-0" />
              
              {/* Text visible on md+ screens */}
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-normal opacity-90">Dispečing 24/7</span>
                <span className="font-display font-bold text-base tabular-nums">
                  +421 911 606 206
                </span>
              </div>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
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
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-display font-medium transition-colors hover:text-accent ${
                    isScrolled ? "text-foreground" : "text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}