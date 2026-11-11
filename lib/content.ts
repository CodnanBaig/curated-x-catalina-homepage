/**
 * Content and asset registry sourced directly from https://www.curatedxcatalina.com/.
 * Brand logos and favicon live locally under /public/brand/ for instant rendering;
 * editorial photography references the owner's live Squarespace CDN assets.
 */
export const ORIGINAL_SITE = "https://www.curatedxcatalina.com";

const cdn = "https://images.squarespace-cdn.com/content/v1/6a2fac5f88c84819b0008a1e";

export const imagery = {
  logoWordmark: "/brand/logo-wordmark.png",
  signature: "/brand/signature-xo.png",
  favicon: "/brand/favicon.png",
  hero: `${cdn}/96000d37-f35b-483f-bc79-62ab2e9f04e0/IMG_4872.jpeg?format=2500w`,
  itineraries: `${cdn}/80e563e6-6609-434f-bd90-a005d7275af7/IMG_7423.jpeg?format=2500w`,
  concierge: `${cdn}/a0649d4f-af3e-4a4b-a50e-1e3b2b020b77/IMG_5708.jpeg?format=1500w`,
  thailand: `${cdn}/4025a053-b7a9-420a-bb01-5018f331eeee/IMG_0727.jpeg?format=1500w`,
  catalina: `${cdn}/359cc025-353d-4f66-a4f9-ad9b19a86049/IMG_3455.jpg?format=1500w`,
} as const;

export const heroCopy = {
  eyebrow: "Thailand Travel Concierge & Custom Itineraries",
  titlePrefix: "Journeys,",
  titleEmphasis: "Curated",
  lead: "Thoughtful itineraries, trusted recommendations, and meticulous planning for travelers who value exceptional experiences over ordinary trips.",
  primaryCta: "Discover More",
  secondaryCta: "Book a consultation",
  photoAlt: "Coastal landscape with rocky shoreline, cliffs, and the ocean under a clear blue sky.",
} as const;

export const services = [
  {
    no: "01",
    title: "Curated Itineraries",
    description:
      "Every journey is thoughtfully designed around your pace, priorities, and the experiences that matter most.",
    image: imagery.itineraries,
    alt: "La Paz, Mexico clear turquoise water along a rocky cove",
    href: `${ORIGINAL_SITE}/services-content`,
  },
  {
    no: "02",
    title: "Travel Concierge",
    description:
      "From hotel reservations to last-minute changes, enjoy seamless support before, during, and after you travel.",
    image: imagery.concierge,
    alt: "Rustic wall with mirror in west Texas reflecting a wide sky",
    href: `${ORIGINAL_SITE}/services-content`,
  },
  {
    no: "03",
    title: "Thailand Specialist",
    description:
      "Insider recommendations and authentic experiences from someone who knows Thailand beyond the guidebooks.",
    image: imagery.thailand,
    alt: "Illuminated golden Buddhist temple in Chiang Mai, Thailand",
    href: `${ORIGINAL_SITE}/services-content`,
  },
] as const;

export const aboutStory = {
  heading: "Why Travel With C x C?",
  body: "Half Thai, now living in Chiang Mai, I spend my days uncovering hidden cafés, boutique stays, and experiences most travelers miss. Curated x Catalina was created to help you experience Thailand with the confidence of having someone local in your corner.",
  photoAlt:
    "Catalina smiling in a pink and purple dress at a vineyard, holding a glass of white wine with mountains behind her.",
  signatureAlt: "XO, curated x catalina",
  ctaLabel: "More about Catalina",
  href: `${ORIGINAL_SITE}/about`,
} as const;

export const journal = [
  {
    no: "01",
    date: "October 29, 2026",
    category: "Thailand Guide",
    title: "The Comprehensive List of Things I Told My Best Friend Before Visiting Thailand",
    description:
      "The things I told my best friend before she came to visit me in Thailand — from taking your shoes off and navigating Thai bathrooms to Grab rides, money, nightlife, cultural etiquette, and all the little things you only learn by living here. Consider this your unofficial guide to not looking completely lost when you land.",
    image: `${cdn}/1793326396781-MPB4QI0LS0SDWUADWDYG/1.png?format=500w`,
    href: `${ORIGINAL_SITE}/blog/things-to-know-before-visiting-thailand`,
  },
  {
    no: "02",
    date: "September 21, 2026",
    category: "Life Abroad",
    title: "25 Things That Surprised Me After Moving to Thailand",
    description:
      "Moving to Thailand comes with plenty of expected changes—but some of the biggest surprises are the tiny, oddly specific things you never think to Google beforehand. Here are 25 things that surprised me after moving to Thailand, from freezing 7-Elevens and LINE to geckos, Grab, Thai breakfast, and the mysterious disappearance of street addresses.",
    image: `${cdn}/1790037486953-Z71T9KPMNH43GUOZVNZI/1.png?format=500w`,
    href: `${ORIGINAL_SITE}/blog/25-things-that-surprised-me-after-moving-to-thailand`,
  },
  {
    no: "03",
    date: "September 11, 2026",
    category: "Packing Notes",
    title: "What I’d Actually Pack for a Trip to Thailand",
    description:
      "I’m a chronic overpacker, but after backpacking through Thailand, traveling with multiple giant suitcases, and eventually moving here, I’ve learned a thing or two about what’s actually worth bringing. Here’s what I’d pack for a 2–3 week trip to Thailand — including what I’d leave at home, what I’d buy at 7-Eleven, and what I’d pack differently depending on where I’m going.",
    image: `${cdn}/1789124766884-WGQCYC2SZEEF0SRHLBSG/3.png?format=500w`,
    href: `${ORIGINAL_SITE}/blog/thailand-packing-list`,
  },
] as const;

export const feelings = [
  { less: "Less searching.", more: "More experiencing." },
  { less: "Less guessing.", more: "More confidence." },
  { less: "Less planning.", more: "More anticipation." },
  { less: "Less stress.", more: "More presence." },
  { less: "Less ordinary.", more: "More unforgettable." },
] as const;

export const navLinks = [
  { label: "Services", href: "#services", external: false },
  { label: "Journal", href: "#journal", external: false },
  { label: "About", href: "#about", external: false },
  { label: "FAQ", href: `${ORIGINAL_SITE}/faq`, external: true },
  { label: "Contact", href: `${ORIGINAL_SITE}/contact`, external: true },
] as const;

export const footerLinks = [
  { label: "Services", href: `${ORIGINAL_SITE}/services` },
  { label: "About", href: `${ORIGINAL_SITE}/about` },
  { label: "FAQ", href: `${ORIGINAL_SITE}/faq` },
  { label: "Blog", href: `${ORIGINAL_SITE}/blog` },
  { label: "Contact", href: `${ORIGINAL_SITE}/contact` },
] as const;
