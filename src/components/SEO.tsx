import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export function SEO({ 
  title = "E-TAXI Košice | Taxislužba 24/7 | Transfery na letisko Budapešť, Krakov, Viedeň",
  description = "Profesionálna taxislužba v Košiciach ✓ Dispečing 24/7 ✓ Letiskové transfery Budapešť, Krakov, Viedeň ✓ Online objednávka ✓ Moderné vozidlá ✓ Expresné transfery na letiská",
  image = "https://etaxi-kosice.sk/og-image.png",
  url = "https://etaxi-kosice.sk"
}: SEOProps) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="taxi Košice, taxislužba Košice, taxi služba Košice, transfer letisko Budapešť, transfer Budapešť Košice, letiskový transfer Budapešť, transfer Krakov, transfer Viedeň, taxi na letisko, letiskové transfery, taxi 24/7 Košice, dispečing taxi Košice, objednať taxi Košice, expresný transfer letisko, medzinárodné transfery Košice" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Slovak" />
      <meta name="author" content="E-TAXI Košice" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="SK-KI" />
      <meta name="geo.placename" content="Košice" />
      <meta name="geo.position" content="48.7164;21.2611" />
      <meta name="ICBM" content="48.7164, 21.2611" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:site_name" content="E-TAXI Košice" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}