/**
 * Aulia Hasna Fadhilah - Personal Portfolio Website
 * Core JavaScript Logic (Pure Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Page Loader Handler
    // ==========================================================================
    const pageLoader = document.getElementById('page-loader');
    
    // Function to dismiss loader
    const dismissLoader = () => {
        if (pageLoader && !pageLoader.classList.contains('loaded')) {
            pageLoader.classList.add('loaded');
            // Remove from DOM after transition completes to save resources
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 600);
        }
    };

    // Automatically dismiss loader when page resources (images, css) are fully loaded
    window.addEventListener('load', () => {
        dismissLoader();
    });

    // Fallback: If resources take too long, dismiss loader after 2.5 seconds anyway
    setTimeout(dismissLoader, 2500);


    // ==========================================================================
    // 2. Mobile Menu Toggle Drawer
    // ==========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenuContainer = document.getElementById('nav-menu-container');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu open/close states
    const toggleMenu = () => {
        menuToggleBtn.classList.toggle('open');
        navMenuContainer.classList.toggle('open');
        // Toggle body scroll lock
        document.body.style.overflow = navMenuContainer.classList.contains('open') ? 'hidden' : '';
    };

    if (menuToggleBtn && navMenuContainer) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu drawer when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenuContainer.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside of the drawer
        document.addEventListener('click', (e) => {
            if (navMenuContainer.classList.contains('open') && 
                !navMenuContainer.contains(e.target) && 
                !menuToggleBtn.contains(e.target)) {
                toggleMenu();
            }
        });
    }


    // ==========================================================================
    // 3. Sticky Navigation Padding Adjustment on Scroll
    // ==========================================================================
    const mainHeader = document.getElementById('main-header');

    const handleHeaderScroll = () => {
        if (mainHeader) {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    // Trigger once on load in case user refreshed middle of page
    handleHeaderScroll();


    // ==========================================================================
    // 4. Smooth Anchor Scrolling with Offsets
    // ==========================================================================
    const allScrollLinks = document.querySelectorAll('a[href^="#"]');

    allScrollLinks.forEach(anchorLink => {
        anchorLink.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Allow default behavior for plain "#" links
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate dynamic header height offset
                const headerOffset = mainHeader ? mainHeader.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 5; // tiny buffer

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================================================
    // 5. Active Section Auto-Highlighting (IntersectionObserver)
    // ==========================================================================
    const pageSections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        // High threshold ensures the main active section in view is highlighted
        rootMargin: '-20% 0px -60% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const targetNavLink = document.getElementById(`nav-${sectionId}`);
                
                if (targetNavLink) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to corresponding link
                    targetNavLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    pageSections.forEach(section => {
        sectionObserver.observe(section);
    });



    // ==========================================================================
    // 7. Scroll Reveal Animations (IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // triggers slightly before entering the screen bottom
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown to lock the animation state in place
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================================================
    // 8. Portfolio Gallery Lightbox Handler
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentIndex = 0;

    // Reset styles for lightbox image when loading new content
    const resetLightboxImgStyles = () => {
        if (lightboxImg) {
            lightboxImg.style.padding = '';
            lightboxImg.style.width = '';
            lightboxImg.style.height = '';
        }
    };

    // Handle error when loading image inside lightbox by showing cute tooth mascot
    if (lightboxImg) {
        lightboxImg.addEventListener('error', () => {
            if (!lightboxImg.src.endsWith('assets/favicon.svg')) {
                lightboxImg.src = 'assets/favicon.svg';
                lightboxImg.style.padding = '40px';
                lightboxImg.style.width = '250px';
                lightboxImg.style.height = '250px';
            }
        });
    }

    // Open Lightbox
    const openLightbox = (index) => {
        currentIndex = index;
        const item = galleryItems[currentIndex];
        
        const imgSrc = item.getAttribute('data-src');

        // Reset styles first
        resetLightboxImgStyles();

        // Set content
        lightboxImg.src = imgSrc;
        lightboxImg.alt = "Portfolio Image";

        // Show overlay
        lightboxOverlay.style.display = 'flex';
        // Force reflow for smooth opacity transition
        lightboxOverlay.offsetHeight; 
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close Lightbox
    const closeLightbox = () => {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxOverlay.style.display = 'none';
            lightboxImg.src = '';
        }, 300); // match transition duration
    };

    // Show Next Item
    const nextItem = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxContent();
    };

    // Show Prev Item
    const prevItem = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    };

    // Update lightbox elements
    const updateLightboxContent = () => {
        const item = galleryItems[currentIndex];
        const imgSrc = item.getAttribute('data-src');

        // Apply slide animation
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            // Reset styles first
            resetLightboxImgStyles();

            lightboxImg.src = imgSrc;
            lightboxImg.alt = "Portfolio Image";
            lightboxImg.style.opacity = '1';
        }, 150);
    };

    // Add listeners to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Lightbox Controls event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextItem);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevItem);
    }

    // Close on clicking backdrop
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // Keyboard Navigation support
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextItem();
        } else if (e.key === 'ArrowLeft') {
            prevItem();
        }
    });

});
