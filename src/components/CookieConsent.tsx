"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary shadow-lg z-50 p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Táto stránka používa cookies pre zlepšenie používateľskej skúsenosti.{" "}
          <Link 
            href="/ochrana-osobnych-udajov" 
            className="text-primary hover:underline font-medium"
          >
            Zásady ochrany osobných údajov
          </Link>
        </p>
        <Button 
          onClick={acceptCookies}
          className="bg-primary hover:bg-primary/90 whitespace-nowrap"
        >
          Súhlasím
        </Button>
      </div>
    </div>
  );
}