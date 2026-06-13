"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => {
        setShowBanner(true);
      }, 5000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem("cookieConsent", "essential-only");
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-card border-2 border-primary/20 rounded-lg shadow-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-display font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                Súbory cookies a ochrana osobných údajov
              </h3>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>
                  Táto webová stránka používa súbory cookies na zlepšenie vášho zážitku a pre marketingové účely.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Používame nasledujúce typy cookies:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>
                      <strong>Nevyhnutné cookies:</strong> Potrebné pre základné fungovanie stránky (zapamätanie vašich preferencií)
                    </li>
                    <li>
                      <strong>Marketingové cookies (Google Ads):</strong> Používame Google Ads na cielenie reklám a meranie ich efektivity. Tieto cookies sledujú vašu aktivitu na webe a môžu byť použité na zobrazenie personalizovaných reklám.
                    </li>
                  </ul>
                </div>

                <p>
                  Kliknutím na „Prijať všetky cookies" súhlasíte s ukladaním cookies na vašom zariadení na účely vylepšenia navigácie na stránke, analýzy využívania stránky a marketingových aktivít v súlade s{" "}
                  <Link href="/ochrana-osobnych-udajov" className="text-primary hover:underline font-semibold">
                    Zásadami ochrany osobných údajov
                  </Link>.
                </p>

                <p className="text-xs">
                  Vaše osobné údaje spracovávame v súlade s nariadením GDPR (EU) 2016/679 a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleAccept}
                  className="bg-primary hover:bg-primary/90 text-white flex-1"
                >
                  Prijať všetky
                </Button>
                <Button
                  onClick={handleRejectOptional}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 flex-1"
                >
                  Len nevyhnutné
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10 flex-1"
                >
                  Odmietnuť všetky
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Svoje rozhodnutie môžete kedykoľvek zmeniť v nastaveniach prehliadača alebo vymazaním cookies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}