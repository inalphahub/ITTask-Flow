document.addEventListener('DOMContentLoaded', () => {
    // ===== Mobile Menu Toggle =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const dropdown = toggle.closest('.mobile-dropdown');
                const isOpen = dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });
        });
    }

    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', event => {
            event.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
            document.querySelectorAll('.nav-dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('open');
                    item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
                dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ===== Navbar scroll shadow =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ===== Category filter buttons (visual only) =====
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ===== Preference toggles (visual feedback) =====
    document.querySelectorAll('.toggle input').forEach(input => {
        input.addEventListener('change', () => {
            // Visual only – no backend
            const row = input.closest('.pref-row');
            if (row) {
                row.style.transition = 'background 0.2s ease';
                row.style.background = input.checked ? 'rgba(79, 70, 229, 0.04)' : '';
                setTimeout(() => {
                    row.style.background = '';
                }, 400);
            }
        });
    });

    // ===== Scroll reveal animations =====
    const revealElements = document.querySelectorAll(
        '.info-card, .manage-item, .realtime-card, .benefit-card, .center-card, .detail-card, .prefs-list, .bell-demo, .notif-preview'
    );

    revealElements.forEach(el => {
        el.classList.add('fade-up');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger slightly for nicer effect
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, (index % 4) * 60);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));

    // ===== Smooth scroll for in-page anchors =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});