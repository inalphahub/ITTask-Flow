/* ============================================================
   STAGE 1 — FOUNDATION
   IT TASKFLOW DOCUMENTATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const docsRoot = document.querySelector("#tfDocs");

    if (!docsRoot) {
        return;
    }


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const mobileToggle =
        docsRoot.querySelector("#tfDocsMobileToggle");

    const sidebar =
        docsRoot.querySelector("#tfDocsSidebar");

    const sidebarClose =
        docsRoot.querySelector("#tfDocsSidebarClose");

    const sidebarOverlay =
        docsRoot.querySelector("#tfDocsSidebarOverlay");

    const searchInput =
        docsRoot.querySelector("#tfDocsSearch");

    const searchTrigger =
        docsRoot.querySelector("#tfDocsSearchTrigger");

    const navGroupButtons =
        docsRoot.querySelectorAll(
            ".tf-docs-nav-group-button"
        );

    const navLinks =
        docsRoot.querySelectorAll(
            ".tf-docs-nav-link"
        );

    const outlineLinks =
        docsRoot.querySelectorAll(
            ".tf-docs-outline nav a"
        );


    /* ========================================================
       MOBILE SIDEBAR
       ======================================================== */

    const openMobileSidebar = () => {

        sidebar?.classList.add("is-open");
        sidebarOverlay?.classList.add("is-visible");

        document.body.classList.add(
            "tf-docs-mobile-open"
        );

        mobileToggle?.setAttribute(
            "aria-expanded",
            "true"
        );
    };


    const closeMobileSidebar = () => {

        sidebar?.classList.remove("is-open");
        sidebarOverlay?.classList.remove("is-visible");

        document.body.classList.remove(
            "tf-docs-mobile-open"
        );

        mobileToggle?.setAttribute(
            "aria-expanded",
            "false"
        );
    };


    mobileToggle?.addEventListener(
        "click",
        openMobileSidebar
    );


    sidebarClose?.addEventListener(
        "click",
        closeMobileSidebar
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeMobileSidebar
    );


    /* ========================================================
       SIDEBAR ACCORDIONS
       ======================================================== */

    navGroupButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const currentlyOpen =
                button.classList.contains("is-open");


            navGroupButtons.forEach((otherButton) => {

                if (otherButton !== button) {

                    otherButton.classList.remove(
                        "is-open"
                    );

                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });


            if (currentlyOpen) {

                button.classList.remove(
                    "is-open"
                );

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );

            } else {

                button.classList.add(
                    "is-open"
                );

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }

        });

    });


    /* ========================================================
       NAVIGATION LINKS
       ======================================================== */

    /* ========================================================
   NAVIGATION LINKS
   ======================================================== */

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        /* ---------------------------------------------
           Active navigation item
           --------------------------------------------- */

        navLinks.forEach((item) => {
            item.classList.remove("is-active");
        });

        link.classList.add("is-active");


        /* ---------------------------------------------
           Make sure the selected category is open
           --------------------------------------------- */

        const parentGroup =
            link.closest(".tf-docs-nav-group");

        const groupButton =
            parentGroup?.querySelector(
                ".tf-docs-nav-group-button"
            );

        if (
            groupButton &&
            !groupButton.classList.contains("is-open")
        ) {

            groupButton.classList.add("is-open");

            groupButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        /* ---------------------------------------------
           Keep selected navigation item visible
           --------------------------------------------- */

        link.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });

});


    /* ========================================================
       SEARCH FOCUS
       ======================================================== */

    searchTrigger?.addEventListener(
        "click",
        () => {

            searchInput?.focus();

            searchInput?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );


    /* ========================================================
       KEYBOARD SHORTCUT
       Ctrl/Cmd + K
       ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            const isMac =
                navigator.platform
                    .toUpperCase()
                    .includes("MAC");


            const shortcutPressed =
                (isMac && event.metaKey && event.key === "k") ||
                (!isMac && event.ctrlKey && event.key === "k");


            if (!shortcutPressed) {
                return;
            }


            event.preventDefault();

            searchInput?.focus();

        }
    );


    /* ========================================================
       ESCAPE KEY
       ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeMobileSidebar();

                if (
                    document.activeElement ===
                    searchInput
                ) {
                    searchInput.blur();
                }

            }

        }
    );


    /* ========================================================
       OUTLINE NAVIGATION
       ======================================================== */

    outlineLinks.forEach((link) => {

        link.addEventListener("click", () => {

            outlineLinks.forEach((item) => {
                item.classList.remove("is-active");
            });


            link.classList.add("is-active");

        });

    });


    /* ========================================================
       ACTIVE SECTION OBSERVER
       ======================================================== */

    const documentationSections =
        docsRoot.querySelectorAll(
            ".tf-docs-content > section[id]"
        );


    if (
        "IntersectionObserver" in window &&
        documentationSections.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const sectionId =
                            entry.target.id;


                        navLinks.forEach((link) => {

                            const isMatch =
                                link.getAttribute("href") ===
                                `#${sectionId}`;


                            if (isMatch) {

                                navLinks.forEach(
                                    (item) => {
                                        item.classList.remove(
                                            "is-active"
                                        );
                                    }
                                );


                                link.classList.add(
                                    "is-active"
                                );
                            }

                        });

                    });

                },
                {
                    rootMargin:
                        "-20% 0px -65% 0px",
                    threshold: 0
                }
            );


        documentationSections.forEach(
            (section) => {
                sectionObserver.observe(section);
            }
        );

    }


    /* ========================================================
       SEARCH FOUNDATION
       ======================================================== */

    searchInput?.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchTerm) {

                navLinks.forEach((link) => {
                    link.hidden = false;
                });

                return;
            }


            navLinks.forEach((link) => {

                const text =
                    link.textContent
                        .trim()
                        .toLowerCase();


                link.hidden =
                    !text.includes(searchTerm);

            });

        }
    );


    /* ========================================================
       RESPONSIVE CLEANUP
       ======================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 850
            ) {
                closeMobileSidebar();
            }

        }
    );


    /* ========================================================
       INITIALIZATION
       ======================================================== */

    navGroupButtons.forEach((button, index) => {

        if (index === 0) {

            button.classList.add(
                "is-open"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});







/* ========================================================
   STAGE 2 — INTRODUCTION JAVASCRIPT
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ====================================================
       STAGE 2 — INTRODUCTION ELEMENTS
       ==================================================== */

    const introductionContent =
        document.querySelector(
            ".tf-docs-introduction-content"
        );

    if (!introductionContent) {
        return;
    }

    const introBlocks =
        introductionContent.querySelectorAll(
            ".tf-docs-intro-block"
        );

    const journeyLinks =
        introductionContent.querySelectorAll(
            ".tf-docs-journey-link"
        );


    /* ====================================================
       STAGE 2 — INTRODUCTION REVEAL ANIMATION
       ==================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (!prefersReducedMotion) {

        introBlocks.forEach((block, index) => {

            block.style.opacity = "0";
            block.style.transform = "translateY(20px)";
            block.style.transition =
                "opacity 600ms ease, transform 600ms ease";

            block.style.transitionDelay =
                `${Math.min(index * 70, 280)}ms`;

        });


        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        introBlocks.forEach((block) => {
            revealObserver.observe(block);
        });

    } else {

        introBlocks.forEach((block) => {
            block.style.opacity = "1";
            block.style.transform = "none";
        });

    }


    /* ====================================================
       STAGE 2 — JOURNEY LINK NAVIGATION
       ==================================================== */

    journeyLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                !targetId.startsWith("#")
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerOffset = 100;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

            /*
             * Update the URL hash without causing
             * another browser jump.
             */

            if (
                window.history &&
                window.history.replaceState
            ) {
                window.history.replaceState(
                    null,
                    "",
                    targetId
                );
            }

        });

    });


    /* ====================================================
       STAGE 2 — FLOW HORIZONTAL SCROLL SUPPORT
       ==================================================== */

    const documentationFlow =
        introductionContent.querySelector(
            ".tf-docs-flow"
        );

    if (documentationFlow) {

        documentationFlow.addEventListener(
            "wheel",
            (event) => {

                /*
                 * On smaller screens, allow the mouse
                 * wheel to move the horizontal workflow.
                 */

                if (
                    window.innerWidth <= 760 &&
                    Math.abs(event.deltaY) >
                    Math.abs(event.deltaX)
                ) {

                    const canScrollLeft =
                        documentationFlow.scrollLeft > 0;

                    const canScrollRight =
                        documentationFlow.scrollLeft +
                        documentationFlow.clientWidth <
                        documentationFlow.scrollWidth;

                    if (
                        (event.deltaY < 0 &&
                            canScrollLeft) ||
                        (event.deltaY > 0 &&
                            canScrollRight)
                    ) {
                        event.preventDefault();

                        documentationFlow.scrollLeft +=
                            event.deltaY;
                    }

                }

            },
            {
                passive: false
            }
        );

    }


    /* ====================================================
       STAGE 2 — INTRODUCTION INITIALIZATION
       ==================================================== */

    introductionContent.classList.add(
        "tf-docs-introduction-ready"
    );

});




