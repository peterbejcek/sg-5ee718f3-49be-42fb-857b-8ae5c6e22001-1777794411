"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Enable Google Ads tracking (if implemented)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted"
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Disable Google Ads tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
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

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleAccept}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      size="lg"
                    >
                      Prijať všetky cookies
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/5"
                      size="lg"
                    >
                      Odmietnuť marketingové cookies
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Svoje rozhodnutie môžete kedykoľvek zmeniť v nastaveniach prehliadača alebo vymazaním cookies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}