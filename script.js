/* ═══════════════════════════════════════════════════════════
   MEGA EXPORTS — script.js
   Handles: Navbar, Mobile menu, Hero slider,
            Scroll reveal, Active nav, Quote form,
            Smooth scroll
═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroSlider();
  initScrollReveal();
  initActiveNav();
  initQuoteForm();
  initSmoothScroll();
});

/* ─────────────────────────────────────────────
   1. NAVBAR — scroll shadow
───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────
   2. MOBILE MENU — hamburger toggle
───────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const open  = () => {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const toggle = () => menu.classList.contains('open') ? close() : open();

  btn.addEventListener('click', toggle);

  // Close on any link click inside the menu
  menu.querySelectorAll('.mob-link, .mob-cta').forEach(el => {
    el.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !btn.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
}

/* ─────────────────────────────────────────────
   3. HERO SLIDER — auto-advance + dot nav
───────────────────────────────────────────── */
function initHeroSlider() {
  const sliderEl = document.getElementById('heroSlider');
  if (!sliderEl) return;

  const slides  = sliderEl.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.slide-dots .dot');
  const DELAY   = 4500;
  let   current = 0;
  let   timer   = null;
  let   paused  = false;

  if (!slides.length) return;

  const goTo = idx => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => { if (!paused) goTo(current + 1); };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  };

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Pause on hover
  const panel = sliderEl.closest('.hero-visual');
  if (panel) {
    panel.addEventListener('mouseenter', () => { paused = true; });
    panel.addEventListener('mouseleave', () => { paused = false; });
  }

  // Keyboard nav when slider panel is focused
  sliderEl.setAttribute('tabindex', '0');
  sliderEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startTimer(); }
  });

  startTimer();
}

/* ─────────────────────────────────────────────
   4. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Respect user's motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   5. ACTIVE NAV LINKS — highlight on scroll
───────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const update = () => {
    const mid = window.scrollY + window.innerHeight * 0.45;
    let activeId = null;

    sections.forEach(sec => {
      if (sec.offsetTop <= mid) activeId = sec.id;
    });

    links.forEach(a => {
      const isActive = a.getAttribute('href') === `#${activeId}`;
      a.style.color = isActive ? 'var(--g2)' : '';
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────
   6. QUOTE FORM — validation + mailto submit
───────────────────────────────────────────── */
function initQuoteForm() {
  const form    = document.getElementById('quoteForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const d = new FormData(form);
    const get = key => (d.get(key) || '').toString().trim();

    const subject = encodeURIComponent(
      `Handicraft Export Enquiry from ${get('buyerName')} – ${get('product')}`
    );
    const body = encodeURIComponent(
      `Hello MEGA EXPORTS,\n\n` +
      `I am interested in your handicraft export products.\n\n` +
      `─── ENQUIRY DETAILS ───\n` +
      `Name    : ${get('buyerName')}\n` +
      `Company : ${get('companyName') || '—'}\n` +
      `Email   : ${get('email')}\n` +
      `Phone   : ${get('phone') || '—'}\n` +
      `Country : ${get('country')}\n` +
      `Product : ${get('product')}\n\n` +
      `Message :\n${get('message')}\n\n` +
      `— Sent via MEGA EXPORTS Website`
    );

    window.location.href =
      `mailto:megaexports24@gmail.com?subject=${subject}&body=${body}`;

    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(() => {
      form.reset();
      if (success) success.hidden = true;
    }, 7000);
  });

  // Live clear errors
  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input',  () => clearErr(f));
    f.addEventListener('change', () => clearErr(f));
  });
}

function validateForm(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const val = f.value.trim();
    if (!val) {
      showErr(f, 'This field is required.');
      ok = false;
    } else if (f.type === 'email' && !validEmail(val)) {
      showErr(f, 'Please enter a valid email address.');
      ok = false;
    }
  });
  return ok;
}

function showErr(field, msg) {
  field.style.borderColor = '#e53e3e';
  field.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.14)';
  clearErr(field, true); // remove old, keep new
  const span = document.createElement('span');
  span.className   = 'field-error';
  span.textContent = msg;
  span.style.cssText = 'display:block;font-size:0.70rem;color:#e53e3e;margin-top:5px;';
  field.parentNode.appendChild(span);
  if (field === form.querySelector('[required]')) field.focus();
}

function clearErr(field, keepStyle = false) {
  if (!keepStyle) {
    field.style.borderColor = '';
    field.style.boxShadow   = '';
  }
  const e = field.parentNode.querySelector('.field-error');
  if (e) e.remove();
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ─────────────────────────────────────────────
   7. SMOOTH SCROLL — offset for fixed navbar
───────────────────────────────────────────── */
function initSmoothScroll() {
  const OFFSET = 82; // navbar height in px

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
