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

  // ── Scroll reveal → js/reveal.js (compartido con las demás
  //    páginas: descargar, soporte y legal) ─────────────────

  // ── Nav scroll y menú móvil → js/nav.js (compartido con
  //    el catálogo y la página de descarga) ────────────────

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

  // ── Catálogo ──
  // La landing ya no muestra el preview del catálogo (categorías +
  // 3 posters): ahora solo tiene el botón que lleva a /catalog, así
  // que acá no queda nada que manejar. Los datos de CONFIG.catalog
  // quedan en config.js por si algún día se quiere volver a mostrar.

  // ════════════════════════════════════════════════════════
  // BOTONES "REGÍSTRATE GRATIS" (nav, hero + CTA final)
  // ════════════════════════════════════════════════════════
  // Van directo a la app de registro por su href (target="_blank").
  // Los botones "Empezar con [Plan]" de pricing arman su propio
  // mensaje de WhatsApp con el plan (ver pricing.js).

});
