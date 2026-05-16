export const TICKET_PRICES = {
  university: {
    student: { early: 5, dayOf: 7 },
    standard: { early: 7, dayOf: 9 },
  },
  schloss: {
    student: { early: 10, dayOf: 10 },
    standard: { early: 15, dayOf: 15 },
  },
};

export function getTicketPrice(isStudent: boolean, isDayOf: boolean, theater: string): number {
  const venueKey = theater.toLowerCase() as keyof typeof TICKET_PRICES;
  const venue = TICKET_PRICES[venueKey] ?? TICKET_PRICES.university;
  const tier = isStudent ? venue.student : venue.standard;
  return isDayOf ? tier.dayOf : tier.early;
}

export interface Show {
  city: string;
  theater: string;
  date: string;
  isoDate: string;
  link: string;
}

export const SHOWS: Show[] = [
  { city: "Saarbrücken (PREMIERE)", theater: "university", date: "28.05.2026 -- 19:00 PM", isoDate: "2026-05-28", link: "https://maps.app.goo.gl/hHZgWYLw6xKoWy2P9" },
  { city: "Saarbrücken", theater: "university", date: "29.05.2026 -- 19:00 PM", isoDate: "2026-05-29", link: "https://maps.app.goo.gl/hHZgWYLw6xKoWy2P9" },
  { city: "Saarbrücken", theater: "Schloss", date: "03.06.2026 -- 19:00 PM", isoDate: "2026-06-03", link: "https://maps.app.goo.gl/DpXvUa7GZeKuCdeo7" },
  { city: "Saarbrücken", theater: "university", date: "09.06.2026 -- 19:00 PM", isoDate: "2026-06-09", link: "https://maps.app.goo.gl/hHZgWYLw6xKoWy2P9" },
  { city: "Saarbrücken (GraFiTi festival)", theater: "university", date: "03.07.2026 -- 19:00 PM", isoDate: "2026-07-03", link: "https://maps.app.goo.gl/8EYvAvwCSLnbW7Sg6" },
];