/* =========================================================
   STAGE 3 — GETTING STARTED DOCUMENTATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(
        "#documentation-getting-started"
    );

    if (!section) {
        return;
    }

    const contentItems = section.querySelectorAll(
        "h3, p, ul, ol"
    );

    /*
     * Skip the animation when unsupported or when the user
     * prefers reduced motion.
     */
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    section.classList.add("gs-reveal-enabled");

    contentItems.forEach((item, index) => {
        item.classList.add("gs-reveal-item");

        item.style.transitionDelay =
            `${Math.min(index * 35, 280)}ms`;
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "gs-revealed"
                    );

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    contentItems.forEach((item) => {
        revealObserver.observe(item);
    });
});




/* =========================================================
   STAGE 4 — IT TASKFLOW FUNDAMENTALS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(
        "#documentation-fundamentals"
    );

    if (!section) {
        return;
    }

    const filterButtons = section.querySelectorAll(
        "[data-fundamentals-filter]"
    );

    const cards = section.querySelectorAll(
        "[data-fundamentals-category]"
    );

    const emptyMessage = section.querySelector(
        ".tf-fundamentals-empty"
    );

    /*
     * Filter the concept cards by category.
     */
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedCategory =
                button.dataset.fundamentalsFilter;

            let visibleCount = 0;

            cards.forEach((card) => {
                const cardCategory =
                    card.dataset.fundamentalsCategory;

                const shouldShow =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount += 1;
                }
            });

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;

                filterButton.classList.toggle(
                    "is-active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount > 0;
            }
        });
    });

    /*
     * Skip scroll animations if the user prefers reduced
     * motion or the browser does not support the observer.
     */
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    /*
     * Reveal each concept card when it enters the viewport.
     */
    section.classList.add(
        "gs-fund-reveal-enabled"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "gs-fund-revealed"
                    );

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    cards.forEach((card, index) => {
        card.style.transitionDelay =
            `${Math.min((index % 3) * 70, 140)}ms`;

        revealObserver.observe(card);
    });
});




