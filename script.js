/**
 * KoppeK Landing Page
 * - Countdown Timer to March 27, 2026 (Private Beta)
 * - Scroll Reveal Animations
 * - App Preview Parallax
 */

(function() {
    'use strict';

    // =========================================
    // Countdown Timer
    // =========================================
    
    // Target date: March 27, 2026 at midnight (Private Beta Launch)
    const LAUNCH_DATE = new Date('2026-03-27T00:00:00').getTime();

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
    // Video Modal
    // =========================================
    
    function initVideoModal() {
        const videoBtn = document.getElementById('videoBtn');
        const videoModal = document.getElementById('videoModal');
        const videoModalBackdrop = document.getElementById('videoModalBackdrop');
        const videoModalClose = document.getElementById('videoModalClose');
        const promoVideo = document.getElementById('promoVideo');
        
        if (!videoBtn || !videoModal) return;
        
        // Open modal
        videoBtn.addEventListener('click', () => {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            promoVideo.play();
        });
        
        // Close modal functions
        function closeModal() {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            promoVideo.pause();
            promoVideo.currentTime = 0;
        }
        
        videoModalBackdrop.addEventListener('click', closeModal);
        videoModalClose.addEventListener('click', closeModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // =========================================
    // Screenshots Carousel
    // =========================================
    
    function initCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');
        
        if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
        
        const slides = track.querySelectorAll('.carousel-slide');
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayInterval = null;
        
        /**
         * Go to a specific slide
         */
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        /**
         * Go to next slide
         */
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        /**
         * Go to previous slide
         */
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        /**
         * Start auto-play
         */
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        /**
         * Stop auto-play
         */
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer on manual navigation
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay();
            });
        });
        
        // Pause on hover
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const carouselSection = document.querySelector('.carousel-section');
            const rect = carouselSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    startAutoPlay();
                }
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Start auto-play (skip if reduced motion preference)
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startAutoPlay();
        }
    }

    // =========================================
    // Reviews Carousel
    // =========================================
    
    function initReviewsCarousel() {
        const track = document.querySelector('.reviews-carousel-track');
        const slides = document.querySelectorAll('.review-slide');
        const prevBtn = document.querySelector('.reviews-carousel-btn.prev');
        const nextBtn = document.querySelector('.reviews-carousel-btn.next');
        const dotsContainer = document.querySelector('.reviews-carousel-dots');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        let autoplayInterval;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');
        
        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev');
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else if (index < currentIndex) {
                    slide.classList.add('prev');
                }
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlides();
            resetAutoplay();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlides();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlides();
        }
        
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }
        
        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
        
        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        track.addEventListener('mouseleave', startAutoplay);
        
        // Start autoplay
        startAutoplay();
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
        
        // Initialize video modal
        initVideoModal();
        
        // Initialize screenshots carousel
        initCarousel();
        
        // Initialize reviews carousel
        initReviewsCarousel();
        
        // Initialize scroll animations
        initScrollReveal();
        
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
