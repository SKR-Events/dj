/* ================================================================
   LUMIÈRE D'OR — JavaScript principal
   ================================================================
   1. EmailJS configuration
   2. Scroll reveals — IntersectionObserver
   3. Navbar — scroll + floating pill state
   4. Mobile overlay menu
   5. Hero image load animation
   6. Parallax hero
   7. Carousel avis
   8. Galerie / Lightbox
   9. Formulaire de réservation + EmailJS
  10. Bouton « Retour en haut »
  11. Date minimale — empêcher dates passées
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. EMAILJS — Remplissez vos clés avant de mettre en ligne
---------------------------------------------------------------- */
const EMAILJS_CONFIG = {
    publicKey:  'VOTRE_PUBLIC_KEY',
    serviceId:  'VOTRE_SERVICE_ID',
    templateId: 'VOTRE_TEMPLATE_ID',
};

/* ----------------------------------------------------------------
   Bootstrap
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    initReveal();
    initNavbar();
    initMobileMenu();
    initHeroImage();
    initParallax();
    initCarousel();
    initLightbox();
    initReservationForm();
    initBackToTop();
    setDateMin();
});

/* ----------------------------------------------------------------
   1b. EmailJS init
---------------------------------------------------------------- */
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'VOTRE_PUBLIC_KEY') {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
}

/* ----------------------------------------------------------------
   2. SCROLL REVEALS — IntersectionObserver pour [data-reveal]
---------------------------------------------------------------- */
function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = el.dataset.revealDelay ? parseInt(el.dataset.revealDelay) * 80 : 0;
            setTimeout(() => el.classList.add('revealed'), delay);
            io.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    els.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------------
   3. NAVBAR — floating pill, .scrolled state au scroll
---------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Smooth scroll sur les liens de navigation */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href   = link.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();

            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH;

            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        });
    });
}

/* ----------------------------------------------------------------
   4. MOBILE OVERLAY MENU
---------------------------------------------------------------- */
function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    hamburger.addEventListener('click', toggleMobileMenu);

    /* Fermer en appuyant sur Escape */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    /* Fermer en cliquant en dehors de l'overlay */
    document.addEventListener('click', (e) => {
        if (
            navOverlay.classList.contains('is-open') &&
            !hamburger.contains(e.target) &&
            !navOverlay.contains(e.target)
        ) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    const isOpen = !navOverlay.classList.contains('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    navOverlay.classList.toggle('is-open', isOpen);
    navOverlay.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-open');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/* ----------------------------------------------------------------
   5. HERO IMAGE — ajoute .loaded après chargement pour animation scale
---------------------------------------------------------------- */
function initHeroImage() {
    const img = document.getElementById('hero-img');
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
        img.closest('.hero-visual')?.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.closest('.hero-visual')?.classList.add('loaded');
        });
    }
}

/* ----------------------------------------------------------------
   6. PARALLAX HERO — translation subtile au scroll
---------------------------------------------------------------- */
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroVisual.style.transform = `scale(1.08) translateY(${scrollY * 0.15}px)`;
        }
    }, { passive: true });
}

/* ----------------------------------------------------------------
   7. CAROUSEL AVIS
---------------------------------------------------------------- */
function initCarousel() {
    const track      = document.getElementById('carousel-track');
    const dotsWrap   = document.getElementById('carousel-dots');
    const btnPrev    = document.getElementById('carousel-prev');
    const btnNext    = document.getElementById('carousel-next');
    const viewport   = document.getElementById('carousel-viewport');

    if (!track || !dotsWrap || !btnPrev || !btnNext) return;

    const cards  = track.querySelectorAll('.avis-card');
    const total  = cards.length;
    let current  = 0;
    let autoplay;

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' dot--active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Avis ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;

        dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('dot--active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });

        track.setAttribute('aria-label', `Avis ${current + 1} sur ${total}`);
    }

    btnPrev.addEventListener('click', () => { resetAutoplay(); goTo(current - 1); });
    btnNext.addEventListener('click', () => { resetAutoplay(); goTo(current + 1); });

    function startAutoplay() {
        autoplay = setInterval(() => goTo(current + 1), 5500);
    }

    function resetAutoplay() {
        clearInterval(autoplay);
        startAutoplay();
    }

    startAutoplay();

    if (viewport) {
        viewport.addEventListener('mouseenter', () => clearInterval(autoplay));
        viewport.addEventListener('mouseleave', startAutoplay);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
            resetAutoplay();
            goTo(current + (delta > 0 ? 1 : -1));
        }
    }, { passive: true });

    if (viewport) {
        viewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  { resetAutoplay(); goTo(current - 1); }
            if (e.key === 'ArrowRight') { resetAutoplay(); goTo(current + 1); }
        });
    }
}

