/**
 * ====================================================
 * SUBHAM KUMAR | VANILLA JAVASCRIPT ENGINE
 * ====================================================
 * Clean, Commented, and Beginner-Friendly
 * No External Dependencies
 * ====================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. STICKY HEADER LOGIC
     * Adds a background to the header when the user scrolls down.
     */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    /**
     * 2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     * Automatically triggers the "active" class on elements when they enter the viewport.
     */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after revealing to stop re-triggering
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /**
     * 3. TYPING ANIMATION (Hero Section)
     * Animates the roles text for a dynamic feel.
     */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const roles = ["ML Engineer", "AI Developer", "Frontend Developer", "Researcher"];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIdx];
            
            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIdx--);
            } else {
                typingText.textContent = currentRole.substring(0, charIdx++);
            }

            let typeSpeed = isDeleting ? 50 : 150;

            if (!isDeleting && charIdx === currentRole.length + 1) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    /**
     * 5. THEME TOGGLE LOGIC (Dark/Light Mode)
     */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('bx-moon', 'bx-sun');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('bx-sun', 'bx-moon');
        }
    });

    /**
     * 6. HIRE ME BUTTON LOGIC
     */
    const hireMeBtn = document.getElementById('hire-me-btn');
    if (hireMeBtn) {
        hireMeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                // 1. Smooth scroll to contact
                contactSection.scrollIntoView({ behavior: 'smooth' });

                // 2. Focus the name field after a short delay
                setTimeout(() => {
                    const nameField = document.querySelector('input[name="name"]');
                    if (nameField) {
                        nameField.focus();
                        // 3. Optional: Add a temporary glow to highlight the form
                        const contactCard = document.querySelector('.contact-card');
                        contactCard.style.borderColor = 'var(--accent)';
                        contactCard.style.boxShadow = '0 0 30px var(--accent-glow)';
                        setTimeout(() => {
                            contactCard.style.borderColor = '';
                            contactCard.style.boxShadow = '';
                        }, 2000);
                    }
                }, 800);
            }
        });
    }

    /**
     * 7. HIGH-PERFORMANCE MOUSE TRACKING
     * Optimized using requestAnimationFrame for 60fps smoothness.
     */
    const particles = document.querySelectorAll('.particle');
    const glow1 = document.querySelector('.glow-1');
    const glow2 = document.querySelector('.glow-2');
    
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) - 0.5;
        targetY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animateBackground() {
        // Smoothly interpolate towards target for a "liquid" feel
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        particles.forEach((p, index) => {
            const depth = (index + 1) * 40;
            p.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
        });

        if (glow1) glow1.style.transform = `translate(${mouseX * 100}px, ${mouseY * 100}px)`;
        if (glow2) glow2.style.transform = `translate(${mouseX * -100}px, ${mouseY * -100}px)`;

        requestAnimationFrame(animateBackground);
    }
    animateBackground();

});
