export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  service?: string;
}

export const reviewsData = {
  title: "Recenzie zákazníkov",
  subtitle: "Prečítajte si, čo hovoria naši spokojní zákazníci",
  googleProfileUrl: "https://share.google/h2KnVsH1yOKwyTuH4",
  averageRating: 4.8,
  totalReviews: 250
};

export const reviews: Review[] = [
  {
    id: "1",
    name: "Michal K.",
    rating: 5,
    date: "2026-04-15",
    text: "Vynikajúca služba! Vodič prišiel presne načas, auto čisté a pohodlné. Určite budem využívať aj naďalej.",
    service: "Transfer na letisko"
  },
  {
    id: "2",
    name: "Jana P.",
    rating: 5,
    date: "2026-04-10",
    text: "Profesionálny prístup, príjemná komunikácia s dispečingom. Odporúčam každému, kto hľadá spoľahlivú taxislužbu v Košiciach.",
    service: "Firemný transfer"
  },
  {
    id: "3",
    name: "Peter V.",
    rating: 5,
    date: "2026-04-05",
    text: "Už niekoľko rokov využívam E-TAXI a vždy som spokojný. Rýchle vyzdvihnutie, slušní vodiči, férové ceny.",
    service: "Mestská jazda"
  },
  {
    id: "4",
    name: "Katarína M.",
    rating: 5,
    date: "2026-03-28",
    text: "Potrebovala som odvoz na letisko včasráno. Vodič bol presný a cesta prebehla v pohode. Ďakujem!",
    service: "Transfer na letisko"
  },
  {
    id: "5",
    name: "Martin S.",
    rating: 4,
    date: "2026-03-20",
    text: "Dobrá služba, čisté vozidlá. Malé meškanie, ale vodič ma upozornil vopred. Celkovo spokojnosť.",
    service: "Mestská jazda"
  },
  {
    id: "6",
    name: "Lucia H.",
    rating: 5,
    date: "2026-03-15",
    text: "Výborný servis! Objednala som online, všetko prebehlo hladko. Odporúčam pre každého, kto potrebuje spoľahlivú prepravu.",
    service: "Firemný transfer"
  }
];