
/* =========================================================
   IT TASKFLOW — TERMS & CONDITIONS
   Vanilla JavaScript | No external dependencies
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ---------- 1. Select page elements ----------
    const navToggle = document.getElementById("navToggle");
    const primaryNav = document.getElementById("primaryNav");

    const contentsCollapse = document.getElementById("contentsCollapse");
    const contentsList = document.getElementById("contentsList");
    const contentsLinks = Array.from(
        document.querySelectorAll(".contents-link")
    );

    const sections = Array.from(
        document.querySelectorAll(".terms-section[id]")
    );

    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const progressTrack = document.getElementById("progressTrack");

    const printTerms = document.getElementById("printTerms");
    const backToTop = document.getElementById("backToTop");
    const currentYear = document.getElementById("currentYear");

    // ---------- 2. Automatically update the footer year ----------
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ---------- 3. Mobile navigation ----------
    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", () => {
            const isExpanded =
                navToggle.getAttribute("aria-expanded") === "true";

            navToggle.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            navToggle.setAttribute(
                "aria-label",
                isExpanded
                    ? "Open navigation menu"
                    : "Close navigation menu"
            );

            primaryNav.classList.toggle("open", !isExpanded);
        });

        // Close the mobile menu when a navigation link is selected.
        primaryNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                primaryNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            });
        });

        // Close the menu when the user clicks outside it.
        document.addEventListener("click", (event) => {
            const clickedInsideNavigation =
                primaryNav.contains(event.target) ||
                navToggle.contains(event.target);

            if (!clickedInsideNavigation) {
                primaryNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            }
        });

        // Restore the desktop navigation state when the viewport grows.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) {
                primaryNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            }
        });
    }

    // ---------- 4. Collapse and expand the table of contents ----------
    if (contentsCollapse && contentsList) {
        contentsCollapse.addEventListener("click", () => {
            const isExpanded =
                contentsCollapse.getAttribute("aria-expanded") === "true";

            contentsCollapse.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            contentsCollapse.setAttribute(
                "aria-label",
                isExpanded
                    ? "Expand table of contents"
                    : "Collapse table of contents"
            );

            contentsCollapse.textContent = isExpanded ? "+" : "−";

            contentsList.hidden = isExpanded;
        });
    }

    // ---------- 5. Smooth section navigation ----------
    contentsLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            // Expand the contents if it was collapsed.
            if (contentsList && contentsList.hidden) {
                contentsList.hidden = false;

                if (contentsCollapse) {
                    contentsCollapse.textContent = "−";
                    contentsCollapse.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                    contentsCollapse.setAttribute(
                        "aria-label",
                        "Collapse table of contents"
                    );
                }
            }

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Update the URL without causing a second page jump.
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", targetId);
            }

            setActiveSection(targetId.slice(1));
        });
    });

    // ---------- 6. Active section highlighting ----------
    function setActiveSection(sectionId) {
        contentsLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // Use IntersectionObserver for efficient section tracking.
    if ("IntersectionObserver" in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visibleEntries.length > 0) {
                    setActiveSection(visibleEntries[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: "-100px 0px -65% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    } else if (sections.length > 0) {
        // Fallback for browsers without IntersectionObserver.
        window.addEventListener("scroll", () => {
            let currentSection = sections[0];

            sections.forEach((section) => {
                if (section.getBoundingClientRect().top <= 140) {
                    currentSection = section;
                }
            });

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        }, { passive: true });
    }

    // ---------- 7. Reading progress ----------
    function updateReadingProgress() {
        const documentElement = document.documentElement;

        const scrollableHeight =
            documentElement.scrollHeight - window.innerHeight;

        const currentScroll =
            window.scrollY || documentElement.scrollTop || 0;

        let percentage = 0;

        if (scrollableHeight > 0) {
            percentage = Math.round(
                (currentScroll / scrollableHeight) * 100
            );
        }

        percentage = Math.max(0, Math.min(100, percentage));

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (progressPercent) {
            progressPercent.textContent = `${percentage}%`;
        }

        if (progressTrack) {
            progressTrack.setAttribute(
                "aria-valuenow",
                String(percentage)
            );
        }
    }

    // ---------- 8. Back-to-top button ----------
    function updateBackToTop() {
        if (!backToTop) {
            return;
        }

        backToTop.classList.toggle(
            "visible",
            window.scrollY > 450
        );
    }

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });
    }

    // ---------- 9. Print the Terms & Conditions ----------
    if (printTerms) {
        printTerms.addEventListener("click", () => {
            window.print();
        });
    }

    // ---------- 10. Efficient scroll updates ----------
    let scrollUpdatePending = false;

    function handleScroll() {
        if (scrollUpdatePending) {
            return;
        }

        scrollUpdatePending = true;

        window.requestAnimationFrame(() => {
            updateReadingProgress();
            updateBackToTop();
            scrollUpdatePending = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    window.addEventListener("resize", () => {
        updateReadingProgress();
        updateBackToTop();
    });

    // ---------- 11. Initialize the page ----------
    updateReadingProgress();
    updateBackToTop();

    // Highlight a section when the page opens with a URL hash.
    if (window.location.hash) {
        const initialTarget = document.querySelector(
            window.location.hash
        );

        if (initialTarget && initialTarget.classList.contains("terms-section")) {
            setActiveSection(initialTarget.id);
        }
    } else {
        setActiveSection("section-1");
    }
});
