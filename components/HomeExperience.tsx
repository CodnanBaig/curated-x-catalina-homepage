"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import FlightStage, { type FlightPose } from "@/components/FlightStage";
import { feelings, imagery, journal, ORIGINAL_SITE, services } from "@/lib/content";

const easeOut = [0.22, 1, 0.36, 1] as const;
const CONTACT = `${ORIGINAL_SITE}/contact`;

const INITIAL_POSE: FlightPose = {
  progress: 0,
  stageIndex: 0,
  behindGlobe: false,
  globeOrbitProgress: 0,
};

function Arrow({ className = "icon-arrow" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 18 18 6M8.5 6H18v9.5" />
    </svg>
  );
}

function PlaneToggleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="toggle-plane-icon" aria-hidden="true">
      <path
        d="M21 3 3 10.5l7.2 2.8L14.5 21 21 3ZM10.2 13.3 21 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Interactive 3D tilt container that responds smoothly to cursor movement.
 */
function TiltFrame({
  children,
  className = "",
  intensity = 6,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const smoothRx = useSpring(rx, { stiffness: 180, damping: 22 });
  const smoothRy = useSpring(ry, { stiffness: 180, damping: 22 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(-ny * intensity);
    ry.set(nx * intensity);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-frame ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: smoothRx,
        rotateY: smoothRy,
        transformPerspective: 1100,
      }}
    >
      {children}
    </motion.div>
  );
}

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#globe" },
  { label: "About", href: "#story" },
  { label: "Journal", href: "#journal" },
];

function Header({
  scrolled,
  menuOpen,
  setMenuOpen,
  flightEnabled,
  setFlightEnabled,
}: {
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (next: boolean) => void;
  flightEnabled: boolean;
  setFlightEnabled: (next: boolean) => void;
}) {
  return (
    <>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand__sigil">C×C</span>
          <span className="brand__name">
            Curated <i>x</i> Catalina
          </span>
        </a>

        <nav aria-label="Main navigation" className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-controls">
          <button
            type="button"
            className={`flight-toggle ${flightEnabled ? "flight-toggle--on" : "flight-toggle--off"}`}
            onClick={() => setFlightEnabled(!flightEnabled)}
            aria-pressed={flightEnabled}
            title={flightEnabled ? "Pause 3D flight animation" : "Enable 3D flight animation"}
          >
            <PlaneToggleIcon />
            <span className="flight-toggle__text">
              Flight {flightEnabled ? "On" : "Off"}
            </span>
          </button>

          <a
            className="button button--small header-cta"
            href={CONTACT}
            target="_blank"
            rel="noopener noreferrer"
          >
            Plan your trip <Arrow />
          </a>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="site-menu"
            aria-label="Mobile navigation"
            className="menu-panel"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05, duration: 0.45, ease: easeOut }}
              >
                {link.label}
              </motion.a>
            ))}
            <a
              className="button"
              href={CONTACT}
              target="_blank"
              rel="noopener noreferrer"
            >
              Plan your trip <Arrow />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Continuous background SVG route line that zig-zags behind all sections.
 */
