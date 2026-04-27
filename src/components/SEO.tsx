import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export function SEOElements({
  title = "E-TAXI Košice | Taxislužba 24/7 | Letiskové transfery",
  description = "Profesionálna taxislužba v Košiciach. Objednajte si taxi online alebo zavolajte +421 911 606 206. Letiskové transfery do Budapešti, Krakova, Viedne. Moderný vozový park, transparentné ceny.",
  image = "/og-image.png",
  url = "https://etaxi-kosice.sk",
  type = "website",
  keywords = "taxi Košice, taxík Košice, taxislužba Košice, letiskový transfer, Košice letisko, taxi na letisko, transfer Budapešť, transfer Krakov, online objednávka taxi"
}: SEOProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:site_name" content="E-TAXI Košice" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
    </>
  );
}

export function SEO(props: SEOProps) {
  return (
    <Head>
      <SEOElements {...props} />
    </Head>
  );
}