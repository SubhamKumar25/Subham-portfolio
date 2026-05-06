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

    /**
     * 8. DYNAMIC GITHUB PROJECTS ENGINE
     * Automatically fetches and categorizes your latest work.
     */
    const GITHUB_USERNAME = "SubhamKumar25";
    const GITHUB_PROJECTS_GRID = document.getElementById('github-projects-grid');

    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
            if (!response.ok) throw new Error('GitHub API Limit Reached or Network Error');
            
            let repos = await response.json();
            
            // Filter out forks and empty repos if needed
            repos = repos.filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME);
            
            // Limit to top 6 latest
            const latestRepos = repos.slice(0, 6);
            
            renderGitHubProjects(latestRepos);
        } catch (error) {
            console.error('GitHub Fetch Error:', error);
            if (GITHUB_PROJECTS_GRID) {
                GITHUB_PROJECTS_GRID.innerHTML = `<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">Error loading GitHub projects. Please visit <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color: var(--accent);">GitHub Profile</a> directly.</p>`;
            }
        }
    }

    function renderGitHubProjects(repos) {
        if (!GITHUB_PROJECTS_GRID) return;
        
        GITHUB_PROJECTS_GRID.innerHTML = ''; // Clear skeletons

        repos.forEach(repo => {
            const category = detectCategory(repo);
            const description = repo.description || generateSummary(repo, category);
            const liveLink = repo.homepage || detectLiveLinkFromDescription(repo.description);
            const techStack = repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language].filter(Boolean);
            
            const card = document.createElement('div');
            card.className = 'project-card repo-card reveal';
            
            card.innerHTML = `
                <div class="pj-info repo-card">
                    <div class="repo-header">
                        <div class="pj-tags">
                            <span class="tag">${category}</span>
                        </div>
                        <h3 style="margin-top: 0.5rem;">${formatRepoName(repo.name)}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-dim); margin-bottom: 1.5rem;">
                            ${description}
                        </p>
                    </div>
                    
                    <div class="repo-body">
                        <div class="repo-stats">
                            <span><i class='bx bx-star'></i> ${repo.stargazers_count}</span>
                            <span><i class='bx bx-git-repo-forked'></i> ${repo.forks_count}</span>
                            <span><i class='bx bx-time-five'></i> ${new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div class="repo-badges">
                            ${techStack.slice(0, 4).map(tech => `<span class="badge">${tech}</span>`).join('')}
                        </div>
                    </div>

                    <div class="repo-footer">
                        <a href="${repo.html_url}" target="_blank" class="btn" style="padding: 0.6rem 1rem; font-size: 0.85rem;">Code</a>
                        ${liveLink ? `<a href="${liveLink}" target="_blank" class="btn btn-outline" style="padding: 0.6rem 1rem; font-size: 0.85rem;">Live</a>` : '<span style="font-size: 0.8rem; opacity: 0.5;">Source Only</span>'}
                    </div>
                </div>
            `;
            
            GITHUB_PROJECTS_GRID.appendChild(card);
            
            // Re-observe new element
            revealObserver.observe(card);
        });
    }

    function generateSummary(repo, category) {
        const name = formatRepoName(repo.name).toLowerCase();
        const displayName = formatRepoName(repo.name);

        if (name.includes('clone')) {
            return `A high-fidelity ${displayName} demonstrating proficiency in complex layouts, interactive components, and modern UI design.`;
        }
        if (name.includes('student') || name.includes('table') || name.includes('data')) {
            return `A specialized data management implementation for ${displayName}, focusing on organized information architecture and efficient processing.`;
        }
        if (name.includes('portfolio') || name.includes('site') || name.includes('web')) {
            return `A professional web platform showcasing high-performance frontend engineering and responsive design principles.`;
        }

        switch (category) {
            case 'AI/ML':
                return `${name} is an advanced machine learning implementation focusing on neural architectures and data-driven intelligence.`;
            case 'Deep Learning':
                return `High-performance ${name} system utilizing deep neural networks for complex pattern recognition and computer vision tasks.`;
            case 'NLP Agent':
                return `An intelligent natural language processor designed for automated text analysis and interactive AI communication.`;
            case 'Frontend':
                return `A responsive, high-performance web interface for ${name}, built with a focus on modern user experience and clean UI.`;
            case 'Backend':
                return `Scalable server-side architecture for ${name}, designed for high security, efficiency, and robust data management.`;
            default:
                return `A professional software engineering project demonstrating clean code, modular design, and industry-standard practices.`;
        }
    }

    function formatRepoName(name) {
        return name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    function detectCategory(repo) {
        const name = repo.name.toLowerCase();
        const desc = (repo.description || '').toLowerCase();
        const topics = (repo.topics || []).map(t => t.toLowerCase());

        if (name.includes('ml') || name.includes('ai') || name.includes('deep-learning') || topics.includes('machine-learning')) return 'AI/ML';
        if (name.includes('vision') || topics.includes('computer-vision')) return 'Deep Learning';
        if (name.includes('bot') || name.includes('nlp')) return 'NLP Agent';
        if (name.includes('react') || name.includes('vue') || topics.includes('frontend')) return 'Frontend';
        if (name.includes('api') || name.includes('backend') || topics.includes('backend')) return 'Backend';
        
        return 'Project';
    }

    function detectLiveLinkFromDescription(desc) {
        if (!desc) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = desc.match(urlRegex);
        return matches ? matches[0] : null;
    }

    // Start fetching
    fetchGitHubProjects();

});
