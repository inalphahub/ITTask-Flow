/* =========================================================
   TASKFLOW — FORGOT PASSWORD
   forgetpassword.js
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const emailForm = document.getElementById("emailForm");
const otpForm = document.getElementById("otpForm");
const passwordForm = document.getElementById("passwordForm");

const emailInput = document.getElementById("email");
const displayEmail = document.getElementById("displayEmail");

const otpInputs = document.querySelectorAll(".otp-input");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const resendOtp = document.getElementById("resendOtp");
const resendTimer = document.getElementById("resendTimer");

const backToEmail = document.getElementById("backToEmail");

const recoverySuccess =
    document.getElementById("recoverySuccess");

const demoOtp =
    document.getElementById("demoOtp");

const strengthBars =
    document.querySelector(".strength-bars");

const strengthText =
    document.getElementById("strengthText");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const toastClose =
    document.getElementById("toastClose");


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {

    currentStep: 1,

    email: "",

    otp: "",

    generatedOtp: "123456",

    resendCountdown: 30,

    resendInterval: null

};


/* =========================================================
   STEP ELEMENTS
========================================================= */

const recoverySteps =
    document.querySelectorAll(".recovery-step");

const progressSteps =
    document.querySelectorAll(".progress-step");

const progressLines =
    document.querySelectorAll(".progress-line");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    showStep(1);

    setupOtpInputs();

    setupPasswordToggles();

    setupPasswordStrength();

    setupToast();

});


/* =========================================================
   SHOW STEP
========================================================= */

function showStep(stepNumber) {

    state.currentStep = stepNumber;


    /* Hide all steps */

    recoverySteps.forEach(step => {

        step.classList.remove("active");

    });


    /* Show selected step */

    const selectedStep =
        document.querySelector(
            `[data-step-content="${stepNumber}"]`
        );

    if (selectedStep) {

        selectedStep.classList.add("active");

    }


    /* Update progress */

    progressSteps.forEach((step, index) => {

        const stepNumberValue = index + 1;

        step.classList.remove(
            "active",
            "completed"
        );

        if (stepNumberValue < stepNumber) {

            step.classList.add("completed");

            const span =
                step.querySelector("span");

            span.textContent = "✓";

        }

        else if (stepNumberValue === stepNumber) {

            step.classList.add("active");

            const span =
                step.querySelector("span");

            span.textContent =
                stepNumberValue;

        }

        else {

            const span =
                step.querySelector("span");

            span.textContent =
                stepNumberValue;

        }

    });


    /* Update progress lines */

    progressLines.forEach((line, index) => {

        if (index < stepNumber - 1) {

            line.classList.add("completed");

        }

        else {

            line.classList.remove("completed");

        }

    });


    /* Scroll to top on small screens */

    if (window.innerWidth <= 850) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =========================================================
   STEP 1 — EMAIL
========================================================= */

emailForm.addEventListener("submit", event => {

    event.preventDefault();


    const email =
        emailInput.value.trim();


    clearError(
        emailInput,
        "emailError"
    );


    /* Validate email */

    if (!email) {

        showError(
            emailInput,
            "emailError",
            "Please enter your email address."
        );

        emailInput.focus();

        return;

    }


    if (!isValidEmail(email)) {

        showError(
            emailInput,
            "emailError",
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;

    }


    state.email = email;


    /* Display email */

    displayEmail.textContent =
        maskEmail(email);


    /* Generate OTP */

    state.generatedOtp =
        generateOtp();

    demoOtp.textContent =
        state.generatedOtp;


    /* Simulate sending */

    const button =
        document.getElementById(
            "sendOtpButton"
        );

    button.classList.add("loading");

    button.disabled = true;


    setTimeout(() => {

        button.classList.remove("loading");

        button.disabled = false;

        showStep(2);

        startResendCountdown();

        showToast(
            "Verification code sent",
            `A verification code was sent to ${maskEmail(email)}.`
        );


        /* Focus first OTP */

        setTimeout(() => {

            if (otpInputs[0]) {
                otpInputs[0].focus();
            }

        }, 300);

    }, 700);

});


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   MASK EMAIL
========================================================= */

function maskEmail(email) {

    const parts =
        email.split("@");

    if (parts.length !== 2) {
        return email;
    }

    const username =
        parts[0];

    const domain =
        parts[1];


    let maskedUsername;


    if (username.length <= 2) {

        maskedUsername =
            username.charAt(0) + "*";

    }

    else {

        maskedUsername =
            username.charAt(0) +
            "*".repeat(
                Math.min(
                    username.length - 2,
                    5
                )
            ) +
            username.charAt(
                username.length - 1
            );

    }


    return `${maskedUsername}@${domain}`;

}


/* =========================================================
   GENERATE OTP
========================================================= */

function generateOtp() {

    /* 
       For frontend testing we generate a 6 digit OTP.
       This can later be replaced with an API response.
    */

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

}


/* =========================================================
   OTP INPUT HANDLING
========================================================= */

function setupOtpInputs() {

    otpInputs.forEach((input, index) => {


        /* Input */

        input.addEventListener("input", event => {

            let value =
                event.target.value
                    .replace(/\D/g, "");

            event.target.value =
                value.charAt(0);


            if (value) {

                input.classList.add("filled");


                /* Move forward */

                if (
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[index + 1].focus();

                }

            }

            else {

                input.classList.remove(
                    "filled"
                );

            }

        });


        /* Keyboard navigation */

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }


                if (
                    event.key === "ArrowLeft" &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }


                if (
                    event.key === "ArrowRight" &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();

                }

            }
        );


        /* Paste */

        input.addEventListener(
            "paste",
            event => {

                event.preventDefault();

                const pastedData =
                    event.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);


                pastedData
                    .split("")
                    .forEach(
                        (digit, digitIndex) => {

                            if (
                                otpInputs[
                                    digitIndex
                                ]
                            ) {

                                otpInputs[
                                    digitIndex
                                ].value =
                                    digit;

                                otpInputs[
                                    digitIndex
                                ].classList.add(
                                    "filled"
                                );

                            }

                        }
                    );


                if (pastedData.length === 6) {

                    otpInputs[5].focus();

                }

            }
        );

    });

}


