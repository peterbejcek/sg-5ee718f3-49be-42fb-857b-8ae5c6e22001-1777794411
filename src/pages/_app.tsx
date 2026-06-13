import "@/styles/globals.css";
import Script from 'next/script'
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-X6TG110M6V"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X6TG110M6V');
        `}
      </Script>
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
      <Component {...pageProps} />
      <CookieConsent />
    </ThemeProvider>
  );
}