/* =========================================================
   STAGE 6 — TASK MANAGEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(
        "#documentation-task-management"
    );

    if (!section) {
        return;
    }

    const filterButtons = section.querySelectorAll(
        "[data-task-filter]"
    );

    const cards = section.querySelectorAll(
        "[data-task-category]"
    );

    const emptyMessage = section.querySelector(
        ".tf-task-empty"
    );

    /* Filter task management topics */

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedCategory =
                button.dataset.taskFilter;

            let visibleCount = 0;

            cards.forEach((card) => {
                const category =
                    card.dataset.taskCategory;

                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount += 1;
                }
            });

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;

                filterButton.classList.toggle(
                    "is-active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount > 0;
            }
        });
    });

    /* Respect reduced-motion preferences */

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    /* Reveal cards as they enter the viewport */

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "tf-task-revealed"
                    );

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    section.classList.add("tf-task-reveal-enabled");

    cards.forEach((card, index) => {
        card.classList.add("tf-task-reveal-item");

        card.style.transitionDelay =
            `${(index % 3) * 65}ms`;

        revealObserver.observe(card);
    });
});



/* =========================================================
   STAGE 7 — PROJECT MANAGEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(
        "#documentation-project-management"
    );

    if (!section) {
        return;
    }

    const filterButtons = section.querySelectorAll(
        "[data-project-filter]"
    );

    const cards = section.querySelectorAll(
        "[data-project-category]"
    );

    const emptyMessage = section.querySelector(
        ".tf-project-empty"
    );

    /* Filter project topics */

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedCategory =
                button.dataset.projectFilter;

            let visibleCount = 0;

            cards.forEach((card) => {
                const category =
                    card.dataset.projectCategory;

                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount += 1;
                }
            });

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;

                filterButton.classList.toggle(
                    "is-active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount > 0;
            }
        });
    });

    /* Respect reduced-motion preferences */

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    /* Reveal cards when they enter the viewport */

    section.classList.add(
        "tf-project-reveal-enabled"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "tf-project-revealed"
                    );

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    cards.forEach((card, index) => {
        card.classList.add(
            "tf-project-reveal-item"
        );

        card.style.transitionDelay =
            `${(index % 3) * 65}ms`;

        revealObserver.observe(card);
    });
});




/* =========================================================
   STAGE 8: TEAM COLLABORATION DOCUMENTATION
   Category filters for the Team Collaboration section.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById(
    "documentation-team-collaboration"
  );

  if (!section) return;

  const filterButtons = section.querySelectorAll(
    ".tf-collab-filter"
  );

  const topicCards = section.querySelectorAll(
    ".tf-collab-topic-card"
  );

  const emptyMessage = section.querySelector(
    ".tf-collab-empty"
  );

  if (!filterButtons.length || !topicCards.length) return;

  function filterCollaborationTopics(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.collabCategory;
      const shouldShow =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      } else {
        // Close expanded content when its card is filtered out.
        card.querySelectorAll("details[open]").forEach(function (item) {
          item.open = false;
        });
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.collabFilter;

      filterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      filterCollaborationTopics(selectedCategory);
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("is-active"))
    );
  });

  // Display all topics when the section first loads.
  filterCollaborationTopics("all");
});



/* =========================================================
   STAGE 9: CALENDAR & SCHEDULING DOCUMENTATION
   Category filtering for scheduling topics.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById(
    "documentation-calendar-scheduling"
  );

  if (!section) return;

  const filterButtons = section.querySelectorAll(
    ".tf-calendar-filter"
  );

  const topicCards = section.querySelectorAll(
    ".tf-calendar-topic-card"
  );

  const emptyMessage = section.querySelector(
    ".tf-calendar-empty"
  );

  if (!filterButtons.length || !topicCards.length) return;

  function filterCalendarTopics(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.calendarCategory;

      const shouldShow =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      } else {
        // Close expanded content when a card is filtered out.
        card.querySelectorAll("details[open]").forEach(function (item) {
          item.open = false;
        });
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.calendarFilter;

      filterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      filterCalendarTopics(selectedCategory);
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("is-active"))
    );
  });

  // Show all scheduling topics on initial load.
  filterCalendarTopics("all");
});




/* =========================================================
   STAGE 10: NOTIFICATIONS & COMMUNICATION DOCUMENTATION
   Category filtering for notification topics.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const section = document.getElementById(
    "documentation-notifications-communication"
  );

  if (!section) return;

  const filterButtons = section.querySelectorAll(
    ".tf-notify-filter"
  );

  const topicCards = section.querySelectorAll(
    ".tf-notify-topic-card"
  );

  const emptyMessage = section.querySelector(
    ".tf-notify-empty"
  );

  if (!filterButtons.length || !topicCards.length) return;

  function filterNotificationTopics(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.notifyCategory;

      const shouldShow =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      } else {
        card.querySelectorAll("details[open]").forEach(function (item) {
          item.open = false;
        });
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.notifyFilter;

      filterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      filterNotificationTopics(selectedCategory);
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("is-active"))
    );
  });

  // Display all notification topics on initial load.
  filterNotificationTopics("all");
});




/* ==========================================
   STAGE 11: REPORTS & ANALYTICS
   Topic filter functionality
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const reportsSection = document.getElementById(
    "documentation-reports-analytics"
  );

  if (!reportsSection) {
    return;
  }

  const reportFilters = reportsSection.querySelectorAll(
    "[data-report-filter]"
  );

  const reportCards = reportsSection.querySelectorAll(
    "[data-report-category]"
  );

  function filterReportTopics(selectedCategory) {
    reportCards.forEach(function (card) {
      const cardCategory = card.getAttribute("data-report-category");

      const shouldShow =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !shouldShow;
    });

    reportFilters.forEach(function (button) {
      const isActive =
        button.getAttribute("data-report-filter") === selectedCategory;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  reportFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.getAttribute("data-report-filter");

      filterReportTopics(selectedCategory);
    });
  });

  // Show all report topics when the section first loads.
  filterReportTopics("all");
});



/* ==========================================
   STAGE 12: AGILE DOCUMENTATION
   Topic filter functionality
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const agileSection = document.getElementById(
    "documentation-agile-documentation"
  );

  if (!agileSection) {
    return;
  }

  const agileFilters = agileSection.querySelectorAll(
    "[data-agile-filter]"
  );

  const agileCards = agileSection.querySelectorAll(
    "[data-agile-category]"
  );

  function filterAgileTopics(selectedCategory) {
    agileCards.forEach(function (card) {
      const cardCategory = card.getAttribute("data-agile-category");

      const shouldShow =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !shouldShow;
    });

    agileFilters.forEach(function (button) {
      const isActive =
        button.getAttribute("data-agile-filter") === selectedCategory;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  agileFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.getAttribute("data-agile-filter");

      filterAgileTopics(selectedCategory);
    });
  });

  // Display every Agile topic when the section loads.
  filterAgileTopics("all");
});




/* =========================================================
   STAGE 13: SOFTWARE INDUSTRY WORKFLOW
   Independent topic-filter functionality.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const industrySection = document.getElementById(
        "documentation-software-industry-workflow"
    );

    if (!industrySection) {
        return;
    }

    const industryFilterButtons = industrySection.querySelectorAll(
        "[data-industry-filter]"
    );

    const industryTopicCards = industrySection.querySelectorAll(
        "[data-industry-category]"
    );

    if (!industryFilterButtons.length || !industryTopicCards.length) {
        return;
    }

    industryFilterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.getAttribute(
                "data-industry-filter"
            );

            industryFilterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            industryTopicCards.forEach(function (card) {
                const cardCategory = card.getAttribute(
                    "data-industry-category"
                );

                const shouldDisplay =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;

                card.hidden = !shouldDisplay;
            });
        });
    });
})


/* =========================================
   STAGE 14: QA & TESTING WORKFLOW
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const qaSection = document.getElementById(
    "documentation-qa-testing-workflow"
  );

  if (!qaSection) {
    return;
  }

  const qaFilterButtons = qaSection.querySelectorAll(
    "[data-qa-filter]"
  );

  const qaTopicCards = qaSection.querySelectorAll(
    "[data-qa-category]"
  );

  if (!qaFilterButtons.length || !qaTopicCards.length) {
    return;
  }

  qaFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.qaFilter;

      qaFilterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      qaTopicCards.forEach(function (card) {
        const cardCategory = card.dataset.qaCategory;

        const shouldShow =
          selectedCategory === "all" ||
          cardCategory === selectedCategory;

        card.hidden = !shouldShow;
      });
    });
  });
});


/* =========================================
   STAGE 15: DEVOPS & RELEASE WORKFLOW
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const devopsSection = document.getElementById(
    "documentation-devops-release-workflow"
  );

  if (!devopsSection) {
    return;
  }

  const devopsFilterButtons = devopsSection.querySelectorAll(
    "[data-devops-filter]"
  );

  const devopsTopicCards = devopsSection.querySelectorAll(
    "[data-devops-category]"
  );

  if (!devopsFilterButtons.length || !devopsTopicCards.length) {
    return;
  }

  devopsFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.devopsFilter;

      devopsFilterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      devopsTopicCards.forEach(function (card) {
        const cardCategory = card.dataset.devopsCategory;

        const shouldShow =
          selectedCategory === "all" ||
          cardCategory === selectedCategory;

        card.hidden = !shouldShow;
      });
    });
  });
});


/* =========================================
   STAGE 16: DEVELOPERS DOCUMENTATION FILTERS
========================================= */

