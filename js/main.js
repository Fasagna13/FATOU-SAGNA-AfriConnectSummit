/* ============================================================
   AFRICONNECT SUMMIT 2026 — MAIN.JS
   Regroupe toutes les interactions du site :
   1. Thème clair/sombre (persisté en mémoire)
   2. Menu mobile (hamburger)
   3. Scroll reveal (.reveal -> .in)
   4. Compte à rebours (page d'accueil)
   5. Stats animées (compteurs, page d'accueil)
   6. Onglets Jour 1/2/3 (programme.html)
   7. Filtre par thématique (intervenants.html)
   8. Formulaire d'inscription + validation (contact.html)
   9. Accordéon FAQ (déjà géré en CSS pur, rien à faire ici)
   10. Bouton retour en haut
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. THÈME CLAIR / SOMBRE
     ============================================================ */
  (function initTheme() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Applique un thème donné au <body>
    function applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
    }

    // Le thème de départ vient de l'attribut déjà présent dans le HTML (data-theme="dark")
    toggle.addEventListener('click', function () {
      var current = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(current);
    });
  })();

  /* ============================================================
     2. MENU MOBILE (HAMBURGER)
     ============================================================ */
  (function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (mobileMenu) mobileMenu.classList.toggle('open', isOpen);
    });

    // Ferme le menu si on clique un lien à l'intérieur
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('open');
        });
      });
    }
  })();

  /* ============================================================
     3. SCROLL REVEAL (.reveal -> .in)
     ============================================================ */
  (function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback : tout afficher directement si le navigateur ne supporte pas l'API
      revealEls.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
     4. COMPTE À REBOURS (page d'accueil)
     ============================================================ */
  (function initCountdown() {
    var daysEl = document.getElementById('cd-days');
    var hoursEl = document.getElementById('cd-hours');
    var minEl = document.getElementById('cd-min');
    var secEl = document.getElementById('cd-sec');
    if (!daysEl || !hoursEl || !minEl || !secEl) return;

    // Date de début du sommet : 18 novembre 2026, 09:00 (heure locale)
    var target = new Date('2026-11-18T09:00:00');

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
      var now = new Date();
      var diff = target - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minEl.textContent = '00';
        secEl.textContent = '00';
        clearInterval(timer);
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minEl.textContent = pad(minutes);
      secEl.textContent = pad(seconds);
    }

    update();
    var timer = setInterval(update, 1000);
  })();

  /* ============================================================
     5. STATS ANIMÉES (compteurs, page d'accueil)
     ============================================================ */
  (function initStats() {
    var statNums = document.querySelectorAll('.stats .num[data-target]');
    if (!statNums.length) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      statNums.forEach(animateCount);
      return;
    }

    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNums.forEach(function (el) { statsObserver.observe(el); });
  })();

  /* ============================================================
     6. ONGLETS JOUR 1 / 2 / 3 (programme.html)
     ============================================================ */
  (function initTabs() {
    var tabs = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.day-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var day = tab.getAttribute('data-day');

        // Met à jour les boutons
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Met à jour les panneaux
        panels.forEach(function (panel) {
          if (panel.id === 'day-' + day) {
            panel.hidden = false;
            panel.classList.add('active');
          } else {
            panel.hidden = true;
            panel.classList.remove('active');
          }
        });
      });
    });
  })();

  /* ============================================================
     7. FILTRE PAR THÉMATIQUE (intervenants.html)
     ============================================================ */
  (function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('#speakersGrid .speaker-card');
    var emptyState = document.getElementById('emptyState');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var visibleCount = 0;
        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var show = filter === 'tous' || category === filter;
          card.classList.toggle('is-hidden', !show);
          if (show) visibleCount++;
        });

        if (emptyState) emptyState.hidden = visibleCount !== 0;
      });
    });
  })();

  /* ============================================================
     8. FORMULAIRE D'INSCRIPTION (contact.html)
     ============================================================ */
  (function initForm() {
    var form = document.getElementById('registrationForm');
    if (!form) return;

    var successMsg = document.getElementById('successMsg');

    var validators = {
      fullName: function (value) {
        return value.trim().length >= 3 ? '' : 'Merci d\'indiquer votre nom complet (3 caractères minimum).';
      },
      email: function (value) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value.trim()) ? '' : 'Merci d\'indiquer une adresse email valide.';
      },
      phone: function (value) {
        var re = /^[+\d][\d\s]{6,}$/;
        return re.test(value.trim()) ? '' : 'Merci d\'indiquer un numéro de téléphone valide.';
      },
      participationType: function (value) {
        return value ? '' : 'Merci de sélectionner un type de participation.';
      },
      country: function (value) {
        return value ? '' : 'Merci de sélectionner votre pays.';
      },
      message: function (value) {
        return value.trim().length >= 10 ? '' : 'Merci de rédiger un message d\'au moins 10 caractères.';
      }
    };

    function showError(fieldName, message) {
      var errorEl = document.getElementById('err-' + fieldName);
      var group = document.getElementById(fieldName)
        ? document.getElementById(fieldName).closest('.form-group')
        : null;

      if (errorEl) errorEl.textContent = message;
      if (group) {
        group.classList.toggle('is-invalid', !!message);
        group.classList.toggle('is-valid', !message);
      }
    }

    function validateField(fieldName) {
      var field = document.getElementById(fieldName);
      if (!field) return true;
      var message = validators[fieldName](field.value);
      showError(fieldName, message);
      return message === '';
    }

    // Validation en direct pendant la saisie
    Object.keys(validators).forEach(function (fieldName) {
      var field = document.getElementById(fieldName);
      if (!field) return;
      field.addEventListener('blur', function () { validateField(fieldName); });
      field.addEventListener('input', function () {
        var group = field.closest('.form-group');
        if (group && group.classList.contains('is-invalid')) validateField(fieldName);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = Object.keys(validators).every(function (fieldName) {
        return validateField(fieldName);
      });

      if (!isValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Simule un envoi réussi (aucun backend connecté)
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      form.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('is-valid', 'is-invalid');
      });
    });
  })();

  /* ============================================================
     9. BOUTON RETOUR EN HAUT
     ============================================================ */
  (function initToTop() {
    var toTopBtn = document.getElementById('toTop');
    if (!toTopBtn) return;

    window.addEventListener('scroll', function () {
      toTopBtn.classList.toggle('show', window.scrollY > 500);
    });

    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ============================================================
     10. ANNÉE COURANTE DANS LE FOOTER
     ============================================================ */
  (function initYear() {
    var yearEl = document.getElementById('year');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear();
  })();

});