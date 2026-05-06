import "@/styles/globals.css";
import Script from 'next/script'
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";

function App({ Component, pageProps }: AppProps) {
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
<Component {...pageProps} />
      <CookieConsent />
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
