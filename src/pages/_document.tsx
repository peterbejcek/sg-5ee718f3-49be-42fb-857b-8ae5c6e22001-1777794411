import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="sk">
      <Head>
        <SEOElements />
        
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Additional SEO */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="E-TAXI Košice" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#282462" />
        <meta name="msapplication-TileColor" content="#282462" />
        
        {/* Alternate languages */}
        <link rel="alternate" hrefLang="sk" href="https://etaxi-kosice.sk/" />
        <link rel="alternate" hrefLang="en" href="https://etaxi-kosice.sk/en" />
        <link rel="alternate" hrefLang="de" href="https://etaxi-kosice.sk/de" />
        <link rel="alternate" hrefLang="ru" href="https://etaxi-kosice.sk/ru" />
        <link rel="alternate" hrefLang="uk" href="https://etaxi-kosice.sk/uk" />
        <link rel="alternate" hrefLang="he" href="https://etaxi-kosice.sk/he" />
        <link rel="alternate" hrefLang="hu" href="https://etaxi-kosice.sk/hu" />
        <link rel="alternate" hrefLang="ar" href="https://etaxi-kosice.sk/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://etaxi-kosice.sk/" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}