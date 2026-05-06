import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (type: "all" | "necessary" | "none") => {
    localStorage.setItem("cookieConsent", type);
    setIsVisible(false);

    // If user accepts marketing cookies, initialize Google Ads
    if (type === "all") {
      // TODO: Initialize Google Ads tracking here
      console.log("Marketing cookies accepted - initialize Google Ads");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
      <div className="container max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-base sm:text-lg mb-2">
                Súbory cookies
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Používame cookies pre zlepšenie vášho zážitku. Vyberte si úroveň cookies:
                </p>
                <ul className="space-y-1 text-xs sm:text-sm ml-4 list-disc">
                  <li>
                    <strong>Nevyhnutné:</strong> Potrebné pre fungovanie stránky (napr. uloženie vašich preferencií)
                  </li>
                  <li>
                    <strong>Marketingové:</strong> Google Ads tracking pre lepšie cielenie reklám
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => handleAccept("none")}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Zavrieť"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={() => handleAccept("none")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-9 flex-1 border-muted-foreground/30 hover:border-muted-foreground"
            >
              Odmietnuť
            </Button>
            <Button
              onClick={() => handleAccept("necessary")}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-9 flex-1 border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Len nevyhnutné
            </Button>
            <Button
              onClick={() => handleAccept("all")}
              size="sm"
              className="text-xs sm:text-sm h-9 flex-1 bg-primary hover:bg-primary/90"
            >
              Prijať všetky
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}