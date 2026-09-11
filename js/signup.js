/* =========================================================
   TASKFLOW SIGNUP PAGE
   signup.js
========================================================= */

"use strict";


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const signupForm =
    document.getElementById("signupForm");

const firstNameInput =
    document.getElementById("firstName");

const lastNameInput =
    document.getElementById("lastName");

const emailInput =
    document.getElementById("email");

const accountRoleInput =
    document.getElementById("accountRole");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsInput =
    document.getElementById("terms");

const sharedAuthApi = "http://127.0.0.1:4173/api";

async function registerWithSharedApi(account) {
    try {
        const response = await fetch(`${sharedAuthApi}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(account)
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}


/* Errors */

const firstNameError =
    document.getElementById("firstNameError");

const lastNameError =
    document.getElementById("lastNameError");

const emailError =
    document.getElementById("emailError");

const accountRoleError =
    document.getElementById("accountRoleError");

const phoneError =
    document.getElementById("phoneError");

const passwordError =
    document.getElementById("passwordError");

const confirmPasswordError =
    document.getElementById("confirmPasswordError");

const termsError =
    document.getElementById("termsError");


/* Buttons */

const passwordToggle =
    document.getElementById("passwordToggle");

const confirmPasswordToggle =
    document.getElementById(
        "confirmPasswordToggle"
    );

const createAccountButton =
    document.getElementById(
        "createAccountButton"
    );


/* Password strength */

const passwordStrength =
    document.getElementById(
        "passwordStrength"
    );

const strengthText =
    document.getElementById(
        "strengthText"
    );


/* Toast */

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const toastClose =
    document.getElementById("toastClose");

let toastTimer;


/* =========================================================
   2. TOAST
========================================================= */

function showToast(title, message) {

    if (!toast) {
        return;
    }

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        hideToast();

    }, 4500);
}


function hideToast() {

    if (!toast) {
        return;
    }

    toast.classList.remove("show");

    clearTimeout(toastTimer);
}


if (toastClose) {

    toastClose.addEventListener(
        "click",
        hideToast
    );

}


/* =========================================================
   3. PASSWORD VISIBILITY
========================================================= */

function setupPasswordToggle(
    toggleButton,
    input
) {

    if (!toggleButton || !input) {
        return;
    }

    toggleButton.addEventListener(
        "click",
        () => {

            const isPassword =
                input.getAttribute("type") ===
                "password";

            input.setAttribute(
                "type",
                isPassword
                    ? "text"
                    : "password"
            );

            toggleButton.classList.toggle(
                "active",
                isPassword
            );

            toggleButton.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );
}


setupPasswordToggle(
    passwordToggle,
    passwordInput
);

setupPasswordToggle(
    confirmPasswordToggle,
    confirmPasswordInput
);


/* =========================================================
   4. EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   5. NAME VALIDATION
========================================================= */

function isValidName(name) {

    return /^[a-zA-ZÀ-ÿ\s'-]{2,}$/
        .test(name);
}


/* =========================================================
   6. PASSWORD STRENGTH
========================================================= */

function calculatePasswordStrength(password) {

    let score = 0;


    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (!password) {

        return {
            level: "",
            text: "Use 8+ characters"
        };

    }


    if (score <= 2) {

        return {
            level: "weak",
            text: "Weak password"
        };

    }


    if (score === 3) {

        return {
            level: "fair",
            text: "Fair password"
        };

    }


    if (score === 4) {

        return {
            level: "good",
            text: "Good password"
        };

    }


    return {

        level: "strong",

        text: "Strong password"

    };
}


/* =========================================================
   7. UPDATE PASSWORD STRENGTH UI
========================================================= */

function updatePasswordStrength() {

    const password =
        passwordInput.value;

    const result =
        calculatePasswordStrength(
            password
        );


    passwordStrength.classList.remove(
        "weak",
        "fair",
        "good",
        "strong"
    );


    if (result.level) {

        passwordStrength.classList.add(
            result.level
        );

    }


    strengthText.textContent =
        result.text;
}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        updatePasswordStrength
    );

}


/* =========================================================
   8. FIELD ERROR HELPERS
========================================================= */

function clearFieldError(
    input,
    errorElement
) {

    const formGroup =
        input.closest(".form-group");

    if (formGroup) {

        formGroup.classList.remove(
            "error"
        );
    }

    if (errorElement) {

        errorElement.textContent = "";
    }
}


function showFieldError(
    input,
    errorElement,
    message
) {

    const formGroup =
        input.closest(".form-group");

    if (formGroup) {

        formGroup.classList.add(
            "error"
        );
    }

    if (errorElement) {

        errorElement.textContent =
            message;
    }
}


/* =========================================================
   9. CLEAR TERMS ERROR
========================================================= */

function clearTermsError() {

    termsError.textContent = "";

}


/* =========================================================
   10. FIRST NAME
========================================================= */

if (firstNameInput) {

    firstNameInput.addEventListener(
        "input",
        () => {

            clearFieldError(
                firstNameInput,
                firstNameError
            );

        }
    );
}


/* =========================================================
   11. LAST NAME
========================================================= */

if (lastNameInput) {

    lastNameInput.addEventListener(
        "input",
        () => {

            clearFieldError(
                lastNameInput,
                lastNameError
            );

        }
    );
}


/* =========================================================
   12. EMAIL
========================================================= */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        () => {

            clearFieldError(
                emailInput,
                emailError
            );

        }
    );
}


/* =========================================================
   13. PHONE
========================================================= */

if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        () => {

            /*
                Allow only numbers.
            */

            phoneInput.value =
                phoneInput.value
                    .replace(/\D/g, "")
                    .slice(0, 10);


            clearFieldError(
                phoneInput,
                phoneError
            );

        }
    );
}


/* =========================================================
   14. PASSWORD
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            clearFieldError(
                passwordInput,
                passwordError
            );

            if (
                confirmPasswordInput.value
            ) {

                validateConfirmPassword();

            }

        }
    );
}


/* =========================================================
   15. CONFIRM PASSWORD
========================================================= */

function validateConfirmPassword() {

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    if (!confirmPassword) {

        showFieldError(
            confirmPasswordInput,
            confirmPasswordError,
            "Please confirm your password."
        );

        return false;
    }


    if (password !== confirmPassword) {

        showFieldError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match."
        );

        return false;
    }


    clearFieldError(
        confirmPasswordInput,
        confirmPasswordError
    );

    return true;
}


if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
        "input",
        validateConfirmPassword
    );
}


/* =========================================================
   16. TERMS
========================================================= */

if (termsInput) {

    termsInput.addEventListener(
        "change",
        () => {

            if (termsInput.checked) {

                clearTermsError();

            }

        }
    );
}


/* =========================================================
   17. COMPLETE FORM VALIDATION
========================================================= */

function validateSignupForm() {

    let valid = true;


    const firstName =
        firstNameInput.value.trim();

    const lastName =
        lastNameInput.value.trim();

    const email =
        emailInput.value.trim();

    const accountRole =
        accountRoleInput.value;

    const phone =
        phoneInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    /* ============================================
       FIRST NAME
    ============================================ */

    if (!firstName) {

        showFieldError(
            firstNameInput,
            firstNameError,
            "Please enter your first name."
        );

        valid = false;

    } else if (!isValidName(firstName)) {

        showFieldError(
            firstNameInput,
            firstNameError,
            "Please enter a valid first name."
        );

        valid = false;

    } else {

        clearFieldError(
            firstNameInput,
            firstNameError
        );
    }


    /* ============================================
       LAST NAME
    ============================================ */

    if (!lastName) {

        showFieldError(
            lastNameInput,
            lastNameError,
            "Please enter your last name."
        );

        valid = false;

    } else if (!isValidName(lastName)) {

        showFieldError(
            lastNameInput,
            lastNameError,
            "Please enter a valid last name."
        );

        valid = false;

    } else {

        clearFieldError(
            lastNameInput,
            lastNameError
        );
    }


    /* ============================================
       EMAIL
    ============================================ */

    if (!email) {

        showFieldError(
            emailInput,
            emailError,
            "Please enter your work email."
        );

        valid = false;

    } else if (!isValidEmail(email)) {

        showFieldError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        valid = false;

    } else {

        clearFieldError(
            emailInput,
            emailError
        );
    }


    /* ============================================
       PHONE
    ============================================ */

    if (
        phone &&
        phone.length !== 10
    ) {

        showFieldError(
            phoneInput,
            phoneError,
            "Please enter a valid 10-digit phone number."
        );

        valid = false;

    } else {

        clearFieldError(
            phoneInput,
            phoneError
        );
    }


    if (!accountRole) {
        showFieldError(
            accountRoleInput,
            accountRoleError,
            "Please select an account role."
        );
        valid = false;
    } else {
        clearFieldError(accountRoleInput, accountRoleError);
    }


    /* ============================================
       PASSWORD
    ============================================ */

    if (!password) {

        showFieldError(
            passwordInput,
            passwordError,
            "Please create a password."
        );

        valid = false;

    } else if (password.length < 8) {

        showFieldError(
            passwordInput,
            passwordError,
            "Password must contain at least 8 characters."
        );

        valid = false;

    } else if (
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ) {

        showFieldError(
            passwordInput,
            passwordError,
            "Use uppercase, lowercase and a number."
        );

        valid = false;

    } else {

        clearFieldError(
            passwordInput,
            passwordError
        );
    }


    /* ============================================
       CONFIRM PASSWORD
    ============================================ */

    if (
        !validateConfirmPassword()
    ) {

        valid = false;

    }


    /* ============================================
       TERMS
    ============================================ */

    if (!termsInput.checked) {

        termsError.textContent =
            "Please accept the Terms of Service and Privacy Policy.";

        valid = false;

    } else {

        clearTermsError();

    }


    return valid;
}


/* =========================================================
   18. FORM SUBMISSION
========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!validateSignupForm()) {

                const firstError =
                    document.querySelector(
                        ".form-group.error input"
                    );

                if (firstError) {

                    firstError.focus();

                }

                return;

            }


            /* =========================================
               GET FORM DATA
            ========================================= */

            const accountRole =
                accountRoleInput.value;

            const accountData = {

                firstName:
                    firstNameInput.value.trim(),

                lastName:
                    lastNameInput.value.trim(),

                email:
                    emailInput.value.trim().toLowerCase(),

                phone:
                    phoneInput.value.trim(),

                password:
                    passwordInput.value,

                userId:
                    `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,

                role: accountRole,

                department: "Software Engineering",

                designation: accountRole,

                accountType: [
                    "Programme Manager",
                    "Program Manager",
                    "Project Manager",
                    "Manager"
                ].includes(accountRole)
                    ? "manager"
                    : "employee"

            };

            await registerWithSharedApi(accountData);

            let accounts = [];

            try {

                accounts = JSON.parse(
                    localStorage.getItem("taskflowAccounts") || "[]"
                );

                const existingAccountIndex = accounts.findIndex(
                    account => account.email === accountData.email
                );

                if (existingAccountIndex >= 0) {
                    accounts[existingAccountIndex] = accountData;
                } else {
                    accounts.push(accountData);
                }

                localStorage.setItem(
                    "taskflowAccounts",
                    JSON.stringify(accounts)
                );

            } catch (error) {

                console.warn(
                    "Unable to save the demo account."
                );

            }


            /*
                IMPORTANT:

                This is frontend demo behavior.

                Later replace this section with:

                fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(accountData)
                })
            */


            createAccountButton.classList.add(
                "loading"
            );

            createAccountButton.disabled = true;


            /* Simulated registration */

            setTimeout(() => {

                createAccountButton.classList.remove(
                    "loading"
                );

                createAccountButton.disabled = false;


                showToast(
                    "Account Created",
                    `Welcome to TaskFlow, ${accountData.firstName}!`
                );


                try {

                    localStorage.setItem(
                        "taskflowRegisteredEmail",
                        accountData.email
                    );

                } catch (error) {

                    console.warn(
                        "Local storage is unavailable."
                    );

                }

                window.setTimeout(() => {

                    window.location.href = "login.html";

                }, 1400);


                console.log(
                    "TaskFlow account data:",
                    accountData
                );


            }, 1400);

        }
    );

}


