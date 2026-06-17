/**
 * TAURO TV — MAIN JS
 * Scroll reveal, FAQ, Nav, Hamburger, Formularios de lead
 */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════
  // SLIDER DEL TV MOCKUP
  // ══════════════════════════════════════════════════════════
  // Lee las imágenes de CONFIG.slider.images
  // Si hay imágenes → crea slides con <img> y reemplaza el placeholder
  // Si no hay imágenes → muestra el placeholder con el logo
  // Autoplay cada CONFIG.slider.autoplaySpeed ms
  // Puntitos de navegación clickeables

  (function initTvSlider() {
    const sliderEl  = document.getElementById('tv-slider');
    const dotsEl    = document.getElementById('tv-dots');

    // Salir si no existen los elementos en el DOM
    if (!sliderEl || !dotsEl) return;

    const slides  = CONFIG.slider && CONFIG.slider.images ? CONFIG.slider.images : [];
    const speed   = CONFIG.slider && CONFIG.slider.autoplaySpeed ? CONFIG.slider.autoplaySpeed : 4000;
    const validSlides = slides.filter(s => s.src && s.src.trim() !== '');

    // Si no hay imágenes válidas, dejar el placeholder y no hacer nada más
    if (validSlides.length === 0) return;

    // Hay imágenes → quitar el placeholder y construir los slides reales
    sliderEl.innerHTML = '';

    validSlides.forEach(function(slideData, index) {
      // Crear el elemento slide
      const slideDiv = document.createElement('div');
      slideDiv.className = 'tv-slide' + (index === 0 ? ' active' : '');

      // Crear la imagen (sin alt — imágenes decorativas)
      const img = document.createElement('img');
      img.src = slideData.src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.loading = index === 0 ? 'eager' : 'lazy';

      slideDiv.appendChild(img);
      sliderEl.appendChild(slideDiv);

      // Crear el puntito correspondiente
      const dot = document.createElement('button');
      dot.className = 'tv-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (index + 1));
      dot.dataset.index = index;
      dotsEl.appendChild(dot);
    });

    // Estado del slider
    let currentSlide = 0;
    const allSlides = sliderEl.querySelectorAll('.tv-slide');
    const allDots   = dotsEl.querySelectorAll('.tv-dot');
    let autoplayTimer = null;

    // Función para ir a un slide específico
    function goToSlide(index) {
      // Quitar active del slide y punto actuales
      allSlides[currentSlide].classList.remove('active');
      allDots[currentSlide].classList.remove('active');

      // Activar el nuevo
      currentSlide = index;
      allSlides[currentSlide].classList.add('active');
      allDots[currentSlide].classList.add('active');
    }

    // Función para avanzar al siguiente slide (en loop)
    function nextSlide() {
      const next = (currentSlide + 1) % allSlides.length;
      goToSlide(next);
    }

    // Arrancar el autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, speed);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Clicks en los puntitos — pausan y reinician el autoplay
    allDots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goToSlide(parseInt(dot.dataset.index, 10));
        startAutoplay(); // reiniciar el timer desde cero
      });
    });

    // Pausar autoplay al pasar el mouse por el TV
    const tvScreen = document.getElementById('tv-screen');
    if (tvScreen) {
      tvScreen.addEventListener('mouseenter', stopAutoplay);
      tvScreen.addEventListener('mouseleave', startAutoplay);
    }

    // Arrancar
    startAutoplay();
  })();

  // ── Scroll reveal ────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ── Nav scroll ───────────────────────────────────────────
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Hamburger / menú móvil ───────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── FAQ accordion ────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Catálogo: botones de categoría cambian las imágenes ──
  // Lee los datos de CONFIG.catalog[category] y actualiza las 3 cards
  const catalogGrid = document.getElementById('catalog-grid');

  // Función para actualizar las cards del catálogo
  function updateCatalogCards(category) {
    const items = (CONFIG.catalog && CONFIG.catalog[category]) ? CONFIG.catalog[category] : [];

    // Actualizar las 3 cards
    if (!catalogGrid) return;

    for (let i = 0; i < 3; i++) {
      const card  = document.getElementById('catalog-card-' + i);
      if (!card) continue;

      const item = items[i] || { src: '', title: '—', genre: '' };

      // Actualizar título y género
      const titleEl = card.querySelector('.catalog-card-title');
      const genreEl = card.querySelector('.catalog-card-genre');
      if (titleEl) titleEl.textContent = item.title;
      if (genreEl) genreEl.textContent = item.genre;

      // Actualizar imagen — si hay src, agregar <img>. Si no, quitar.
      let img = card.querySelector('img');

      if (item.src && item.src.trim() !== '') {
        // Hay imagen — crear o actualizar
        if (!img) {
          img = document.createElement('img');
          img.alt = '';
          img.setAttribute('aria-hidden', 'true');
          card.insertBefore(img, card.firstChild);
        }
        img.src = item.src;
      } else {
        // No hay imagen — quitar si existe
        if (img) img.remove();
      }
    }
  }

  // Cargar la categoría inicial (anime) al cargar la página
  updateCatalogCards('anime');

  // Event listeners para los botones de categoría
  document.querySelectorAll('.category-tag[data-category]').forEach(tag => {
    tag.addEventListener('click', () => {
      // Actualizar estado visual de los tags
      document.querySelectorAll('.category-tag[data-category]').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      // Obtener la categoría seleccionada y actualizar las cards
      const category = tag.dataset.category;
      updateCatalogCards(category);
    });
  });

  // ════════════════════════════════════════════════════════
  // SISTEMA DE FORMULARIOS / LEADS
  // ════════════════════════════════════════════════════════
  //
  // Estado global del plan seleccionado.
  // Se setea cuando el usuario hace click en "Empezar con [Plan]"
  // y se incluye en el mensaje de WhatsApp al enviar cualquier formulario.

  let selectedPlan = null; // null = prueba general, 'basic' | 'standard' | 'family'

  // ── Labels de modo de facturación ───────────────────────
  const MODE_LABELS = {
    monthly:    'Mensual',
    semiannual: 'Semestral (pague 5, lleve 6)',
    annual:     'Anual (pague 10, lleve 12)',
  };

  function getModeLabel() {
    const mode = (window.TAURO_STATE && window.TAURO_STATE.getMode)
      ? window.TAURO_STATE.getMode()
      : 'monthly';
    return MODE_LABELS[mode] || mode;
  }

  // Helper: obtiene el nombre legible del plan desde config
  function getPlanLabel(planKey) {
    if (!planKey) return null;
    return (CONFIG.plans && CONFIG.plans[planKey]) ? CONFIG.plans[planKey] : planKey;
  }

  // Helper: construye la URL de WhatsApp con el mensaje armado
  function buildWhatsAppUrl(email, planKey) {
    const wa   = 'https://wa.me/' + CONFIG.contact.whatsappNumber;
    const plan = getPlanLabel(planKey);
    const mode = getModeLabel();

    let msg;
    if (plan) {
      msg =
        'Hola! Quiero solicitar mi prueba gratuita de 24 horas.\n' +
        'Plan de interés: ' + plan + '\n' +
        'Facturación: ' + mode + '\n' +
        'Mi correo: ' + email;
    } else {
      msg =
        'Hola! Quiero solicitar mi prueba gratuita de 24 horas.\n' +
        'Mi correo: ' + email;
    }

    return wa + '?text=' + encodeURIComponent(msg);
  }

  // Helper: valida email básico
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Helper: muestra feedback de éxito en el botón submit
  function setSubmitSuccess(btn, originalText) {
    btn.textContent = '¡Listo! Abriendo WhatsApp…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 4000);
  }

  // ── Botones "Empezar con [Plan]" en pricing ──────────────
  // Al hacer click:
  //   1. Guarda el plan elegido en `selectedPlan`
  //   2. Hace scroll suave al CTA section
  //   3. Muestra un indicador del plan elegido en el formulario CTA
  //   4. Hace foco en el input de email

  document.querySelectorAll('.plan-btn[data-plan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedPlan = btn.dataset.plan;

      // Mostrar el plan elegido en el formulario CTA
      const planLabel   = document.getElementById('cta-plan-selected');
      const ctaEmailEl  = document.getElementById('cta-email');

      if (planLabel) {
        const modeLabel = getModeLabel();
        planLabel.textContent = 'Plan seleccionado: ' + getPlanLabel(selectedPlan) + ' · ' + modeLabel;
        planLabel.style.display = '';
      }

      // Scroll al CTA
      const ctaSection = document.getElementById('contacto');
      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Foco en el email tras el scroll
        setTimeout(() => {
          if (ctaEmailEl) ctaEmailEl.focus();
        }, 600);
      }
    });
  });

  // ── Formulario del HERO ──────────────────────────────────
  const heroForm  = document.getElementById('hero-form');
  const heroEmail = document.getElementById('hero-email');
  const heroError = document.getElementById('hero-email-error');

  if (heroForm && heroEmail) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = heroEmail.value.trim();

      if (!isValidEmail(email)) {
        heroError.textContent = 'Ingresá un correo válido para continuar.';
        heroEmail.focus();
        return;
      }
      heroError.textContent = '';

      // Desde el hero nunca hay plan seleccionado — es prueba general
      window.open(buildWhatsAppUrl(email, null), '_blank', 'noopener,noreferrer');

      const btn = heroForm.querySelector('.hero-submit');
      if (btn) setSubmitSuccess(btn, 'Prueba gratis 24h');
    });

    heroEmail.addEventListener('input', () => {
      if (heroError.textContent) heroError.textContent = '';
    });
  }

  // ── Formulario del CTA FINAL ─────────────────────────────
  const ctaForm  = document.getElementById('cta-form');
  const ctaEmail = document.getElementById('cta-email');
  const ctaError = document.getElementById('cta-email-error');

  if (ctaForm && ctaEmail) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = ctaEmail.value.trim();

      if (!isValidEmail(email)) {
        ctaError.textContent = 'Ingresá un correo válido para continuar.';
        ctaEmail.focus();
        return;
      }
      ctaError.textContent = '';

      // Incluye el plan si viene de un botón de pricing
      window.open(buildWhatsAppUrl(email, selectedPlan), '_blank', 'noopener,noreferrer');

      const btn = ctaForm.querySelector('.cta-submit');
      if (btn) setSubmitSuccess(btn, 'Solicitar prueba gratis');

      // Limpiar el plan seleccionado después de enviar
      selectedPlan = null;
      const planLabel = document.getElementById('cta-plan-selected');
      if (planLabel) {
        planLabel.style.display = 'none';
        planLabel.textContent = '';
      }
    });

    ctaEmail.addEventListener('input', () => {
      if (ctaError.textContent) ctaError.textContent = '';
    });
  }

});
