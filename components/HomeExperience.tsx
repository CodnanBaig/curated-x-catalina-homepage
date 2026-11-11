"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  aboutStory,
  feelings,
  footerLinks,
  heroCopy,
  imagery,
  journal,
  navLinks,
  ORIGINAL_SITE,
  services,
} from "@/lib/content";
import {
  EASE_EDITORIAL,
  EditorialSection,
  HairlineDivider,
  ParallaxImage,
  ParallaxShift,
  PoeticPhrase,
  RevealBlock,
  ScrollProgressLine,
} from "./MotionPrimitives";

const CONTACT_URL = `${ORIGINAL_SITE}/contact`;

function ArrowIcon({ className = "icon-arrow" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SiteHeader({
  scrolled,
  menuOpen,
  setMenuOpen,
}: {
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (next: boolean) => void;
}) {
  return (
    <>
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="site-header__inner shell">
          <a
            href="#top"
            className="brand-logo"
            aria-label="Curated x Catalina home"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={imagery.logoWordmark}
              alt="Curated x Catalina"
              width={563}
              height={38}
              decoding="async"
            />
          </a>

          <nav aria-label="Primary navigation" className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="pill-btn pill-btn--sm header-cta"
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book now
          </a>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <span />
            <span />
          </button>
        </div>

        <ScrollProgressLine className="header-progress" />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mobile-drawer"
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
          >
            <nav className="mobile-drawer__links" aria-label="Mobile links">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: EASE_EDITORIAL }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="mobile-drawer__footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.45, ease: EASE_EDITORIAL }}
            >
              <a
                className="pill-btn"
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Book now
              </a>
              <a href="mailto:xo@curatedxcatalina.com" className="mobile-drawer__email">
                xo@curatedxcatalina.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.35 });

  // Bi-directional scroll-out fade and subtle scale recession as the visitor enters Services.
  const heroOpacity = useTransform(smooth, [0, 0.72, 1], [1, 0.92, 0.16]);
  const heroScale = useTransform(smooth, [0, 1], [1, 0.975]);

  return (
    <motion.section
      id="top"
      ref={ref}
      className="hero shell"
      style={reduced ? undefined : { opacity: heroOpacity, scale: heroScale }}
    >
      <motion.p
        className="hero__eyebrow"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.05, ease: EASE_EDITORIAL }}
      >
        {heroCopy.eyebrow}
      </motion.p>

      <div className="hero__grid">
        <ParallaxShift offset={[0, -34]} className="hero__copy">
          <h1 className="hero__title">
            <span className="hero__line">
              <motion.span
                initial={reduced ? false : { y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.95, delay: 0.12, ease: EASE_EDITORIAL }}
              >
                {heroCopy.titlePrefix}
              </motion.span>
            </span>
            <span className="hero__line hero__line--indent">
              <motion.span
                initial={reduced ? false : { y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.95, delay: 0.24, ease: EASE_EDITORIAL }}
              >
                <em>{heroCopy.titleEmphasis}</em>
                <span className="hero__period" aria-hidden="true">
                  .
                </span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero__lead"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.36, ease: EASE_EDITORIAL }}
          >
            {heroCopy.lead}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.48, ease: EASE_EDITORIAL }}
          >
            <a className="pill-btn" href="#services">
              {heroCopy.primaryCta}
            </a>
            <a
              className="editorial-link"
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroCopy.secondaryCta} <ArrowIcon />
            </a>
          </motion.div>
        </ParallaxShift>

        <ParallaxShift offset={[0, 36]} className="hero__media-col">
          <ParallaxImage
            src={imagery.hero}
            alt={heroCopy.photoAlt}
            className="hero__photo"
            depth={11}
            priority
            revealOnMount
            objectPosition="50% 52%"
          />
        </ParallaxShift>
      </div>
    </motion.section>
  );
}

const serviceOffsets: [number, number][] = [
  [16, -16],
  [44, -40],
  [22, -22],
];

