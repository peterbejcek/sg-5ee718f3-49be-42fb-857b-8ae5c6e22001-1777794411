import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: "Vozový park", href: "#vozovy-park" },
    { label: "O nás", href: "#o-nas" },
    { label: "Cenník", href: "#cennik" },
    { label: "Recenzie", href: "#recenzie" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "#blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md"
          : "bg-primary"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/etaxi_logo_svg.svg"
              alt="E-TAXI Košice"
              width={120}
              height={40}
              className={`h-10 w-auto transition-all ${
                isScrolled ? "brightness-100" : "brightness-0 invert"
              }`}
            />
          </Link>

          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-display font-semibold text-sm transition-colors hover:text-accent ${
                  isScrolled
                    ? "text-foreground"
                    : "text-primary-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Phone Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Phone Button - visible on all devices */}
            <a href="tel:+421911606206">
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
              >
                <Phone className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">+421 911 606 206</span>
              </Button>
            </a>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${
                isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-primary-foreground hover:text-accent"
              }`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 pt-2 border-t border-border/10">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-display font-semibold text-sm py-2 transition-colors hover:text-accent ${
                    isScrolled
                      ? "text-foreground"
                      : "text-primary-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
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