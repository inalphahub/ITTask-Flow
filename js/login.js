/* =========================================================
   TASKFLOW LOGIN PAGE
   login.js
========================================================= */

"use strict";


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const passwordToggle = document.getElementById("passwordToggle");

const loginButton = document.getElementById("loginButton");

const forgotPassword = document.getElementById("forgotPassword");
const signupLink = document.getElementById("signupLink");

const demoLogin = document.getElementById("demoLogin");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastClose = document.getElementById("toastClose");

const rememberMe = document.getElementById("rememberMe");

const demoEmail = "demo@taskflow.com";
const demoPassword = "taskflow123";
const sharedAuthApi = "http://127.0.0.1:4173/api";

async function loginWithSharedApi(email, password) {
    try {
        const response = await fetch(`${sharedAuthApi}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) return null;
        return (await response.json()).account || null;
    } catch (error) {
        return null;
    }
}

function createUserId() {

    return `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

}

function getNameFromEmail(email) {

    const emailName = email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .trim();

    return emailName
        .split(" ")
        .filter(Boolean)
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ") || "TaskFlow User";

}

function isManagerRole(role) {
    return ["administrator", "manager", "project manager", "program manager", "programme manager"]
        .includes(String(role || "").trim().toLowerCase());
}


/* =========================================================
   2. TOAST SYSTEM
========================================================= */

let toastTimer;

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

    toastClose.addEventListener("click", () => {
        hideToast();
    });

}


/* =========================================================
   3. PASSWORD VISIBILITY
========================================================= */

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

        const isPassword =
            passwordInput.getAttribute("type") === "password";

        passwordInput.setAttribute(
            "type",
            isPassword ? "text" : "password"
        );

        passwordToggle.classList.toggle("active", isPassword);

        passwordToggle.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    });

}


/* =========================================================
   4. VALIDATION HELPERS
========================================================= */

function clearFieldError(input, errorElement) {

    const formGroup = input.closest(".form-group");

    if (formGroup) {
        formGroup.classList.remove("error");
    }

    errorElement.textContent = "";
}


function showFieldError(input, errorElement, message) {

    const formGroup = input.closest(".form-group");

    if (formGroup) {
        formGroup.classList.add("error");
    }

    errorElement.textContent = message;
}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   5. LIVE VALIDATION
========================================================= */

if (emailInput) {

    emailInput.addEventListener("input", () => {

        clearFieldError(
            emailInput,
            emailError
        );

    });

}


if (passwordInput) {

    passwordInput.addEventListener("input", () => {

        clearFieldError(
            passwordInput,
            passwordError
        );

    });

}


/* =========================================================
   6. LOGIN VALIDATION
========================================================= */

function validateLoginForm() {

    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    /* Email */

    if (!email) {

        showFieldError(
            emailInput,
            emailError,
            "Please enter your work email."
        );

        isValid = false;

    } else if (!isValidEmail(email)) {

        showFieldError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        isValid = false;

    } else {

        clearFieldError(
            emailInput,
            emailError
        );

    }


    /* Password */

    if (!password) {

        showFieldError(
            passwordInput,
            passwordError,
            "Please enter your password."
        );

        isValid = false;

    } else if (password.length < 6) {

        showFieldError(
            passwordInput,
            passwordError,
            "Password must contain at least 6 characters."
        );

        isValid = false;

    } else {

        clearFieldError(
            passwordInput,
            passwordError
        );

    }


    return isValid;
}


