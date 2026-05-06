import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Vozový park", href: "#vozovy-park" },
  { label: "O nás", href: "#o-nas" },
  { label: "Cenník", href: "#cennik" },
  { label: "Recenzie", href: "#recenzie" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#blog" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/etaxi_logo_svg.svg" alt="E-TAXI Košice" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground/80 hover:text-primary font-display font-medium transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Phone Button (with label and icon) */}
          <a
            href="tel:+421911606206"
            className="hidden sm:flex flex-col items-start bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2.5 rounded-lg font-display transition-all hover:scale-105"
          >
            <span className="text-xs font-medium opacity-90 mb-0.5">
              Dispečing 24/7
            </span>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="font-bold text-base tabular-nums">
                +421 911 606 206
              </span>
            </div>
          </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 font-display font-medium transition-colors rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}