function AerialRouteBackdrop() {
  return (
    <svg
      className="aerial-route-svg"
      viewBox="0 0 1440 5800"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 280 260 C 980 480, 1280 660, 1120 940 C 960 1220, 180 1320, 300 1720 C 420 2120, 1260 2180, 720 2780 C 180 3380, 1240 3480, 1120 3980 C 1000 4480, 220 4560, 360 4980 C 500 5400, 720 5540, 720 5720"
        stroke="url(#routeGrad)"
        strokeWidth="2"
        strokeDasharray="10 12"
      />
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="5800" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bb3028" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#c69963" stopOpacity="0.48" />
          <stop offset="80%" stopColor="#bb3028" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#bb3028" stopOpacity="0.14" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Hero({ behindElements }: { behindElements: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);

  return (
    <section className="hero shell" id="top" ref={ref}>
      <div className="hero__grid">
        <div className="hero__copy text-shield">
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            THAILAND &amp; BEYOND · BESPOKE TRAVEL ATELIER
          </motion.span>

          <h1 className="hero__title">
            <span className="hero__line">
              <motion.span
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.05, delay: 0.08, ease: easeOut }}
              >
                Journeys,
              </motion.span>
            </span>
            <span className="hero__line hero__line--indent">
              <motion.span
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.05, delay: 0.2, ease: easeOut }}
              >
                <em>curated</em>
                <span className="dot">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38, ease: easeOut }}
          >
            Custom itineraries and travel concierge for Thailand and beyond,
            planned by someone who lives there.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: easeOut }}
          >
            <a
              className="button"
              href={CONTACT}
              target="_blank"
              rel="noopener noreferrer"
            >
              Plan your trip <Arrow />
            </a>
            <a className="text-link" href="#services">
              See services
            </a>
          </motion.div>
        </div>

        <motion.div
          className={`hero__visual ${behindElements ? "layer-occlude" : "layer-under"}`}
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.15, delay: 0.22, ease: easeOut }}
        >
          <TiltFrame className="hero__window" intensity={6}>
            <div className="hero__window-frame">
              <motion.img
                style={{ y: imgY, scale: imgScale }}
                src={imagery.hero}
                alt="A rocky coastline above a deep-blue cove"
                fetchPriority="high"
              />
              <div className="hero__window-overlay">
                <div className="window-badge">
                  <span className="window-badge__label">COASTAL HORIZONS</span>
                  <strong>24°08′N · 110°18′W</strong>
                </div>
                <div className="window-badge window-badge--right">
                  <span className="window-badge__label">HOME BASE</span>
                  <strong>CHIANG MAI, THAILAND</strong>
                </div>
              </div>
            </div>
          </TiltFrame>
        </motion.div>
      </div>
    </section>
  );
}

