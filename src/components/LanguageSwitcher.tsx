"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "mobile" }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === router.locale) || languages[0];

  const changeLanguage = (locale: string) => {
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", locale);
    }

    // Change route with new locale
    router.push(router.pathname, router.asPath, { locale });
  };

  if (!mounted) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="px-4 py-2 border-t border-white/20">
        <p className="text-xs text-white/60 mb-2 uppercase font-medium">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                router.locale === lang.code
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
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
          className="gap-2 font-medium hover:bg-primary/10"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <Globe className="h-4 w-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              router.locale === lang.code ? "bg-primary/10 font-medium" : ""
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}