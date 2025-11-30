/**
 * KoppeK Landing Page
 * - Countdown Timer to December 24, 2025
 * - Scroll Reveal Animations
 * - App Preview Parallax
 */

(function() {
    'use strict';

    // =========================================
    // Countdown Timer
    // =========================================
    
    // Target date: December 24, 2025 at midnight
    const LAUNCH_DATE = new Date('2025-12-24T00:00:00').getTime();

    // DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    /**
     * Pad a number with leading zero if needed
     */
    function padNumber(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Update the countdown display
     */
    function updateCountdown() {
        const now = Date.now();
        const distance = LAUNCH_DATE - now;

        // If countdown is finished
        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM with animation
        updateWithAnimation(daysEl, padNumber(days));
        updateWithAnimation(hoursEl, padNumber(hours));
        updateWithAnimation(minutesEl, padNumber(minutes));
        updateWithAnimation(secondsEl, padNumber(seconds));
    }

    /**
     * Update element with subtle animation when value changes
     */
    function updateWithAnimation(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(1.1)';
            element.textContent = newValue;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // =========================================
    // Scroll Reveal Animations
    // =========================================
    
    /**
     * Initialize Intersection Observer for reveal animations
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // =========================================
    // App Preview Scroll Animation
    // =========================================
    
    /**
     * Initialize scroll-based animation for app preview
     */
    function initAppPreviewAnimation() {
        const appPreview = document.getElementById('appPreview');
        if (!appPreview) return;

        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        const previewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                    appPreview.classList.add('in-view');
                } else if (entry.intersectionRatio < 0.1) {
                    appPreview.classList.remove('in-view');
                }
            });
        }, observerOptions);

        previewObserver.observe(appPreview);
    }

    // =========================================
    // Smooth Parallax on App Preview (optional enhancement)
    // =========================================
    
    function initParallax() {
        const appPreview = document.getElementById('appPreview');
        if (!appPreview) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = appPreview.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // Calculate how far through the viewport the element is
                    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    
                    if (progress > 0 && progress < 1) {
                        // Subtle rotation based on scroll position
                        const rotateX = 10 - (progress * 15);
                        const translateY = 50 - (progress * 70);
                        const opacity = 0.5 + (progress * 0.5);
                        
                        appPreview.style.transform = `rotateX(${Math.max(0, rotateX)}deg) translateY(${Math.max(0, translateY)}px)`;
                        appPreview.style.opacity = Math.min(1, opacity);
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }

    // =========================================
    // Video Fallback Handler
    // =========================================
    
    function initVideoFallback() {
        const video = document.getElementById('logoVideo');
        const fallback = document.getElementById('logoFallback');
        
        if (!video || !fallback) return;
        
        // Handle video load error
        video.addEventListener('error', showFallback);
        
        // Also check if video can play
        video.addEventListener('loadeddata', () => {
            // Video loaded successfully, make sure it's visible
            video.style.display = 'block';
            fallback.style.display = 'none';
        });
        
        // If video fails to load within 3 seconds, show fallback
        setTimeout(() => {
            if (video.readyState === 0) {
                showFallback();
            }
        }, 3000);
        
        function showFallback() {
            video.style.display = 'none';
            fallback.style.display = 'block';
        }
    }

    // =========================================
    // Initialize Everything
    // =========================================
    
    function init() {
        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Initialize video with fallback
        initVideoFallback();
        
        // Initialize scroll animations
        initScrollReveal();
        initAppPreviewAnimation();
        
        // Enable parallax only if user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            initParallax();
        }
        
        // Add transition for countdown values
        document.querySelectorAll('.countdown-value').forEach(el => {
            el.style.transition = 'transform 0.1s ease-out';
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
