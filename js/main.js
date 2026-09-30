/* ==========================================================================
   Suvarna Homemade Tiffin Service — minimal progressive enhancement
   Only two jobs: the mobile nav toggle and the header shadow on scroll.
   Everything else is CSS. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after tapping a link (the page is a single document with anchors).
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    // Escape closes and returns focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Clicking outside the header closes the menu.
    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!event.target.closest(".site-header")) setOpen(false);
    });

    // Reset when resizing up to the horizontal-nav breakpoint.
    var desktop = window.matchMedia("(min-width: 768px)");
    var onChange = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else desktop.addListener(onChange);
  }

  /* ---------- Header shadow once scrolled ---------- */
  var header = document.querySelector(".site-header");

  if (header && "IntersectionObserver" in window) {
    // A zero-height sentinel avoids a scroll listener entirely.
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    header.parentNode.insertBefore(sentinel, header);
    new IntersectionObserver(
      function (entries) {
        header.classList.toggle("is-stuck", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(sentinel);
  }

  /* ---------- Sticky WhatsApp CTA: reserve space, hide near the footer ---------- */
  var mobileCta = document.getElementById("mobileCta");

  if (mobileCta) {
    // Keep the page from being covered by the fixed bar.
    var syncPadding = function () {
      var hidden = window.matchMedia("(min-width: 768px)").matches;
      document.body.classList.toggle("has-mobile-cta", !hidden);
      document.documentElement.style.setProperty(
        "--mobile-cta-h",
        hidden ? "0px" : mobileCta.offsetHeight + "px"
      );
    };

    syncPadding();
    window.addEventListener("resize", syncPadding, { passive: true });
    window.addEventListener("orientationchange", syncPadding, { passive: true });

    // Once the in-page WhatsApp CTA band is visible, the sticky bar is redundant.
    var band = document.querySelector(".cta-band");
    if (band && "IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          mobileCta.classList.toggle("is-hidden", entries[0].isIntersecting);
        },
        { threshold: 0.2 }
      ).observe(band);
    }
  }
})();
