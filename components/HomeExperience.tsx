"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { feelings, imagery, journal, ORIGINAL_SITE, services } from "@/lib/content";

const easeOut = [0.22, 1, 0.36, 1] as const;
const CONTACT = `${ORIGINAL_SITE}/contact`;

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="icon-arrow">
      <path d="M6 18 18 6M8.5 6H18v9.5" />
    </svg>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#story" },
];

function Header({ scrolled, menuOpen, setMenuOpen }: {
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (next: boolean) => void;
}) {
  return (
    <>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
          Curated <i>x</i> Catalina
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="button button--small header-cta" href={CONTACT} target="_blank" rel="noopener noreferrer">
          Plan your trip
        </a>
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span /><span />
        </button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="site-menu"
            aria-label="Mobile navigation"
            className="menu-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: easeOut }}
              >
                {link.label}
              </motion.a>
            ))}
            <a className="button" href={CONTACT} target="_blank" rel="noopener noreferrer">Plan your trip</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: easeOut },
  });

  return (
    <section className="hero shell" id="top" ref={ref}>
      <div className="hero__text">
        <h1 className="hero__title">
          {[<>Journeys,</>, <><em>curated</em><span className="dot">.</span></>].map((line, i) => (
            <span className="hero__line" key={i}>
              <motion.span
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease: easeOut }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="hero__aside" {...rise(0.45)}>
          <p>Custom itineraries and travel concierge for Thailand and beyond, planned by someone who lives there.</p>
          <div className="hero__actions">
            <a className="button" href={CONTACT} target="_blank" rel="noopener noreferrer">Plan your trip</a>
            <a className="text-link" href="#services">See services</a>
          </div>
        </motion.div>
      </div>
      <motion.figure
        className="hero__photo"
        initial={reduced ? false : { clipPath: "inset(12% 6% 0% 6%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.4, delay: 0.2, ease: easeOut }}
      >
        <motion.img
          style={{ y: photoY }}
          src={imagery.hero}
          alt="A rocky coastline above a deep-blue cove"
          fetchPriority="high"
        />
      </motion.figure>
    </section>
  );
}

function Services() {
  return (
    <section className="services shell" id="services">
      <Reveal className="section-head">
        <h2>How I can help</h2>
        <a className="text-link" href={`${ORIGINAL_SITE}/services`} target="_blank" rel="noopener noreferrer">All services</a>
      </Reveal>
      <div className="services__grid">
        {services.map((service, i) => (
          <Reveal key={service.no} delay={i * 0.08} className="service">
            <a href={`${ORIGINAL_SITE}/services`} target="_blank" rel="noopener noreferrer">
              <div className="service__image">
                <img src={service.image} alt={service.alt} loading="lazy" />
              </div>
              <h3>{service.title} <Arrow /></h3>
              <p>{service.description}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="story__inner shell">
        <Reveal className="story__photo">
          <img src={imagery.catalina} alt="Catalina at a vineyard, holding a glass of wine with mountains behind her" loading="lazy" />
        </Reveal>
        <Reveal className="story__text" delay={0.1}>
          <h2>Hi, I&rsquo;m Catalina.</h2>
          <p>
            Half Thai, now living in Chiang Mai, I spend my days uncovering hidden cafés, boutique stays, and
            experiences most travelers miss. Curated x Catalina was created to help you experience Thailand with
            the confidence of having someone local in your corner.
          </p>
          <img className="story__signature" src={imagery.signature} alt="xo, curated x catalina" loading="lazy" />
          <a className="text-link" href={`${ORIGINAL_SITE}/about`} target="_blank" rel="noopener noreferrer">More about me</a>
        </Reveal>
      </div>
    </section>
  );
}

function Feelings() {
  return (
    <section className="feelings shell" aria-labelledby="feelings-title">
      <Reveal><h2 id="feelings-title">Travel should feel like&hellip;</h2></Reveal>
      <ul>
        {feelings.map((item, i) => (
          <motion.li
            key={item.more}
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.9, once: true }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: easeOut }}
          >
            <span>{item.less}</span> <em>{item.more}</em>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Journal() {
  return (
    <section className="journal shell" id="journal">
      <Reveal className="section-head">
        <h2>From the journal</h2>
        <a className="text-link" href={`${ORIGINAL_SITE}/blog`} target="_blank" rel="noopener noreferrer">All posts</a>
      </Reveal>
      <ul className="journal__list">
        {journal.map((article, i) => (
          <motion.li
            key={article.no}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: easeOut }}
          >
            <a href={article.href} target="_blank" rel="noopener noreferrer">
              <span className="journal__meta">{article.category}</span>
              <h3>{article.title}</h3>
              <time className="journal__meta">{article.date}</time>
              <Arrow />
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing" id="contact">
      <Reveal className="closing__inner shell">
        <h2>Your world is <em>waiting.</em></h2>
        <p>Every good trip starts with a conversation.</p>
        <a className="button button--light" href={CONTACT} target="_blank" rel="noopener noreferrer">Let&rsquo;s plan your journey</a>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer shell">
      <a href="mailto:xo@curatedxcatalina.com" className="footer__email">xo@curatedxcatalina.com</a>
      <nav aria-label="Footer">
        {["about", "services", "faq", "contact"].map((page) => (
          <a key={page} href={`${ORIGINAL_SITE}/${page}`} target="_blank" rel="noopener noreferrer">{page}</a>
        ))}
      </nav>
      <p>© {new Date().getFullYear()} Curated x Catalina</p>
    </footer>
  );
}

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKeydown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <Header scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Services />
        <Story />
        <Feelings />
        <Journal />
        <Closing />
      </main>
      <Footer />
    </MotionConfig>
  );
}
