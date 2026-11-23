/* United Pro Construction — Interactions */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header shadow on scroll ───────────────────────────── */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const toggleMenu = () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    mobileMenu.classList.toggle('is-open', !open);
    mobileMenu.setAttribute('aria-hidden', String(open));
    document.body.style.overflow = open ? '' : 'hidden';
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMenu();
  });

  /* ── Cert marquee: duplicate content for a seamless loop ── */
  const certTrack = document.getElementById('certTrack');
  if (certTrack) certTrack.innerHTML += certTrack.innerHTML;

  /* ── Reveal on scroll ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── FAQ accordion ─────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-toggle');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Reviews carousel ──────────────────────────────────── */
  const viewport = document.getElementById('reviewsViewport');
  const cards = viewport ? Array.from(viewport.querySelectorAll('.review-card')) : [];
  const dotsWrap = document.getElementById('reviewsDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  let reviewIndex = 0;
  let autoplayId = null;

  const showReview = (index) => {
    reviewIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === reviewIndex));
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.reviews-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === reviewIndex);
        dot.setAttribute('aria-selected', String(i === reviewIndex));
      });
    }
  };
  const stopAutoplay = () => { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } };
  const startAutoplay = () => {
    stopAutoplay();
    if (cards.length > 1) autoplayId = setInterval(() => showReview(reviewIndex + 1), 6000);
  };

  if (cards.length && dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Review ' + (i + 1));
      dot.addEventListener('click', () => { showReview(i); startAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    prevBtn.addEventListener('click', () => { showReview(reviewIndex - 1); startAutoplay(); });
    nextBtn.addEventListener('click', () => { showReview(reviewIndex + 1); startAutoplay(); });
    const carousel = viewport.closest('.reviews-carousel');
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    showReview(0);
    startAutoplay();
  }

  /* ── Lightbox gallery ──────────────────────────────────── */
  const workItems = Array.from(document.querySelectorAll('.work-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxIndex = 0;
  let lastFocused = null;

  const showPhoto = (index) => {
    lightboxIndex = (index + workItems.length) % workItems.length;
    const item = workItems[lightboxIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption || '';
  };
  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showPhoto(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  workItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showPhoto(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => showPhoto(lightboxIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(lightboxIndex + 1);
  });

  /* ── Service buttons → preselect project type in form ──── */
  const typeSelect = document.getElementById('fType');
  const formCard = document.getElementById('estimateForm');
  document.querySelectorAll('.service-link[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.service;
      if (typeSelect) {
        const match = Array.from(typeSelect.options).find((o) => o.value === service);
        if (match) typeSelect.value = match.value;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
      formCard.classList.add('form-flash');
      window.setTimeout(() => formCard.classList.remove('form-flash'), 1600);
    });
  });

  /* ── Estimate form → opens the user's mail client ──────── */
  const form = document.getElementById('estimateForm');
  const formError = document.getElementById('formError');
  const BUSINESS_EMAIL = 'info@unitedprocomstruction.com';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formError.hidden = true;

    const first = form.first_name.value.trim();
    const last = form.last_name.value.trim();
    const phone = form.phone.value.trim();
    const type = form.project_type.value;
    const email = form.email.value.trim();
    const address = form.address.value.trim();
    const message = form.message.value.trim();

    const missing = [];
    if (!first) missing.push('first name');
    if (!last) missing.push('last name');
    if (!phone) missing.push('phone');
    if (!type) missing.push('project type');
    if (missing.length) {
      formError.textContent = 'Please fill in: ' + missing.join(', ') + '.';
      formError.hidden = false;
      return;
    }

    const subject = encodeURIComponent('Free Estimate Request — ' + type + ' (' + first + ' ' + last + ')');
    const lines = [
      'Name: ' + first + ' ' + last,
      'Phone: ' + phone,
      'Email: ' + (email || '—'),
      'Project type: ' + type,
      'Property address: ' + (address || '—'),
      '',
      'Project details:',
      message || '—'
    ];
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = 'mailto:' + BUSINESS_EMAIL + '?subject=' + subject + '&body=' + body;
  });

  /* ── Scroll-spy for primary nav ─────────────────────────── */
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = ['services', 'why-us', 'work', 'reviews', 'faq']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => spy.observe(section));
  }

  /* ── Reveal fallback: ensure content appears even if IO never fires ── */
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
    }, 1200);
  });

  /* ── Footer year ────────────────────────────────────────── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