/* ----------------------------------------------------------------
   8. LIGHTBOX GALERIE
---------------------------------------------------------------- */
function initLightbox() {
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    const lbClose   = document.getElementById('lightbox-close');
    const lbPrev    = document.getElementById('lightbox-prev');
    const lbNext    = document.getElementById('lightbox-next');
    const backdrop  = document.getElementById('lightbox-backdrop');

    if (!lightbox || !lbImg) return;

    const items  = document.querySelectorAll('.galerie-item');
    const images = Array.from(items).map((item) => {
        const img = item.querySelector('img');
        const cap = item.querySelector('.galerie-label');
        return {
            src:     img ? img.src.replace(/w=\d+/, 'w=1200') : '',
            alt:     img ? img.alt : '',
            caption: cap ? cap.textContent : '',
        };
    });

    let current = 0;

    function openAt(index) {
        current = (index + images.length) % images.length;
        const { src, alt, caption } = images[current];
        lbImg.src = src;
        lbImg.alt = alt;
        if (lbCaption) lbCaption.textContent = caption;
        lightbox.classList.add('lightbox--active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function prev() { openAt(current - 1); }
    function next() { openAt(current + 1); }

    items.forEach((item, i) => {
        item.addEventListener('click', () => openAt(i));
    });

    if (lbClose)   lbClose.addEventListener('click', closeLightbox);
    if (backdrop)  backdrop.addEventListener('click', closeLightbox);
    if (lbPrev)    lbPrev.addEventListener('click', prev);
    if (lbNext)    lbNext.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox--active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    let touchX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const delta = touchX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
            delta > 0 ? next() : prev();
        }
    }, { passive: true });
}

/* ----------------------------------------------------------------
   9. FORMULAIRE DE RÉSERVATION + EMAILJS
---------------------------------------------------------------- */
function initReservationForm() {
    const form      = document.getElementById('reservation-form');
    const submitBtn = document.getElementById('submit-btn');
    const msgOk     = document.getElementById('form-success');
    const msgErr    = document.getElementById('form-error');
    const nameSpan  = document.getElementById('success-name');

    if (!form) return;

    form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('blur',  () => validateField(field));
        field.addEventListener('input', () => clearError(field));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(form)) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        if (msgOk)  msgOk.hidden  = true;
        if (msgErr) msgErr.hidden = true;

        const data = collectFormData(form);

        try {
            await sendEmail(data);
            if (nameSpan) nameSpan.textContent = data.prenom;
            if (msgOk)  msgOk.hidden  = false;
            form.reset();
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            console.error('[EmailJS] Erreur :', err);
            if (msgErr) msgErr.hidden = false;
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function collectFormData(form) {
    const fd = new FormData(form);
    return {
        prenom:     fd.get('prenom')?.trim()    || '',
        nom:        fd.get('nom')?.trim()       || '',
        email:      fd.get('email')?.trim()     || '',
        telephone:  fd.get('telephone')?.trim() || '',
        prestation: fd.get('prestation')        || '',
        date:       formatDate(fd.get('date'))  || '',
        creneau:    fd.get('creneau')           || '',
        message:    fd.get('message')?.trim()   || 'Aucun message',
    };
}

function formatDate(raw) {
    if (!raw) return '';
    const [y, m, d] = raw.split('-');
    return `${d}/${m}/${y}`;
}

async function sendEmail(data) {
    if (
        typeof emailjs !== 'undefined' &&
        EMAILJS_CONFIG.publicKey  !== 'VOTRE_PUBLIC_KEY' &&
        EMAILJS_CONFIG.serviceId  !== 'VOTRE_SERVICE_ID' &&
        EMAILJS_CONFIG.templateId !== 'VOTRE_TEMPLATE_ID'
    ) {
        return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            prenom:     data.prenom,
            nom:        data.nom,
            email:      data.email,
            telephone:  data.telephone,
            prestation: data.prestation,
            date:       data.date,
            creneau:    data.creneau,
            message:    data.message,
        });
    }

    /* Mode démo — simuler un envoi réussi */
    return new Promise((resolve) => setTimeout(resolve, 1200));
}

function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
        if (!validateField(field)) valid = false;
    });
    return valid;
}

function validateField(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (!field.required) return true;

    let msg = '';

    if (field.type === 'checkbox') {
        if (!field.checked) msg = 'Veuillez accepter les conditions.';
    } else if (!field.value.trim()) {
        msg = 'Ce champ est obligatoire.';
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        msg = 'Adresse email invalide.';
    } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        msg = 'Numéro de téléphone invalide.';
    }

    field.classList.toggle('error', !!msg);
    if (error) error.textContent = msg;
    return !msg;
}

function clearError(field) {
    const error = field.parentElement.querySelector('.field-error');
    field.classList.remove('error');
    if (error) error.textContent = '';
}

function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v) {
    return /^[\d\s\+\-\(\)\.]{6,20}$/.test(v.trim());
}

/* ----------------------------------------------------------------
  10. BOUTON RETOUR EN HAUT
---------------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ----------------------------------------------------------------
  11. DATE MINIMALE — interdire les dates passées
---------------------------------------------------------------- */
function setDateMin() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    const today = new Date();
    today.setDate(today.getDate() + 1);

    const yyyy = today.getFullYear();
    const mm   = String(today.getMonth() + 1).padStart(2, '0');
    const dd   = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${yyyy}-${mm}-${dd}`;

    dateInput.addEventListener('input', () => {
        const selected = new Date(dateInput.value);
        const day      = selected.getUTCDay();
        if (day === 0 || day === 1) {
            const err = dateInput.parentElement.querySelector('.field-error');
            if (err) err.textContent = "L'institut est fermé le dimanche et le lundi.";
            dateInput.classList.add('error');
            dateInput.value = '';
        }
    });
}
