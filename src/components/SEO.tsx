import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
}

export function SEO({
  title = "E-TAXI Košice | Profesionálna taxislužba 24/7",
  description = "Profesionálna taxislužba v Košiciach dostupná 24/7. Letiskové transfery Budapešť, Krakov, Viedeň. Online objednávka, moderné vozidlá. Dispečing +421 911 606 206",
  image = "https://etaxi-kosice.sk/og-image.png",
  url = "https://etaxi-kosice.sk",
  type = "website",
  locale = "sk_SK",
  siteName = "E-TAXI Košice"
}: SEOProps) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="taxi košice, taxislužba košice, letiskový transfer, taxi budapešť, taxi krakov, taxi viedeň, e-taxi, online objednávka taxi, firemný transfer" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Slovak" />
      <meta name="author" content="E-TAXI Košice" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="geo.region" content="SK-KI" />
      <meta name="geo.placename" content="Košice" />
      <meta name="geo.position" content="48.7164;21.2611" />
      <meta name="ICBM" content="48.7164, 21.2611" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    </Head>
  );
}

// Export for _document.tsx static SEO
export function SEOElements({
  title = "E-TAXI Košice | Profesionálna taxislužba 24/7",
  description = "Profesionálna taxislužba v Košiciach dostupná 24/7. Letiskové transfery Budapešť, Krakov, Viedeň. Online objednávka, moderné vozidlá. Dispečing +421 911 606 206",
  image = "https://etaxi-kosice.sk/og-image.png",
  url = "https://etaxi-kosice.sk"
}: SEOProps) {
  return (
    <>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="taxi košice, taxislužba košice, letiskový transfer, taxi budapešť, taxi krakov, taxi viedeň, e-taxi, online objednávka taxi" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </>
  );
}