
/* =========================================================
   IT TASKFLOW — CONTACT SUPPORT
   Vanilla JavaScript | Frontend validation only
   IMPORTANT: This version does not send or store tickets.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("csSupportForm");
  const categorySelect = document.getElementById("csCategory");
  const categoryCards = document.querySelectorAll(".cs-category-card");
  const description = document.getElementById("csDescription");
  const characterCount = document.getElementById("csCharacterCount");
  const attachmentInput = document.getElementById("csAttachment");
  const attachmentError = document.getElementById("csAttachmentError");
  const submitButton = document.getElementById("csSubmitButton");
  const formStatus = document.getElementById("csFormStatus");

  const menuToggle = document.getElementById("csMenuToggle");
  const navigation = document.getElementById("csNavigation");
  const backToTop = document.getElementById("csBackToTop");

  const currentYear = document.getElementById("csCurrentYear");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_FILES = 3;

  const allowedExtensions = [
    "png", "jpg", "jpeg", "webp", "pdf", "txt", "log"
  ];

  const errorFields = {
    company: {
      input: "csCompany",
      error: "csCompanyError"
    },
    contactName: {
      input: "csName",
      error: "csNameError"
    },
    email: {
      input: "csEmail",
      error: "csEmailError"
    },
    role: {
      input: "csRole",
      error: "csRoleError"
    },
    category: {
      input: "csCategory",
      error: "csCategoryError"
    },
    subject: {
      input: "csSubject",
      error: "csSubjectError"
    },
    description: {
      input: "csDescription",
      error: "csDescriptionError"
    }
  };

  // -------------------------------------------------------
  // 1. FOOTER YEAR
  // -------------------------------------------------------

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 2. CATEGORY CARD SELECTION
  // -------------------------------------------------------

  function selectCategory(category) {
    categorySelect.value = category;

    categoryCards.forEach((card) => {
      const selected = card.dataset.category === category;

      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });

    clearFieldError("category");
  }

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectCategory(card.dataset.category);

      // Bring the selected category into the request form.
      document.getElementById("support-form").scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  categorySelect.addEventListener("change", () => {
    selectCategory(categorySelect.value);
  });

  // -------------------------------------------------------
  // 3. MOBILE NAVIGATION
  // -------------------------------------------------------

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("is-open") &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // -------------------------------------------------------
  // 4. DESCRIPTION CHARACTER COUNTER
  // -------------------------------------------------------

  function updateCharacterCount() {
    characterCount.textContent =
      `${description.value.length} / 5000`;
  }

  description.addEventListener("input", () => {
    updateCharacterCount();
    clearFieldError("description");
  });

  updateCharacterCount();

  // -------------------------------------------------------
  // 5. FIELD ERROR HELPERS
  // -------------------------------------------------------

  function setFieldError(fieldName, message) {
    const config = errorFields[fieldName];

    if (!config) return;

    const input = document.getElementById(config.input);
    const error = document.getElementById(config.error);

    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
  }

  function clearFieldError(fieldName) {
    const config = errorFields[fieldName];

    if (!config) return;

    const input = document.getElementById(config.input);
    const error = document.getElementById(config.error);

    input.removeAttribute("aria-invalid");
    error.textContent = "";
  }

  function clearAllErrors() {
    Object.keys(errorFields).forEach(clearFieldError);

    attachmentInput.removeAttribute("aria-invalid");
    attachmentError.textContent = "";

    document.getElementById("csConsentError").textContent = "";
  }

  function showStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", isError);
    formStatus.hidden = false;
    formStatus.focus();
  }

  function clearStatus() {
    formStatus.hidden = true;
    formStatus.textContent = "";
    formStatus.classList.remove("is-error");
  }

  // Clear an individual error as the user edits the field.
  Object.entries(errorFields).forEach(([fieldName, config]) => {
    const input = document.getElementById(config.input);

    input.addEventListener("input", () => {
      clearFieldError(fieldName);
      clearStatus();
    });

    input.addEventListener("change", () => {
      clearFieldError(fieldName);
      clearStatus();
    });
  });

  // -------------------------------------------------------
  // 6. ATTACHMENT VALIDATION
  // -------------------------------------------------------

  function validateAttachments() {
    const files = Array.from(attachmentInput.files);

    attachmentError.textContent = "";
    attachmentInput.removeAttribute("aria-invalid");

    if (files.length > MAX_FILES) {
      attachmentError.textContent =
        `Choose no more than ${MAX_FILES} files.`;
    } else {
      const invalidFile = files.find((file) => {
        const extension = file.name.split(".").pop().toLowerCase();

        return (
          !allowedExtensions.includes(extension) ||
          file.size > MAX_FILE_SIZE
        );
      });

      if (invalidFile) {
        const extension = invalidFile.name
          .split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          attachmentError.textContent =
            `The file "${invalidFile.name}" has an unsupported file type.`;
        } else {
          attachmentError.textContent =
            `The file "${invalidFile.name}" exceeds the 5 MB limit.`;
        }
      }
    }

    if (attachmentError.textContent) {
      attachmentInput.setAttribute("aria-invalid", "true");
      return false;
    }

    return true;
  }

  attachmentInput.addEventListener("change", () => {
    validateAttachments();
    clearStatus();
  });

  // -------------------------------------------------------
  // 7. FORM VALIDATION
  // -------------------------------------------------------

  function validateForm() {
    clearAllErrors();

    let isValid = true;
    let firstInvalidField = null;

    function reject(fieldName, message) {
      setFieldError(fieldName, message);
      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = document.getElementById(
          errorFields[fieldName].input
        );
      }
    }

    const company = document.getElementById("csCompany").value.trim();
    const name = document.getElementById("csName").value.trim();
    const email = document.getElementById("csEmail").value.trim();
    const role = document.getElementById("csRole").value;
    const category = categorySelect.value;
    const subject = document.getElementById("csSubject").value.trim();
    const details = description.value.trim();
    const consent = document.getElementById("csPrivacyConsent");

    if (!company) {
      reject("company", "Enter your company or organization name.");
    } else if (company.length < 2) {
      reject("company", "Enter a company name with at least 2 characters.");
    }

    if (!name) {
      reject("contactName", "Enter the contact person's name.");
    } else if (name.length < 2) {
      reject("contactName", "Enter a name with at least 2 characters.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      reject("email", "Enter your work email address.");
    } else if (
      email.length > 254 ||
      !emailPattern.test(email)
    ) {
      reject("email", "Enter a valid email address.");
    }

    if (!role) {
      reject("role", "Select your role.");
    }

    if (!category) {
      reject("category", "Select an issue category.");
    }

    if (!subject) {
      reject("subject", "Enter a subject for your issue.");
    } else if (subject.length < 5) {
      reject("subject", "The subject must contain at least 5 characters.");
    }

    if (!details) {
      reject("description", "Describe the issue you are experiencing.");
    } else if (details.length < 20) {
      reject("description", "Please provide at least 20 characters.");
    }

    if (!validateAttachments()) {
      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = attachmentInput;
      }
    }

    const consentError = document.getElementById("csConsentError");

    if (!consent.checked) {
      consentError.textContent =
        "Please confirm that your request does not contain confidential credentials.";

      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = consent;
      }
    }

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
    }

    return isValid;
  }

  // -------------------------------------------------------
  // 8. SUBMISSION — FRONTEND TEST ONLY
  // -------------------------------------------------------

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();

    if (!validateForm()) {
      showStatus(
        "Please correct the highlighted fields before continuing.",
        true
      );
      return;
    }

    /*
      IMPORTANT:
      This version only validates the form locally.

      Next phase:
      1. Send the form to the Node.js API using fetch().
      2. Let the backend validate the request again.
      3. Send the ticket to the configured support email.
      4. Display success only after the backend confirms receipt.
    */

    showStatus(
      "Frontend validation successful. No ticket has been sent or saved yet. " +
      "The Node.js backend must be connected before real support requests can be delivered."
    );
  });

  // -------------------------------------------------------
  // 9. BACK TO TOP
  // -------------------------------------------------------

  function updateBackToTop() {
    backToTop.classList.toggle("is-visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  });

  updateBackToTop();

  // Set the initial selected category.
  selectCategory(categorySelect.value);
});
