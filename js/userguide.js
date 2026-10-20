
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const searchForm = $("#guideSearchForm");
  const searchInput = $("#guideSearch");
  const guideCards = $$(".guide-card");
  const categoryButtons = $$(".category-link");
  const guideCount = $("#guideCount");
  const activeFilter = $("#activeFilter");
  const activeFilterText = $("#activeFilterText");
  const clearFilterButton = $("#clearFilter");
  const noResults = $("#noResults");
  const resetSearchButton = $("#resetSearch");
  const guideList = $("#guideList");

  const mobileMenuToggle = $("#mobileMenuToggle");
  const topNav = $("#topNav");
  const guideSidebar = $("#guideSidebar");
  const backToTop = $("#backToTop");

  let selectedCategory = "all";
  let searchTerm = "";

  // Expand and collapse individual guide cards.
  function setGuideExpanded(card, expanded) {
    const button = $(".guide-expand", card);
    if (!button) return;

    card.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", String(expanded));

    const label = $("span:first-child", button);
    const arrow = $(".expand-arrow", button);

    if (label) {
      label.textContent = expanded
        ? "Hide guide details"
        : "Explore this guide";
    }

    if (arrow) {
      arrow.textContent = expanded ? "↑" : "↓";
    }
  }

  // Apply the initial expanded state defined in the HTML.
  guideCards.forEach((card) => {
    const button = $(".guide-expand", card);
    setGuideExpanded(
      card,
      button?.getAttribute("aria-expanded") === "true"
    );
  });

  function getCardSearchText(card) {
    return [
      card.dataset.search || "",
      card.textContent || ""
    ].join(" ").toLowerCase();
  }

  function updateResults() {
    let visibleCount = 0;

    guideCards.forEach((card) => {
      const category = card.dataset.category || "";
      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesSearch =
        !searchTerm ||
        getCardSearchText(card).includes(searchTerm);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    guideCount.textContent =
      `${String(visibleCount).padStart(2, "0")} guide${visibleCount === 1 ? "" : "s"}`;

    noResults.hidden = visibleCount !== 0;
    guideList.hidden = visibleCount === 0;

    const hasFilter =
      selectedCategory !== "all" || searchTerm.length > 0;

    activeFilter.hidden = !hasFilter;

    if (hasFilter) {
      const categoryButton = categoryButtons.find(
        (button) => button.dataset.category === selectedCategory
      );

      const categoryLabel =
        selectedCategory === "all"
          ? "All categories"
          : categoryButton?.querySelector("span:nth-child(2)")?.textContent.trim()
            || "Selected category";

      const searchLabel = searchTerm
        ? `Search: "${searchTerm}"`
        : "";

      activeFilterText.textContent = [categoryLabel, searchLabel]
        .filter(Boolean)
        .join(" · ");
    }

    categoryButtons.forEach((button) => {
      const active = button.dataset.category === selectedCategory;

      button.classList.toggle("active", active);

      if (active) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function applySearch(value) {
    searchTerm = value.trim().toLowerCase();
    updateResults();
  }

  // Search when the user submits the search form.
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    applySearch(searchInput.value);
    $("#guideList")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  // Update results as the user types.
  searchInput?.addEventListener("input", () => {
    applySearch(searchInput.value);
  });

  // Quick-search suggestions.
  $$("[data-search-term]").forEach((button) => {
    button.addEventListener("click", () => {
      searchInput.value = button.dataset.searchTerm || "";
      applySearch(searchInput.value);

      searchInput.focus();

      $("#guideList")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // Category navigation.
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category || "all";
      updateResults();

      if (window.innerWidth <= 780) {
        $("#guideList")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Clear both the category filter and search query.
  function resetFilters() {
    selectedCategory = "all";
    searchTerm = "";

    if (searchInput) searchInput.value = "";

    updateResults();
  }

  clearFilterButton?.addEventListener("click", resetFilters);
  resetSearchButton?.addEventListener("click", resetFilters);

  // Expand or collapse guide details.
  $$(".guide-expand").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".guide-card");
      if (!card) return;

      const currentlyExpanded =
        button.getAttribute("aria-expanded") === "true";

      setGuideExpanded(card, !currentlyExpanded);
    });
  });

  // Mobile top navigation.
  function closeTopNav() {
    topNav?.classList.remove("open");
    mobileMenuToggle?.setAttribute("aria-expanded", "false");
    mobileMenuToggle?.setAttribute("aria-label", "Open navigation");
  }

  mobileMenuToggle?.addEventListener("click", () => {
    const isOpen = topNav?.classList.toggle("open") ?? false;

    mobileMenuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    mobileMenuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  $$("#topNav a").forEach((link) => {
    link.addEventListener("click", closeTopNav);
  });

  // Make the category sidebar convenient on mobile.
  if (guideSidebar) {
    guideSidebar.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        guideSidebar.querySelector(".category-link.active")?.focus();
      }
    });
  }

  // Back-to-top button.
  function updateBackToTop() {
    backToTop?.classList.toggle("visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Keyboard shortcut for closing the mobile navigation.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTopNav();
    }
  });

  // Reset mobile navigation when switching to desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      closeTopNav();
    }
  });

  // Support direct links to a specific guide, such as #guide-tasks.
  function openGuideFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const card = document.getElementById(id);
    if (!card?.classList.contains("guide-card")) return;

    selectedCategory = "all";
    searchTerm = "";

    if (searchInput) searchInput.value = "";

    updateResults();
    setGuideExpanded(card, true);

    window.setTimeout(() => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  window.addEventListener("hashchange", openGuideFromHash);

  // Initialize the page.
  updateResults();
  updateBackToTop();
  openGuideFromHash();
});