function ServicesSection() {
  return (
    <EditorialSection id="services" className="services shell" ariaLabelledBy="services-heading">
      <HairlineDivider className="section-rule" />

      <div className="section-header">
        <RevealBlock direction="up">
          <p className="section-kicker">Bespoke Planning</p>
          <h2 id="services-heading">Distinguished Travel Services</h2>
        </RevealBlock>
        <RevealBlock direction="up" delay={0.08}>
          <a
            className="editorial-link"
            href={`${ORIGINAL_SITE}/services`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View service tiers <ArrowIcon />
          </a>
        </RevealBlock>
      </div>

      <div className="services__grid">
        {services.map((service, i) => (
          <ParallaxShift
            key={service.no}
            offset={serviceOffsets[i] ?? [16, -16]}
            className="service-card-wrap"
          >
            <RevealBlock delay={i * 0.08} className="service-card">
              <a href={service.href} target="_blank" rel="noopener noreferrer">
                <ParallaxImage
                  src={service.image}
                  alt={service.alt}
                  className="service-card__frame"
                  depth={8}
                />
                <div className="service-card__meta">
                  <span className="service-card__num">{service.no}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-card__link">
                    Learn More <ArrowIcon />
                  </span>
                </div>
              </a>
            </RevealBlock>
          </ParallaxShift>
        ))}
      </div>
    </EditorialSection>
  );
}

function JournalAndStorySection() {
  return (
    <EditorialSection id="journal" className="journal-story shell" ariaLabelledBy="journal-heading">
      <HairlineDivider className="section-rule" />

      <div className="journal-story__grid">
        <ParallaxShift offset={[-14, 14]} className="journal-col">
          <RevealBlock>
            <p className="section-kicker">Field Notes &amp; Guides</p>
            <h2 id="journal-heading" className="journal-col__title">
              <em>From the Journal</em>
            </h2>
          </RevealBlock>

          <ul className="journal-list">
            {journal.map((article, i) => (
              <li key={article.no}>
                <RevealBlock direction="left" delay={i * 0.06}>
                  <a
                    className="journal-entry"
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="journal-entry__thumb">
                      <img src={article.image} alt={article.title} loading="lazy" />
                    </div>
                    <div className="journal-entry__body">
                      <div className="journal-entry__top">
                        <span>{article.category}</span>
                        <time>{article.date}</time>
                      </div>
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <span className="journal-entry__cta">
                        Read more <ArrowIcon />
                      </span>
                    </div>
                  </a>
                </RevealBlock>
              </li>
            ))}
          </ul>

          <RevealBlock delay={0.12} className="journal-col__actions">
            <a
              className="pill-btn"
              href={`${ORIGINAL_SITE}/blog`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore The Rest of My Journal <ArrowIcon />
            </a>
          </RevealBlock>
        </ParallaxShift>

        <ParallaxShift offset={[34, -34]} className="arch-col">
          <article id="about" className="arch-card" aria-labelledby="about-heading">
            <RevealBlock>
              <h2 id="about-heading">{aboutStory.heading}</h2>
              <p className="arch-card__copy">{aboutStory.body}</p>
            </RevealBlock>

            <ParallaxImage
              src={imagery.catalina}
              alt={aboutStory.photoAlt}
              className="arch-card__photo"
              depth={8}
              objectPosition="65% 42%"
            />

            <RevealBlock delay={0.08} className="arch-card__signoff">
              <img
                src={imagery.signature}
                alt={aboutStory.signatureAlt}
                className="arch-card__signature"
                width={430}
                height={242}
                loading="lazy"
              />
              <a
                className="editorial-link"
                href={aboutStory.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {aboutStory.ctaLabel} <ArrowIcon />
              </a>
            </RevealBlock>
          </article>
        </ParallaxShift>
      </div>
    </EditorialSection>
  );
}

function FeelingsSection() {
  return (
    <EditorialSection
      fullBleed
      className="feelings-band"
      innerClassName="feelings-band__inner shell"
      ariaLabelledBy="feelings-heading"
    >
      <div className="feelings-band__aside">
        <RevealBlock>
          <p className="section-kicker">The Experience</p>
          <h2 id="feelings-heading">Travel Should Feel Like&hellip;</h2>
          <p className="feelings-band__sub">
            Intentional planning replaces uncertainty with ease—leaving space for wonder from
            departure to return.
          </p>
        </RevealBlock>
      </div>

      <ul className="feelings-list">
        {feelings.map((item) => (
          <PoeticPhrase key={item.more} less={item.less} more={item.more} />
        ))}
      </ul>
    </EditorialSection>
  );
}

function ClosingAndFooter() {
  return (
    <>
      <EditorialSection className="closing shell" ariaLabelledBy="closing-heading">
        <RevealBlock className="closing__card">
          <p className="section-kicker">Begin Your Journey</p>
          <h2 id="closing-heading">
            Travel beautifully.
            <br />
            <em>
              Leave the details <span className="closing__nowrap">to me.</span>
            </em>
          </h2>
          <p className="closing__lead">
            Share a few details about where and how you love to travel, and I&rsquo;ll personally
            curate the path forward.
          </p>
          <div className="closing__actions">
            <a
              className="pill-btn"
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book now
            </a>
            <a
              className="editorial-link"
              href={`${ORIGINAL_SITE}/services`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore packages <ArrowIcon />
            </a>
          </div>
        </RevealBlock>
      </EditorialSection>

      <footer className="site-footer shell">
        <HairlineDivider className="section-rule" />
        <div className="site-footer__row">
          <a href="#top" className="site-footer__brand" aria-label="Back to top">
            <img
              src={imagery.logoWordmark}
              alt="Curated x Catalina"
              width={563}
              height={38}
              loading="lazy"
            />
          </a>

          <nav aria-label="Footer navigation" className="site-footer__nav">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="mailto:xo@curatedxcatalina.com?subject=New%20Inquiry%3A"
            className="site-footer__email"
          >
            xo@curatedxcatalina.com
          </a>
        </div>
        <p className="site-footer__copy">
          &copy; {new Date().getFullYear()} Curated x Catalina &middot; Chiang Mai &amp; Worldwide
        </p>
      </footer>
    </>
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
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeydown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeydown);
    };
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-shell">
        <SiteHeader scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main>
          <HeroSection />
          <ServicesSection />
          <JournalAndStorySection />
          <FeelingsSection />
          <ClosingAndFooter />
        </main>
      </div>
    </MotionConfig>
  );
}
