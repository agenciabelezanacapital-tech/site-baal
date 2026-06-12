/* =======================================================
   BAAL BEAUTY · MEGA HAIR · LANDING PAGE
   JavaScript puro (sem dependências)
   ======================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------
     1. NAVBAR — muda opacidade/estilo ao rolar
  ----------------------------------------------------- */
  var header = document.getElementById('header');
  function onScrollHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* -----------------------------------------------------
     2. SCROLL SUAVE entre âncoras internas
     (fallback caso o navegador não suporte CSS smooth)
  ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* -----------------------------------------------------
     3. ACCORDION (FAQ) — abre/fecha animado
  ----------------------------------------------------- */
  var accItems = document.querySelectorAll('.accordion__item');
  accItems.forEach(function (item) {
    var header = item.querySelector('.accordion__header');
    var panel = item.querySelector('.accordion__panel');

    header.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Fecha todos (comportamento de accordion único)
      accItems.forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.accordion__panel').style.maxHeight = null;
        other.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado se estava fechado
      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------------------------
     4. REVEAL ON SCROLL — fade-in das seções no viewport
  ----------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: mostra tudo
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* -----------------------------------------------------
     5. LAZY LOADING das imagens da galeria
     (marca como carregada quando entra no viewport —
      pronto para receber data-src de fotos reais)
  ----------------------------------------------------- */
  var lazyItems = document.querySelectorAll('[data-lazy]');
  if ('IntersectionObserver' in window) {
    var lazyObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var img = el.querySelector('img[data-src]');
          if (img) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
          el.classList.add('loaded');
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });

    lazyItems.forEach(function (el) { lazyObserver.observe(el); });
  }

  /* -----------------------------------------------------
     6. CONTADOR ANIMADO de avaliações (badge do Hero)
     Anima 0 → 5,0 e 0 → 15 quando o badge aparece
  ----------------------------------------------------- */
  function animateCounter(el, target, decimals, suffix, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (target - start) * eased;
      el.textContent = value.toFixed(decimals).replace('.', ',') + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var heroBadge = document.querySelector('.hero__badge');
  if (heroBadge) {
    // Reconstrói o badge com spans animáveis
    heroBadge.innerHTML =
      '<span class="stars">★★★★★</span>' +
      '<span><strong class="count-rating">0,0</strong> no Google · ' +
      '<strong class="count-reviews">0</strong> avaliações · Lago Sul, Brasília</span>';

    var ratingEl = heroBadge.querySelector('.count-rating');
    var reviewsEl = heroBadge.querySelector('.count-reviews');
    var counted = false;

    function runCounters() {
      if (counted) return;
      counted = true;
      animateCounter(ratingEl, 5.0, 1, '', 1400);
      animateCounter(reviewsEl, 15, 0, '+', 1400);
    }

    if ('IntersectionObserver' in window) {
      var counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounters(); counterObs.disconnect(); }
        });
      }, { threshold: 0.5 });
      counterObs.observe(heroBadge);
    } else {
      runCounters();
    }
  }

  /* -----------------------------------------------------
     7. BOTÃO FLUTUANTE WHATSAPP
     Aparece após 3 segundos OU ao rolar a página
  ----------------------------------------------------- */
  var waFloat = document.getElementById('whatsappFloat');
  if (waFloat) {
    var shown = false;
    function showFloat() {
      if (shown) return;
      shown = true;
      waFloat.classList.add('visible');
    }
    // Aparece após 3 segundos
    setTimeout(showFloat, 3000);
    // Ou imediatamente ao começar a rolar
    window.addEventListener('scroll', function onFirstScroll() {
      if (window.scrollY > 200) {
        showFloat();
        window.removeEventListener('scroll', onFirstScroll);
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------
     8. Ano dinâmico no copyright (mantém atualizado)
  ----------------------------------------------------- */
  // Mantido fixo em 2025 conforme solicitado; descomente para auto:
  // var yearEl = document.querySelector('.footer__bottom p');
  // if (yearEl) yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());

})();
