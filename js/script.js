/* =========================================================
   TASKFLOW JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header = document.getElementById("siteHeader");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.getElementById("navMenu");
    const dropdowns = document.querySelectorAll(".dropdown");
    const counters = document.querySelectorAll(".counter");
    const faqItems = document.querySelectorAll(".faq-item");
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );

    let toastTimer;


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function updateNavbar() {

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    mobileMenuBtn.addEventListener("click", () => {

        const isOpen =
            navMenu.classList.toggle("mobile-open");

        mobileMenuBtn.classList.toggle("open", isOpen);

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    /* =====================================================
       DROPDOWNS
    ===================================================== */

    dropdowns.forEach(dropdown => {

        const toggle =
            dropdown.querySelector(".dropdown-toggle");

        toggle.addEventListener("click", event => {

            event.stopPropagation();

            const currentlyOpen =
                dropdown.classList.contains("open");

            dropdowns.forEach(item => {
                item.classList.remove("open");
            });

            if (!currentlyOpen) {
                dropdown.classList.add("open");
            }

        });

    });


    /* =====================================================
       CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", event => {

        if (!event.target.closest(".dropdown")) {

            dropdowns.forEach(dropdown => {
                dropdown.classList.remove("open");
            });

        }

    });


    /* =====================================================
       MOBILE NAV LINK
    ===================================================== */

    document.querySelectorAll(".nav-menu a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("mobile-open");
            mobileMenuBtn.classList.remove("open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            dropdowns.forEach(dropdown => {
                dropdown.classList.remove("open");
            });

        });

    });


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       ANIMATED COUNTERS
    ===================================================== */

    function animateCounter(element) {

        const target =
            Number(element.dataset.target);

        const suffix =
            element.dataset.suffix || "";

        const duration = 1500;

        const startTime = performance.now();

        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                Math.floor(target * eased);

            element.textContent =
                current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target.toLocaleString() + suffix;
            }

        }

        requestAnimationFrame(update);

    }


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* =====================================================
       PRODUCTIVITY PROGRESS BARS
    ===================================================== */

    const progressBars =
        document.querySelectorAll(".progress-track span");

    const progressObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const width =
                            entry.target.dataset.width;

                        entry.target.style.width = width;

                        progressObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.5
            }
        );


    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        question.setAttribute(
            "aria-expanded",
            "false"
        );

        question.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("open");


            /* Close all other items */

            faqItems.forEach(otherItem => {

                otherItem.classList.remove("open");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                const otherQuestion =
                    otherItem.querySelector(".faq-question");

                otherAnswer.style.maxHeight = null;

                otherQuestion.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });


            /* Open clicked item */

            if (!isOpen) {

                item.classList.add("open");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });


    /* =====================================================
       FAQ KEYBOARD ACCESSIBILITY
    ===================================================== */

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        question.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();
                question.click();

            }

        });

    });


    /* =====================================================
       KANBAN DRAG & DROP
    ===================================================== */

    const tasks =
        document.querySelectorAll(".kanban-task");

    const columns =
        document.querySelectorAll(".kanban-column");


    let draggedTask = null;


    tasks.forEach(task => {

        task.addEventListener("dragstart", () => {

            draggedTask = task;

            task.classList.add("dragging");

        });


        task.addEventListener("dragend", () => {

            task.classList.remove("dragging");

            draggedTask = null;

            updateTaskCounts();

        });

    });


    columns.forEach(column => {

        column.addEventListener("dragover", event => {

            event.preventDefault();

            if (!draggedTask) {
                return;
            }

            const taskList =
                column.querySelector(".task-list");

            taskList.appendChild(draggedTask);

        });

        column.addEventListener("drop", event => {

            event.preventDefault();

            if (!draggedTask) {
                return;
            }

            showToast(
                "Task Updated",
                `"${draggedTask.dataset.task}" moved successfully.`
            );

            updateTaskCounts();

        });

    });


    function updateTaskCounts() {

        columns.forEach(column => {

            const count =
                column.querySelectorAll(".kanban-task").length;

            const counter =
                column.querySelector(".task-count");

            counter.textContent = count;

        });

    }


    /* =====================================================
       TASK CLICK
    ===================================================== */

    tasks.forEach(task => {

        task.addEventListener("click", event => {

            if (event.target.closest(".task-meta")) {
                return;
            }

            showToast(
                "Task Selected",
                task.dataset.task
            );

        });

    });


    /* =====================================================
       BOARD FILTER
    ===================================================== */

    const boardFilters =
        document.querySelectorAll(".board-filter");

    boardFilters.forEach(filter => {

        filter.addEventListener("click", () => {

            boardFilters.forEach(button => {
                button.classList.remove("active");
            });

            filter.classList.add("active");

            showToast(
                "Board Filter",
                `${filter.textContent.trim()} selected.`
            );

        });

    });


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    const notificationBtn =
        document.getElementById("notificationBtn");

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {

            showToast(
                "Notifications",
                "You have 3 new task notifications."
            );

        });

    }


    /* =====================================================
       CTA BUTTONS
    ===================================================== */

    const getStartedButtons =
        document.querySelectorAll(".get-started-btn");

    const loginButtons =
        document.querySelectorAll(".login-btn");


    getStartedButtons.forEach(button => {

        button.addEventListener("click", () => {

            showToast(
                "Get Started",
                "Signup experience would open here."
            );

        });

    });


    loginButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Navigate to the login page
            window.location.href = "login.html";

        });

    });


    /* =====================================================
       ANALYTICS SELECT
    ===================================================== */

    const analyticsSelect =
        document.querySelector(".analytics-top select");

    if (analyticsSelect) {

        analyticsSelect.addEventListener("change", () => {

            showToast(
                "Analytics Updated",
                `${analyticsSelect.value} selected.`
            );

        });

    }


    /* =====================================================
       SHOWCASE NEW TASK
    ===================================================== */

    const newTaskButton =
        document.querySelector(".showcase-header .btn");

    if (newTaskButton) {

        newTaskButton.addEventListener("click", () => {

            showToast(
                "New Task",
                "Task creation interface would open here."
            );

        });

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(title, message) {

        const toast =
            document.getElementById("toast");

        const toastTitle =
            document.getElementById("toastTitle");

        const toastMessage =
            document.getElementById("toastMessage");

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3000);

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll("main section[id]");

    const navLinks =
        document.querySelectorAll(
            '.nav-menu a[href^="#"]'
        );


    const activeSectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const currentId =
                            entry.target.getAttribute("id");

                        navLinks.forEach(link => {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${currentId}`
                            ) {

                                link.classList.add("active");

                            }

                        });

                    }

                });

            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );


    sections.forEach(section => {
        activeSectionObserver.observe(section);
    });


    /* =====================================================
       CLOSE MOBILE MENU WITH ESC
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            dropdowns.forEach(dropdown => {
                dropdown.classList.remove("open");
            });

            navMenu.classList.remove("mobile-open");

            mobileMenuBtn.classList.remove("open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            navMenu.classList.remove("mobile-open");

            mobileMenuBtn.classList.remove("open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /* =====================================================
       INITIAL TASK COUNT
    ===================================================== */

    updateTaskCounts();

});