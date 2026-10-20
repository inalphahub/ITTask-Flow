
/* =========================================================
   IT TASKFLOW — HELP CENTER FUNCTIONALITY
   Vanilla JavaScript | No dependencies
   File: js/helpcenter.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------
  // 01. Select page elements
  // -------------------------------------------------------

  const searchForm = document.getElementById("hcSearchForm");
  const searchInput = document.getElementById("hcSearchInput");
  const searchClear = document.getElementById("hcSearchClear");

  const topicFilters = Array.from(
    document.querySelectorAll(".hc-topic-filter")
  );

  const resourceGrid = document.getElementById("hcResourceGrid");
  const resourceCards = Array.from(
    document.querySelectorAll(".hc-resource-card")
  );

  const resourceCount = document.getElementById("hcResourceCount");
  const emptyState = document.getElementById("hcResourceEmpty");
  const resetSearchButton = document.getElementById("hcResetSearch");

  const issueButtons = Array.from(
    document.querySelectorAll(".hc-issue-button")
  );

  const diagnosticTitle = document.getElementById("hcDiagnosticTitle");
  const diagnosticSymbol = document.getElementById("hcDiagnosticSymbol");
  const diagnosticIntro = document.getElementById("hcDiagnosticIntro");
  const diagnosticSteps = document.getElementById("hcDiagnosticSteps");
  const diagnosticNote = document.getElementById("hcDiagnosticNote");
  const diagnosticLink = document.getElementById("hcDiagnosticLink");

  const mobileToggle = document.getElementById("hcMobileToggle");
  const primaryNav = document.getElementById("hcPrimaryNav");

  const backToTop = document.getElementById("hcBackToTop");
  const currentYear = document.getElementById("hcCurrentYear");

  if (
    !searchInput ||
    !resourceGrid ||
    !resourceCount ||
    !emptyState
  ) {
    console.error(
      "IT TaskFlow Help Center: Required resource elements are missing."
    );
    return;
  }

  // -------------------------------------------------------
  // 02. Application state
  // -------------------------------------------------------

  let activeCategory = "all";
  let searchQuery = "";

  const categoryNames = {
    all: "All topics",
    "getting-started": "Getting started",
    tasks: "Tasks & projects",
    accounts: "Accounts & access",
    notifications: "Notifications",
    troubleshooting: "Troubleshooting"
  };

  // -------------------------------------------------------
  // 03. Troubleshooting content
  //
  // These are general diagnostic suggestions. They do not
  // connect to an actual support system or backend.
  // -------------------------------------------------------

  const troubleshootingGuides = {
    login: {
      title: "Having trouble signing in?",
      symbol: "↗",
      intro:
        "Work through these basic checks before requesting additional assistance.",
      steps: [
        "Verify that you are using the correct login page for your IT TaskFlow environment.",
        "Check your username and password for typing errors, including accidental spaces.",
        "If password recovery is available, follow the approved recovery process.",
        "If access still fails, contact your authorized organization administrator."
      ],
      note:
        "Never share your password or verification codes with anyone.",
      link: "faqs.html",
      linkText: "Explore related FAQs"
    },

    project: {
      title: "Can't find your project?",
      symbol: "▦",
      intro:
        "A project may be missing because of membership, account association, or access permissions.",
      steps: [
        "Confirm that you signed in with the account associated with your organization.",
        "Check the project list or workspace available to your role.",
        "Confirm the project name and your membership with the project manager.",
        "If access is expected but still missing, ask an authorized administrator to review your permissions."
      ],
      note:
        "Do not attempt to access a project by bypassing its permissions.",
      link: "userguide.html",
      linkText: "Explore project guidance"
    },

    task: {
      title: "Is your task failing to update?",
      symbol: "✓",
      intro:
        "Check the task, its current status, and your permission to make the intended change.",
      steps: [
        "Open the task from its authorized project workspace and verify that you selected the correct item.",
        "Review the current status and available actions for that task.",
        "Retry the update once and check whether the displayed status changes.",
        "If the issue continues, record the task reference, action attempted, and any visible error."
      ],
      note:
        "Avoid repeatedly submitting the same change if the result is unclear.",
      link: "faqs.html",
      linkText: "Explore task FAQs"
    },

    notification: {
      title: "Did you miss a notification?",
      symbol: "♧",
      intro:
        "Check the underlying task or project first, then investigate the notification options available to you.",
      steps: [
        "Open your task or project list and check whether the expected update is present.",
        "Verify that the task assignment or status change actually occurred.",
        "Review available notification preferences and browser permissions, if those settings are supported.",
        "If the alert remains missing, record the related task and approximate time and report the issue."
      ],
      note:
        "Notification delivery depends on the features implemented and enabled in your environment.",
      link: "faqs.html",
      linkText: "Explore notification FAQs"
    },

    error: {
      title: "Encountered an unexpected error?",
      symbol: "!",
      intro:
        "Collect a few details so the issue can be reproduced and investigated.",
      steps: [
        "Note the page, module, and action you were performing when the error appeared.",
        "Read and record the visible error message without including sensitive information.",
        "If appropriate, retry once and check whether the issue occurs again.",
        "Report the steps, expected result, actual result, and approximate time to your designated support contact."
      ],
      note:
        "Never include passwords, authentication codes, or confidential data unnecessarily.",
      link: "documentation.html",
      linkText: "Review available documentation"
    }
  };

  // -------------------------------------------------------
  // 04. Search normalization
  // -------------------------------------------------------

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function getResourceSearchText(card) {
    return normalizeText([
      card.querySelector("h3")?.textContent || "",
      card.querySelector("p")?.textContent || "",
      card.dataset.hcKeywords || "",
      card.dataset.hcCategory || ""
    ].join(" "));
  }

  // -------------------------------------------------------
  // 05. Filter resource cards
  // -------------------------------------------------------

  function filterResources() {
    const normalizedQuery = normalizeText(searchQuery);
    let visibleCount = 0;

    resourceCards.forEach((card) => {
      const category = card.dataset.hcCategory || "";
      const searchableText = getResourceSearchText(card);

      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;

      const matchesQuery =
        normalizedQuery === "" ||
        searchableText.includes(normalizedQuery);

      const shouldShow = matchesCategory && matchesQuery;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    resourceCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? "resource" : "resources"}`;

    resourceGrid.hidden = visibleCount === 0;
    emptyState.hidden = visibleCount !== 0;

    if (searchClear) {
      searchClear.hidden = normalizedQuery.length === 0;
    }

    topicFilters.forEach((button) => {
      const isActive =
        (button.dataset.hcCategory || "all") === activeCategory;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  // -------------------------------------------------------
  // 06. Category filters
  // -------------------------------------------------------

  topicFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.hcCategory || "all";
      filterResources();
    });
  });

  // -------------------------------------------------------
  // 07. Live search
  // -------------------------------------------------------

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    filterResources();
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      searchQuery = searchInput.value;
      filterResources();

      document.getElementById("hcResources")?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  // -------------------------------------------------------
  // 08. Suggested search terms
  // -------------------------------------------------------

  document.querySelectorAll("[data-hc-search]").forEach((button) => {
    button.addEventListener("click", () => {
      searchQuery = button.dataset.hcSearch || "";
      searchInput.value = searchQuery;

      // Start with all topics so a search isn't restricted
      // by a previously selected category.
      activeCategory = "all";
      filterResources();

      document.getElementById("hcResources")?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // -------------------------------------------------------
  // 09. Clear search
  // -------------------------------------------------------

  function clearResourceSearch() {
    searchInput.value = "";
    searchQuery = "";
    filterResources();
    searchInput.focus();
  }

  if (searchClear) {
    searchClear.addEventListener("click", clearResourceSearch);
  }

  // -------------------------------------------------------
  // 10. Reset all resource filters
  // -------------------------------------------------------

  function resetResourceFilters() {
    searchInput.value = "";
    searchQuery = "";
    activeCategory = "all";

    filterResources();
    searchInput.focus();
  }

  if (resetSearchButton) {
    resetSearchButton.addEventListener("click", resetResourceFilters);
  }

  // -------------------------------------------------------
  // 11. Troubleshooting panel renderer
  // -------------------------------------------------------

  function renderTroubleshooting(issueKey) {
    const guide = troubleshootingGuides[issueKey];

    if (
      !guide ||
      !diagnosticTitle ||
      !diagnosticSteps ||
      !diagnosticLink
    ) {
      return;
    }

    diagnosticTitle.textContent = guide.title;

    if (diagnosticSymbol) {
      diagnosticSymbol.textContent = guide.symbol;
    }

    if (diagnosticIntro) {
      diagnosticIntro.textContent = guide.intro;
    }

    if (diagnosticNote) {
      diagnosticNote.textContent = guide.note;
    }

    // Create list items safely using textContent.
    diagnosticSteps.replaceChildren();

    guide.steps.forEach((stepText) => {
      const listItem = document.createElement("li");
      listItem.textContent = stepText;
      diagnosticSteps.appendChild(listItem);
    });

    diagnosticLink.href = guide.link;
    diagnosticLink.innerHTML = "";

    const linkText = document.createElement("span");
    linkText.textContent = guide.linkText;

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    diagnosticLink.append(linkText, arrow);

    // Update the selected issue.
    issueButtons.forEach((button) => {
      const isSelected = button.dataset.hcIssue === issueKey;

      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  // -------------------------------------------------------
  // 12. Troubleshooting issue selection
  // -------------------------------------------------------

  issueButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const issueKey = button.dataset.hcIssue;

      if (issueKey) {
        renderTroubleshooting(issueKey);
      }
    });
  });

  // -------------------------------------------------------
  // 13. Mobile navigation
  // -------------------------------------------------------

  if (mobileToggle && primaryNav) {
    function closeMobileMenu() {
      primaryNav.classList.remove("is-open");

      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    }

    mobileToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");

      mobileToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      mobileToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        closeMobileMenu();
      }
    });
  }

  // -------------------------------------------------------
  // 14. Back-to-top button
  // -------------------------------------------------------

  function updateBackToTop() {
    if (!backToTop) {
      return;
    }

    backToTop.classList.toggle(
      "is-visible",
      window.scrollY > 450
    );
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

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

  // -------------------------------------------------------
  // 15. Automatic copyright year
  // -------------------------------------------------------

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 16. Initialize Help Center
  // -------------------------------------------------------

  filterResources();
  renderTroubleshooting("login");
  updateBackToTop();
});