/* =========================================================
   GET OTP VALUE
========================================================= */

function getOtpValue() {

    return Array.from(otpInputs)
        .map(input => input.value)
        .join("");

}


/* =========================================================
   OTP FORM
========================================================= */

otpForm.addEventListener("submit", event => {

    event.preventDefault();


    const enteredOtp =
        getOtpValue();


    clearOtpError();


    if (enteredOtp.length !== 6) {

        showOtpError(
            "Please enter the complete 6-digit code."
        );

        return;

    }


    if (
        enteredOtp !==
        state.generatedOtp
    ) {

        showOtpError(
            "The verification code is incorrect. Please try again."
        );

        shakeOtpInputs();

        return;

    }


    showToast(
        "Code verified",
        "Your identity has been successfully verified."
    );


    showStep(3);


    setTimeout(() => {

        newPassword.focus();

    }, 300);

});


/* =========================================================
   OTP ERROR
========================================================= */

function showOtpError(message) {

    const error =
        document.getElementById(
            "otpError"
        );

    error.textContent =
        message;


    otpInputs.forEach(input => {

        input.classList.add("error");

    });

}


function clearOtpError() {

    const error =
        document.getElementById(
            "otpError"
        );

    error.textContent = "";


    otpInputs.forEach(input => {

        input.classList.remove("error");

    });

}


/* =========================================================
   SHAKE OTP
========================================================= */