(() => {
  const section = document.getElementById(
    "documentation-developers-documentation"
  );

  if (!section || section.dataset.devFiltersInitialized === "true") {
    return;
  }

  section.dataset.devFiltersInitialized = "true";

  const filterButtons = section.querySelectorAll("[data-dev-filter]");
  const topicCards = section.querySelectorAll("[data-dev-category]");
  const emptyMessage = section.querySelector(".tf-dev-empty");

  function applyDeveloperFilter(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach((card) => {
      const category = card.dataset.devCategory;
      const shouldShow =
        selectedCategory === "all" || category === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach((button) => {
      const isActive =
        button.dataset.devFilter === selectedCategory;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyDeveloperFilter(button.dataset.devFilter);
    });
  });

  applyDeveloperFilter("all");
})();


/* =========================================
   STAGE 17: API DOCUMENTATION FILTERS
========================================= */

(() => {
  const section = document.getElementById(
    "documentation-api-documentation"
  );

  if (!section || section.dataset.apiFiltersInitialized === "true") {
    return;
  }

  section.dataset.apiFiltersInitialized = "true";

  const filterButtons = section.querySelectorAll("[data-api-filter]");
  const topicCards = section.querySelectorAll("[data-api-category]");
  const emptyMessage = section.querySelector(".tf-api-empty");

  function applyApiFilter(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach((card) => {
      const category = card.dataset.apiCategory;

      const shouldShow =
        selectedCategory === "all" ||
        category === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach((button) => {
      const isActive =
        button.dataset.apiFilter === selectedCategory;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyApiFilter(button.dataset.apiFilter);
    });
  });

  applyApiFilter("all");
})();


/* =========================================
   STAGE 18: AI DOCUMENTATION FILTERS
========================================= */

(() => {
  const section = document.getElementById(
    "documentation-ai-api-documentation"
  );

  if (!section || section.dataset.aiDocFiltersInitialized === "true") {
    return;
  }

  section.dataset.aiDocFiltersInitialized = "true";

  const filterButtons = section.querySelectorAll("[data-ai-doc-filter]");
  const topicCards = section.querySelectorAll("[data-ai-doc-category]");
  const emptyMessage = section.querySelector(".tf-ai-doc-empty");

  function applyAiDocFilter(selectedCategory) {
    let visibleCount = 0;

    topicCards.forEach((card) => {
      const category = card.dataset.aiDocCategory;

      const shouldShow =
        selectedCategory === "all" ||
        category === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach((button) => {
      const isActive =
        button.dataset.aiDocFilter === selectedCategory;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyAiDocFilter(button.dataset.aiDocFilter);
    });
  });

  applyAiDocFilter("all");
})();


/* =========================================================
   STAGE 19: ADMINISTRATION DOCUMENTATION
   Isolated filters, checklist progress, and FAQ behavior
   ========================================================= */

(function initTaskFlowAdministrationDocumentation() {
  "use strict";

  const section = document.getElementById("documentation-administration");

  // The section may not exist on every page.
  if (!section || section.dataset.adminInitialized === "true") {
    return;
  }

  section.dataset.adminInitialized = "true";

  /* -----------------------------------------
     1. Topic category filters
     ----------------------------------------- */

  const filterButtons = section.querySelectorAll("[data-admin-filter]");
  const topicCards = section.querySelectorAll("[data-admin-category]");
  const emptyMessage = section.querySelector(".tf-admin-empty");

  function filterAdminTopics(category) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.adminCategory;
      const shouldShow = category === "all" || cardCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive = button.dataset.adminFilter === category;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterAdminTopics(button.dataset.adminFilter);
    });
  });

  // Show every topic when the section first loads.
  filterAdminTopics("all");

  /* -----------------------------------------
     2. Administration readiness checklist
     ----------------------------------------- */

  const checklistItems = section.querySelectorAll("[data-admin-check]");
  const progressText = section.querySelector("[data-admin-progress-text]");
  const progressFill = section.querySelector("[data-admin-progress-fill]");

  function updateAdminChecklistProgress() {
    const total = checklistItems.length;

    const completed = Array.from(checklistItems).filter(function (item) {
      return item.checked;
    }).length;

    const percentage = total > 0 ? (completed / total) * 100 : 0;

    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " completed";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener("change", updateAdminChecklistProgress);
  });

  updateAdminChecklistProgress();

  /* -----------------------------------------
     3. FAQ accordion
     ----------------------------------------- */

  const faqItems = section.querySelectorAll(".tf-admin-faq");

  faqItems.forEach(function (currentItem) {
    currentItem.addEventListener("toggle", function () {
      if (!currentItem.open) {
        return;
      }

      faqItems.forEach(function (otherItem) {
        if (otherItem !== currentItem) {
          otherItem.open = false;
        }
      });
    });
  });
})();