function Services({ behindElements }: { behindElements: boolean }) {
  const alignments = ["left", "right", "left"] as const;

  return (
    <section className="services shell" id="services">
      <motion.div
        className="section-head text-shield"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div>
          <span className="section-kicker">TAILORED TO YOUR PACE</span>
          <h2>How I can help</h2>
        </div>
        <a
          className="text-link"
          href={`${ORIGINAL_SITE}/services`}
          target="_blank"
          rel="noopener noreferrer"
        >
          All services <Arrow />
        </a>
      </motion.div>

      <div className="waypoints-corridor">
        {services.map((service, i) => {
          const side = alignments[i];
          const mediaOccludeClass =
            behindElements || i % 2 === 0 ? "layer-occlude" : "layer-under";
          return (
            <motion.article
              key={service.no}
              className={`waypoint-card waypoint-card--${side}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.9, ease: easeOut }}
            >
              <TiltFrame className={`waypoint-card__media ${mediaOccludeClass}`} intensity={5}>
                <a
                  href={`${ORIGINAL_SITE}/services`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="waypoint-card__img-link"
                >
                  <img src={service.image} alt={service.alt} loading="lazy" />
                </a>
              </TiltFrame>

              <div className="waypoint-card__body text-shield">
                <span className="waypoint-card__no">{service.no}</span>
                <h3>
                  <a
                    href={`${ORIGINAL_SITE}/services`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {service.title} <Arrow />
                  </a>
                </h3>
                <p>{service.description}</p>
                <a
                  className="text-link"
                  href={`${ORIGINAL_SITE}/services`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Illustrated 2D Earth Globe section where the 3D aircraft visibly crosses
 * in front of the globe, rounds the horizon limb, flies BEHIND the 2D Earth disc,
 * and reappears on the other side on its route to Thailand!
 */
function GlobeCrossing({ pose }: { pose: FlightPose }) {
  return (
    <section className="globe-section" id="globe">
      <div className="globe-section__inner shell">
        <motion.div
          className="globe-section__copy text-shield"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          <span className="section-kicker">ACROSS OCEANS · LOCAL IN THAILAND</span>
          <h2>
            From anywhere in the world, <em>to the heart of Thailand.</em>
          </h2>
          <p>
            Whether you are flying in from California, New York, or London,
            every route is choreographed down to the smallest transfer, boutique
            hideaway, and neighborhood table in Chiang Mai, Bangkok, and the
            southern islands.
          </p>
          <div className="globe-coords">
            <div>
              <span>PACIFIC &amp; AMERICAS</span>
              <strong>34°03′N · 118°14′W</strong>
            </div>
            <span className="globe-coords__arrow">⟶</span>
            <div>
              <span>CHIANG MAI, THAILAND</span>
              <strong>18°47′N · 98°59′E</strong>
            </div>
          </div>
        </motion.div>

        <div className="globe-stage">
          {/* Back half of the orbital ring (always behind the Earth) */}
          <svg
            className="globe-orbit-back"
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="300"
              cy="300"
              rx="275"
              ry="88"
              transform="rotate(-16 300 300)"
              stroke="#c69963"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeOpacity="0.55"
            />
          </svg>

          {/* The 2D Illustrated Earth Disc:
              When pose.behindGlobe is true, the Earth sits at z-index 20 (ABOVE the 3D plane canvas),
              so the plane physically disappears BEHIND the 2D Earth and emerges on the other side!
              When pose.behindGlobe is false, the Earth sits at z-index 6 (BELOW the 3D plane canvas),
              so the plane visibly flies right across the front of the 2D Earth! */}
          <motion.div
            id="earth-disc-target"
            className={`earth-disc ${
              pose.behindGlobe ? "earth-disc--occlude-plane" : "earth-disc--behind-plane"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, ease: easeOut }}
          >
            <svg
              viewBox="0 0 520 520"
              fill="none"
              className="earth-disc__svg"
              role="img"
              aria-label="Illustrated 2D globe showing the route across the ocean to Thailand"
            >
              <defs>
                <radialGradient id="oceanGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#2b586e" />
                  <stop offset="55%" stopColor="#1c3d4f" />
                  <stop offset="100%" stopColor="#122836" />
                </radialGradient>
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3ead8" />
                  <stop offset="100%" stopColor="#dccab0" />
                </linearGradient>
                <clipPath id="earthClip">
                  <circle cx="260" cy="260" r="228" />
                </clipPath>
              </defs>

              {/* Outer Brass Compass Bezel */}
              <circle
                cx="260"
                cy="260"
                r="244"
                stroke="#c69963"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <circle
                cx="260"
                cy="260"
                r="234"
                stroke="#191513"
                strokeOpacity="0.18"
                strokeWidth="1"
              />

              {/* 2D Earth Ocean Sphere */}
              <g clipPath="url(#earthClip)">
                <circle cx="260" cy="260" r="228" fill="url(#oceanGrad)" />

                {/* Latitude & Longitude Graticule Lines */}
                <g stroke="#f5efe4" strokeOpacity="0.14" strokeWidth="1">
                  <ellipse cx="260" cy="260" rx="228" ry="70" />
                  <ellipse cx="260" cy="260" rx="228" ry="145" />
                  <line x1="32" y1="260" x2="488" y2="260" />
                  <ellipse cx="260" cy="260" rx="75" ry="228" />
                  <ellipse cx="260" cy="260" rx="155" ry="228" />
                  <line x1="260" y1="32" x2="260" y2="488" />
                </g>

                {/* Stylized 2D Continents: Eurasia & Southeast Asia (Thailand highlighted) */}
                <path
                  d="M 65 140 C 95 110, 155 95, 215 110 C 260 120, 295 145, 310 185 C 320 215, 300 248, 285 278 C 276 298, 278 325, 265 335 C 252 322, 248 292, 238 272 C 218 258, 196 272, 182 288 C 168 265, 155 238, 128 228 C 98 218, 72 182, 65 140 Z"
                  fill="url(#landGrad)"
                />
                {/* Japan & Island Arc */}
                <path
                  d="M 332 176 C 344 188, 348 208, 338 224 C 328 216, 326 196, 332 176 Z"
                  fill="url(#landGrad)"
                />
                {/* Indonesia & Philippines */}
                <path
                  d="M 272 348 C 292 344, 315 352, 332 364 C 314 372, 286 368, 272 348 Z"
                  fill="url(#landGrad)"
                />
                {/* Australia Silhouette */}
                <path
                  d="M 305 398 C 338 386, 378 396, 392 426 C 384 452, 346 462, 315 446 C 298 432, 294 410, 305 398 Z"
                  fill="url(#landGrad)"
                />
                {/* Americas Rim on Eastern Edge */}
                <path
                  d="M 425 95 C 458 118, 482 162, 476 215 C 462 242, 442 255, 452 288 C 464 322, 488 355, 472 405 C 448 382, 432 335, 422 292 C 412 248, 398 152, 425 95 Z"
                  fill="url(#landGrad)"
                />

                {/* Inscribed Great-Circle Flight Arc across the 2D Globe */}
                <path
                  d="M 442 192 Q 355 135 268 278"
                  stroke="#bb3028"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  fill="none"
                />

                {/* Departure Pin (Americas Coast) */}
                <circle cx="442" cy="192" r="5" fill="#f5efe4" stroke="#bb3028" strokeWidth="2.5" />

                {/* Pulsing Destination Beacon: Chiang Mai, Thailand */}
                <circle cx="268" cy="278" r="18" fill="#bb3028" fillOpacity="0.24" />
                <circle cx="268" cy="278" r="9" fill="#bb3028" fillOpacity="0.45" />
                <circle cx="268" cy="278" r="5" fill="#bb3028" stroke="#fbf7f0" strokeWidth="2" />

                {/* Chiang Mai Callout Tag on the 2D Earth */}
                <g transform="translate(118, 262)">
                  <rect
                     width="136"
                    height="32"
                    rx="16"
                    fill="#191513"
                    fillOpacity="0.86"
                  />
                  <text
                    x="68"
                    y="20"
                    textAnchor="middle"
                    fill="#fbf7f0"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="1.4"
                  >
                    CHIANG MAI · CNX
                  </text>
                </g>

                {/* Inner atmospheric rim shading */}
                <circle
                  cx="260"
                  cy="260"
                  r="228"
                  stroke="#f5efe4"
                  strokeOpacity="0.28"
                  strokeWidth="6"
                  fill="none"
                />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Story({ behindElements }: { behindElements: boolean }) {
  return (
    <section className="story" id="story">
      <div className="story__inner shell">
        <motion.div
          className={`story__visual ${behindElements ? "layer-occlude" : "layer-under"}`}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          <TiltFrame className="story__photo-card" intensity={5}>
            <img
              src={imagery.catalina}
              alt="Catalina at a vineyard, holding a glass of wine with mountains behind her"
              loading="lazy"
            />
            <div className="story__photo-stamp">
              <span>BASED IN CHIANG MAI</span>
              <strong>18°47′N · 98°59′E</strong>
            </div>
          </TiltFrame>
        </motion.div>

        <motion.div
          className="story__text text-shield"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeOut }}
        >
          <span className="section-kicker">SOMEONE LOCAL IN YOUR CORNER</span>
          <h2>Hi, I&rsquo;m Catalina.</h2>
          <p>
            Half Thai, now living in Chiang Mai, I spend my days uncovering
            hidden cafés, boutique stays, and experiences most travelers miss.
            Curated x Catalina was created to help you experience Thailand with
            the confidence of having someone local in your corner.
          </p>
          <img
            className="story__signature"
            src={imagery.signature}
            alt="xo, curated x catalina"
            loading="lazy"
          />
          <div className="story__footer">
            <a
              className="button"
              href={`${ORIGINAL_SITE}/about`}
              target="_blank"
              rel="noopener noreferrer"
            >
              More about me <Arrow />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Feelings() {
  return (
    <section className="feelings shell" id="feelings" aria-labelledby="feelings-title">
      <div className="feelings__header text-shield">
        <span className="section-kicker">THE PHILOSOPHY</span>
        <h2 id="feelings-title">Travel should feel like&hellip;</h2>
      </div>

      <ul className="feelings__ladder">
        {feelings.map((item, i) => (
          <motion.li
            key={item.more}
            className={`feeling-step feeling-step--${
              i % 2 === 0 ? "left" : "right"
            } text-shield`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.55, once: true }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: easeOut }}
          >
            <span className="feeling-step__fl">0{i + 1}</span>
            <div className="feeling-step__text">
              <span className="feeling-step__less">{item.less}</span>{" "}
              <em className="feeling-step__more">{item.more}</em>
            </div>
            <span className="feeling-step__compass" aria-hidden="true">
              ✦
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Journal() {
  return (
    <section className="journal shell" id="journal">
      <motion.div
        className="section-head text-shield"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div>
          <span className="section-kicker">FIELD NOTES &amp; GUIDES</span>
          <h2>From the journal</h2>
        </div>
        <a
          className="text-link"
          href={`${ORIGINAL_SITE}/blog`}
          target="_blank"
          rel="noopener noreferrer"
        >
          All posts <Arrow />
        </a>
      </motion.div>

      <div className="journal__grid">
        {journal.map((article, i) => (
          <motion.article
            key={article.no}
            className={`dispatch-card dispatch-card--${
              i % 2 === 0 ? "left" : "right"
            } text-shield`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: easeOut }}
          >
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="dispatch-card__link"
            >
              <div className="dispatch-card__top">
                <span className="dispatch-card__code">{article.no}</span>
                <span className="dispatch-card__category">{article.category}</span>
                <time className="dispatch-card__date">{article.date}</time>
              </div>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <span className="dispatch-card__cta">
                Read article <Arrow />
              </span>
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing" id="contact">
      <div className="closing__runway shell">
        <motion.div
          className="closing__card text-shield"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          <span className="closing__kicker">THAILAND &amp; BEYOND</span>
          <h2>
            Your world is <em>waiting.</em>
          </h2>
          <p>
            Every extraordinary journey begins with a single conversation. Tell
            me where you&rsquo;re dreaming of going.
          </p>
          <div className="closing__actions">
            <a
              className="button button--light"
              href={CONTACT}
              target="_blank"
              rel="noopener noreferrer"
            >
              Let&rsquo;s plan your journey <Arrow />
            </a>
            <a href="mailto:xo@curatedxcatalina.com" className="closing__mail">
              xo@curatedxcatalina.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer shell text-shield">
      <div className="footer__brand">
        <strong>Curated x Catalina</strong>
        <span>Thailand Travel Specialist &amp; Custom Itineraries</span>
      </div>
      <nav aria-label="Footer">
        {["about", "services", "faq", "contact"].map((page) => (
          <a
            key={page}
            href={`${ORIGINAL_SITE}/${page}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {page}
          </a>
        ))}
      </nav>
      <p>© {new Date().getFullYear()} Curated x Catalina</p>
    </footer>
  );
}

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [flightEnabled, setFlightEnabled] = useState(true);
  const [pose, setPose] = useState<FlightPose>(INITIAL_POSE);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const saved = window.localStorage.getItem("cxc-flight-enabled");
    if (saved === "false") {
      setFlightEnabled(false);
    }
  }, []);

  const handleToggleFlight = (next: boolean) => {
    setFlightEnabled(next);
    window.localStorage.setItem("cxc-flight-enabled", String(next));
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <FlightStage enabled={flightEnabled} onPoseChange={setPose} />
      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        flightEnabled={flightEnabled}
        setFlightEnabled={handleToggleFlight}
      />
      <div className="page-canvas">
        <AerialRouteBackdrop />
        <main>
          <Hero behindElements={pose.behindGlobe} />
          <Services behindElements={pose.behindGlobe} />
          <GlobeCrossing pose={pose} />
          <Story behindElements={pose.behindGlobe} />
          <Feelings />
          <Journal />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
