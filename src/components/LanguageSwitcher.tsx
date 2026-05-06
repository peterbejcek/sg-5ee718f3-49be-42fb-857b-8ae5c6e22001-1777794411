"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "sk", name: "Slovenčina" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "he", name: "עברית" },
  { code: "hu", name: "Magyar" },
  { code: "ar", name: "العربية" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "mobile";
  isScrolled?: boolean;
}

export function LanguageSwitcher({ variant = "default", isScrolled = false }: LanguageSwitcherProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === router.locale) || languages[0];

  const changeLanguage = (locale: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", locale);
      
      // Change i18next language
      i18n.changeLanguage(locale);
      
      // Get current path
      const currentPath = router.asPath;
      
      // Remove existing locale prefix if present
      const pathWithoutLocale = currentPath.replace(/^\/(sk|en|de|ru|uk|he|hu|ar)(\/|$)/, '/');
      
      // Build new URL with locale prefix
      const newPath = locale === 'sk' ? pathWithoutLocale : `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
      
      // Use window.location.href for guaranteed navigation
      window.location.href = newPath;
    }
  };

  if (!mounted) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="px-4 py-2 border-t border-white/20">
        <p className="text-xs text-white/60 mb-2 uppercase font-medium">Language</p>
        <div className="grid grid-cols-4 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                router.locale === lang.code
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-10 w-10 rounded-full font-bold text-sm transition-all ${
            isScrolled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-white text-primary hover:bg-white/90"
          }`}
        >
          {currentLanguage.code.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center justify-between cursor-pointer ${
              router.locale === lang.code ? "bg-primary/10 font-medium" : ""
            }`}
          >
            <span className="font-bold text-primary">{lang.code.toUpperCase()}</span>
            <span className="text-sm text-muted-foreground">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}