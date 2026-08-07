/* ============================================================
   COACHES' BOX — Shared Layout Injection (nav + footer)
   ============================================================ */

const NAV_HTML = `
<style>
  /* Hamburger-only navigation — one menu on every screen size */
  #site-nav .container { position: relative; }
  #site-nav .nav__links { display: none !important; }
  #site-nav .nav__cta { display: none !important; }
  #site-nav .nav__toggle { display: flex !important; }
  #site-nav .nav__mobile {
    display: none;
    position: absolute; top: calc(100% + 10px); right: var(--space-4, 16px);
    flex-direction: column; gap: 2px;
    min-width: 240px;
    background: #0A0A0A;
    border: 1px solid rgba(200,168,75,0.28);
    border-radius: 14px;
    padding: var(--space-4, 16px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.55);
    z-index: 300;
  }
  #site-nav .nav__mobile.open { display: flex !important; }
  #site-nav .nav__mobile a {
    padding: 11px 14px; border-radius: 9px;
    font-size: 0.95rem; font-weight: 600; letter-spacing: 0.04em;
    text-transform: none;
    text-decoration: none; color: rgba(255,255,255,0.85);
    transition: background 200ms ease, color 200ms ease;
  }
  #site-nav .nav__mobile a:hover { color: #C8A84B; background: rgba(200,168,75,0.10); }
  #site-nav .nav__mobile a.active { color: #C8A84B; }
  #site-nav .nav__mobile .btn { margin-top: var(--space-3, 12px); width: 100%; text-align: center; }
  #site-nav .nav__toggle.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  #site-nav .nav__toggle.is-open span:nth-child(2) { opacity: 0; }
  #site-nav .nav__toggle.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
</style>
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="nav__inner">
      <a href="index.html" class="nav__logo" aria-label="Coaches' Box Home" style="position:relative;display:inline-flex;align-items:flex-start;">
        <img src="images/logo.png" alt="Coaches' Box Logo" class="nav__logo-img">
        <sup style="font-size:9px;color:#C8A84B;font-family:Trebuchet MS,sans-serif;font-weight:bold;margin-left:1px;margin-top:3px;">&trade;</sup>
      </a>
      <div style="display:flex;align-items:center;gap:var(--space-3);">
        <button class="nav__toggle" data-nav-toggle aria-expanded="false" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <nav class="nav__mobile" aria-label="Site menu">
      <a href="index.html">Home</a>
      <a href="pages/about.html">About</a>
      <a href="pages/products.html">Products</a>
      <a href="pages/books.html">Bookshelf</a>
      <a href="pages/blog.html">Blog</a>
      <a href="pages/contact.html">Contact</a>
      <a href="pages/contact.html" class="btn btn--primary">Get Early Access</a>
    </nav>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="images/logo.png" alt="Coaches' Box Logo" class="nav__logo-img">
        <p>Empowering coaches with innovative technology that transforms the way athletes learn, teams prepare, and programs succeed.</p>
        <p class="footer__tagline">BUILDING BETTER COACHES. DEVELOPING BETTER LEADERS.</p>
      </div>
      <div>
        <p class="footer__heading">Company</p>
        <ul class="footer__links" role="list">
          <li><a href="pages/about.html">About Us</a></li>
          <li><a href="pages/products.html">Products</a></li>
          <li><a href="pages/books.html">Bookshelf</a></li>
          <li><a href="pages/blog.html">Blog</a></li>
          <li><a href="pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <p class="footer__heading">Products</p>
        <ul class="footer__links" role="list">
          <li><a href="pages/products.html">Virtual Practice Simulator</a></li>
          <li><a href="pages/products.html">AI Practice Builder</a></li>
          <li><a href="pages/products.html">Practice Planning</a></li>
          <li><a href="pages/products.html">Analytics</a></li>
        </ul>
      </div>
      <div>
        <p class="footer__heading">Connect</p>
        <ul class="footer__links" role="list">
          <li><a href="mailto:info@coachesbox.ai">info@coachesbox.ai</a></li>
          <li><a href="tel:3213779494">321.377.9494</a></li>
          <li><a href="https://www.facebook.com/profile.php?id=61591734908628" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="https://www.instagram.com/thecoachesboxapp" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; 2026 The Coaches' Box&trade;, LLC. All rights reserved. Patent Pending.</span>
      <span>Winter Springs, Florida &middot; coachesbox.ai</span>
    </div>
  </div>
</footer>`;

// Inject nav + footer
document.addEventListener('DOMContentLoaded', () => {
  // Nav
  const navEl = document.querySelector('#site-nav');
  if (navEl) navEl.innerHTML = NAV_HTML;

  // Footer
  const footerEl = document.querySelector('#site-footer');
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;

  // Fix paths for pages subdirectory
  const isSubpage = window.location.pathname.includes('/pages/');
  if (isSubpage) {
    document.querySelectorAll('a[href], img[src]').forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'img') {
        const src = el.getAttribute('src');
        if (src && src.startsWith('images/')) el.setAttribute('src', '../' + src);
      } else {
        const href = el.getAttribute('href');
        if (!href) return;
        if (href.startsWith('images/')) el.setAttribute('href', '../' + href);
        if (href.startsWith('pages/')) el.setAttribute('href', href.replace('pages/', ''));
        if (href === 'index.html') el.setAttribute('href', '../index.html');
      }
    });
  }

  // Hamburger toggle — bound here so it works on every screen size,
  // regardless of when main.js runs relative to nav injection.
  const toggle = navEl ? navEl.querySelector('[data-nav-toggle]') : null;
  const mobile = navEl ? navEl.querySelector('.nav__mobile') : null;
  if (toggle && mobile) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = mobile.classList.toggle('open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!navEl.contains(e.target)) {
        mobile.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