/* =========================================================
   STAGE 20: SECURITY & PERMISSIONS DOCUMENTATION
   Isolated topic filters, checklist progress, and FAQ
   ========================================================= */

(function initTaskFlowSecurityDocumentation() {
  "use strict";

  const section = document.getElementById(
    "documentation-security-permissions"
  );

  if (!section || section.dataset.securityInitialized === "true") {
    return;
  }

  section.dataset.securityInitialized = "true";

  /* -----------------------------------------
     1. Topic category filters
     ----------------------------------------- */

  const filterButtons = section.querySelectorAll(
    "[data-security-filter]"
  );

  const topicCards = section.querySelectorAll(
    "[data-security-category]"
  );

  const emptyMessage = section.querySelector(
    ".tf-security-empty"
  );

  function filterSecurityTopics(category) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.securityCategory;

      const shouldShow =
        category === "all" || cardCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive =
        button.dataset.securityFilter === category;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterSecurityTopics(button.dataset.securityFilter);
    });
  });

  // Display all 12 topics on initial load.
  filterSecurityTopics("all");

  /* -----------------------------------------
     2. Security readiness checklist
     ----------------------------------------- */

  const checklistItems = section.querySelectorAll(
    "[data-security-check]"
  );

  const progressText = section.querySelector(
    "[data-security-progress-text]"
  );

  const progressFill = section.querySelector(
    "[data-security-progress-fill]"
  );

  function updateSecurityChecklistProgress() {
    const total = checklistItems.length;

    const completed = Array.from(checklistItems).filter(
      function (item) {
        return item.checked;
      }
    ).length;

    const percentage =
      total > 0 ? (completed / total) * 100 : 0;

    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " reviewed";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener(
      "change",
      updateSecurityChecklistProgress
    );
  });

  updateSecurityChecklistProgress();

  /* -----------------------------------------
     3. FAQ accordion
     ----------------------------------------- */

  const faqItems = section.querySelectorAll(
    ".tf-security-faq"
  );

  faqItems.forEach(function (currentItem) {
    currentItem.addEventListener("toggle", function () {
      if (!currentItem.open) {
        return;
      }

      faqItems.forEach(function (otherItem) {
        if (otherItem !== currentItem) {
          otherItem.open = false;
        }
      });
    });
  });
})();


/* =========================================================
   STAGE 21: INTEGRATIONS DOCUMENTATION
   Isolated topic filters, checklist progress, and FAQ
   ========================================================= */

(function initTaskFlowIntegrationsDocumentation() {
  "use strict";

  const section = document.getElementById("documentation-integrations");

  if (!section || section.dataset.integrationsInitialized === "true") {
    return;
  }

  section.dataset.integrationsInitialized = "true";

  /* -----------------------------------------
     1. Integration topic filters
     ----------------------------------------- */

  const filterButtons = section.querySelectorAll(
    "[data-integration-filter]"
  );

  const topicCards = section.querySelectorAll(
    "[data-integration-category]"
  );

  const emptyMessage = section.querySelector(
    ".tf-integrations-empty"
  );

  function filterIntegrationTopics(category) {
    let visibleCount = 0;

    topicCards.forEach(function (card) {
      const cardCategory = card.dataset.integrationCategory;

      const shouldShow =
        category === "all" || cardCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive =
        button.dataset.integrationFilter === category;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterIntegrationTopics(button.dataset.integrationFilter);
    });
  });

  // Show all 12 integration topics initially.
  filterIntegrationTopics("all");

  /* -----------------------------------------
     2. Integration readiness checklist
     ----------------------------------------- */

  const checklistItems = section.querySelectorAll(
    "[data-integration-check]"
  );

  const progressText = section.querySelector(
    "[data-integration-progress-text]"
  );

  const progressFill = section.querySelector(
    "[data-integration-progress-fill]"
  );

  function updateIntegrationChecklistProgress() {
    const total = checklistItems.length;

    const completed = Array.from(checklistItems).filter(
      function (item) {
        return item.checked;
      }
    ).length;

    const percentage =
      total > 0 ? (completed / total) * 100 : 0;

    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " reviewed";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener(
      "change",
      updateIntegrationChecklistProgress
    );
  });

  updateIntegrationChecklistProgress();

  /* -----------------------------------------
     3. FAQ accordion
     ----------------------------------------- */

  const faqItems = section.querySelectorAll(
    ".tf-integrations-faq"
  );

  faqItems.forEach(function (currentItem) {
    currentItem.addEventListener("toggle", function () {
      if (!currentItem.open) {
        return;
      }

      faqItems.forEach(function (otherItem) {
        if (otherItem !== currentItem) {
          otherItem.open = false;
        }
      });
    });
  });
})();



