// DOM Elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const sections = document.querySelectorAll('.section');
const contactForm = document.getElementById('contact-form');
const whatsappFloat = document.getElementById('whatsapp-float');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileNavigation();
    setupScrollEffects();
    setupSmoothScrolling();
    setupContactForm();
    setupScrollReveal();
    setupFormEffects();
    setupWhatsAppIntegration();
    
    // Initial calls
    scrollReveal();
    scrollActive();
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Handle window resize for mobile menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show-menu');
        }
    });
}

// Header scroll effect and active navigation
function setupScrollEffects() {
    function scrollHeader() {
        if (window.scrollY >= 80) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }

    window.addEventListener('scroll', () => {
        scrollHeader();
        scrollActive();
        scrollReveal();
        handleWhatsAppFloatVisibility();
    });
}

// Active Navigation Link
function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const sectionLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current section link
            if (sectionLink) {
                sectionLink.classList.add('active');
            }
        }
    });
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetSection.offsetTop - headerHeight + 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('show-menu');
            }
        });
    });
}

// Scroll Reveal Animation
function setupScrollReveal() {
    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        window.addEventListener('scroll', scrollReveal);
    }
}

function scrollReveal() {
    const windowHeight = window.innerHeight;
    const elementTop = 150;

    sections.forEach(section => {
        const elementOffset = section.offsetTop;
        const distance = elementOffset - windowHeight + elementTop;

        if (window.pageYOffset >= distance) {
            section.classList.add('visible');
        }
    });
}

// WhatsApp Integration - Simplified to not interfere with links
function setupWhatsAppIntegration() {
    // Add pulse animation to floating button after delay
    setTimeout(() => {
        if (whatsappFloat) {
            whatsappFloat.style.animation = 'bounce 2s infinite';
        }
    }, 3000);
}

function handleWhatsAppFloatVisibility() {
    if (!whatsappFloat) return;
    
    // Hide WhatsApp float when at the very top of the page
    if (window.scrollY < 100) {
        whatsappFloat.style.opacity = '0.7';
        whatsappFloat.style.transform = 'scale(0.9)';
    } else {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.transform = 'scale(1)';
    }
}

// Contact Form Handling with WhatsApp integration
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form elements
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const serviceSelect = document.getElementById('service');
        const messageInput = document.getElementById('message');
        
        // Get values
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const service = serviceSelect.value;
        const message = messageInput.value.trim();
        
        // Clear previous error styles
        clearFormErrors();
        
        // Validation
        const errors = validateForm(name, phone, service);
        
        if (errors.length > 0) {
            showFormErrors(errors);
            highlightErrorFields(nameInput, phoneInput, serviceSelect, name, phone, service);
            return;
        }
        
        // Success
        showNotification('Thank you for your message! We will contact you soon.', 'success');
        
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(name, phone, service, message);
        
        // Show WhatsApp option with better UX
        setTimeout(() => {
            showWhatsAppOption(whatsappMessage);
        }, 1500);
        
        // Reset form
        contactForm.reset();
        clearFormErrors();
    });
}

function validateForm(name, phone, service) {
    const errors = [];
    
    if (!name || name.length < 2) {
        errors.push('Please enter your full name (at least 2 characters)');
    }
    
    if (!phone) {
        errors.push('Phone number is required');
    } else if (!isValidPhone(phone)) {
        errors.push('Please enter a valid phone number (10-15 digits)');
    }
    
    if (!service) {
        errors.push('Please select a service from the dropdown');
    }
    
    return errors;
}

function highlightErrorFields(nameInput, phoneInput, serviceSelect, name, phone, service) {
    if (!name || name.length < 2) {
        nameInput.classList.add('error');
    }
    if (!phone || !isValidPhone(phone)) {
        phoneInput.classList.add('error');
    }
    if (!service) {
        serviceSelect.classList.add('error');
    }
}

function clearFormErrors() {
    const errorFields = contactForm.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    const existingErrorMsg = document.querySelector('.form-error-message');
    if (existingErrorMsg) {
        existingErrorMsg.remove();
    }
}

function showFormErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.innerHTML = `
        <h4>Please fix the following errors:</h4>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Phone validation function
function isValidPhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's between 10-15 digits
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// Create WhatsApp message
function createWhatsAppMessage(name, phone, service, message) {
    const ownerPhone = '919890155321'; // Purnachandra Barik's number
    
    // Get service name from select option
    const serviceSelect = document.getElementById('service');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    
    const text = encodeURIComponent(
        `Hello Poonam Tailors! 👋\n\n` +
        `*Customer Details:*\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Service Required: ${serviceName}\n\n` +
        `*Message:* ${message || 'Looking forward to discussing my tailoring requirements.'}\n\n` +
        `I'm interested in your quality tailoring services. Please let me know about pricing and availability.`
    );
    return `https://wa.me/${ownerPhone}?text=${text}`;
}

