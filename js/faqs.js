
/* =========================================================
   IT TASKFLOW — FAQ PAGE FUNCTIONALITY
   Vanilla JavaScript | No dependencies
   File: js/faqs.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------
  // 01. Select page elements
  // -------------------------------------------------------

  const faqSearchForm = document.getElementById("faqSearchForm");
  const faqSearchInput = document.getElementById("faqSearchInput");
  const clearSearchButton = document.getElementById("clearSearch");

  const categoryList = document.getElementById("categoryList");
  const categoryButtons = Array.from(
    document.querySelectorAll(".category-button")
  );

  const faqList = document.getElementById("faqList");
  const faqItems = Array.from(
    faqList.querySelectorAll(".faq-item")
  );

  const activeCategoryTitle = document.getElementById(
    "activeCategoryTitle"
  );

  const resultCount = document.getElementById("resultCount");
  const faqEmptyState = document.getElementById("faqEmptyState");

  const expandAllButton = document.getElementById("expandAll");
  const collapseAllButton = document.getElementById("collapseAll");
  const resetFaqsButton = document.getElementById("resetFaqs");

  const mobileMenuToggle = document.getElementById(
    "mobileMenuToggle"
  );

  const primaryNavigation = document.getElementById(
    "primaryNavigation"
  );

  const backToTopButton = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");

  // Stop initialization if the required FAQ elements are missing.
  if (
    !faqSearchInput ||
    !categoryList ||
    !faqList ||
    !resultCount ||
    !faqEmptyState
  ) {
    console.error(
      "IT TaskFlow FAQs: Required page elements were not found."
    );
    return;
  }

  // -------------------------------------------------------
  // 02. Page state
  // -------------------------------------------------------

  let activeCategory = "all";
  let searchQuery = "";

  const categoryNames = {
    all: "All questions",
    "getting-started": "Getting started",
    tasks: "Tasks & workflow",
    projects: "Projects & teams",
    notifications: "Notifications",
    accounts: "Accounts & security",
    administration: "Administration"
  };

  // -------------------------------------------------------
  // 03. Prepare accordion buttons and answer panels
  // -------------------------------------------------------

  faqItems.forEach((item, index) => {
    const questionButton = item.querySelector(".faq-question");
    const answerPanel = item.querySelector(".faq-answer");

    if (!questionButton || !answerPanel) {
      console.warn(
        "IT TaskFlow FAQs: An FAQ item is missing its button or answer.",
        item
      );
      return;
    }

    // Give each answer panel a unique ID.
    const panelId = `faq-answer-${index + 1}`;

    answerPanel.id = panelId;
    questionButton.setAttribute("aria-controls", panelId);
    questionButton.setAttribute("aria-expanded", "false");

    answerPanel.hidden = true;
    item.classList.remove("is-open");

    questionButton.addEventListener("click", () => {
      const isCurrentlyOpen =
        questionButton.getAttribute("aria-expanded") === "true";

      setAccordionState(item, !isCurrentlyOpen);
    });
  });

  // -------------------------------------------------------
  // 04. Open or close an individual accordion
  // -------------------------------------------------------

  function setAccordionState(item, shouldOpen) {
    const questionButton = item.querySelector(".faq-question");
    const answerPanel = item.querySelector(".faq-answer");

    if (!questionButton || !answerPanel) {
      return;
    }

    questionButton.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    answerPanel.hidden = !shouldOpen;
    item.classList.toggle("is-open", shouldOpen);
  }

  // -------------------------------------------------------
  // 05. Update category counts
  // -------------------------------------------------------

  function updateCategoryCounts() {
    const categoryCounts = {
      all: faqItems.length
    };

    faqItems.forEach((item) => {
      const category = item.dataset.category;

      if (category) {
        categoryCounts[category] =
          (categoryCounts[category] || 0) + 1;
      }
    });

    document
      .querySelectorAll("[data-count-for]")
      .forEach((countElement) => {
        const category = countElement.dataset.countFor;

        countElement.textContent =
          categoryCounts[category] ?? 0;
      });
  }

  // -------------------------------------------------------
  // 06. Build searchable text for each FAQ
  // -------------------------------------------------------

  function getSearchableText(item) {
    const question = item.querySelector(".question-text");
    const answer = item.querySelector(".faq-answer");

    return [
      question ? question.textContent : "",
      answer ? answer.textContent : "",
      item.dataset.keywords || "",
      item.dataset.category || ""
    ]
      .join(" ")
      .toLocaleLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  // -------------------------------------------------------
  // 07. Filter questions by category and search query
  // -------------------------------------------------------

  function filterFAQs() {
    const normalizedQuery = searchQuery
      .toLocaleLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    let visibleCount = 0;

    faqItems.forEach((item) => {
      const itemCategory = item.dataset.category || "";
      const searchableText = getSearchableText(item);

      const matchesCategory =
        activeCategory === "all" ||
        itemCategory === activeCategory;

      const matchesSearch =
        normalizedQuery === "" ||
        searchableText.includes(normalizedQuery);

      const shouldShow = matchesCategory && matchesSearch;

      item.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      } else {
        // Close an answer when its question is filtered out.
        setAccordionState(item, false);
      }
    });

    activeCategoryTitle.textContent =
      categoryNames[activeCategory] || "All questions";

    if (normalizedQuery) {
      activeCategoryTitle.textContent += " · Search results";
    }

    resultCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? "question" : "questions"}`;

    faqEmptyState.hidden = visibleCount !== 0;
    faqList.hidden = visibleCount === 0;

    clearSearchButton.hidden = normalizedQuery.length === 0;

    // Update the expand/collapse controls.
    expandAllButton.disabled = visibleCount === 0;
    collapseAllButton.disabled = visibleCount === 0;
  }

  // -------------------------------------------------------
  // 08. Category selection
  // -------------------------------------------------------

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";

      categoryButtons.forEach((categoryButton) => {
        const isActive =
          categoryButton === button;

        categoryButton.classList.toggle("active", isActive);

        categoryButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      filterFAQs();
    });
  });

  // -------------------------------------------------------
  // 09. Live search
  // -------------------------------------------------------

  faqSearchInput.addEventListener("input", () => {
    searchQuery = faqSearchInput.value;
    filterFAQs();
  });

  // Prevent a page reload when the search form is submitted.
  if (faqSearchForm) {
    faqSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      searchQuery = faqSearchInput.value;
      filterFAQs();
    });
  }

  // -------------------------------------------------------
  // 10. Clear the search field
  // -------------------------------------------------------

  function clearSearch() {
    faqSearchInput.value = "";
    searchQuery = "";

    filterFAQs();
    faqSearchInput.focus();
  }

  if (clearSearchButton) {
    clearSearchButton.addEventListener("click", clearSearch);
  }

  // -------------------------------------------------------
  // 11. Popular search shortcuts
  // -------------------------------------------------------

  document
    .querySelectorAll("[data-search]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const searchTerm = button.dataset.search || "";

        faqSearchInput.value = searchTerm;
        searchQuery = searchTerm;

        filterFAQs();

        // Bring the FAQ results into view.
        document
          .querySelector(".faq-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });

  // -------------------------------------------------------
  // 12. Expand all visible questions
  // -------------------------------------------------------

  if (expandAllButton) {
    expandAllButton.addEventListener("click", () => {
      faqItems.forEach((item) => {
        if (!item.hidden) {
          setAccordionState(item, true);
        }
      });
    });
  }

  // -------------------------------------------------------
  // 13. Collapse all questions
  // -------------------------------------------------------

  if (collapseAllButton) {
    collapseAllButton.addEventListener("click", () => {
      faqItems.forEach((item) => {
        if (!item.hidden) {
          setAccordionState(item, false);
        }
      });
    });
  }

  // -------------------------------------------------------
  // 14. Reset filters and show all questions
  // -------------------------------------------------------

  function resetFAQs() {
    activeCategory = "all";
    searchQuery = "";

    faqSearchInput.value = "";

    categoryButtons.forEach((button) => {
      const isAllCategory =
        button.dataset.category === "all";

      button.classList.toggle("active", isAllCategory);

      button.setAttribute(
        "aria-pressed",
        String(isAllCategory)
      );
    });

    faqItems.forEach((item) => {
      setAccordionState(item, false);
    });

    filterFAQs();
  }

  if (resetFaqsButton) {
    resetFaqsButton.addEventListener("click", resetFAQs);
  }

  // -------------------------------------------------------
  // 15. Mobile navigation
  // -------------------------------------------------------

  if (mobileMenuToggle && primaryNavigation) {
    function closeMobileNavigation() {
      primaryNavigation.classList.remove("is-open");

      mobileMenuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileMenuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    }

    mobileMenuToggle.addEventListener("click", () => {
      const isOpen =
        primaryNavigation.classList.toggle("is-open");

      mobileMenuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      mobileMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    primaryNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileNavigation();
      }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        closeMobileNavigation();
      }
    });
  }

  // -------------------------------------------------------
  // 16. Back-to-top button
  // -------------------------------------------------------

  function updateBackToTopVisibility() {
    if (!backToTopButton) {
      return;
    }

    backToTopButton.classList.toggle(
      "is-visible",
      window.scrollY > 450
    );
  }

  window.addEventListener(
    "scroll",
    updateBackToTopVisibility,
    { passive: true }
  );

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });
  }

  // -------------------------------------------------------
  // 17. Automatic copyright year
  // -------------------------------------------------------

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 18. Initialize the page
  // -------------------------------------------------------

  updateCategoryCounts();
  filterFAQs();
  updateBackToTopVisibility();
});
