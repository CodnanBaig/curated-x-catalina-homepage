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
import FlightStage, { type FlightTelemetry } from "@/components/FlightStage";
import { feelings, imagery, journal, ORIGINAL_SITE, services } from "@/lib/content";

const easeOut = [0.22, 1, 0.36, 1] as const;
const CONTACT = `${ORIGINAL_SITE}/contact`;

const INITIAL_TELEMETRY: FlightTelemetry = {
  progress: 0,
  stageIndex: 0,
  stageLabel: "Origami Paper Glider",
  stageCode: "STAGE 01 · PAPER GLIDER",
  altitudeFt: 1400,
  speedKts: 45,
  coordinates: "34°03′N 118°14′W → 24°08′N 110°18′W",
  phaseNote: "First spark: sketching your bespoke route",
};

function Arrow({ className = "icon-arrow" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 18 18 6M8.5 6H18v9.5" />
    </svg>
  );
}

function PlaneStageIcon({ stage }: { stage: 0 | 1 | 2 }) {
  if (stage === 0) {
    // Origami Paper Glider icon
    return (
      <svg viewBox="0 0 24 24" fill="none" className="stage-icon" aria-hidden="true">
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
  if (stage === 1) {
    // Sleek Private Jet icon
    return (
      <svg viewBox="0 0 24 24" fill="none" className="stage-icon" aria-hidden="true">
        <path
          d="M12 2.5c.7 0 1.2.6 1.2 1.5v5.2l7.3 4.3v1.8l-7.3-2.3v4.6l2.6 1.9V21l-3.8-1-3.8 1v-1.5l2.6-1.9V13l-7.3 2.3v-1.8l7.3-4.3V4c0-.9.5-1.5 1.2-1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // Wide-body Passenger Jet icon
  return (
    <svg viewBox="0 0 24 24" fill="none" className="stage-icon" aria-hidden="true">
      <path
        d="M12 2c.9 0 1.5.7 1.5 1.8v4.8L22 13v2l-8.5-2.4v4.8l3.2 2.1v1.5L12 19.8 7.3 21v-1.5l3.2-2.1v-4.8L2 15v-2l8.5-4.4V3.8C10.5 2.7 11.1 2 12 2Z"
        fill="currentColor"
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
  intensity = 7,
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
  { label: "Waypoints", href: "#services" },
  { label: "Catalina", href: "#story" },
  { label: "Flight Levels", href: "#feelings" },
  { label: "Dispatches", href: "#journal" },
];

function Header({
  scrolled,
  menuOpen,
  setMenuOpen,
  telemetry,
}: {
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (next: boolean) => void;
  telemetry: FlightTelemetry;
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

        <div className="flight-hud-pill" aria-live="polite">
          <span className="flight-hud-pill__dot" />
          <PlaneStageIcon stage={telemetry.stageIndex} />
          <span className="flight-hud-pill__stage">{telemetry.stageLabel}</span>
          <span className="flight-hud-pill__sep">·</span>
          <span className="flight-hud-pill__alt">
            {telemetry.altitudeFt.toLocaleString()} FT
          </span>
        </div>

        <nav aria-label="Main navigation" className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

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
            <div className="menu-panel__telemetry">
              <span>{telemetry.stageCode}</span>
              <span>{telemetry.coordinates}</span>
            </div>
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
 * Right-side interactive flight altitude & aircraft morph scrubber.
 */
function FlightRail({ telemetry }: { telemetry: FlightTelemetry }) {
  const stages = [
    { label: "01 · Paper Glider", href: "#top", active: telemetry.stageIndex === 0 },
    { label: "02 · Private Jet", href: "#services-concierge", active: telemetry.stageIndex === 1 },
    { label: "03 · Passenger Jet", href: "#feelings", active: telemetry.stageIndex === 2 },
  ];

  return (
    <aside className="flight-rail" aria-label="Flight stage progress">
      <div className="flight-rail__track">
        <div
          className="flight-rail__fill"
          style={{ transform: `scaleY(${Math.max(0.03, telemetry.progress)})` }}
        />
      </div>
      <div className="flight-rail__stages">
        {stages.map((item, idx) => (
          <a
            key={item.href}
            href={item.href}
            className={`flight-rail__node ${item.active ? "flight-rail__node--active" : ""}`}
            title={item.label}
          >
            <span className="flight-rail__pip" />
            <span className="flight-rail__label">{item.label}</span>
            <PlaneStageIcon stage={idx as 0 | 1 | 2} />
          </a>
        ))}
      </div>
    </aside>
  );
}

/**
 * Continuous background SVG route line that zig-zags behind all sections,
 * visually anchoring the 3D aircraft's path.
 */
function AerialRouteBackdrop() {
  return (
    <svg
      className="aerial-route-svg"
      viewBox="0 0 1440 5200"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 240 260 C 980 480, 1290 660, 1140 940 C 990 1220, 180 1320, 290 1680 C 410 2040, 1260 1980, 1180 2360 C 1100 2740, 210 2780, 310 3180 C 410 3580, 1220 3560, 1120 3980 C 1020 4400, 260 4420, 480 4780 C 620 5000, 720 5080, 720 5160"
        stroke="url(#routeGrad)"
        strokeWidth="2"
        strokeDasharray="10 12"
      />
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="5200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bb3028" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#c69963" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#bb3028" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#bb3028" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Hero({ telemetry }: { telemetry: FlightTelemetry }) {
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
        <div className="hero__copy">
          <motion.div
            className="departure-tag"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span className="departure-tag__code">FLIGHT CXC-01</span>
            <span className="departure-tag__divider" />
            <span>PAPER GLIDER → PRIVATE JET → FLAGSHIP AIRLINER</span>
          </motion.div>

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
              Follow the flight path ↓
            </a>
          </motion.div>

          <motion.div
            className="hero__evolution"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.64, ease: easeOut }}
          >
            <div className="hero__evolution-steps">
              <div className={`evo-chip ${telemetry.stageIndex === 0 ? "evo-chip--active" : ""}`}>
                <PlaneStageIcon stage={0} />
                <div>
                  <strong>01 · Paper Glider</strong>
                  <span>Dream &amp; Sketch</span>
                </div>
              </div>
              <span className="evo-arrow">→</span>
              <div className={`evo-chip ${telemetry.stageIndex === 1 ? "evo-chip--active" : ""}`}>
                <PlaneStageIcon stage={1} />
                <div>
                  <strong>02 · Private Jet</strong>
                  <span>Bespoke Concierge</span>
                </div>
              </div>
              <span className="evo-arrow">→</span>
              <div className={`evo-chip ${telemetry.stageIndex === 2 ? "evo-chip--active" : ""}`}>
                <PlaneStageIcon stage={2} />
                <div>
                  <strong>03 · Passenger Jet</strong>
                  <span>Touchdown in Thailand</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
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
                  <span className="window-badge__label">DEPARTURE WINDOW</span>
                  <strong>24°08′N · 110°18′W</strong>
                </div>
                <div className="window-badge window-badge--right">
                  <span className="window-badge__label">DESTINATION</span>
                  <strong>CHIANG MAI · CNX</strong>
                </div>
              </div>
            </div>
          </TiltFrame>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  const alignments = ["left", "right", "left"] as const;
  const waypointCoords = [
    "WAYPOINT 01 · 24°08′N 110°18′W · LA PAZ COAST",
    "WAYPOINT 02 · DOOR-TO-DOOR WHITE GLOVE",
    "WAYPOINT 03 · 18°47′N 98°59′E · CHIANG MAI",
  ];

  return (
    <section className="services shell" id="services">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div>
          <span className="section-kicker">AERIAL CORRIDOR · 01 TO 03</span>
          <h2>How I can help</h2>
        </div>
        <a
          className="text-link"
          href={`${ORIGINAL_SITE}/services`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore all services <Arrow />
        </a>
      </motion.div>

      <div className="waypoints-corridor">
        {services.map((service, i) => {
          const side = alignments[i];
          return (
            <div key={service.no} id={i === 1 ? "services-concierge" : undefined}>
              {/* Inject Morph Gate Banner right before Service 02 */}
              {i === 1 && (
                <motion.div
                  className="morph-gate"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.75, ease: easeOut }}
                >
                  <span className="morph-gate__pulse" />
                  <PlaneStageIcon stage={1} />
                  <div>
                    <strong>AIRCRAFT EVOLUTION · STAGE 02</strong>
                    <span>
                      Your folded paper sketch transforms into a Bespoke Private Jet as concierge planning takes over.
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.article
                className={`waypoint-card waypoint-card--${side}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.9, ease: easeOut }}
              >
                <TiltFrame className="waypoint-card__media" intensity={5}>
                  <a
                    href={`${ORIGINAL_SITE}/services`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="waypoint-card__img-link"
                  >
                    <img src={service.image} alt={service.alt} loading="lazy" />
                    <span className="waypoint-card__coord">{waypointCoords[i]}</span>
                  </a>
                </TiltFrame>

                <div className="waypoint-card__body">
                  <span className="waypoint-card__no">0{i + 1}</span>
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
                    View service details
                  </a>
                </div>
              </motion.article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="story__inner shell">
        <motion.div
          className="story__visual"
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
          className="story__text"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeOut }}
        >
          <span className="section-kicker">THE NAVIGATOR IN YOUR CORNER</span>
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
  const flightLevels = ["FL 120", "FL 190", "FL 260", "FL 340", "FL 410"];

  return (
    <section className="feelings shell" id="feelings" aria-labelledby="feelings-title">
      <motion.div
        className="morph-gate morph-gate--widebody"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease: easeOut }}
      >
        <span className="morph-gate__pulse" />
        <PlaneStageIcon stage={2} />
        <div>
          <strong>AIRCRAFT EVOLUTION · STAGE 03 · FLAGSHIP WIDE-BODY JET</strong>
          <span>
            Entering transpacific cruise altitude — crossing into Thailand with total peace of mind.
          </span>
        </div>
      </motion.div>

      <div className="feelings__header">
        <span className="section-kicker">CRUISING ALTITUDE · FIVE PROMISES</span>
        <h2 id="feelings-title">Travel should feel like&hellip;</h2>
      </div>

      <ul className="feelings__ladder">
        {feelings.map((item, i) => (
          <motion.li
            key={item.more}
            className={`feeling-step feeling-step--${i % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.55, once: true }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: easeOut }}
          >
            <span className="feeling-step__fl">{flightLevels[i]}</span>
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
        className="section-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div>
          <span className="section-kicker">FIELD DISPATCHES · THAILAND INSIDER NOTES</span>
          <h2>From the journal</h2>
        </div>
        <a
          className="text-link"
          href={`${ORIGINAL_SITE}/blog`}
          target="_blank"
          rel="noopener noreferrer"
        >
          All field notes <Arrow />
        </a>
      </motion.div>

      <div className="journal__grid">
        {journal.map((article, i) => (
          <motion.article
            key={article.no}
            className={`dispatch-card dispatch-card--${i % 2 === 0 ? "left" : "right"}`}
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
                <span className="dispatch-card__code">DISPATCH {article.no}</span>
                <span className="dispatch-card__category">{article.category}</span>
                <time className="dispatch-card__date">{article.date}</time>
              </div>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <span className="dispatch-card__cta">
                Read dispatch <Arrow />
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
          className="closing__card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          <span className="closing__kicker">
            FINAL APPROACH · RUNWAY 36 · CHIANG MAI &amp; BEYOND
          </span>
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
    <footer className="footer shell">
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
  const [telemetry, setTelemetry] = useState<FlightTelemetry>(INITIAL_TELEMETRY);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

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
      <FlightStage onTelemetry={setTelemetry} />
      <FlightRail telemetry={telemetry} />
      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        telemetry={telemetry}
      />
      <div className="page-canvas">
        <AerialRouteBackdrop />
        <main>
          <Hero telemetry={telemetry} />
          <Services />
          <Story />
          <Feelings />
          <Journal />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