// Enhanced WhatsApp option display
function showWhatsAppOption(whatsappUrl) {
    const modal = createWhatsAppModal(whatsappUrl);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            closeWhatsAppModal(modal);
        }
    }, 10000);
}

function createWhatsAppModal(whatsappUrl) {
    const modal = document.createElement('div');
    modal.className = 'whatsapp-modal';
    modal.innerHTML = `
        <div class="whatsapp-modal__overlay" onclick="closeWhatsAppModal(this.parentElement)"></div>
        <div class="whatsapp-modal__content">
            <div class="whatsapp-modal__header">
                <div class="whatsapp-modal__icon">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <h3>Send message via WhatsApp</h3>
                <button class="whatsapp-modal__close" onclick="closeWhatsAppModal(this.closest('.whatsapp-modal'))">×</button>
            </div>
            <div class="whatsapp-modal__body">
                <p>Your message is ready! Click below to send it directly to our owner <strong>Purnachandra Barik</strong> on WhatsApp for faster response.</p>
                <div class="whatsapp-modal__actions">
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp whatsapp-modal__btn" onclick="closeWhatsAppModal(this.closest('.whatsapp-modal'))">
                        <i class="fab fa-whatsapp"></i>
                        Send WhatsApp Message
                    </a>
                    <button class="btn btn--outline whatsapp-modal__cancel" onclick="closeWhatsAppModal(this.closest('.whatsapp-modal'))">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function closeWhatsAppModal(modal) {
    modal.classList.add('hide');
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 300);
}

// Form input effects
function setupFormEffects() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('error');
        });
        
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
        
        // Check if input has value on load
        if (input.value.trim()) {
            input.classList.add('filled');
        }
    });

    // Prevent form submission on Enter key for better UX
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
            if (e.target.form === contactForm) {
                e.preventDefault();
                const inputs = Array.from(contactForm.elements);
                const currentIndex = inputs.indexOf(e.target);
                const nextInput = inputs[currentIndex + 1];
                
                if (nextInput && nextInput.type !== 'submit') {
                    nextInput.focus();
                }
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <p class="notification__message">${message}</p>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles for notification if not present
    addNotificationStyles();
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function addNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
        }
        
        .notification--success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .notification--error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .notification__content {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 16px;
        }
        
        .notification__message {
            margin: 0;
            flex: 1;
            white-space: pre-line;
            line-height: 1.4;
        }
        
        .notification__close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin-left: 12px;
            opacity: 0.7;
        }
        
        .notification__close:hover {
            opacity: 1;
        }
        
        .form-error-message {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
        }
        
        .form-error-message h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
        }
        
        .form-error-message ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .form-error-message li {
            margin-bottom: 4px;
        }
        
        .form-control.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .whatsapp-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .whatsapp-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .whatsapp-modal.hide {
            opacity: 0;
            visibility: hidden;
        }
        
        .whatsapp-modal__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
        }
        
        .whatsapp-modal__content {
            position: relative;
            max-width: 500px;
            margin: 10% auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .whatsapp-modal.show .whatsapp-modal__content {
            transform: translateY(0);
        }
        
        .whatsapp-modal__header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 24px 24px 16px;
            border-bottom: 1px solid #eee;
        }
        
        .whatsapp-modal__icon {
            width: 40px;
            height: 40px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }
        
        .whatsapp-modal__header h3 {
            flex: 1;
            margin: 0;
            font-size: 1.3rem;
            color: #333;
        }
        
        .whatsapp-modal__close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            opacity: 0.7;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .whatsapp-modal__close:hover {
            opacity: 1;
            background-color: #f5f5f5;
        }
        
        .whatsapp-modal__body {
            padding: 24px;
        }
        
        .whatsapp-modal__body p {
            margin: 0 0 20px 0;
            line-height: 1.6;
            color: #666;
        }
        
        .whatsapp-modal__actions {
            display: flex;
            gap: 12px;
            flex-direction: column;
        }
        
        .whatsapp-modal__btn {
            justify-content: center;
        }
        
        .whatsapp-modal__cancel {
            background-color: transparent;
            color: #666;
            border: 1px solid #ddd;
        }
        
        .whatsapp-modal__cancel:hover {
            background-color: #f8f9fa;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media screen and (max-width: 480px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }
            
            .whatsapp-modal__content {
                margin: 5% 16px;
            }
            
            .whatsapp-modal__header,
            .whatsapp-modal__body {
                padding: 16px;
            }
            
            .whatsapp-modal__actions {
                gap: 8px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}

// Make functions globally accessible for onclick handlers
window.closeWhatsAppModal = closeWhatsAppModal;