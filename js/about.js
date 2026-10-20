
/* ==========================================================
   IT TASKFLOW — ABOUT PAGE
   Vanilla JavaScript | No dependencies
   ========================================================== */

"use strict";

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
    initMobileNavigation();
    initDropdownNavigation();
    initHeaderScrollEffect();
    initScrollReveal();
    initFaqAccordion();
    initCopyrightYear();
    initAnchorNavigation();
});

/* ================= MOBILE NAVIGATION ================= */

function initMobileNavigation() {
    const menuToggle = document.getElementById("menu-toggle");
    const navPanel = document.getElementById("primary-navigation");

    if (!menuToggle || !navPanel) return;

    const mobileQuery = window.matchMedia("(max-width: 900px)");

    function openMenu() {
        navPanel.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        navPanel.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("menu-open");
        navPanel.querySelectorAll(".dropdown").forEach((dropdown) => {
            dropdown.classList.remove("open");
            dropdown.querySelector(".dropdown-toggle")
                ?.setAttribute("aria-expanded", "false");
        });
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the mobile menu after a navigation link is selected.
    navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu with Escape and return focus to its toggle.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Prevent a mobile menu from remaining open after resizing to desktop.
    function handleViewportChange(event) {
        if (!event.matches) {
            closeMenu();
        }
    }

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleViewportChange);
    } else {
        // Compatibility with older browsers.
        mobileQuery.addListener(handleViewportChange);
    }
}

/* ================= NAVIGATION DROPDOWNS ================= */

function initDropdownNavigation() {
    const navPanel = document.getElementById("primary-navigation");
    if (!navPanel) return;

    const dropdowns = navPanel.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (!toggle) return;

        toggle.addEventListener("click", () => {
            const willOpen = !dropdown.classList.contains("open");

            dropdowns.forEach((item) => {
                item.classList.remove("open");
                item.querySelector(".dropdown-toggle")
                    ?.setAttribute("aria-expanded", "false");
            });

            if (willOpen) {
                dropdown.classList.add("open");
                toggle.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element) ||
            event.target.closest("#primary-navigation .dropdown")) {
            return;
        }

        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("open");
            dropdown.querySelector(".dropdown-toggle")
                ?.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        const openDropdown = navPanel.querySelector(".dropdown.open");
        if (!openDropdown) return;

        openDropdown.classList.remove("open");
        const toggle = openDropdown.querySelector(".dropdown-toggle");
        toggle?.setAttribute("aria-expanded", "false");
        toggle?.focus();
    });
}

/* ================= HEADER SCROLL EFFECT ================= */

function initHeaderScrollEffect() {
    const header = document.getElementById("site-header");

    if (!header) return;

    let ticking = false;

    function updateHeader() {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        },
        { passive: true }
    );

    // Set the initial appearance correctly if the page opens mid-scroll.
    updateHeader();
}

/* ================= SCROLL REVEAL ANIMATIONS ================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!revealElements.length) return;

    revealElements.forEach((element) => {
        const delay = Number(element.dataset.revealDelay);

        if (Number.isFinite(delay) && delay >= 0) {
            element.style.setProperty(
                "--reveal-delay",
                `${Math.min(delay, 1000)}ms`
            );
        }
    });

    // Keep all content visible if animations are not appropriate.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (
        reducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* ================= FAQ ACCORDION ================= */

function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        // The HTML starts with every answer collapsed.
        question.setAttribute("aria-expanded", "false");
        answer.hidden = true;

        question.addEventListener("click", () => {
            const currentlyExpanded =
                question.getAttribute("aria-expanded") === "true";

            // Keep the FAQ compact by allowing one open answer at a time.
            faqItems.forEach((otherItem) => {
                const otherQuestion =
                    otherItem.querySelector(".faq-question");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (!otherQuestion || !otherAnswer) return;

                otherQuestion.setAttribute("aria-expanded", "false");
                otherAnswer.hidden = true;
            });

            // Reopen the selected answer unless it was already open.
            if (!currentlyExpanded) {
                question.setAttribute("aria-expanded", "true");
                answer.hidden = false;
            }
        });
    });
}

/* ================= COPYRIGHT YEAR ================= */

function initCopyrightYear() {
    const yearElement = document.getElementById("current-year");

    if (!yearElement) return;

    yearElement.textContent = String(new Date().getFullYear());
}

/* ================= ANCHOR NAVIGATION ================= */

function initAnchorNavigation() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch {
                // Ignore malformed selectors rather than breaking navigation.
                return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            // Preserve a useful keyboard focus position for in-page links.
            if (!target.hasAttribute("tabindex") && target !== document.body) {
                target.setAttribute("tabindex", "-1");
            }

            target.focus({ preventScroll: true });

            // Update the fragment without adding a new browser history entry.
            if (window.location.hash !== href) {
                window.history.replaceState(null, "", href);
            }
        });
    });
}
