/* LUMIO AD — interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header elevation on scroll ─────────────────────────── */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile navigation ──────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* ── Reveal on scroll ───────────────────────────────────── */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── Animated counters ──────────────────────────────────── */
  function formatValue(value, el) {
    var text = el.dataset.format === 'in'
      ? value.toLocaleString('en-IN')
      : String(value);
    return text + (el.dataset.suffix || '');
  }

  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10) || 0;
    if (reduceMotion) {
      el.textContent = formatValue(target, el);
      return;
    }
    var duration = 1800;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      el.textContent = formatValue(Math.round(target * eased), el);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = formatValue(parseInt(el.dataset.target, 10) || 0, el);
    });
  }

  /* ── Scroll through all 240 frames of the supplied film ─── */
  var hero = document.getElementById('hero-story');
  var heroCanvas = document.getElementById('hero-canvas');
  if (hero && heroCanvas && heroCanvas.getContext('2d')) {
    var context = heroCanvas.getContext('2d');
    var heroFrames = Number(heroCanvas.dataset.frameCount);
    var framePath = heroCanvas.dataset.framePath;
    var heroGrid = hero.querySelector('.hero__grid');
    var wantedFrame = 0;
    var shownFrame = -1;
    var heroTicking = false;
    var frameCache = new Map();
    var pendingFrames = new Set();
    var failedFrames = new Set();

    function drawHeroFrame() {
      var nearest = null;
      frameCache.forEach(function (image, frame) {
        if (nearest === null || Math.abs(frame - wantedFrame) < Math.abs(nearest - wantedFrame)) nearest = frame;
      });
      if (nearest === null || nearest === shownFrame) return;
      context.drawImage(frameCache.get(nearest), 0, 0, heroCanvas.width, heroCanvas.height);
      shownFrame = nearest;
      heroCanvas.dataset.frame = String(nearest);
      heroCanvas.classList.add('is-ready');
    }

    function trimFrameCache() {
      // Keep decoded image memory bounded, including during rapid scrolling.
      var frames = Array.from(frameCache.keys()).sort(function (a, b) {
        return Math.abs(a - wantedFrame) - Math.abs(b - wantedFrame);
      });
      frames.slice(24).forEach(function (frame) { frameCache.delete(frame); });
    }

    function loadHeroFrame(frame) {
      if (frame < 0 || frame >= heroFrames || frameCache.has(frame) || pendingFrames.has(frame) || failedFrames.has(frame) || pendingFrames.size >= 8) return;
      pendingFrames.add(frame);
      var image = new Image();
      image.decoding = 'async';
      image.onload = function () {
        pendingFrames.delete(frame);
        frameCache.set(frame, image);
        trimFrameCache();
        drawHeroFrame();
        loadNearbyFrames();
      };
      image.onerror = function () {
        pendingFrames.delete(frame);
        failedFrames.add(frame);
        loadNearbyFrames();
      };
      image.src = framePath + 'frame-' + String(frame).padStart(3, '0') + '.jpg';
    }

    function loadNearbyFrames() {
      loadHeroFrame(wantedFrame);
      if (!reduceMotion) {
        for (var offset = 1; offset <= 3; offset++) {
          loadHeroFrame(wantedFrame + offset);
          loadHeroFrame(wantedFrame - offset);
        }
      }
    }

    function syncHeroFrame() {
      heroTicking = false;
      var progress;
      if (reduceMotion) {
        progress = 1;
      } else if (window.matchMedia('(max-width: 700px)').matches) {
        var frameRect = heroCanvas.getBoundingClientRect();
        progress = (window.innerHeight * 0.48 - frameRect.top) / (window.innerHeight * 0.48 + frameRect.height * 0.7);
      } else {
        var stickyTop = parseFloat(getComputedStyle(heroGrid).top) || 0;
        var distance = Math.max(1, hero.offsetHeight - heroGrid.offsetHeight);
        progress = (stickyTop - hero.getBoundingClientRect().top) / distance;
      }
      wantedFrame = Math.round(Math.max(0, Math.min(1, progress)) * (heroFrames - 1));
      drawHeroFrame();
      loadNearbyFrames();
    }

    function scheduleHeroFrame() {
      if (!heroTicking) {
        heroTicking = true;
        requestAnimationFrame(syncHeroFrame);
      }
    }

    window.addEventListener('scroll', scheduleHeroFrame, { passive: true });
    window.addEventListener('resize', scheduleHeroFrame);
    scheduleHeroFrame();
  }

  /* ── Active nav link while scrolling ────────────────────── */
  var sectionIds = ['about', 'services', 'network', 'why-dooh', 'contact'];
  var navLinks = {};
  sectionIds.forEach(function (id) {
    var link = document.querySelector('.nav__link[href="#' + id + '"]');
    if (link) navLinks[id] = link;
  });

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(navLinks).forEach(function (key) {
            navLinks[key].classList.remove('is-active');
          });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ── Footer year ────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
