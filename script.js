document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scroll ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    });

    // --- Hero Slideshow Logic Removed (Video Background Implemented) ---


    // --- Enquiry Modal Logic ---
    const modal = document.getElementById('enquiryModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const productInput = document.getElementById('modal-product');
    const enquiryForm = document.getElementById('modalEnquiryForm');

    function openModal(productName = "General Enquiry") {
        if (modal && productInput) {
            productInput.value = productName;
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Global Event Delegation for Enquire Buttons & Mobile Menu Close
    document.addEventListener('click', (e) => {
        // Enquire Now Buttons - using closest for robustness
        const enquireBtn = e.target.closest('.btn-enquire');
        if (enquireBtn) {
            const card = enquireBtn.closest('.product-card');
            const productName = card ? card.getAttribute('data-product') :
                (enquireBtn.getAttribute('data-product') || "General Enquiry");
            openModal(productName);
            return; // Stop further processing if button clicked
        }

        // WhatsApp Enquiry Buttons
        const whatsappBtn = e.target.closest('.btn-whatsapp-enquiry');
        if (whatsappBtn) {
            const card = whatsappBtn.closest('.product-card');
            const productName = card ? card.getAttribute('data-product') : "Selected Stone";
            const message = `Hello, I’m interested in ${productName} from A1_Design_Center. Please share details.`;
            const whatsappUrl = `https://wa.me/15551234567?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            return;
        }

        // Close Mobile Menu if clicking outside
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (lightbox) lightbox.style.display = "none";
        }
    });

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show Success Feedback
            const btn = enquiryForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your enquiry! Our team will contact you soon.');
                closeModal();
                btn.innerText = originalText;
                btn.disabled = false;
                enquiryForm.reset();
            }, 1000);
        });
    }

    // --- Portfolio Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (portfolioItems.length > 0 && lightbox) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3').innerText;
                const category = item.querySelector('p').innerText;
                lightbox.style.display = "block";
                lightboxImg.src = img.src;
                captionText.innerHTML = `<strong>${title}</strong><br><span>${category}</span>`;
            });
        });
    }

    if (closeLightbox) closeLightbox.addEventListener('click', () => lightbox.style.display = "none");
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = "none";
        });
    }

    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                portfolioItems.forEach(item => {
                    item.style.display = (filterValue === 'all' || item.classList.contains(filterValue)) ? 'block' : 'none';
                });
            });
        });
    }
    // --- Process Section Auto-Carousel (Mobile) ---
    const processContainer = document.querySelector('.process-container');
    let autoScrollInterval;

    function initProcessCarousel() {
        if (!processContainer || window.innerWidth > 768) {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            return;
        }

        // Clone items for infinite loop
        const items = Array.from(processContainer.children);
        if (items.length < 2) return;

        // Only clone if not already cloned
        if (!processContainer.querySelector('.cloned')) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('cloned');
                processContainer.appendChild(clone);
            });
        }

        let scrollAmount = 0;
        const step = 1; // Pixels per interval
        const delay = 30; // ms

        function startAutoScroll() {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                processContainer.scrollLeft += step;

                // If reached the end of original items, reset to start
                const firstItemWidth = items[0].offsetWidth + 20; // width + gap
                const totalOriginalWidth = firstItemWidth * items.length;

                if (processContainer.scrollLeft >= totalOriginalWidth) {
                    processContainer.scrollLeft = 0;
                }
            }, delay);
        }

        startAutoScroll();

        // Pause on touch
        processContainer.addEventListener('touchstart', () => clearInterval(autoScrollInterval));
        processContainer.addEventListener('touchend', startAutoScroll);
    }

    // Initialize and handle resize
    initProcessCarousel();
    window.addEventListener('resize', initProcessCarousel);

    // --- Google Drive Video Auto-Fixer ---
    function fixGoogleDriveVideoLinks() {
        // Target all video elements
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            let src = video.getAttribute('src');
            const sourceTag = video.querySelector('source');

            // If video src is empty but has source tag, check that
            if (!src && sourceTag) {
                src = sourceTag.getAttribute('src');
            }

            if (src && src.includes('drive.google.com')) {
                console.log('Found Google Drive link:', src);

                // Extract file ID
                const idMatch = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);

                if (idMatch && idMatch[1]) {
                    const fileId = idMatch[1];
                    const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

                    if (src !== directLink) {
                        console.log(`Converting to direct link: ${directLink}`);

                        // Set src directly on video element
                        video.src = directLink;

                        // Remove inner source tags to avoid conflicts
                        if (sourceTag) {
                            sourceTag.remove();
                        }

                        // Reload and play
                        video.load();
                        const playPromise = video.play();

                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                                console.log('Video playing successfully');
                            })
                                .catch(error => {
                                    console.error('Video playback failed:', error);
                                });
                        }
                    }
                }
            }
        });
    }

    // Run the fixer
    fixGoogleDriveVideoLinks();

    // --- Scroll Animation Observer ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));
});
