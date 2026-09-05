/**
 * BANKAI + — MAIN JS
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
  // BOTONES "REGÍSTRATE GRATIS" (nav, hero + CTA final)
  // ════════════════════════════════════════════════════════
  // Van directo a la app de registro por su href (target="_blank").
  // Los botones "Empezar con [Plan]" de pricing arman su propio
  // mensaje de WhatsApp con el plan (ver pricing.js).

});
