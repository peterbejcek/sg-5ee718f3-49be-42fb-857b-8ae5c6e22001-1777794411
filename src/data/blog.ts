export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "elektromobily-v-taxi",
    title: "Prečo sme prešli na elektrické vozidlá?",
    excerpt: "Elektrické vozidlá sú budúcnosť taxislužieb. Prinášajú nižšie náklady, tichú jazdu a nulové emisie.",
    content: `
      V E-TAXI Košice sme sa rozhodli investovať do elektrických vozidiel z niekoľkých dôvodov.
      
      **Výhody pre zákazníkov:**
      - Tichá a plynulá jazda
      - Moderné vybavenie (klimatizácia, WiFi)
      - Čistý vzduch vo vozidle
      
      **Výhody pre životné prostredie:**
      - Nulové emisie CO2 v meste
      - Zníženie hluku v mestskej zástavbe
      - Podpora udržateľnej mobility
      
      Naša flotila Tesla Model 3 a plug-in hybridov predstavuje našu víziu modernej, ekologickej taxislužby.
    `,
    date: "2026-03-15",
    author: "Peter Novák",
    category: "Ekológia",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"
  },
  {
    id: "letiskove-transfery",
    title: "Ako fungujú letiskové transfery?",
    excerpt: "Všetko, čo potrebujete vedieť o preprave na letisko Košice. Jednoduché objednanie, fixná cena, sledovanie letu.",
    content: `
      Letiskové transfery patria medzi naše najobľúbenejšie služby. Tu je niekoľko tipov:
      
      **Objednanie:**
      - Rezervujte si jazdu aspoň 24 hodín vopred
      - Uveďte číslo letu - sledujeme prílet/odlet
      - Fixná cena bez ohľadu na dopravu
      
      **V deň transferu:**
      - Vodič čaká na dohodnutom mieste (pri odlete) alebo v príletovej hale (pri prílete)
      - SMS s menom vodiča a ŠPZ vozidla
      - Pomoc s batožinou
      
      **Ceny:**
      - Košice centrum → Letisko: 15-20 €
      - Prešov → Letisko: 25-30 €
      - Pri zmeškané letu neúčtujeme storno poplatok
    `,
    date: "2026-02-20",
    author: "Mária Kováčová",
    category: "Služby",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
  },
  {
    id: "firemne-ucty",
    title: "Firemné účty a mesačné faktúry",
    excerpt: "Pre firmy ponúkame špeciálne podmienky - mesačné faktúry, zľavy a dedikovaný account manažér.",
    content: `
      Spolupracujeme s viac ako 50 firmami v Košiciach. Čo im môžeme ponúknuť?
      
      **Výhody firemného účtu:**
      - Mesačná faktúra s rozpísaním všetkých jázd
      - Možnosť platby prevodom (nie je potrebná hotovosť)
      - Špeciálne zľavy pri pravidelných objednávkach
      - Dedikovaný account manažér
      
      **Ako to funguje:**
      1. Uzatvoríme zmluvu o spolupráci
      2. Zamestnanci si objednávajú cez telefón alebo formulár
      3. Každý mesiac vystavíme súhrnnú faktúru
      4. Platba prevodom s 14-dňovou splatnosťou
      
      Ideálne pre firmy s častými obchodnými cestami, transfermi hostí alebo dopravou zamestnancov.
    `,
    date: "2026-01-10",
    author: "Ján Horváth",
    category: "Biznis",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
  }
];