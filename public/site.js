(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // wrong passphrase: shake the card
  var gc = $('.gate-card');
  if (gc && $('.gate-err') && $('.gate-err').textContent.trim()) gc.classList.add('shake');

  // reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  // counters
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var end = +e.target.dataset.count, t0 = performance.now();
      if (reduce || !end) { e.target.textContent = end; return; }
      (function tick(t) {
        var p = Math.min(1, (t - t0) / 1400), k = 1 - Math.pow(1 - p, 4);
        e.target.textContent = Math.round(end * k);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  // section background morph
  var secs = $$('[data-bg]');
  if (secs.length && !reduce) {
    var bio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) document.body.style.backgroundColor = e.target.dataset.bg; });
    }, { rootMargin: '-50% 0px -50% 0px' });
    secs.forEach(function (s) { bio.observe(s); });
  }

  // scroll progress + parallax
  var prog = $('.progress'), par = $$('[data-speed]'), ticking = false;
  function frame() {
    ticking = false;
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (!reduce) par.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -400 || r.top > innerHeight + 400) return;
      var c = (r.top + r.height / 2 - innerHeight / 2) * -parseFloat(el.dataset.speed);
      el.style.transform = 'translate3d(0,' + c.toFixed(1) + 'px,0)';
    });
    var nav = $('.nav');
    if (nav) nav.style.transform = y > 300 && lastY < y ? 'translateY(-110%)' : 'none';
    lastY = y;
  }
  var lastY = 0;
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  frame();

  // mouse drift on gate / hero shapes
  if (!reduce) {
    var host = $('.gate-bg') || $('.hero');
    if (host) host.addEventListener('mousemove', function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      $$('.shape-in', host).forEach(function (s, i) {
        var f = (i % 4 + 1) * 14;
        s.style.translate = (x * f).toFixed(1) + 'px ' + (y * f).toFixed(1) + 'px';
      });
    });
  }

  // catalogue filter
  var chips = $$('.chip'), cards = $$('.card');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('on', x === c); });
      var f = c.dataset.f;
      cards.forEach(function (card) { card.classList.add('fading'); });
      setTimeout(function () {
        cards.forEach(function (card, i) {
          var show = f === 'all' || card.dataset.cat === f;
          card.classList.toggle('hide', !show);
          if (show) setTimeout(function () { card.classList.remove('fading'); }, 30 + i * 40);
        });
      }, reduce ? 0 : 280);
    });
  });

  // card 3D tilt
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('.card').forEach(function (card) {
      var box = $('.card-img', card);
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        box.style.rotate = (x * 3).toFixed(2) + 'deg';
      });
      card.addEventListener('mouseleave', function () { box.style.rotate = ''; });
    });
  }

  // lightbox
  var lb;
  function close() { if (lb) lb.classList.remove('open'); }
  document.addEventListener('click', function (e) {
    var z = e.target.closest && e.target.closest('.zoom');
    if (z) {
      if (!lb) {
        lb = document.createElement('div'); lb.className = 'lb';
        lb.innerHTML = '<img alt=""><button aria-label="Chiudi">×</button>';
        lb.addEventListener('click', close); document.body.appendChild(lb);
      }
      $('img', lb).src = z.dataset.src;
      requestAnimationFrame(function () { lb.classList.add('open'); });
    }
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