function shakeOtpInputs() {

    otpInputs.forEach(input => {

        input.animate(
            [
                {
                    transform: "translateX(0)"
                },
                {
                    transform: "translateX(-5px)"
                },
                {
                    transform: "translateX(5px)"
                },
                {
                    transform: "translateX(-4px)"
                },
                {
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 280
            }
        );

    });

}


/* =========================================================
   RESEND OTP
========================================================= */

function startResendCountdown() {

    clearInterval(
        state.resendInterval
    );


    state.resendCountdown = 30;

    resendOtp.disabled = true;

    updateResendTimer();


    state.resendInterval =
        setInterval(() => {

            state.resendCountdown--;

            updateResendTimer();


            if (
                state.resendCountdown <= 0
            ) {

                clearInterval(
                    state.resendInterval
                );

                resendOtp.disabled = false;

                resendTimer.textContent = "";

            }

        }, 1000);

}


function updateResendTimer() {

    resendTimer.textContent =
        `${state.resendCountdown}s`;

}


resendOtp.addEventListener(
    "click",
    () => {

        if (resendOtp.disabled) {
            return;
        }


        state.generatedOtp =
            generateOtp();


        demoOtp.textContent =
            state.generatedOtp;


        /* Clear existing OTP */

        otpInputs.forEach(input => {

            input.value = "";

            input.classList.remove(
                "filled",
                "error"
            );

        });


        clearOtpError();


        if (otpInputs[0]) {
            otpInputs[0].focus();
        }


        startResendCountdown();


        showToast(
            "New code sent",
            "A new verification code has been generated."
        );

    }
);


/* =========================================================
   BACK TO EMAIL
========================================================= */

backToEmail.addEventListener(
    "click",
    () => {

        clearInterval(
            state.resendInterval
        );

        showStep(1);

        setTimeout(() => {

            emailInput.focus();

        }, 250);

    }
);


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggles() {

    const toggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    toggles.forEach(toggle => {

        toggle.addEventListener(
            "click",
            () => {

                const targetId =
                    toggle.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );


                if (
                    input.type ===
                    "password"
                ) {

                    input.type = "text";

                    toggle.classList.add(
                        "visible"
                    );

                    toggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                }

                else {

                    input.type = "password";

                    toggle.classList.remove(
                        "visible"
                    );

                    toggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    });

}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function setupPasswordStrength() {

    newPassword.addEventListener(
        "input",
        () => {

            updatePasswordStrength(
                newPassword.value
            );

            clearError(
                newPassword,
                "passwordError"
            );

        }
    );


    confirmPassword.addEventListener(
        "input",
        () => {

            clearError(
                confirmPassword,
                "confirmPasswordError"
            );

        }
    );

}


function updatePasswordStrength(password) {

    const requirements =
        getPasswordRequirements(
            password
        );


    /* Requirement UI */

    Object.keys(requirements)
        .forEach(key => {

            const element =
                document.querySelector(
                    `[data-requirement="${key}"]`
                );

            if (!element) {
                return;
            }

            element.classList.toggle(
                "valid",
                requirements[key]
            );

        });


    /* Calculate score */

    const score =
        Object.values(
            requirements
        ).filter(Boolean).length;


    strengthBars.className =
        "strength-bars";


    if (!password) {

        strengthText.textContent =
            "Enter a password";

        return;

    }


    if (score <= 1) {

        strengthBars.classList.add(
            "weak"
        );

        strengthText.textContent =
            "Weak";

    }

    else if (score === 2) {

        strengthBars.classList.add(
            "fair"
        );

        strengthText.textContent =
            "Fair";

    }

    else if (score === 3) {

        strengthBars.classList.add(
            "good"
        );

        strengthText.textContent =
            "Good";

    }

    else {

        strengthBars.classList.add(
            "strong"
        );

        strengthText.textContent =
            "Strong";

    }

}


/* =========================================================
   PASSWORD REQUIREMENTS
========================================================= */

function getPasswordRequirements(password) {

    return {

        length:
            password.length >= 8,

        uppercase:
            /[A-Z]/.test(password),

        number:
            /[0-9]/.test(password),

        special:
            /[^A-Za-z0-9]/.test(password)

    };

}


/* =========================================================
   PASSWORD FORM
========================================================= */

passwordForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const password =
            newPassword.value;

        const confirmation =
            confirmPassword.value;


        clearError(
            newPassword,
            "passwordError"
        );

        clearError(
            confirmPassword,
            "confirmPasswordError"
        );


        const requirements =
            getPasswordRequirements(
                password
            );


        /* Validate password */

        if (
            !requirements.length ||
            !requirements.uppercase ||
            !requirements.number ||
            !requirements.special
        ) {

            showError(
                newPassword,
                "passwordError",
                "Please meet all password requirements."
            );

            newPassword.focus();

            return;

        }


        /* Validate confirmation */

        if (!confirmation) {

            showError(
                confirmPassword,
                "confirmPasswordError",
                "Please confirm your new password."
            );

            confirmPassword.focus();

            return;

        }


        if (
            password !==
            confirmation
        ) {

            showError(
                confirmPassword,
                "confirmPasswordError",
                "Passwords do not match."
            );

            confirmPassword.focus();

            return;

        }


        /* Simulate password reset */

        const button =
            passwordForm.querySelector(
                ".primary-button"
            );

        button.classList.add(
            "loading"
        );

        button.disabled = true;


        setTimeout(() => {

            button.classList.remove(
                "loading"
            );

            button.disabled = false;

            try {

                const accounts =
                    JSON.parse(
                        localStorage.getItem("taskflowAccounts") || "[]"
                    );

                const accountIndex = accounts.findIndex(
                    account => account.email === state.email
                );

                if (accountIndex >= 0) {
                    accounts[accountIndex].password = password;

                    if (!accounts[accountIndex].userId) {
                        accounts[accountIndex].userId =
                            `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
                    }
                } else {

                    const emailName = state.email
                        .split("@")[0]
                        .replace(/[._-]+/g, " ")
                        .trim()
                        .split(" ")
                        .filter(Boolean)
                        .map(name => name.charAt(0).toUpperCase() + name.slice(1));

                    accounts.push({
                        email: state.email,
                        password,
                        firstName: emailName[0] || "User",
                        lastName: emailName.slice(1).join(" ") || "User",
                        userId:
                            `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
                    });
                }

                localStorage.setItem(
                    "taskflowAccounts",
                    JSON.stringify(accounts)
                );

                localStorage.setItem(
                    "taskflowResetEmail",
                    state.email
                );

            } catch (error) {

                console.warn(
                    "Unable to save the updated password."
                );

            }


            /* Hide password step */

            document
                .querySelector(
                    "#step-password"
                )
                .classList.remove(
                    "active"
                );


            /* Hide progress */

            document
                .querySelector(
                    ".recovery-progress"
                )
                .style.display =
                "none";


            /* Show success */

            recoverySuccess.classList.add(
                "active"
            );


            /* Update security text */

            document
                .querySelector(
                    ".security-message"
                )
                .style.display =
                "none";


            showToast(
                "Password reset successful",
                "Your new password is ready to use."
            );

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1800);


        }, 800);

    }
);


/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(
    input,
    errorId,
    message
) {

    const wrapper =
        input.closest(
            ".input-wrapper"
        );


    if (wrapper) {

        wrapper.classList.add(
            "error"
        );

    }


    const error =
        document.getElementById(
            errorId
        );


    if (error) {

        error.textContent =
            message;

    }

}


function clearError(
    input,
    errorId
) {

    const wrapper =
        input.closest(
            ".input-wrapper"
        );


    if (wrapper) {

        wrapper.classList.remove(
            "error"
        );

    }


    const error =
        document.getElementById(
            errorId
        );


    if (error) {

        error.textContent = "";

    }

}


/* =========================================================
   CLEAR ERROR WHEN USER TYPES
========================================================= */

emailInput.addEventListener(
    "input",
    () => {

        clearError(
            emailInput,
            "emailError"
        );

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(
    title,
    message
) {

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(() => {

            hideToast();

        }, 4500);

}


function hideToast() {

    toast.classList.remove(
        "show"
    );

}


function setupToast() {

    toastClose.addEventListener(
        "click",
        hideToast
    );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            hideToast();

        }

    }
);


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        clearInterval(
            state.resendInterval
        );

    }
);