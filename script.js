/* ============================================
   GSMS-B Portfolio Website JavaScript
   =============================================
   Table of Contents:
   1. DOM Selectors & Constants
   2. Loading Screen
   3. Custom Cursor
   4. Navigation (Hamburger Menu)
   5. Smooth Scroll
   6. GSAP Animations & ScrollTrigger
   7. Project Carousel
   8. 3D Monitor Parallax
   9. Particle System
   10. Audio Toggle
   11. Counter Animation
   12. Initialization
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ============================================
       1. DOM SELECTORS & CONSTANTS
       Centralized element selection
       ============================================ */
    const DOM = {
        // Loader
        loader: document.getElementById('loader'),
        loaderProgress: document.querySelector('.loader__progress'),

        // Cursor
        cursor: document.getElementById('cursor'),
        cursorFollower: document.getElementById('cursor-follower'),

        // Navigation
        header: document.getElementById('header'),
        hamburger: document.getElementById('hamburger'),
        navOverlay: document.getElementById('nav-overlay'),
        navClose: document.getElementById('nav-close'),
        navLinks: document.querySelectorAll('.nav-overlay__link'),
        navChars: document.querySelectorAll('.nav-char'),

        // Sections
        sections: document.querySelectorAll('.section'),
        home: document.getElementById('home'),
        about: document.getElementById('about'),
        projects: document.getElementById('projects'),
        contact: document.getElementById('contact'),

        // Hero
        heroBgLetters: document.querySelectorAll('.hero__bg-letter'),
        heroImage: document.querySelector('.hero__image'),
        heroNameParts: document.querySelectorAll('.hero__name-part'),
        taglineWords: document.querySelectorAll('.tagline-word'),

        // About
        glassCards: document.querySelectorAll('.glass-card'),
        techBadges: document.querySelectorAll('.tech-badge'),
        statNumbers: document.querySelectorAll('.stat__number'),
        titleLetters: document.querySelectorAll('.title-letter'),

        // Projects
        carousel: document.getElementById('carousel'),
        projectCards: document.querySelectorAll('.project-card'),
        carouselPrev: document.getElementById('carousel-prev'),
        carouselNext: document.getElementById('carousel-next'),
        carouselDots: document.querySelectorAll('.carousel-dot'),
        monitor: document.getElementById('monitor'),
        monitorIframe: document.getElementById('monitor-iframe'),
        monitorPlaceholder: document.querySelector('.monitor__placeholder'),

        // Contact
        contactWords: document.querySelectorAll('.contact-word'),
        socialLinks: document.querySelectorAll('.social-link'),

        // Audio
        audioToggle: document.getElementById('audio-toggle'),
        ambientAudio: document.getElementById('ambient-audio'),

        // Particles
        particlesHome: document.getElementById('particles-home'),
        particlesContact: document.getElementById('particles-contact'),
    };

    // State management
    const state = {
        isMenuOpen: false,
        isAudioPlaying: false,
        currentProject: 0,
        totalProjects: DOM.projectCards.length,
        mouseX: 0,
        mouseY: 0,
    };

    /* ============================================
       2. LOADING SCREEN
       Animated loader with progress bar
       ============================================ */
    function initLoader() {
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Hide loader after animation
                setTimeout(() => {
                    DOM.loader.classList.add('hidden');
                    // Trigger entry animations after loader hides
                    setTimeout(initEntryAnimations, 300);
                }, 500);
            }
            if (DOM.loaderProgress) {
                DOM.loaderProgress.style.width = `${progress}%`;
            }
        }, 200);
    }

    /* ============================================
       3. CUSTOM CURSOR
       Interactive cursor following mouse movement
       ============================================ */
    function initCursor() {
        // Only initialize for devices with hover capability
        if (window.matchMedia('(hover: none)').matches) return;

        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
        });

        // Smooth cursor animation using requestAnimationFrame
        function animateCursor() {
            // Instant cursor
            if (DOM.cursor) {
                DOM.cursor.style.left = `${cursorX}px`;
                DOM.cursor.style.top = `${cursorY}px`;
            }

            // Smooth follower with lerp
            const ease = 0.15;
            followerX += (cursorX - followerX) * ease;
            followerY += (cursorY - followerY) * ease;

            if (DOM.cursorFollower) {
                DOM.cursorFollower.style.left = `${followerX}px`;
                DOM.cursorFollower.style.top = `${followerY}px`;
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .glass-card, .tech-badge');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                DOM.cursorFollower?.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                DOM.cursorFollower?.classList.remove('hovering');
            });
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            DOM.cursorFollower?.classList.add('clicking');
        });
        document.addEventListener('mouseup', () => {
            DOM.cursorFollower?.classList.remove('clicking');
        });
    }

    /* ============================================
       4. NAVIGATION (Hamburger Menu)
       Full-screen overlay with letter animations
       ============================================ */
    function initNavigation() {
        // Toggle menu on hamburger click
        DOM.hamburger?.addEventListener('click', toggleMenu);

        // Close menu on close button click (X button)
        DOM.navClose?.addEventListener('click', toggleMenu);

        // Close menu when nav link is clicked
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) {
                    toggleMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) {
                toggleMenu();
            }
        });
    }

    function toggleMenu() {
        state.isMenuOpen = !state.isMenuOpen;

        DOM.hamburger?.classList.toggle('active', state.isMenuOpen);
        DOM.navOverlay?.classList.toggle('active', state.isMenuOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    }

    /* ============================================
       5. SMOOTH SCROLL
       Smooth scrolling for navigation links
       ============================================ */
    function initSmoothScroll() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update header style on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add scrolled class to header
            if (currentScroll > 100) {
                DOM.header?.classList.add('scrolled');
            } else {
                DOM.header?.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /* ============================================
       6. GSAP ANIMATIONS & SCROLLTRIGGER
       Advanced scroll-based animations
       ============================================ */
    function initGSAPAnimations() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded. Falling back to CSS animations.');
            fallbackAnimations();
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Set default easing
        gsap.defaults({
            ease: 'power3.out',
            duration: 1
        });

        // Animate section titles on scroll
        DOM.sections.forEach(section => {
            const titleLetters = section.querySelectorAll('.title-letter');

            if (titleLetters.length > 0) {
                gsap.fromTo(titleLetters,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.05,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        });

        // About section - Glass cards animation
        gsap.fromTo(DOM.glassCards,
            { y: 80, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.15,
                duration: 0.8,
                scrollTrigger: {
                    trigger: DOM.about,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Tech badges animation
        gsap.fromTo(DOM.techBadges,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                stagger: 0.08,
                duration: 0.5,
                scrollTrigger: {
                    trigger: '.glass-card--tech',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Contact section words animation
        gsap.fromTo(DOM.contactWords,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                scrollTrigger: {
                    trigger: DOM.contact,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Social links animation
        gsap.fromTo(DOM.socialLinks,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.6,
                scrollTrigger: {
                    trigger: '.social-links',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Parallax effect for floating elements
        gsap.utils.toArray('.floating-code').forEach(element => {
            gsap.to(element, {
                y: () => -100 * Math.random(),
                scrollTrigger: {
                    trigger: element.closest('.section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // Hero background text parallax
        if (DOM.heroBgLetters.length > 0) {
            gsap.to(DOM.heroBgLetters, {
                y: -50,
                scrollTrigger: {
                    trigger: DOM.home,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    // Fallback for when GSAP isn't loaded
    function fallbackAnimations() {
        // Add visible class to elements to trigger CSS transitions
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe all animated elements
        document.querySelectorAll('.glass-card, .title-letter, .tech-badge').forEach(el => {
            observer.observe(el);
        });
    }

    /* ============================================
       7. ENTRY ANIMATIONS
       Initial animations when page loads
       ============================================ */
    function initEntryAnimations() {
        if (typeof gsap === 'undefined') {
            // Simple fallback without GSAP
            DOM.heroBgLetters.forEach((letter, i) => {
                setTimeout(() => {
                    letter.style.opacity = '1';
                    letter.style.transform = 'translateY(0)';
                }, i * 100);
            });

            DOM.taglineWords.forEach((word, i) => {
                setTimeout(() => {
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, 500 + i * 100);
            });
            return;
        }

        // Timeline for hero entrance
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Background text letters
        heroTimeline.fromTo(DOM.heroBgLetters,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 1 }
        );

        // Hero image
        heroTimeline.fromTo(DOM.heroImage,
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1 },
            '-=0.5'
        );

        // Name parts
        heroTimeline.fromTo(DOM.heroNameParts,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
            '-=0.5'
        );

        // Tagline words
        heroTimeline.fromTo(DOM.taglineWords,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.4 },
            '-=0.3'
        );

        // Scroll indicator
        heroTimeline.fromTo('.scroll-indicator',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 0.7, duration: 0.5 },
            '-=0.2'
        );
    }

    /* ============================================
       8. PROJECT CAROUSEL
       Circular carousel with automatic rotation
       ============================================ */
    function initCarousel() {
        if (!DOM.carousel || DOM.projectCards.length === 0) return;

        // Set initial state
        updateCarousel();

        // Previous button
        DOM.carouselPrev?.addEventListener('click', () => {
            state.currentProject = (state.currentProject - 1 + state.totalProjects) % state.totalProjects;
            updateCarousel();
        });

        // Next button
        DOM.carouselNext?.addEventListener('click', () => {
            state.currentProject = (state.currentProject + 1) % state.totalProjects;
            updateCarousel();
        });

        // Dot navigation
        DOM.carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                state.currentProject = index;
                updateCarousel();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!isElementInViewport(DOM.projects)) return;

            if (e.key === 'ArrowLeft') {
                state.currentProject = (state.currentProject - 1 + state.totalProjects) % state.totalProjects;
                updateCarousel();
            } else if (e.key === 'ArrowRight') {
                state.currentProject = (state.currentProject + 1) % state.totalProjects;
                updateCarousel();
            }
        });

        // Project card click - update monitor
        DOM.projectCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (card.dataset.state === 'active') {
                    const url = card.dataset.url;
                    if (url) {
                        window.open(url, '_blank', 'noopener');
                    }
                } else {
                    state.currentProject = index;
                    updateCarousel();
                }
            });

            // Hover effect for monitor preview
            card.addEventListener('mouseenter', () => {
                updateMonitorPreview(card.dataset.url);
            });
        });
    }

    function updateCarousel() {
        DOM.projectCards.forEach((card, index) => {
            const diff = index - state.currentProject;
            let cardState = 'hidden';

            if (diff === 0) {
                cardState = 'active';
            } else if (diff === -1 || (state.currentProject === 0 && index === state.totalProjects - 1)) {
                cardState = 'prev';
            } else if (diff === 1 || (state.currentProject === state.totalProjects - 1 && index === 0)) {
                cardState = 'next';
            }

            card.dataset.state = cardState;
        });

        // Update dots
        DOM.carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === state.currentProject);
        });

        // Update monitor with active project
        const activeCard = DOM.projectCards[state.currentProject];
        if (activeCard) {
            updateMonitorPreview(activeCard.dataset.url);
        }
    }

    function updateMonitorPreview(url) {
        if (!DOM.monitorIframe || !url) return;

        // Show placeholder while loading
        if (DOM.monitorPlaceholder) {
            DOM.monitorPlaceholder.style.display = 'flex';
        }
        DOM.monitorIframe.classList.remove('loaded');

        // Note: Due to X-Frame-Options, most sites won't load in iframe
        // This is a known limitation. In production, use screenshots/videos instead.
        DOM.monitorIframe.src = url;

        DOM.monitorIframe.onload = () => {
            if (DOM.monitorPlaceholder) {
                DOM.monitorPlaceholder.style.display = 'none';
            }
            DOM.monitorIframe.classList.add('loaded');
        };

        DOM.monitorIframe.onerror = () => {
            // Keep placeholder visible on error
            if (DOM.monitorPlaceholder) {
                DOM.monitorPlaceholder.querySelector('.monitor__placeholder-text').textContent = 'Preview unavailable';
            }
        };
    }

    /* ============================================
       9. 3D MONITOR PARALLAX
       Mouse-tracking parallax effect
       ============================================ */
    function initMonitorParallax() {
        if (!DOM.monitor) return;

        // Update monitor rotation based on mouse position
        document.addEventListener('mousemove', (e) => {
            if (!isElementInViewport(DOM.projects)) return;

            const rect = DOM.monitor.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate rotation based on mouse distance from center
            const rotateY = ((e.clientX - centerX) / window.innerWidth) * 15;
            const rotateX = ((e.clientY - centerY) / window.innerHeight) * -10;

            DOM.monitor.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset on mouse leave
        DOM.projects?.addEventListener('mouseleave', () => {
            DOM.monitor.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    /* ============================================
       10. PARTICLE SYSTEM
       Floating particles in sections
       ============================================ */
    function initParticles() {
        createParticles(DOM.particlesHome, 20, 'secondary');
        createParticles(DOM.particlesContact, 15, 'secondary');
    }

    function createParticles(container, count, colorScheme = 'primary') {
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Random size (2-6px)
            const size = 2 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random animation properties
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * 10;
            const tx = (Math.random() - 0.5) * 100;
            const ty = -50 - Math.random() * 100;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.animation = `particleFloat ${duration}s ${delay}s ease-in-out infinite`;

            container.appendChild(particle);
        }
    }

    /* ============================================
       11. AUDIO TOGGLE
       Background ambient music control
       ============================================ */
    function initAudioToggle() {
        if (!DOM.audioToggle || !DOM.ambientAudio) return;

        DOM.audioToggle.addEventListener('click', () => {
            state.isAudioPlaying = !state.isAudioPlaying;

            DOM.audioToggle.classList.toggle('playing', state.isAudioPlaying);

            if (state.isAudioPlaying) {
                DOM.ambientAudio.play().catch(e => {
                    console.log('Audio playback failed:', e);
                    state.isAudioPlaying = false;
                    DOM.audioToggle.classList.remove('playing');
                });
            } else {
                DOM.ambientAudio.pause();
            }
        });
    }

    /* ============================================
       12. COUNTER ANIMATION
       Animated number counting for stats
       ============================================ */
    function initCounters() {
        if (DOM.statNumbers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.dataset.count, 10);
                    animateCounter(target, finalValue);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        DOM.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.round(startValue + (target - startValue) * easeProgress);
            element.textContent = currentValue.toLocaleString() + (target >= 1000 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */
    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }

    // Debounce function for performance
    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /* ============================================
       12b. AUDIO VIBE CONTROL
       Control background music from header
       ============================================ */
    /* ============================================
       12b. AUDIO SYSTEM (Vibe Control + Nav Toggle)
       Unified audio control with persistence
       ============================================ */
    function initAudioSystem() {
        const audio = document.getElementById('bg-music');
        const headerControl = document.getElementById('audio-control');
        const navToggle = document.getElementById('audio-toggle');

        if (!audio) return;

        // --- Persistence: Restore State ---
        const savedTime = sessionStorage.getItem('audio_currentTime');
        const wasPlaying = sessionStorage.getItem('audio_isPlaying') === 'true';

        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }

        audio.volume = 0.4;

        if (wasPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updateUI(true);
                }).catch(e => console.log('Autoplay blocked:', e));
            }
        }

        // --- UI Update Helper ---
        function updateUI(isPlaying) {
            if (headerControl) headerControl.classList.toggle('playing', isPlaying);
            if (navToggle) navToggle.classList.toggle('playing', isPlaying);
        }

        // --- Toggle Logic ---
        function toggleAudio() {
            if (audio.paused) {
                audio.play().then(() => {
                    updateUI(true);
                    sessionStorage.setItem('audio_isPlaying', 'true');
                }).catch(e => console.error("Audio play failed:", e));
            } else {
                audio.pause();
                updateUI(false);
                sessionStorage.setItem('audio_isPlaying', 'false');
            }
        }

        // --- Event Listeners ---
        if (headerControl) headerControl.addEventListener('click', toggleAudio);
        if (navToggle) navToggle.addEventListener('click', toggleAudio);

        // Save state before leaving page (for seamless transition)
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('audio_currentTime', audio.currentTime);
            sessionStorage.setItem('audio_isPlaying', !audio.paused);
        });
    }

    /* ============================================
       WARDROBE INTERACTION
       Sliding doors, Rack reveal, High-Fidelity Preview
       ============================================ */
    function initWardrobeProjects() {
        const section = document.querySelector('.section--wardrobe');
        const rackItems = document.querySelectorAll('.rack-item');
        const preview = document.querySelector('.project-preview');
        const rack = document.querySelector('.wardrobe-rack');

        // UI Elements - High Fidelity Preview
        const ui = {
            titleStart: document.getElementById('project-title-start'),
            titleEnd: document.getElementById('project-title-end'),
            tagline: document.getElementById('project-tagline'),
            desc: document.getElementById('project-desc'),
            tech: document.getElementById('project-tech'),
            urlBar: document.getElementById('project-url-bar'),
            monitorView: document.getElementById('project-monitor-view'),
            linkLive: document.getElementById('project-link-live'),
            linkCode: document.getElementById('project-link-code'),
            backBtn: document.getElementById('btn-back-wardrobe'),
            index: document.getElementById('project-index')
        };

        // UI Elements - Current Selection Card
        const selectionCard = {
            container: document.getElementById('current-selection'),
            title: document.getElementById('selection-title'),
            desc: document.getElementById('selection-desc'),
            btn: document.getElementById('selection-btn'),
            closeBtn: document.querySelector('.current-selection__icon')
        };

        // UI Elements - Catalog ID
        const catalogId = {
            value: document.getElementById('catalog-id-value')
        };

        if (!section || !rackItems.length) return;

        // Project Data
        const projects = {
            'contrasignal': {
                titleStart: 'Contra', titleEnd: 'Signal',
                name: 'CONTRA SIGNAL',
                tagline: '// Market Sentiment Analysis Engine',
                shortDesc: 'AI multi-agent system for stock analysis that delivers insights in 60 seconds. Autonomously scrapes global news to identify overreactions.',
                desc: `<p>"When negative news breaks, stock prices crash. But is it a disaster or a discount?"</p>
                       <p class="mt-4">AI multi-agent system for stock analysis that delivers insights in 60 seconds. Autonomously scrapes global news to identify overreactions in real-time.</p>`,
                tech: ['Python', 'FastAPI', 'Google Gemini', 'LangChain', 'ChromaDB'],
                url: 'gsms-b-contra-signal.hf.space',
                live: 'https://gsms-b-contra-signal.hf.space/',
                code: 'https://github.com/GSMS-B/Contra-Signal.git',
                media: `<iframe src="https://gsms-b-contra-signal.hf.space/" title="ContraSignal" class="w-full h-full border-0 bg-white dark:bg-black"></iframe>`
            },
            'projectqr': {
                titleStart: 'Project', titleEnd: 'QR',
                name: 'PROJECT QR',
                tagline: '// Dynamic QR Code Management',
                shortDesc: 'Dynamic QR code management platform with real-time scanning analytics, geolocation tracking, and expiration management.',
                desc: `<p>Static QR codes are dead. ProjectQR introduces a dynamic layer, allowing you to change destination URLs instantly without reprinting.</p>
                       <p class="mt-4">Dynamic QR code management platform with real-time scanning analytics, geolocation tracking, and expiration management.</p>`,
                tech: ['FastAPI', 'PostgreSQL', 'JavaScript', 'Chart.js'],
                url: 'projectqr.onrender.com',
                live: 'https://projectqr.onrender.com',
                code: 'https://github.com/GSMS-B/ProjectQR.git',
                media: `<iframe src="https://projectqr.onrender.com" title="ProjectQR" class="w-full h-full border-0 bg-white dark:bg-black"></iframe>`
            },
            'quantumleap': {
                titleStart: 'Quantum', titleEnd: 'Leap',
                name: 'QUANTUM LEAP',
                tagline: '// Quantum-Inspired Portfolio Optimizer',
                shortDesc: 'Portfolio optimizer utilizing quantum algorithms to maximize Sharpe ratios and minimize risk across complex asset baskets.',
                desc: `<p>Traditional optimization hits limits. QuantumLeap breaks them using the QAOA algorithm for superior asset allocation.</p>
                       <p class="mt-4">Portfolio optimizer utilizing quantum algorithms to maximize Sharpe ratios and minimize risk across complex asset baskets.</p>`,
                tech: ['Python', 'Quantum Algorithms (QAOA)', 'Financial APIs'],
                url: 'quantumleap-optimizer.onrender.com',
                live: 'https://quantumleap-optimizer.onrender.com/',
                code: 'https://github.com/GSMS-B/QuantumLeap-Portfolio-Optimizer.git',
                media: `<iframe src="https://quantumleap-optimizer.onrender.com/" title="QuantumLeap" class="w-full h-full border-0 bg-white dark:bg-black"></iframe>`
            },
            'hush': {
                titleStart: 'Hush', titleEnd: '.io',
                name: 'HUSH .IO',
                tagline: '// Zero-Knowledge Messaging',
                shortDesc: 'Private ephemeral messaging app ensuring complete anonymity with zero database storage. No logs, no trace.',
                desc: `<p>Privacy is not a feature, it's the foundation. Hush.io ensures your messages are encrypted in transit and deleted on receipt.</p>
                       <p class="mt-4">Private ephemeral messaging app ensuring complete anonymity with zero database storage. No logs, no trace.</p>`,
                tech: ['WebSockets', 'E2E Encryption', 'Zero-storage Architecture'],
                url: 'hush-io-chgx.onrender.com',
                live: 'https://hush-io-chgx.onrender.com/',
                code: 'https://github.com/GSMS-B/Hush.io.git',
                media: `<iframe src="https://hush-io-chgx.onrender.com/" title="Hush.io" class="w-full h-full border-0 bg-white dark:bg-black"></iframe>`
            }
        };

        // ScrollTrigger for Door Animation
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Get door elements for width calculation
            const leftDoor = document.querySelector('.wardrobe-door--left');
            const rightDoor = document.querySelector('.wardrobe-door--right');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Animate doors using x with function to get actual width
            tl.to('.wardrobe-door--left', {
                x: () => leftDoor ? -leftDoor.offsetWidth : -350,
                ease: "none",
                duration: 2
            })
                .to('.wardrobe-door--right', {
                    x: () => rightDoor ? rightDoor.offsetWidth : 350,
                    ease: "none",
                    duration: 2
                }, "<")
                .fromTo(rack, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, "-=1");
        }

        // Helper to convert keys to array for navigation
        const projectKeys = Object.keys(projects);
        let currentIndex = 0;

        // T-Shirt Click: Show Current Selection Card
        rackItems.forEach((item, idx) => {
            item.addEventListener('click', () => {
                selectProject(idx);
            });
        });

        // Select Project (show card, don't open full preview)
        function selectProject(index) {
            currentIndex = index;
            const pid = projectKeys[index];
            const data = projects[pid];
            if (!data) return;

            // Update Catalog ID
            if (catalogId.value) {
                catalogId.value.textContent = `#00${index + 1}-C0`;
            }

            // Update Current Selection Card
            if (selectionCard.container) {
                if (selectionCard.title) selectionCard.title.textContent = data.name;
                if (selectionCard.desc) selectionCard.desc.textContent = data.shortDesc;
                if (selectionCard.btn) selectionCard.btn.href = data.live;

                // Show card with animation
                selectionCard.container.style.display = 'flex';
                gsap.fromTo(selectionCard.container,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
                );
            }

            // Store current project for VIEW PROJECT CASE button
            if (selectionCard.btn) {
                selectionCard.btn.onclick = (e) => {
                    e.preventDefault();
                    openFullPreview(index);
                };
            }
        }

        // VIEW PROJECT CASE: Open Full Preview
        function openFullPreview(index) {
            if (!preview) return;

            // Update current index for navigation
            currentIndex = index;

            const pid = projectKeys[index];
            const data = projects[pid];
            if (!data) return;

            // 1. Lock Body & HTML Scroll
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // 2. Hide Global Header
            const header = document.getElementById('header');
            if (header) header.style.display = 'none';

            // 3. Hide ALL wardrobe UI elements for full-screen preview
            const wardrobeHeader = document.querySelector('.wardrobe-header');
            const catalogIdEl = document.getElementById('catalog-id');
            const wardrobeDoors = document.querySelector('.wardrobe-doors');
            const wardrobeBg = document.querySelector('.wardrobe-bg');

            if (wardrobeHeader) gsap.to(wardrobeHeader, { opacity: 0, duration: 0.3 });
            if (catalogIdEl) gsap.to(catalogIdEl, { opacity: 0, duration: 0.3 });
            if (wardrobeDoors) gsap.to(wardrobeDoors, { opacity: 0, duration: 0.3 });
            if (wardrobeBg) gsap.to(wardrobeBg, { opacity: 0, duration: 0.3 });

            gsap.to(rack, { opacity: 0, y: -50, duration: 0.5, pointerEvents: 'none' });
            if (selectionCard.container) {
                gsap.to(selectionCard.container, { opacity: 0, duration: 0.3 });
            }

            // 4. Populate Full Preview Data
            updateModalUI(data, index);

            // 5. Reveal Preview with full-screen positioning
            gsap.set(preview, { display: 'block', opacity: 0 });
            gsap.to(preview, {
                opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
                pointerEvents: 'all'
            });
        }

        function updateModalUI(data, index) {
            if (ui.titleStart) ui.titleStart.textContent = data.titleStart;
            if (ui.titleEnd) ui.titleEnd.textContent = data.titleEnd;
            if (ui.tagline) ui.tagline.textContent = data.tagline;
            if (ui.desc) ui.desc.innerHTML = data.desc;
            if (ui.urlBar) ui.urlBar.innerHTML = `<span class="material-icons text-[10px]">lock</span> ${data.url}`;
            if (ui.monitorView) ui.monitorView.innerHTML = data.media;
            if (ui.index) ui.index.textContent = `0${index + 1}`;

            // Tech Stack
            if (ui.tech) {
                ui.tech.innerHTML = data.tech.map(t => {
                    const style = t === 'React' || t === 'Python' ? 'bg-black dark:bg-white text-white dark:text-black' : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300';
                    return `<span class="px-3 py-1 text-xs font-bold uppercase tracking-wider ${style}">${t}</span>`;
                }).join('');
            }

            // Links
            if (ui.linkLive) { ui.linkLive.href = data.live; }
            if (ui.linkCode) { ui.linkCode.href = data.code; }

            // Show Nav Buttons
            const btnPrev = document.getElementById('btn-prev-project');
            const btnNext = document.getElementById('btn-next-project');
            if (btnPrev) { btnPrev.style.display = 'inline'; btnPrev.innerText = 'Prev Project'; }
            if (btnNext) { btnNext.style.display = 'inline'; btnNext.innerText = 'Next Project'; }
        }

        function closePreview() {
            // Unlock body & HTML scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            // Restore Global Header
            const header = document.getElementById('header');
            if (header) header.style.display = ''; // Restore default (flex)

            // Hide preview first
            gsap.to(preview, {
                opacity: 0, y: 20, duration: 0.5, pointerEvents: 'none',
                onComplete: () => { gsap.set(preview, { display: 'none' }); }
            });

            // Restore ALL wardrobe UI elements
            const wardrobeHeader = document.querySelector('.wardrobe-header');
            const catalogIdEl = document.getElementById('catalog-id');
            const wardrobeDoors = document.querySelector('.wardrobe-doors');
            const wardrobeBg = document.querySelector('.wardrobe-bg');

            if (wardrobeHeader) gsap.to(wardrobeHeader, { opacity: 1, duration: 0.5, delay: 0.3 });
            if (catalogIdEl) gsap.to(catalogIdEl, { opacity: 1, duration: 0.5, delay: 0.3 });
            if (wardrobeDoors) gsap.to(wardrobeDoors, { opacity: 1, duration: 0.5, delay: 0.3 });
            if (wardrobeBg) gsap.to(wardrobeBg, { opacity: 1, duration: 0.5, delay: 0.3 });

            gsap.to(rack, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out", pointerEvents: 'all' });

            // Show selection card again
            if (selectionCard.container) {
                selectionCard.container.style.display = 'flex';
                gsap.to(selectionCard.container, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 });
            }
        }

        // Back Button (from full preview)
        if (ui.backBtn) {
            ui.backBtn.addEventListener('click', closePreview);
        }

        // Close Button (on Current Selection card)
        if (selectionCard.closeBtn) {
            selectionCard.closeBtn.addEventListener('click', () => {
                gsap.to(selectionCard.container, {
                    opacity: 0, y: 20, duration: 0.3,
                    onComplete: () => { selectionCard.container.style.display = 'none'; }
                });
            });
        }

        // Navigation Logic (within full preview)
        const btnPrev = document.getElementById('btn-prev-project');
        const btnNext = document.getElementById('btn-next-project');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = projectKeys.length - 1; // Loop
                openFullPreview(newIndex);
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                let newIndex = currentIndex + 1;
                if (newIndex >= projectKeys.length) newIndex = 0; // Loop
                openFullPreview(newIndex);
            });
        }
    }

    /* ============================================
       13. INITIALIZATION
       Start all modules
       ============================================ */
    function init() {
        initLoader();
        initCursor();
        initNavigation();
        initSmoothScroll();
        initGSAPAnimations();
        initWardrobeProjects();
        initParticles();
        initAudioSystem(); // Unified audio system
        initCounters();

        // Log initialization success
        console.log('%c🚀 GSMS-B Portfolio Loaded', 'color: #F6383F; font-size: 16px; font-weight: bold;');
        console.log('%cAI handles the typing, I handle the thinking.', 'color: #1E1E1C; font-style: italic;');
    }

    // Start the app
    init();
});

/* ============================================
   IMAGE ERROR HANDLING
   Graceful fallback for missing images
   ============================================ */
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        // Replace with placeholder or hide
        e.target.style.opacity = '0.3';
        e.target.alt = 'Image not found - Add your photo to assets/hero-image.png';
    }
}, true);
