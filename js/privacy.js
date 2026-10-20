/**
 * IT TaskFlow — Privacy Policy
 * Smooth animations · Reading progress · Mobile nav · TOC
 */
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Year ---------- */
  const yearEl = $("#currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = $(".site-header");
  let lastScrollY = 0;

  function updateHeader() {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    lastScrollY = y;
  }

  /* ---------- Mobile Navigation ---------- */
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");
  let overlay = null;

  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeNav);
    return overlay;
  }

  function openNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    createOverlay().classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.contains("open");
      isOpen ? closeNav() : openNav();
    });
  }

  // Close nav when a link is clicked (mobile)
  if (primaryNav) {
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Reading Progress ---------- */
  const progressBar = $("#progressBar");
  const progressPercent = $("#progressPercent");
  const progressTrack = $("#progressTrack");
  const mainContent = $("#main-content");

  function updateProgress() {
    if (!progressBar || !mainContent) return;

    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;

    progressBar.style.width = pct + "%";
    if (progressPercent) progressPercent.textContent = pct + "%";
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", pct);
  }

  /* ---------- Active TOC link (Intersection Observer) ---------- */
  const tocLinks = $$(".contents-link");
  const sections = $$(".terms-section");

  const sectionMap = new Map();
  sections.forEach((sec) => {
    const id = sec.id;
    if (id) sectionMap.set(id, sec);
  });

  function setActiveToc(id) {
    tocLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === "#" + id;
      link.classList.toggle("active", isActive);
      if (isActive) {
        // Keep active link visible in scrollable TOC
        link.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  }

  let tocObserver;
  if ("IntersectionObserver" in window && sections.length) {
    tocObserver = new IntersectionObserver(
      (entries) => {
        // Find the most visible section near the top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          setActiveToc(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.25],
      }
    );

    sections.forEach((sec) => tocObserver.observe(sec));
  }

  // Smooth scroll for TOC links
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      // Update URL without jump
      history.replaceState(null, "", href);
      setActiveToc(href.slice(1));
    });
  });

  /* ---------- Section reveal on scroll ---------- */
  function revealSections() {
    if (prefersReducedMotion) {
      sections.forEach((s) => s.classList.add("visible"));
      return;
    }

    if ("IntersectionObserver" in window) {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      sections.forEach((sec, i) => {
        // Stagger initial delay via CSS transition-delay
        sec.style.transitionDelay = Math.min(i * 0.04, 0.3) + "s";
        revealObs.observe(sec);
      });
    } else {
      sections.forEach((s) => s.classList.add("visible"));
    }
  }

  /* ---------- TOC collapse (mobile / optional) ---------- */
  const contentsCollapse = $("#contentsCollapse");
  const contentsList = $("#contentsList");

  if (contentsCollapse && contentsList) {
    contentsCollapse.addEventListener("click", () => {
      const expanded = contentsCollapse.getAttribute("aria-expanded") === "true";
      contentsCollapse.setAttribute("aria-expanded", String(!expanded));
      contentsCollapse.textContent = expanded ? "+" : "−";
      contentsCollapse.setAttribute(
        "aria-label",
        expanded ? "Expand table of contents" : "Collapse table of contents"
      );
      contentsList.style.display = expanded ? "none" : "flex";
    });
  }

  /* ---------- Back to Top ---------- */
  const backToTop = $("#backToTop");

  function updateBackToTop() {
    if (!backToTop) return;
    const show = window.scrollY > 500;
    backToTop.classList.toggle("visible", show);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Print ---------- */
  const printBtn = $("#printPolicy");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  /* ---------- Smooth page load entrance ---------- */
  function pageEntrance() {
    if (prefersReducedMotion) return;

    const hero = $(".legal-hero");
    const notice = $(".draft-notice");
    const layout = $(".legal-layout");

    [hero, notice, layout].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.7s var(--ease-out) ${0.08 + i * 0.1}s, transform 0.7s var(--ease-out) ${0.08 + i * 0.1}s`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    });
  }

  /* ---------- Scroll listener (throttled via rAF) ---------- */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateProgress();
      updateBackToTop();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    // Close mobile nav on large screens
    if (window.innerWidth > 768) closeNav();
  });

  /* ---------- Init ---------- */
  function init() {
    updateHeader();
    updateProgress();
    updateBackToTop();
    revealSections();
    pageEntrance();

    // If URL has a hash, ensure section is visible
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          setActiveToc(location.hash.slice(1));
        }, 100);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();