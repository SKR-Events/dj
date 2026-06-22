/* ================================================================
   LUMIÈRE D'OR — JavaScript principal
   Esthéticienne haut de gamme · Lille Nord 59
   ================================================================
   Sections :
     1. EmailJS — Configuration (à remplir par le propriétaire)
     2. Init AOS
     3. Navbar — scroll + transparence
     4. Menu hamburger mobile
     5. Parallax hero
     6. Carousel avis
     7. Galerie / Lightbox
     8. Formulaire de réservation + EmailJS
     9. Bouton « Retour en haut »
    10. Date minimale — empêcher dates passées
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. EMAILJS — Remplissez vos clés avant de mettre en ligne
---------------------------------------------------------------- */
const EMAILJS_CONFIG = {
    publicKey:  'VOTRE_PUBLIC_KEY',   // Tableau de bord EmailJS → Account → Public Key
    serviceId:  'VOTRE_SERVICE_ID',   // Services → votre service
    templateId: 'VOTRE_TEMPLATE_ID',  // Email Templates → votre template
};

/* ----------------------------------------------------------------
   2. AOS — Animate On Scroll
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 750,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            delay: 0,
        });
    }

    initEmailJS();
    initNavbar();
    initHamburger();
    initParallax();
    initCarousel();
    initLightbox();
    initReservationForm();
    initBackToTop();
    setDateMin();
});

/* ----------------------------------------------------------------
   2b. EmailJS init
---------------------------------------------------------------- */
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'VOTRE_PUBLIC_KEY') {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
}

/* ----------------------------------------------------------------
   4. NAVBAR — Opacité au scroll + lien actif
---------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Smooth scroll sur les liens de navigation */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH;

            window.scrollTo({ top, behavior: 'smooth' });

            /* Fermer le menu mobile si ouvert */
            closeMenu();
        });
    });
}

/* ----------------------------------------------------------------
   5. HAMBURGER — Menu mobile
---------------------------------------------------------------- */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', toggleMenu);

    /* Fermer en cliquant en dehors */
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    /* Fermer avec Escape */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    function toggleMenu() {
        const isOpen = hamburger.classList.toggle('hamburger--open');
        hamburger.setAttribute('aria-expanded', isOpen);
        navMenu.classList.toggle('nav-menu--open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
}

function closeMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.classList.remove('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('nav-menu--open');
    document.body.style.overflow = '';
}

/* ----------------------------------------------------------------
   6. PARALLAX HERO — Translation subtile au scroll
---------------------------------------------------------------- */
function initParallax() {
    const parallax = document.getElementById('hero-parallax');
    if (!parallax) return;

    /* Désactiver si préférence reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function onScroll() {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            parallax.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------------
   7. CAROUSEL AVIS — Glissement avec touch support
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

    /* Génération des dots */
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

        /* Announce pour lecteur d'écran */
        track.setAttribute('aria-label', `Avis ${current + 1} sur ${total}`);
    }

    btnPrev.addEventListener('click', () => { resetAutoplay(); goTo(current - 1); });
    btnNext.addEventListener('click', () => { resetAutoplay(); goTo(current + 1); });

    /* Autoplay */
    function startAutoplay() {
        autoplay = setInterval(() => goTo(current + 1), 5500);
    }

    function resetAutoplay() {
        clearInterval(autoplay);
        startAutoplay();
    }

    startAutoplay();

    /* Pause au survol */
    if (viewport) {
        viewport.addEventListener('mouseenter', () => clearInterval(autoplay));
        viewport.addEventListener('mouseleave', startAutoplay);
    }

    /* Swipe tactile */
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

    /* Navigation clavier */
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
    const lightbox   = document.getElementById('lightbox');
    const lbImg      = document.getElementById('lightbox-img');
    const lbCaption  = document.getElementById('lightbox-caption');
    const lbClose    = document.getElementById('lightbox-close');
    const lbPrev     = document.getElementById('lightbox-prev');
    const lbNext     = document.getElementById('lightbox-next');
    const backdrop   = document.getElementById('lightbox-backdrop');

    if (!lightbox || !lbImg) return;

    /* Collecter toutes les images de la galerie */
    const items = document.querySelectorAll('.galerie-item');
    const images = Array.from(items).map((item) => {
        const img = item.querySelector('img');
        const cap = item.querySelector('.galerie-label');
        return {
            src: img ? img.src.replace(/w=\d+/, 'w=1200') : '',
            alt: img ? img.alt : '',
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
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function prev() { openAt(current - 1); }
    function next() { openAt(current + 1); }

    /* Clic sur items de la galerie */
    items.forEach((item, i) => {
        item.addEventListener('click', () => openAt(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', prev);
    if (lbNext)  lbNext.addEventListener('click', next);

    /* Clavier */
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox--active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    /* Swipe tactile */
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

    /* Validation en temps réel */
    form.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearError(field));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(form)) return;

        /* État chargement */
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        if (msgOk)  msgOk.hidden  = true;
        if (msgErr) msgErr.hidden = true;

        const data = collectFormData(form);

        try {
            await sendEmail(data);

            /* Succès */
            if (nameSpan) nameSpan.textContent = data.prenom;
            if (msgOk)  msgOk.hidden  = false;
            form.reset();
            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            console.error('[EmailJS] Erreur envoi :', err);
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
    /* Si EmailJS est chargé et configuré */
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

    /* Mode démo : simule un envoi réussi (supprimer en production) */
    return new Promise((resolve) => setTimeout(resolve, 1200));
}

/* ---- Validation ---- */
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
   11. DATE MINIMALE — Interdire les dates passées dans le formulaire
---------------------------------------------------------------- */
function setDateMin() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    const today = new Date();
    /* +1 jour : impossible de réserver pour aujourd'hui même */
    today.setDate(today.getDate() + 1);

    const yyyy = today.getFullYear();
    const mm   = String(today.getMonth() + 1).padStart(2, '0');
    const dd   = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${yyyy}-${mm}-${dd}`;

    /* Bloquer dimanches et lundis (0 = dim, 1 = lun) */
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
