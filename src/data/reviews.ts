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
    name: "Diana Švarcová",
    rating: 5,
    date: "pred 3 rokmi",
    text: "Naozaj veľmi príjemná cesta šofér pozorný, slušný a neskutočne milý pre ďalšiu cestu v KE budem jednoznačne využívať túto taxislužbu. 💯 Mladý pán ak toto čítate kľudne sa ozvite a pozývam na kávu ☕",
    service: "Firemný transfer"
  },
  {
    id: "3",
    name: "Q Q",
    rating: 5,
    date: "pred 2 mesiacmi",
    text: "Ďakujeme za rýchly prístup spoločnosti.Vrelo odporúčam.Spokojnosť 🙂",
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