/* ==========================================
   STAGE 22: TROUBLESHOOTING DOCUMENTATION
   Isolated filter and checklist behavior
========================================== */

(function initTaskFlowTroubleshooting() {
  "use strict";

  const section = document.getElementById(
    "documentation-troubleshooting"
  );

  // Exit safely if this section is not on the current page.
  if (!section || section.dataset.troubleshootingInitialized === "true") {
    return;
  }

  section.dataset.troubleshootingInitialized = "true";

  /* ----------------------------------------
     1. CATEGORY FILTERS
  ---------------------------------------- */

  const filterButtons = Array.from(
    section.querySelectorAll("[data-troubleshooting-filter]")
  );

  const guideCards = Array.from(
    section.querySelectorAll("[data-troubleshooting-category]")
  );

  const resultCount = section.querySelector(
    "[data-troubleshooting-result-count]"
  );

  function applyTroubleshootingFilter(category) {
    let visibleCount = 0;

    guideCards.forEach(function (card) {
      const cardCategory = card.dataset.troubleshootingCategory;

      const shouldShow =
        category === "all" || cardCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive =
        button.dataset.troubleshootingFilter === category;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount +
        (visibleCount === 1 ? " guide" : " guides");
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory =
        button.dataset.troubleshootingFilter;

      applyTroubleshootingFilter(selectedCategory);
    });
  });

  // Show all guides when the section initializes.
  applyTroubleshootingFilter("all");

  /* ----------------------------------------
     2. DIAGNOSTIC CHECKLIST
  ---------------------------------------- */

  const checklistItems = Array.from(
    section.querySelectorAll("[data-troubleshooting-check]")
  );

  const progressBar = section.querySelector(
    "[data-troubleshooting-progress-bar]"
  );

  const progressFill = section.querySelector(
    "[data-troubleshooting-progress-fill]"
  );

  const progressText = section.querySelector(
    "[data-troubleshooting-progress-text]"
  );

  const progressPercent = section.querySelector(
    "[data-troubleshooting-progress-percent]"
  );

  const resetButton = section.querySelector(
    "[data-troubleshooting-reset]"
  );

  function updateTroubleshootingProgress() {
    const completedCount = checklistItems.filter(function (item) {
      return item.checked;
    }).length;

    const totalCount = checklistItems.length;

    const percentage = totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

    if (progressText) {
      progressText.textContent =
        completedCount + " of " + totalCount + " complete";
    }

    if (progressPercent) {
      progressPercent.textContent = percentage + "%";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    if (progressBar) {
      progressBar.setAttribute("aria-valuemax", String(totalCount));
      progressBar.setAttribute(
        "aria-valuenow",
        String(completedCount)
      );
      progressBar.setAttribute(
        "aria-valuetext",
        completedCount + " of " + totalCount + " checks complete"
      );
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener("change", updateTroubleshootingProgress);
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      checklistItems.forEach(function (item) {
        item.checked = false;
      });

      updateTroubleshootingProgress();
    });
  }

  // Initialize progress when the page loads.
  updateTroubleshootingProgress();

  /* ----------------------------------------
     3. FAQ ACCORDIONS
     Native <details> elements handle opening
     and closing without extra JS.
  ---------------------------------------- */

  // No custom accordion handlers are needed.
  // This prevents interference with other
  // documentation accordions.
})();


/* ==========================================
   STAGE 23: BEST PRACTICES DOCUMENTATION
   Isolated filter and review checklist
========================================== */

(function initTaskFlowBestPractices() {
  "use strict";

  const section = document.getElementById(
    "documentation-best-practices"
  );

  if (
    !section ||
    section.dataset.bestPracticesInitialized === "true"
  ) {
    return;
  }

  section.dataset.bestPracticesInitialized = "true";

  /* ----------------------------------------
     1. CATEGORY FILTERS
  ---------------------------------------- */

  const filterButtons = Array.from(
    section.querySelectorAll("[data-best-practices-filter]")
  );

  const guideCards = Array.from(
    section.querySelectorAll("[data-best-practices-category]")
  );

  const resultCount = section.querySelector(
    "[data-best-practices-count]"
  );

  function applyBestPracticesFilter(category) {
    let visibleCount = 0;

    guideCards.forEach(function (card) {
      const matches =
        category === "all" ||
        card.dataset.bestPracticesCategory === category;

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive =
        button.dataset.bestPracticesFilter === category;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount +
        (visibleCount === 1 ? " guide" : " guides");
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyBestPracticesFilter(
        button.dataset.bestPracticesFilter
      );
    });
  });

  applyBestPracticesFilter("all");

  /* ----------------------------------------
     2. FEATURE REVIEW CHECKLIST
  ---------------------------------------- */

  const checklistItems = Array.from(
    section.querySelectorAll("[data-best-practices-check]")
  );

  const progressBar = section.querySelector(
    "[data-best-practices-progress-bar]"
  );

  const progressFill = section.querySelector(
    "[data-best-practices-progress-fill]"
  );

  const progressText = section.querySelector(
    "[data-best-practices-progress-text]"
  );

  const progressPercent = section.querySelector(
    "[data-best-practices-progress-percent]"
  );

  const resetButton = section.querySelector(
    "[data-best-practices-reset]"
  );

  function updateBestPracticesProgress() {
    const total = checklistItems.length;

    const completed = checklistItems.filter(function (item) {
      return item.checked;
    }).length;

    const percentage = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " complete";
    }

    if (progressPercent) {
      progressPercent.textContent = percentage + "%";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    if (progressBar) {
      progressBar.setAttribute("aria-valuemax", String(total));
      progressBar.setAttribute("aria-valuenow", String(completed));
      progressBar.setAttribute(
        "aria-valuetext",
        completed + " of " + total + " checks complete"
      );
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener("change", updateBestPracticesProgress);
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      checklistItems.forEach(function (item) {
        item.checked = false;
      });

      updateBestPracticesProgress();
    });
  }

  updateBestPracticesProgress();
})();


