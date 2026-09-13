/* ============================================================
   PORTFOLIO - Script principal
   1. Écran d'introduction     4. Fenêtres modales (CV / compétences)
   2. Menu mobile              5. Onglets du CV
   3. En-tête au défilement    6. Révélation au défilement
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Écran d'introduction ---------- */
  // Les polices doivent être chargées AVANT de lancer l'animation du titre :
  // sinon le navigateur substitue la police de secours puis rebascule sur Outfit
  // en pleine animation, et le nom "saute" - c'est ce qui donnait une impression
  // de lag sur le titre de l'accueil.
  function policesPretes() {
    var attente =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    // On n'attend jamais plus de 1,5 s : mieux vaut une police de secours
    // qu'une page bloquée si Google Fonts ne répond pas.
    return Promise.race([
      attente,
      new Promise(function (r) {
        window.setTimeout(r, 1500);
      })
    ]);
  }

  function demarrer() {
    policesPretes().then(function () {
      document.body.classList.add("is-loaded");
    });
  }

  // L'animation d'arrivée ne joue qu'une fois par onglet (sessionStorage).
  function bootIntro() {
    var intro = document.querySelector(".intro");
    var alreadySeen = false;

    try {
      alreadySeen = sessionStorage.getItem("intro-vue") === "1";
    } catch (e) {
      /* mode privé : on ignore */
    }

    if (!intro || alreadySeen || reduceMotion) {
      if (intro) intro.remove();
      demarrer();
      return;
    }

    var start = Date.now();
    var MIN_DUREE = 1400; // durée minimale de l'intro, en ms
    var lance = false;

    function reveal() {
      if (lance) return; // `load` et le filet de sécurité peuvent tous deux appeler
      lance = true;

      var reste = Math.max(0, MIN_DUREE - (Date.now() - start));
      window.setTimeout(function () {
        demarrer();
        try {
          sessionStorage.setItem("intro-vue", "1");
        } catch (e) {}
        window.setTimeout(function () {
          if (intro && intro.parentNode) intro.remove();
        }, 1200);
      }, reste);
    }

    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal);

    // Filet de sécurité si `load` ne se déclenche jamais
    window.setTimeout(reveal, 4000);
  }

  bootIntro();

  /* ---------- 2. Menu mobile ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var ouvert = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!ouvert));
      nav.classList.toggle("is-open", !ouvert);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  /* ---------- 3. En-tête au défilement ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var majHeader = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    majHeader();
    window.addEventListener("scroll", majHeader, { passive: true });
  }

  /* ---------- 4. Fenêtres modales ---------- */
  var dernierFocus = null;

  // Le PDF n'est inséré qu'à la première ouverture de la modale. Placé directement
  // dans le HTML, un <object type="application/pdf"> déclenche le téléchargement du
  // fichier ET l'initialisation de la visionneuse PDF au chargement de la page -
  // même modale fermée. C'est ce qui figeait l'accueil.
  function chargerPdf(modal) {
    var panneau = modal.querySelector("[data-pdf]");
    if (!panneau || panneau.dataset.pdfCharge === "1") return;
    panneau.dataset.pdfCharge = "1";

    var objet = document.createElement("object");
    objet.className = "pdf-frame";
    objet.type = "application/pdf";
    objet.data = panneau.dataset.pdf;
    objet.innerHTML =
      '<div class="pdf-fallback"><div>' +
      '<p style="font-size:1.05rem;color:var(--text)">Aucun CV PDF trouvé pour l\'instant.</p>' +
      '<p style="margin-top:.6rem">Dépose ton fichier ici : <code>' +
      panneau.dataset.pdf +
      "</code></p>" +
      '<p style="margin-top:.6rem">En attendant, l\'onglet <strong>Version web</strong> reste disponible.</p>' +
      "</div></div>";

    panneau.textContent = "";
    panneau.appendChild(objet);
  }

  function ouvrirModal(modal) {
    if (!modal) return;
    dernierFocus = document.activeElement;
    chargerPdf(modal);
    modal.classList.add("is-open");
    modal.removeAttribute("aria-hidden");
    document.body.classList.add("no-scroll");

    var cible =
      modal.querySelector("[data-autofocus]") ||
      modal.querySelector(".modal__close");
    if (cible) window.setTimeout(function () { cible.focus(); }, 60);
  }

  function fermerModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }

  // Ouverture : <button data-modal-open="cv">
  document.addEventListener("click", function (e) {
    var declencheur = e.target.closest("[data-modal-open]");
    if (declencheur) {
      e.preventDefault();
      ouvrirModal(document.getElementById(declencheur.dataset.modalOpen));
      return;
    }

    // Fermeture : bouton croix, fond, ou tout [data-modal-close]
    var fermeture = e.target.closest("[data-modal-close]");
    if (fermeture) {
      e.preventDefault();
      fermerModal(fermeture.closest(".modal"));
    }
  });

  // Échap + piège à focus basique
  document.addEventListener("keydown", function (e) {
    var ouverte = document.querySelector(".modal.is-open");
    if (!ouverte) return;

    if (e.key === "Escape") {
      fermerModal(ouverte);
      return;
    }

    if (e.key === "Tab") {
      var focusables = ouverte.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, iframe, object, [tabindex]:not([tabindex="-1"])'
      );
      var visibles = Array.prototype.filter.call(focusables, function (el) {
        return el.offsetParent !== null || el.tagName === "IFRAME";
      });
      if (!visibles.length) return;

      var premier = visibles[0];
      var dernier = visibles[visibles.length - 1];

      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    }
  });

  /* ---------- 5. Onglets (CV : PDF / version web) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (groupe) {
    var boutons = groupe.querySelectorAll("[data-tab]");

    boutons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        boutons.forEach(function (b) {
          var actif = b === btn;
          b.setAttribute("aria-selected", String(actif));
          var panneau = document.getElementById(b.dataset.tab);
          if (panneau) panneau.hidden = !actif;
        });
      });
    });
  });

  /* ---------- 6. Lignes dépliables du tableau de compétences ---------- */
  document.addEventListener("click", function (e) {
    var bouton = e.target.closest(".skill-toggle");
    if (!bouton) return;

    var panneau = document.getElementById(bouton.getAttribute("aria-controls"));
    if (!panneau) return;

    var ouvert = bouton.getAttribute("aria-expanded") === "true";
    bouton.setAttribute("aria-expanded", String(!ouvert));
    panneau.hidden = ouvert;
  });

  /* ---------- 7. Révélation au défilement ---------- */
  var aReveler = document.querySelectorAll(".on-scroll");

  if (aReveler.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      aReveler.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observateur = new IntersectionObserver(
        function (entrees) {
          entrees.forEach(function (entree) {
            if (entree.isIntersecting) {
              entree.target.classList.add("is-visible");
              observateur.unobserve(entree.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      aReveler.forEach(function (el) { observateur.observe(el); });
    }
  }

  /* ---------- 7. Année courante dans le pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
