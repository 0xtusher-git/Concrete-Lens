// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Tab Switching (Section 4)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Update buttons
        tabButtons.forEach(b => {
            b.classList.remove('active', 'border-brand-yellow', 'bg-white');
            b.classList.add('border-transparent');
        });
        btn.classList.add('active', 'border-brand-yellow', 'bg-white');
        btn.classList.remove('border-transparent');
        
        // Update content
        tabContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.remove('hidden');
                content.classList.add('block');
            } else {
                content.classList.remove('block');
                content.classList.add('hidden');
            }
        });
    });
});

// IntersectionObserver for Navigation Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-brand-black/95', 'backdrop-blur-sm');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-brand-black/95', 'backdrop-blur-sm');
    }
});
