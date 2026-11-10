/**
 * Home-page copy and image references were transcribed from curatedxcatalina.com
 * on 10 November 2026. The original site is the source of truth.
 *
 * Image URLs point to the EXISTING Squarespace CDN so the owner's existing
 * photography remains intact. The demo needs internet access for those photos.
 */
export const ORIGINAL_SITE = "https://www.curatedxcatalina.com";

const cdn = "https://images.squarespace-cdn.com/content/v1/6a2fac5f88c84819b0008a1e";

export const imagery = {
  hero: `${cdn}/96000d37-f35b-483f-bc79-62ab2e9f04e0/IMG_4872.jpeg?format=2000w`,
  itineraries: `${cdn}/80e563e6-6609-434f-bd90-a005d7275af7/IMG_7423.jpeg?format=1200w`,
  concierge: `${cdn}/a0649d4f-af3e-4a4b-a50e-1e3b2b020b77/IMG_5708.jpeg?format=1200w`,
  thailand: `${cdn}/4025a053-b7a9-420a-bb01-5018f331eeee/IMG_0727.jpeg?format=1200w`,
  catalina: `${cdn}/359cc025-353d-4f66-a4f9-ad9b19a86049/IMG_3455.jpg?format=1500w`,
  signature: `${cdn}/dc0e7ec2-0e54-4c03-a4ba-1dcaa2c028e5/curated%2Bx%2Bcatalina%2Bsignature%2Btransparent%2B%281000%2Bx%2B1000%2Bpx%29.png?format=750w`
} as const;

export const services = [
  {
    no: "01",
    title: "Curated Itineraries",
    description: "Every journey is thoughtfully designed around your pace, priorities, and the experiences that matter most.",
    image: imagery.itineraries,
    alt: "Clear turquoise water off the coast of La Paz, Mexico",
    className: "itinerary"
  },
  {
    no: "02",
    title: "Travel Concierge",
    description: "From hotel reservations to last-minute changes, enjoy seamless support before, during, and after you travel.",
    image: imagery.concierge,
    alt: "Rust-colored wall and a mirror reflecting a wide sky",
    className: "concierge"
  },
  {
    no: "03",
    title: "Thailand Specialist",
    description: "Insider recommendations and authentic experiences from someone who knows Thailand beyond the guidebooks.",
    image: imagery.thailand,
    alt: "Illuminated golden Buddhist temple in Chiang Mai, Thailand",
    className: "thailand"
  }
] as const;

export const journal = [
  {
    no: "01",
    date: "October 29, 2026",
    category: "A local's guide",
    title: "The Comprehensive List of Things I Told My Best Friend Before Visiting Thailand",
    description: "The things I told my best friend before she came to visit me in Thailand — from taking your shoes off and navigating Thai bathrooms to Grab rides, money, nightlife, cultural etiquette, and all the little things you only learn by living here. Consider this your unofficial guide to not looking completely lost when you land.",
    href: `${ORIGINAL_SITE}/blog/things-to-know-before-visiting-thailand`
  },
  {
    no: "02",
    date: "September 21, 2026",
    category: "Life in Thailand",
    title: "25 Things That Surprised Me After Moving to Thailand",
    description: "Moving to Thailand comes with plenty of expected changes—but some of the biggest surprises are the tiny, oddly specific things you never think to Google beforehand. Here are 25 things that surprised me after moving to Thailand, from freezing 7-Elevens and LINE to geckos, Grab, Thai breakfast, and the mysterious disappearance of street addresses.",
    href: `${ORIGINAL_SITE}/blog/25-things-that-surprised-me-after-moving-to-thailand`
  },
  {
    no: "03",
    date: "September 11, 2026",
    category: "Packing notes",
    title: "What I’d Actually Pack for a Trip to Thailand",
    description: "I’m a chronic overpacker, but after backpacking through Thailand, traveling with multiple giant suitcases, and eventually moving here, I’ve learned a thing or two about what’s actually worth bringing. Here’s what I’d pack for a 2–3 week trip to Thailand — including what I’d leave at home, what I’d buy at 7-Eleven, and what I’d pack differently depending on where I’m going.",
    href: `${ORIGINAL_SITE}/blog/thailand-packing-list`
  }
] as const;

export const feelings = [
  { less: "Less searching.", more: "More experiencing." },
  { less: "Less guessing.", more: "More confidence." },
  { less: "Less planning.", more: "More anticipation." },
  { less: "Less stress.", more: "More presence." },
  { less: "Less ordinary.", more: "More unforgettable." }
] as const;
