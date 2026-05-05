// Initialize Lucide Icons
lucide.createIcons();

// Announcement Banner Logic
const banner = document.getElementById('announcement-banner');
const dismissBtn = document.getElementById('dismiss-banner');
const nav = document.getElementById('navbar');

if (localStorage.getItem('bannerDismissed') === 'true') {
    banner.classList.add('banner-hidden');
    nav.style.top = '0';
    nav.classList.remove('navbar-with-banner');
}

dismissBtn.addEventListener('click', () => {
    banner.classList.add('banner-hidden');
    nav.style.top = '0';
    nav.classList.remove('navbar-with-banner');
    localStorage.setItem('bannerDismissed', 'true');
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Speech Synthesis Implementation
const btnListenAll = document.getElementById('btn-listen-all');
const btnStopSpeech = document.getElementById('btn-stop-speech');
const speechStatus = document.getElementById('speech-status');
const currentTopicName = document.getElementById('current-topic-name');
const readSectionButtons = document.querySelectorAll('.read-section-btn');
const topicSections = document.querySelectorAll('.topic-section');

let isReadingFullGuide = false;

function updateStatus(text, show = true) {
    if (show) {
        speechStatus.classList.remove('opacity-0');
        currentTopicName.textContent = text;
    } else {
        speechStatus.classList.add('opacity-0');
    }
}

function stopAllSpeech() {
    window.speechSynthesis.cancel();
    isReadingFullGuide = false;
    btnListenAll.classList.remove('pulse-active');
    btnListenAll.querySelector('span').textContent = "Listen to full guide";
    btnStopSpeech.classList.add('hidden');
    updateStatus("", false);
    
    // Reset all section buttons
    readSectionButtons.forEach(btn => {
        btn.classList.remove('bg-brand-yellow', 'text-brand-black');
        btn.querySelector('span').textContent = "Read this";
        const icon = btn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'volume-2');
        }
    });
    lucide.createIcons();
}

function readText(text, title, onEndCallback = null, btn = null) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
        updateStatus(title);
        if (btn) {
            btn.classList.add('bg-brand-yellow', 'text-brand-black');
            btn.querySelector('span').textContent = "Pause";
            const icon = btn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'pause');
            lucide.createIcons();
        }
    };

    utterance.onend = () => {
        if (btn) {
            btn.classList.remove('bg-brand-yellow', 'text-brand-black');
            btn.querySelector('span').textContent = "Read this";
            const icon = btn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'volume-2');
            lucide.createIcons();
        }
        if (onEndCallback) {
            onEndCallback();
        } else if (!isReadingFullGuide) {
            updateStatus("", false);
        }
    };

    window.speechSynthesis.speak(utterance);
}

// Individual Section Buttons
readSectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const topicId = btn.getAttribute('data-topic');
        const section = document.getElementById(`topic-${topicId}`);
        const title = section.querySelector('h2').textContent;
        const text = section.querySelector('.topic-text').textContent;
        
        if (btn.classList.contains('bg-brand-yellow')) {
            stopAllSpeech();
        } else {
            stopAllSpeech();
            readText(text, title, null, btn);
            btnStopSpeech.classList.remove('hidden');
        }
    });
});

// Full Guide Narration
btnListenAll.addEventListener('click', () => {
    if (isReadingFullGuide) {
        stopAllSpeech();
        return;
    }

    stopAllSpeech();
    isReadingFullGuide = true;
    btnListenAll.classList.add('pulse-active');
    btnListenAll.querySelector('span').textContent = "Pause Guide";
    btnStopSpeech.classList.remove('hidden');

    const sectionsData = Array.from(topicSections).map(section => ({
        title: section.querySelector('h2').textContent,
        text: section.querySelector('.topic-text').textContent,
        id: section.id
    }));

    let currentSectionIndex = 0;

    function readNext() {
        if (!isReadingFullGuide || currentSectionIndex >= sectionsData.length) {
            stopAllSpeech();
            return;
        }

        const data = sectionsData[currentSectionIndex];
        const btn = document.querySelector(`.read-section-btn[data-topic="${currentSectionIndex + 1}"]`);
        
        // Scroll to section
        document.getElementById(data.id).scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        readText(data.text, data.title, () => {
            currentSectionIndex++;
            readNext();
        }, btn);
    }

    readNext();
});

btnStopSpeech.addEventListener('click', stopAllSpeech);

// Pill Navigation
const pillButtons = document.querySelectorAll('.pill-btn');
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            pillButtons.forEach(btn => {
                btn.classList.remove('pill-active');
                if (btn.getAttribute('data-target') === id) {
                    btn.classList.add('pill-active');
                    // Ensure pill is visible in scroll
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
topicSections.forEach(section => observer.observe(section));

pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        const navHeight = document.querySelector('.sticky').offsetHeight + 64;
        
        window.scrollTo({
            top: targetElement.offsetTop - navHeight,
            behavior: 'smooth'
        });
    });
});

// Navbar Scroll Effect (same as index)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-brand-black/95', 'backdrop-blur-sm');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-brand-black/95', 'backdrop-blur-sm');
    }
});