/* ==========================================
   STAGE 24: EXAMPLES & TUTORIALS
   Search, filters, expandable tutorials,
   and learning progress
========================================== */

(function initTaskFlowExamplesTutorials() {
  "use strict";

  const section = document.getElementById(
    "documentation-examples-tutorials"
  );

  if (
    !section ||
    section.dataset.examplesInitialized === "true"
  ) {
    return;
  }

  section.dataset.examplesInitialized = "true";

  /* ----------------------------------------
     1. SEARCH AND CATEGORY FILTERS
  ---------------------------------------- */

  const searchInput = section.querySelector(
    "[data-examples-search]"
  );

  const filterButtons = Array.from(
    section.querySelectorAll("[data-examples-filter]")
  );

  const cards = Array.from(
    section.querySelectorAll("[data-examples-category]")
  );

  const resultCount = section.querySelector(
    "[data-examples-result-count]"
  );

  const emptyState = section.querySelector(
    "[data-examples-empty]"
  );

  const clearSearchButton = section.querySelector(
    "[data-examples-clear-search]"
  );

  const emptyResetButton = section.querySelector(
    "[data-examples-empty-reset]"
  );

  let activeCategory = "all";

  function filterTutorials() {
    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    cards.forEach(function (card) {
      const categoryMatches =
        activeCategory === "all" ||
        card.dataset.examplesCategory === activeCategory;

      const searchableText = (
        (card.dataset.examplesSearchText || "") +
        " " +
        card.textContent
      ).toLowerCase();

      const searchMatches =
        searchTerm === "" ||
        searchableText.includes(searchTerm);

      const shouldShow = categoryMatches && searchMatches;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach(function (button) {
      const isActive =
        button.dataset.examplesFilter === activeCategory;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount +
        (visibleCount === 1 ? " tutorial" : " tutorials");
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.examplesFilter;
      filterTutorials();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterTutorials);
  }

  function resetTutorialSearch() {
    activeCategory = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    filterTutorials();
  }

  if (clearSearchButton) {
    clearSearchButton.addEventListener(
      "click",
      resetTutorialSearch
    );
  }

  if (emptyResetButton) {
    emptyResetButton.addEventListener(
      "click",
      resetTutorialSearch
    );
  }

  filterTutorials();

  /* ----------------------------------------
     2. EXPANDABLE TUTORIAL CARDS
  ---------------------------------------- */

  const tutorialButtons = Array.from(
    section.querySelectorAll(".tf-example-toggle")
  );

  tutorialButtons.forEach(function (button) {
    const card = button.closest(".tf-example-card");

    if (!card) {
      return;
    }

    const details = card.querySelector(".tf-example-details");

    if (details) {
      details.id = "tf-example-details-" +
        (cards.indexOf(card) + 1);

      button.setAttribute("aria-controls", details.id);
    }

    button.addEventListener("click", function () {
      const isExpanded =
        card.classList.toggle("is-expanded");

      button.setAttribute(
        "aria-expanded",
        String(isExpanded)
      );

      const label = button.firstChild;

      if (label && label.nodeType === Node.TEXT_NODE) {
        label.textContent = isExpanded
          ? "Hide tutorial "
          : "View tutorial ";
      }
    });
  });

  /* ----------------------------------------
     3. LEARNING CHECKLIST PROGRESS
  ---------------------------------------- */

  const checklistItems = Array.from(
    section.querySelectorAll("[data-examples-check]")
  );

  const progressBar = section.querySelector(
    "[data-examples-progress-bar]"
  );

  const progressFill = section.querySelector(
    "[data-examples-progress-fill]"
  );

  const progressText = section.querySelector(
    "[data-examples-progress-text]"
  );

  const progressPercent = section.querySelector(
    "[data-examples-progress-percent]"
  );

  const resetChecklistButton = section.querySelector(
    "[data-examples-reset]"
  );

  function updateLearningProgress() {
    const total = checklistItems.length;

    const completed = checklistItems.filter(function (item) {
      return item.checked;
    }).length;

    const percentage = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    if (progressText) {
      progressText.textContent =
        completed + " of " + total + " complete";
    }

    if (progressPercent) {
      progressPercent.textContent = percentage + "%";
    }

    if (progressFill) {
      progressFill.style.width = percentage + "%";
    }

    if (progressBar) {
      progressBar.setAttribute("aria-valuemax", String(total));
      progressBar.setAttribute("aria-valuenow", String(completed));
      progressBar.setAttribute(
        "aria-valuetext",
        completed + " of " + total + " checks complete"
      );
    }
  }

  checklistItems.forEach(function (item) {
    item.addEventListener("change", updateLearningProgress);
  });

  if (resetChecklistButton) {
    resetChecklistButton.addEventListener("click", function () {
      checklistItems.forEach(function (item) {
        item.checked = false;
      });

      updateLearningProgress();
    });
  }

  updateLearningProgress();
})();



/* =========================================
   IT TASKFLOW — STAGE 25: GLOSSARY
========================================= */

(function initTaskFlowGlossary() {
  "use strict";

  const section = document.getElementById("documentation-glossary");

  if (!section || section.dataset.glossaryInitialized === "true") {
    return;
  }

  section.dataset.glossaryInitialized = "true";

  const searchInput = section.querySelector("[data-glossary-search]");
  const filterButtons = [
    ...section.querySelectorAll("[data-glossary-filter]")
  ];
  const cards = [
    ...section.querySelectorAll(".tf-glossary-card")
  ];
  const resultLabel = section.querySelector("[data-glossary-results]");
  const countLabel = section.querySelector("[data-glossary-count]");
  const emptyState = section.querySelector("[data-glossary-empty]");
  const resetButton = section.querySelector("[data-glossary-reset]");
  const grid = section.querySelector("[data-glossary-grid]");

  if (
    !searchInput ||
    !resultLabel ||
    !countLabel ||
    !emptyState ||
    !resetButton ||
    !grid
  ) {
    return;
  }

  let activeCategory = "all";

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function updateGlossary() {
    const searchTerm = normalizeText(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.glossaryCategory || "";
      const term = card.dataset.glossaryTerm || "";
      const title = card.querySelector("h3")?.textContent || "";
      const description = card.querySelector("p")?.textContent || "";

      const searchableText = normalizeText(
        `${term} ${title} ${description} ${category}`
      );

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch =
        searchTerm === "" || searchableText.includes(searchTerm);

      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    countLabel.textContent = visibleCount;

    resultLabel.textContent =
      `Showing ${visibleCount} of ${cards.length} terms`;

    emptyState.hidden = visibleCount !== 0;
    grid.hidden = visibleCount === 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.glossaryFilter || "all";

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      updateGlossary();
    });
  });

  searchInput.addEventListener("input", updateGlossary);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "all";

    filterButtons.forEach((button) => {
      const isActive = button.dataset.glossaryFilter === "all";

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    updateGlossary();
    searchInput.focus();
  });

  updateGlossary();
})();



/* =========================================
   IT TASKFLOW — STAGE 26: FAQ
========================================= */

(function initTaskFlowFAQ() {
  "use strict";

  const section = document.getElementById("documentation-faq");

  if (!section || section.dataset.faqInitialized === "true") {
    return;
  }

  section.dataset.faqInitialized = "true";

  const searchInput = section.querySelector("[data-faq-search]");
  const filterButtons = [
    ...section.querySelectorAll("[data-faq-filter]")
  ];
  const items = [
    ...section.querySelectorAll(".tf-faq-item")
  ];
  const resultLabel = section.querySelector("[data-faq-results]");
  const emptyState = section.querySelector("[data-faq-empty]");
  const list = section.querySelector("[data-faq-list]");
  const resetButton = section.querySelector("[data-faq-reset]");
  const expandButton = section.querySelector("[data-faq-expand]");
  const collapseButton = section.querySelector("[data-faq-collapse]");

  if (
    !searchInput ||
    !resultLabel ||
    !emptyState ||
    !list ||
    !resetButton ||
    !expandButton ||
    !collapseButton
  ) {
    return;
  }

  let activeCategory = "all";

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function updateFAQ() {
    const searchTerm = normalizeText(searchInput.value);
    let visibleCount = 0;

    items.forEach((item) => {
      const category = item.dataset.faqCategory || "";
      const question =
        item.querySelector(".tf-faq-question")?.textContent || "";
      const answer =
        item.querySelector(".tf-faq-answer")?.textContent || "";

      const searchableText = normalizeText(
        `${question} ${answer} ${category}`
      );

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch =
        searchTerm === "" || searchableText.includes(searchTerm);

      const isVisible = matchesCategory && matchesSearch;

      item.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    resultLabel.textContent =
      `Showing ${visibleCount} of ${items.length} questions`;

    emptyState.hidden = visibleCount !== 0;
    list.hidden = visibleCount === 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.faqFilter || "all";

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      updateFAQ();
    });
  });

  searchInput.addEventListener("input", updateFAQ);

  expandButton.addEventListener("click", () => {
    items.forEach((item) => {
      if (!item.hidden) {
        const details = item.querySelector("details");

        if (details) {
          details.open = true;
        }
      }
    });
  });

  collapseButton.addEventListener("click", () => {
    items.forEach((item) => {
      if (!item.hidden) {
        const details = item.querySelector("details");

        if (details) {
          details.open = false;
        }
      }
    });
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "all";

    filterButtons.forEach((button) => {
      const isActive = button.dataset.faqFilter === "all";

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    updateFAQ();
    searchInput.focus();
  });

  updateFAQ();
})();




/* =========================================
   IT TASKFLOW — FLOATING BACK TO TOP BUTTON
========================================= */

(function initTaskFlowBackToTop() {
  "use strict";

  const backToTopButton = document.getElementById("tf-back-to-top");

  if (
    !backToTopButton ||
    backToTopButton.dataset.initialized === "true"
  ) {
    return;
  }

  backToTopButton.dataset.initialized = "true";

  const scrollThreshold = 300;
  let isVisible = false;
  let ticking = false;

  function updateButtonVisibility() {
    const shouldShow = window.scrollY > scrollThreshold;

    if (shouldShow !== isVisible) {
      isVisible = shouldShow;

      backToTopButton.classList.toggle("is-visible", shouldShow);
      backToTopButton.setAttribute("aria-hidden", String(!shouldShow));
      backToTopButton.tabIndex = shouldShow ? 0 : -1;
    }

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateButtonVisibility);
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  backToTopButton.addEventListener("click", function () {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });

  // Set the correct initial state when the page loads.
  updateButtonVisibility();
})();
