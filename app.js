// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';
let typingTimer;
let countersAnimated = false;
let skillsAnimated = false;

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const progressFill = document.getElementById('progress-fill');
const loadingPercentage = document.getElementById('loading-percentage');
const mainContent = document.getElementById('main-content');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const scrollTopBtn = document.getElementById('scroll-top');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Start loading animation
    startLoading();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

// Loading screen functionality
function startLoading() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(finishLoading, 500);
        }
        
        progressFill.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
    }, 150);
}

function finishLoading() {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        startTypingAnimation();
        initializeParallax();
    }, 500);
}

// Theme functionality - Fixed implementation
function setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.body.setAttribute('data-color-scheme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    
    console.log('Theme set to:', theme); // Debug log
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', currentTheme, 'to', newTheme); // Debug log
    setTheme(newTheme);
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Typing animation
function startTypingAnimation() {
    const phrases = [
        'Frontend Developer',
        'UI/UX Design',
        'Problem Solving'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        typingTimer = setTimeout(type, typingSpeed);
    }

    type();
}

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });

    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Counter animation
function animateCounters() {
    if (countersAnimated) return;
    
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    countersAnimated = true;
}

// Skills animation
function animateSkills() {
    if (skillsAnimated) return;
    
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, index * 200);
    });
    
    skillsAnimated = true;
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger specific animations based on section
                if (entry.target.closest('#about')) {
                    setTimeout(animateCounters, 500);
                }
                
                if (entry.target.closest('#skills')) {
                    setTimeout(animateSkills, 500);
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .card, .project-card, .timeline-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Parallax effect
function initializeParallax() {
    const particles = document.querySelectorAll('.particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.3;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Contact form handling - Fixed implementation
function handleContactForm() {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submitted'); // Debug log
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        console.log('Form data:', data); // Debug log
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await simulateFormSubmission(data);
            
            showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            
        } catch (error) {
            console.error('Form submission error:', error); // Debug log
            showFormStatus('❌ Failed to send message. Please try again or contact me directly via WhatsApp or email.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success most of the time for demo
            if (Math.random() > 0.1) {
                console.log('Form submission successful'); // Debug log
                resolve();
            } else {
                console.log('Form submission failed (simulated)'); // Debug log
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function showFormStatus(message, type) {
    console.log('Showing form status:', message, type); // Debug log
    
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Scroll status into view
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 8000); // Show for 8 seconds
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Download CV functionality
function downloadCV() {
    // Create a comprehensive resume content
    const resumeContent = `
ALAGARSAMY D
    `.trim();

    const blob = new Blob([resumeContent], { type: 'pdf/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RESUME.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    
    // Show feedback
    showFormStatus('📄 Resume downloaded successfully!', 'success');
}

// Form validation
function validateForm() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }

    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-4)';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// WhatsApp functionality - Fixed implementation
function initializeWhatsApp() {
    // Make sure WhatsApp button is visible
    if (whatsappBtn) {
        whatsappBtn.style.display = 'flex';
        
        // Set up WhatsApp link with pre-filled message
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent(
                'Hi 👋! I found your portfolio website💻 and I\'m interested in your frontend development services🔥. ' +
                'I would like to discuss a potential project with you😎.'
            );
            const whatsappURL = `https://wa.me/918610852614?text=${message}`;
            window.open(whatsappURL, '_blank');
            
            console.log('WhatsApp button clicked'); // Debug log
        });
        
        // Add tooltip on hover
        whatsappBtn.title = 'Chat with me on WhatsApp';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Theme toggle - Fixed event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Theme toggle clicked'); // Debug log
            toggleTheme();
        });
    }
    
    // Mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation
    initializeNavigation();
    
    // Contact form
    if (contactForm) {
        handleContactForm();
        validateForm();
    }
    
    // Download CV
    const downloadBtn = document.querySelector('.download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadCV();
        });
    }
    
    // Scroll to top
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
    
    // WhatsApp functionality
    initializeWhatsApp();
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Social links tracking (for analytics if needed)
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function() {
            console.log('Social link clicked:', this.href);
        });
    });
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
window.addEventListener('resize', debounce(function() {
    // Handle resize events if needed
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Accessibility improvements
function initializeAccessibility() {
    // Add keyboard navigation for custom elements
    document.querySelectorAll('.btn, .social-link, .project-link').forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Announce theme changes to screen readers
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            setTimeout(() => {
                const announcement = currentTheme === 'dark' ? 'Dark mode activated' : 'Light mode activated';
                announceToScreenReader(announcement);
            }, 100);
        });
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    // Clear timers
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
});

// Export functions for potential module usage
window.portfolioApp = {
    setTheme,
    toggleTheme,
    scrollToTop,
    downloadCV
};