/**
 * ====================================================
 * SUBHAM KUMAR | PREMIUM JS ENGINE (V2)
 * ====================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. THEME TOGGLE & PERSISTENCE
     */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Initial check (Anti-flash script in head handles the root attribute)
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        body.setAttribute('data-theme', newTheme); // Sync both for safety
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.classList.replace('bx-moon', 'bx-sun');
        } else {
            icon.classList.replace('bx-sun', 'bx-moon');
        }
    }

    /**
     * 2. MOBILE MENU TOGGLE
     */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'bx bx-x';
            } else {
                icon.className = 'bx bx-menu';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'bx bx-menu';
            }
        });
    }

    /**
     * 3. SCROLL REVEAL (INTERSECTION OBSERVER)
     */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    /**
     * 4. TYPING ANIMATION (Preserved Logic)
     */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const roles = ["Frontend Developer", "ML Engineer", "AI Developer", "Researcher"];
        let roleIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const current = roles[roleIdx];
            typingText.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);

            let speed = isDeleting ? 50 : 150;
            if (!isDeleting && charIdx === current.length + 1) {
                isDeleting = true; speed = 2000;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 500;
            }
            setTimeout(type, speed);
        }
        type();
    }

    /**
     * 5. DYNAMIC GITHUB PROJECTS (Preserved Logic)
     */
    const GITHUB_USERNAME = "SubhamKumar25";
    const GITHUB_GRID = document.getElementById('github-projects-grid');

    async function fetchRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
            if (!response.ok) throw new Error('API limit');
            let repos = await response.json();
            repos = repos.filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME).slice(0, 6);
            renderRepos(repos);
        } catch (error) {
            console.error(error);
            if (GITHUB_GRID) GITHUB_GRID.innerHTML = '<p>GitHub stats temporarily unavailable.</p>';
        }
    }

    function renderRepos(repos) {
        if (!GITHUB_GRID) return;
        GITHUB_GRID.innerHTML = '';
        repos.forEach(repo => {
            const liveLink = repo.homepage || detectURL(repo.description);
            const createdDate = new Date(repo.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            const card = document.createElement('div');
            card.className = 'project-card repo-card reveal';
            card.innerHTML = `
                <div class="pj-info">
                    <div class="pj-tags">
                        <span class="tag">Open Source</span>
                        <span class="tag-date">Started ${createdDate}</span>
                    </div>
                    <h3>${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                    <p>${repo.description || "Consistent engineering on modern tech stacks."}</p>
                    <div class="repo-stats" style="display:flex; gap:1rem; font-size:0.8rem; margin-bottom:1rem; opacity:0.7;">
                        <span><i class='bx bx-star'></i> ${repo.stargazers_count}</span>
                        <span><i class='bx bx-git-repo-forked'></i> ${repo.forks_count}</span>
                    </div>
                    <div style="display:flex; gap:1rem; margin-top:auto;">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-outline" style="flex:1;">Code</a>
                        ${liveLink ? `<a href="${liveLink}" target="_blank" class="btn" style="flex:1;">Live</a>` : ''}
                    </div>
                </div>
            `;
            GITHUB_GRID.appendChild(card);
            revealObserver.observe(card);
        });
    }

    function detectURL(text) {
        if (!text) return null;
        const match = text.match(/(https?:\/\/[^\s]+)/g);
        return match ? match[0] : null;
    }

    /**
     * 6. CONTACT FORM HANDLING (Premium Feedback)
     */
    const contactForm = document.getElementById('portfolio-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Loading State
            btn.disabled = true;
            btn.innerHTML = `Sending... <i class='bx bx-loader-alt bx-spin'></i>`;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    btn.innerHTML = `Success! <i class='bx bx-check-circle'></i>`;
                    btn.style.background = '#25D366';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                    }, 5000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                btn.innerHTML = `Error! Try Again <i class='bx bx-error-circle'></i>`;
                btn.style.background = '#ff3b30';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    /**
     * 7. INTERACTIVE BACKGROUND ENGINE
     */
    const orbs = document.querySelectorAll('.particle');
    const glows = document.querySelectorAll('.bg-glow');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let rawMouseX = 0, rawMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        rawMouseX = e.clientX;
        rawMouseY = e.clientY;
        // Parallax relative to center
        mouseX = (e.clientX - window.innerWidth / 2) / 20; // Increased amplitude
        mouseY = (e.clientY - window.innerHeight / 2) / 20;
    });

    function animateBackground() {
        // Smoothly interpolate towards target position (lerp)
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        // 1. Update Parallax Orbs
        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 0.4; 
            orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        // 2. Update Corner Glows
        glows.forEach((glow, index) => {
            const factor = (index + 1) * 0.2;
            glow.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
        });

        // 3. Update Cursor Follower
        if (follower) {
            follower.style.left = `${rawMouseX}px`;
            follower.style.top = `${rawMouseY}px`;
        }

        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    // Start fetching
    fetchRepos();

    /**
     * 8. DROPDOWN TOGGLE ENGINE
     */
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    const dropdownParent = document.querySelector('.dropdown');

    if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
            dropdownParent.classList.toggle('active');
        });

        // Close when clicking a link inside
        dropdownContent.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                dropdownContent.classList.remove('show');
                dropdownParent.classList.remove('active');
            });
        });

        // Close when clicking outside
        window.addEventListener('click', () => {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                dropdownParent.classList.remove('active');
            }
        });
    }
});
