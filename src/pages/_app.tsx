import "@/styles/globals.css";
import Script from 'next/script'
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";
import "@/lib/i18n";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get locale from URL params or router
    const localeFromUrl = router.query.locale as string || router.locale || "sk";
    
    // Change i18n language immediately
    if (i18n.language !== localeFromUrl) {
      i18n.changeLanguage(localeFromUrl).then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, [router.query.locale, router.locale, i18n]);

  // Don't render until language is set
  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      {/* Google Tag Manager */}
      <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W2XG84SD');`
          }}
      />
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2XG84SD"
      height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
      {/* End Google Tag Manager */}
      <div suppressHydrationWarning>
        <Component {...pageProps} />
      </div>
      <CookieConsent />
    </ThemeProvider>
  );
}