import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 pr-2">
            <p className="text-sm text-foreground leading-relaxed">
              Používame cookies pre zlepšenie vášho zážitku. Pokračovaním súhlasíte s ich použitím.{" "}
              <a
                href="/ochrana-osobnych-udajov"
                className="text-primary hover:underline font-medium"
              >
                Viac informácií
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={acceptNecessary}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
            >
              Len potrebné
            </Button>
            <Button
              onClick={acceptAll}
              size="sm"
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-xs sm:text-sm h-9"
            >
              Prijať všetky
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}