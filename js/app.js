/* ============================================
   INDUMEC — App.js
   Canvas-in-Hero Architecture
   Frame-by-frame scroll animation
   + Post-scroll section animations
   + Form submission via EmailJS
   ============================================ */

(function () {
  'use strict';

  // --- Config ---
  const WA_NUMBER = '573057670817';

  // Device & canvas config (leídos desde INDUMEC_CONFIG en init)
  let canvasConfig   = null;
  let FRAME_COUNT    = 60;             // frames virtuales a usar
  let FRAME_STEP     = 1;             // salto en archivos reales (1=todos, 2=alternos)
  let FRAME_PATH     = 'frames/frame_';
  let FRAME_EXT      = '.webp';
  let BATCH_SIZE     = 18;
  let MAX_DPR        = 2;
  let SCROLL_MULT    = 1;             // multiplicador de velocidad de animacion

  // --- State ---
  const frames = [];
  let currentFrame = 0;
  let targetFrame = 0;
  let loadedCount = 0;
  let isReady = false;
  let activeSectionIndex = -1;
  let resizeTimeout = null;

  // --- DOM ---
  const heroWrapper = document.getElementById('hero-wrapper');
  const hero = document.getElementById('hero');
  const canvasWrap = document.getElementById('canvas-wrap');
  const canvas = document.getElementById('product-canvas');
  const ctx = canvas.getContext('2d');
  const darkOverlay = document.getElementById('dark-overlay');
  const marqueeWrap = document.getElementById('marquee-wrap');
  const marqueeText = document.getElementById('marquee-text');
  const scrollContainer = document.getElementById('scroll-container');
  const scrollHint = document.getElementById('scroll-hint');
  const sections = document.querySelectorAll('.scroll-section');

  // --- Canvas Setup ---
  function resizeCanvas() {
    // Limitar DPR para evitar canvas gigantes en pantallas retina/4K
    const rawDpr = window.devicePixelRatio || 1;
    const dpr = Math.min(rawDpr, MAX_DPR);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (frames[currentFrame]) drawFrame(currentFrame);
  }

  // Debounced resize para evitar reflow excesivo
  function debouncedResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  }

  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let drawW, drawH;
    if (imgRatio > canvasRatio) {
      drawH = ch;
      drawW = drawH * imgRatio;
    } else {
      drawW = cw;
      drawH = drawW / imgRatio;
    }
    const x = (cw - drawW) / 2;
    const y = (ch - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  // --- Frame Preloading ---
  function padNumber(n) { return String(n).padStart(4, '0'); }

  /**
   * loadFrame(virtualIndex)
   * En desktop/tablet: carga frame_000N donde N = virtualIndex + 1
   * En móvil (FRAME_STEP=2): carga frame_000N donde N = virtualIndex*2 + 1
   *   → frame virtual 0 = frame real 0001
   *   → frame virtual 1 = frame real 0003
   *   → frame virtual 95 = frame real 0191
   * Así 96 frames cubren toda la animación con la mitad de requests
   */
  function loadFrame(virtualIndex) {
    return new Promise((resolve) => {
      const img       = new Image();
      const realIndex = virtualIndex * FRAME_STEP; // mapeo a archivo real
      img.onload  = () => { frames[virtualIndex] = img; loadedCount++; resolve(); };
      img.onerror = () => {                        loadedCount++; resolve(); };
      img.src = FRAME_PATH + padNumber(realIndex + 1) + FRAME_EXT;
    });
  }

  async function preloadFrames() {
    // 1. Initial frame for immediate visual continuity (unblocks main thread)
    await loadFrame(0);
    if (frames[0]) drawFrame(0);

    // 2. Initialize animations immediately to improve WPO
    isReady = true;
    initAnimations();

    // 3. Background preloading of remaining frames
    // Desktop: carga todos los frames (192)
    // Mobile: carga frames optimizados (40)
    for (let i = 1; i < FRAME_COUNT; i += BATCH_SIZE) {
      const batch = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, FRAME_COUNT); j++) {
        batch.push(loadFrame(j));
      }
      await Promise.all(batch);
    }
  }

  // --- Lenis ---
  function initLenis() {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // --- Section Data ---
  const sectionConfig = [];

  function buildSectionData() {
    sections.forEach((sec, i) => {
      sectionConfig.push({
        el: sec,
        enter: parseFloat(sec.dataset.enter),
        leave: parseFloat(sec.dataset.leave),
        anim: sec.dataset.animation,
        hasOverlay: sec.dataset.overlay === 'true',
        persist: sec.dataset.persist === 'true',
        children: sec.querySelectorAll('.section-label, .section-title, .section-text, .step, .industry-tag, .stat-number, .stat-label, .stats-grid > div, .btn, .client-carousel'),
      });
      // FORCE all sections invisible at start
      sec.style.opacity = '0';
      sec.style.visibility = 'hidden';
      sec.style.pointerEvents = 'none';
    });
  }

  // --- Show/Hide Sections (HARD, no race conditions) ---
  function showSection(index) {
    if (index === activeSectionIndex) return;

    // HIDE all sections immediately
    sectionConfig.forEach((data, i) => {
      if (i !== index) {
        gsap.killTweensOf(data.el);
        data.el.style.opacity = '0';
        data.el.style.visibility = 'hidden';
        data.el.style.pointerEvents = 'none';
        data.el.classList.remove('active');
        if (data.hasOverlay) {
          gsap.killTweensOf(darkOverlay);
          darkOverlay.style.opacity = '0';
        }
      }
    });

    // SHOW the target section
    const data = sectionConfig[index];
    data.el.style.visibility = 'visible';
    data.el.style.pointerEvents = 'auto';
    data.el.classList.add('active');

    // Animate in
    const initial = getInitialState(data.anim);
    const animated = getAnimatedState(data.anim);

    if (data.anim === 'stagger-up') {
      gsap.set(data.children, initial);
      gsap.to(data.children, { ...animated, duration: 0.8, ease: 'power3.out', stagger: 0.08 });
      gsap.fromTo(data.el, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    } else {
      gsap.fromTo(data.el, { ...initial, opacity: 0 }, { ...animated, opacity: 1, duration: 0.8, ease: 'power3.out' });
    }

    if (data.hasOverlay) {
      darkOverlay.style.opacity = '1';
    }

    activeSectionIndex = index;
  }

  function hideAllSections() {
    sectionConfig.forEach((data) => {
      data.el.style.opacity = '0';
      data.el.style.visibility = 'hidden';
      data.el.style.pointerEvents = 'none';
      data.el.classList.remove('active');
    });
    darkOverlay.style.opacity = '0';
    activeSectionIndex = -1;
  }

  // --- Animations ---
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    buildSectionData();

    // Hero text reveal
    gsap.set(['.hero-label', '.hero-title', '.hero-subtitle', '.hero-cta-row', '#hero-trust'], { y: 30, opacity: 0 });
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('#hero-trust', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

    // Hero fade on scroll
    ScrollTrigger.create({
      trigger: heroWrapper,
      start: 'top top',
      end: '30% top',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        hero.style.opacity = String(Math.max(0, 1 - p * 1.5));
        if (scrollHint) scrollHint.style.opacity = String(Math.max(0, 1 - p * 3));
      }
    });

    // Frame sync — sincronizado con scroll-container
    // Con SCROLL_MULT=2: la animación completa en la mitad del scroll disponible
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        // frameProgress llega a 1.0 antes del final de página gracias a SCROLL_MULT
        const frameProgress = Math.min(1, (self.progress * SCROLL_MULT) / 0.85);
        targetFrame = Math.min(FRAME_COUNT - 1, Math.floor(frameProgress * (FRAME_COUNT - 1)));
      }
    });

    // Canvas hide when scroll-container ends
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'bottom 80%',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        canvasWrap.style.opacity = String(1 - self.progress);
      }
    });

    // --- MASTER SECTION CONTROLLER ---
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        const p = self.progress;

        // Find which section should be active
        let targetIndex = -1;
        for (let i = 0; i < sectionConfig.length; i++) {
          const cfg = sectionConfig[i];
          const inRange = p >= cfg.enter && p <= cfg.leave;
          const isPersistent = cfg.persist && p >= cfg.enter;
          if (inRange || isPersistent) {
            targetIndex = i;
          }
        }

        if (targetIndex !== activeSectionIndex) {
          if (targetIndex === -1) {
            hideAllSections();
          } else {
            showSection(targetIndex);
          }
        }
      }
    });

    // Marquee
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        marqueeWrap.style.opacity = (p > 0.15 && p < 0.85) ? '1' : '0';
        gsap.set(marqueeText, { x: -p * 2000 });
      }
    });

    // --- POST-SCROLL REVEAL ANIMATIONS ---
    initPostScrollAnimations();

    // --- POST-SCROLL COUNTERS ---
    initPostScrollCounters();
  }

  // --- Post-Scroll Section Reveal Animations ---
  function initPostScrollAnimations() {
    // Animate elements as they scroll into view
    const revealSections = document.querySelectorAll('.section-soluciones, .section-porque, .section-industrias, .section-recursos, .section-final-cta');

    revealSections.forEach((section) => {
      const elements = section.querySelectorAll('.pill-badge, .post-title, .post-subtitle, .porque-title, .porque-subtitle, .solution-card, .porque-card, .industria-card, .recurso-card, .porque-stat, .cta-content, .cta-form-wrap, .form-title, .form-subtitle');

      elements.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.04,
          }
        );
      });
    });
  }

  // --- Post-Scroll Counters (Section 6) ---
  function initPostScrollCounters() {
    const counters = document.querySelectorAll('.porque-stat-number[data-count]');
    if (!counters.length) return;

    let hasAnimated = false;
    ScrollTrigger.create({
      trigger: '.section-porque',
      start: 'top 70%',
      onEnter: () => {
        if (hasAnimated) return;
        hasAnimated = true;
        counters.forEach((el) => {
          const target = parseInt(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2.5, ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
            }
          });
        });
      }
    });
  }

  // --- Animation States ---
  function getInitialState(type) {
    const m = {
      'fade-up': { y: 50, opacity: 0 },
      'slide-left': { x: -80, opacity: 0 },
      'slide-right': { x: 80, opacity: 0 },
      'scale-up': { scale: 0.85, opacity: 0 },
      'rotate-in': { y: 40, rotation: 3, opacity: 0 },
      'stagger-up': { y: 60, opacity: 0 },
      'clip-reveal': { clipPath: 'inset(100% 0 0 0)', opacity: 0 }
    };
    return m[type] || { opacity: 0 };
  }

  function getAnimatedState(type) {
    const m = {
      'fade-up': { y: 0, opacity: 1 },
      'slide-left': { x: 0, opacity: 1 },
      'slide-right': { x: 0, opacity: 1 },
      'scale-up': { scale: 1, opacity: 1 },
      'rotate-in': { y: 0, rotation: 0, opacity: 1 },
      'stagger-up': { y: 0, opacity: 1 },
      'clip-reveal': { clipPath: 'inset(0% 0 0 0)', opacity: 1 }
    };
    return m[type] || { opacity: 1 };
  }

  // --- Contact Form Submission ---
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const nombre = formData.get('nombre');
      const empresa = formData.get('empresa') || 'No especificada';
      const telefono = formData.get('telefono');
      const email = formData.get('email') || 'No proporcionado';
      const mensaje = formData.get('mensaje') || 'Sin mensaje';

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      try {
        // Send via EmailJS
        if (typeof emailjs !== 'undefined' && typeof INDUMEC_CONFIG !== 'undefined' && INDUMEC_CONFIG.emailjs.enabled) {
          const cfg = INDUMEC_CONFIG.emailjs;
          emailjs.init(cfg.publicKey);
          await emailjs.send(cfg.serviceId, cfg.templateId, {
            to_email: INDUMEC_CONFIG.business.email,
            from_name: nombre,
            from_empresa: empresa,
            from_telefono: telefono,
            from_email: email,
            message: mensaje,
          });
        }

        // Fallback: open mailto
        const contactEmail = typeof INDUMEC_CONFIG !== 'undefined' ? INDUMEC_CONFIG.business.email : 'agency.adsbigger@gmail.com';
        const mailtoBody = `Nombre: ${nombre}%0AEmpresa: ${empresa}%0ATelefono: ${telefono}%0AEmail: ${email}%0AMensaje: ${mensaje}`;
        const mailtoLink = `mailto:${contactEmail}?subject=Solicitud%20Indumec%20-%20${encodeURIComponent(nombre)}&body=${mailtoBody}`;

        // Also send to WhatsApp as backup
        const waMsg = `Hola, soy ${nombre} de ${empresa}. ${mensaje}. Mi telefono: ${telefono}`;
        const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;

        submitBtn.textContent = '✓ Solicitud enviada';
        submitBtn.style.background = 'var(--green)';

        // Open both links
        window.open(waLink, '_blank');

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          form.reset();
        }, 4000);
      } catch (err) {
        // Fallback to mailto
        const mailtoBody = `Nombre: ${nombre}%0AEmpresa: ${empresa}%0ATelefono: ${telefono}%0AEmail: ${email}%0AMensaje: ${mensaje}`;
        window.location.href = `mailto:agency.adsbigger@gmail.com?subject=Solicitud%20Indumec%20-%20${encodeURIComponent(nombre)}&body=${mailtoBody}`;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('site-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Close on link click
    const links = nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  // --- Render Loop ---
  function renderLoop() {
    if (isReady) {
      currentFrame += (targetFrame - currentFrame) * 0.15;
      const idx = Math.round(currentFrame);
      if (frames[idx]) drawFrame(idx);
    }
    requestAnimationFrame(renderLoop);
  }

  // --- Init ---
  function init() {
    // Cargar configuracion segun dispositivo
    if (typeof window.INDUMEC_CONFIG !== 'undefined') {
      canvasConfig  = window.INDUMEC_CONFIG.getCanvasConfig();
      FRAME_COUNT   = canvasConfig.frameCount;
      FRAME_STEP    = canvasConfig.frameStep    || 1;
      SCROLL_MULT   = canvasConfig.scrollMultiplier || 1;
      FRAME_PATH    = canvasConfig.framePath;
      FRAME_EXT     = canvasConfig.frameExt;
      BATCH_SIZE    = canvasConfig.batchSize;
      MAX_DPR       = canvasConfig.maxDpr;

      // Ajustar altura del scroll-container dinamicamente segun velocidad
      // Desktop 2× → 350vh | Mobile 1× → 350vh (ya estaba corto en mobile)
      if (scrollContainer) {
        const bp = canvasConfig.breakpoint || 'desktop';
        if (bp === 'mobile') {
          scrollContainer.style.height = '350vh';
        } else {
          // 700vh base dividido entre el multiplicador de velocidad
          const vhBase = 700;
          scrollContainer.style.height = Math.round(vhBase / SCROLL_MULT) + 'vh';
        }
      }
    }

    resizeCanvas();
    window.addEventListener('resize', debouncedResize);
    initLenis();
    renderLoop();
    preloadFrames();
    initContactForm();
    initMobileMenu();

    // Mostrar sticky bar despues de 5 segundos
    setTimeout(() => {
      const stickyBar = document.getElementById('bottom-sticky-bar');
      if (stickyBar) stickyBar.classList.add('visible');
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