/* =========================================================
   19. TERMS / PRIVACY PLACEHOLDERS
========================================================= */

const termsLink =
    document.getElementById("termsLink");

const privacyLink =
    document.getElementById("privacyLink");


if (termsLink) {

    termsLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showToast(
                "Terms of Service",
                "Connect this link to your Terms of Service page."
            );

        }
    );
}


if (privacyLink) {

    privacyLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            showToast(
                "Privacy Policy",
                "Connect this link to your Privacy Policy page."
            );

        }
    );
}


/* =========================================================
   20. ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            hideToast();

        }

    }
);


/* =========================================================
   21. INPUT FOCUS EFFECTS
========================================================= */

const inputs =
    document.querySelectorAll(
        ".input-wrapper input"
    );


inputs.forEach((input) => {

    input.addEventListener(
        "focus",
        () => {

            const wrapper =
                input.closest(
                    ".input-wrapper"
                );

            if (wrapper) {

                wrapper.classList.add(
                    "focused"
                );

            }

        }
    );


    input.addEventListener(
        "blur",
        () => {

            const wrapper =
                input.closest(
                    ".input-wrapper"
                );

            if (wrapper) {

                wrapper.classList.remove(
                    "focused"
                );

            }

        }
    );

});


/* =========================================================
   22. PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);