/* =========================================================
   7. LOGIN SUBMIT
========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        if (!validateLoginForm()) {

            const firstError =
                document.querySelector(
                    ".form-group.error input"
                );

            if (firstError) {
                firstError.focus();
            }

            return;
        }


        const email =
            emailInput.value.trim();

        const remember =
            rememberMe.checked;

        let storedAccount = await loginWithSharedApi(email, passwordInput.value);

        if (!storedAccount) try {

            let accounts =
                JSON.parse(
                    localStorage.getItem("taskflowAccounts") || "[]"
                );

            storedAccount = accounts.find(
                account => String(account.email || "").trim().toLowerCase() === email.toLowerCase()
            );

        } catch (error) {

            console.warn(
                "Unable to access stored accounts."
            );

        }

        const isValidPassword = storedAccount
            ? storedAccount.password === passwordInput.value
            : email === demoEmail && passwordInput.value === demoPassword;

        if (!isValidPassword) {

            showFieldError(
                passwordInput,
                passwordError,
                "The email or password is incorrect."
            );

            passwordInput.focus();

            return;

        }

        const loggedInAccount = storedAccount || {
            firstName: "Demo",
            lastName: "User",
            email: demoEmail,
            password: demoPassword,
            userId: "TF-DEMO01",
            role: "Project Manager",
            department: "Project Management",
            designation: "Project Manager"
            ,accountType: "manager"
        };

        if (!loggedInAccount.firstName || !loggedInAccount.lastName) {

            const fallbackName =
                getNameFromEmail(loggedInAccount.email);

            const nameParts = fallbackName.split(" ");

            loggedInAccount.firstName =
                loggedInAccount.firstName || nameParts[0];

            loggedInAccount.lastName =
                loggedInAccount.lastName || nameParts.slice(1).join(" ") || "User";

        }

        loggedInAccount.role = loggedInAccount.role || "Employee";
        loggedInAccount.department = loggedInAccount.department || "Software Engineering";
        loggedInAccount.designation = loggedInAccount.designation || loggedInAccount.role;
        loggedInAccount.accountType = isManagerRole(loggedInAccount.role) || email === demoEmail
            ? "manager"
            : "employee";

        if (storedAccount) {
            try {
                const accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
                const accountIndex = accounts.findIndex(account =>
                    String(account.email || "").toLowerCase() === email.toLowerCase()
                );
                if (accountIndex >= 0) {
                    accounts[accountIndex] = {
                        ...accounts[accountIndex],
                        role: loggedInAccount.role,
                        department: loggedInAccount.department,
                        designation: loggedInAccount.designation,
                        accountType: loggedInAccount.accountType
                    };
                    localStorage.setItem("taskflowAccounts", JSON.stringify(accounts));
                }
            } catch (error) {
                console.warn("Unable to refresh account permissions.");
            }
        }

        if (!loggedInAccount.userId) {
            loggedInAccount.userId = createUserId();

            if (storedAccount) {

                try {

                    const accounts =
                        JSON.parse(
                            localStorage.getItem("taskflowAccounts") || "[]"
                        );

                    const accountIndex = accounts.findIndex(
                        account => account.email === email
                    );

                    if (accountIndex >= 0) {
                        accounts[accountIndex].userId = loggedInAccount.userId;
                        localStorage.setItem(
                            "taskflowAccounts",
                            JSON.stringify(accounts)
                        );
                    }

                } catch (error) {

                    console.warn(
                        "Unable to save the user ID."
                    );

                }

            }
        }

        try {

            sessionStorage.setItem(
                "taskflowCurrentUser",
                JSON.stringify(loggedInAccount)
            );

        } catch (error) {

            showFieldError(
                passwordInput,
                passwordError,
                "Unable to start your session. Please try again."
            );

            return;

        }


        /* Loading state */

        loginButton.classList.add("loading");
        loginButton.disabled = true;


        /*
            Frontend demo simulation.

            Replace this section later with your
            backend authentication API.
        */

        setTimeout(() => {

            loginButton.classList.remove("loading");
            loginButton.disabled = false;


            showToast(
                "Login Successful",
                `Welcome back, ${loggedInAccount.firstName || "there"}.`
            );


            window.location.href = "dashboard.html";

            if (remember) {

                try {

                    localStorage.setItem(
                        "taskflowRememberEmail",
                        email
                    );

                } catch (error) {

                    console.warn(
                        "Local storage is unavailable."
                    );

                }

            }

        }, 1200);

    });

}


/* =========================================================
   8. REMEMBERED EMAIL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    try {

        const registeredEmail =
            localStorage.getItem(
                "taskflowRegisteredEmail"
            );

        const resetEmail =
            localStorage.getItem(
                "taskflowResetEmail"
            );

        const returnEmail =
            registeredEmail || resetEmail;

        if (returnEmail && emailInput) {

            emailInput.value = returnEmail;

            showToast(
                "Account Created",
                "Your account is ready. Sign in to continue."
            );

            localStorage.removeItem(
                "taskflowRegisteredEmail"
            );

            localStorage.removeItem(
                "taskflowResetEmail"
            );

        }

        if (!returnEmail) {

            const savedEmail =
                localStorage.getItem(
                    "taskflowRememberEmail"
                );

            if (savedEmail && emailInput) {

                emailInput.value = savedEmail;

                if (rememberMe) {
                    rememberMe.checked = true;
                }

            }

        }

    } catch (error) {

        console.warn(
            "Unable to access local storage."
        );

    }

});


/* =========================================================
   9. FORGOT PASSWORD
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        window.location.href = "forgetpassword.html";

    });

}


/* =========================================================
   10. CREATE ACCOUNT
========================================================= */

if (signupLink) {

    signupLink.addEventListener("click", (event) => {

        event.preventDefault();

        window.location.href = "signup.html";

    });

}


/* =========================================================
   11. DEMO ACCOUNT
========================================================= */

// if (demoLogin) {

//     demoLogin.addEventListener("click", () => {

//         emailInput.value = "demo@taskflow.com";
//         passwordInput.value = "taskflow123";

//         clearFieldError(
//             emailInput,
//             emailError
//         );

//         clearFieldError(
//             passwordInput,
//             passwordError
//         );


//         showToast(
//             "Demo Account Loaded",
//             "Demo credentials have been filled in. Click Sign In to continue."
//         );


//         emailInput.focus();

//     });

// }


/* =========================================================
   12. ENTER KEY SUPPORT
========================================================= */

if (emailInput) {

    emailInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            passwordInput
        ) {

            event.preventDefault();

            passwordInput.focus();

        }

    });

}


/* =========================================================
   13. ESCAPE TO CLOSE TOAST
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        hideToast();

    }

});


/* =========================================================
   14. INPUT AUTO-FEEDBACK
========================================================= */

const allInputs =
    document.querySelectorAll(
        ".input-wrapper input"
    );

allInputs.forEach((input) => {

    input.addEventListener("focus", () => {

        const wrapper =
            input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.add("focused");
        }

    });


    input.addEventListener("blur", () => {

        const wrapper =
            input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.remove("focused");
        }

    });

});


/* =========================================================
   15. PAGE LOAD ANIMATION
========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});