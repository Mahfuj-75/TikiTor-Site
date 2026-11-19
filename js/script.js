/* Tikitor website: page switching, mobile menu, sample QR. */
(function () {
  'use strict';

  var VIEWS = ['home', 'how-it-works', 'for-organizers'];
  var header = document.querySelector('header');
  var menuBtn = document.getElementById('menu');

  /* ---- Placeholder QR drawing (sample only, not a real code) ---- */
  function drawQR(el) {
    var N = 21, F = 7, seed = 1234, cells = '';
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var on;
        if ((x < F && y < F) || (x >= N - F && y < F) || (x < F && y >= N - F)) {
          var fx = x < F ? x : x - (N - F);
          var fy = y < F ? y : y - (N - F);
          on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        } else {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          on = ((seed >> 16) % 2) === 0;
        }
        if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    el.insertAdjacentHTML('afterbegin',
      '<svg viewBox="0 0 21 21" fill="#010b61" shape-rendering="crispEdges">' + cells + '</svg>');
  }
  document.querySelectorAll('[data-qr]').forEach(drawQR);

  /* ---- Mobile menu ---- */
  function setMenu(open) {
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!header.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---- Page switching by URL hash: #home, #how-it-works, #for-organizers, #contact ---- */
  function route() {
    var h = location.hash.slice(1);
    setMenu(false);
    if (h === 'contact') {
      if (!document.querySelector('.view.on')) document.getElementById('home').classList.add('on');
      document.getElementById('contact').scrollIntoView();
      return;
    }
    if (VIEWS.indexOf(h) < 0) h = 'home';
    VIEWS.forEach(function (v) {
      document.getElementById(v).classList.toggle('on', v === h);
    });
    document.querySelectorAll('nav a[data-v]').forEach(function (a) {
      a.classList.toggle('on', a.dataset.v === h);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  window.addEventListener('hashchange', route);
  route();
})();
