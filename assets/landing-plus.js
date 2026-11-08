/* landing-plus.js - interaction layer for the landing page: headline reveal, live hero demo, 3D tilt,
   card spotlight, magnetic buttons, sliding filter, "how" progress line, circular theme switch.
   Pointer effects run only on devices with a real hover pointer; everything is skipped under reduced motion. */
(() => {
  const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches && !REDUCED;
  const hero = $('#hero'), mock = $('#mock'), h1 = $('#htitle');

  /* ---------- headline: split into words (fragments joined without a space stay in one word) ---------- */
  let firstSplit = true;
  function splitTitle() {
    if (!h1 || REDUCED) return;
    const words = [[]];
    h1.childNodes.forEach(n => {
      const em = n.nodeName === 'EM', txt = n.textContent;
      txt.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { if (words[words.length - 1].length) words.push([]); return; }
        words[words.length - 1].push(em ? `<em>${esc(tok)}</em>` : esc(tok));
      });
    });
    const list = words.filter(w => w.length);
    h1.innerHTML = list.map((w, i) => `<span class="w"><span class="wi" style="--i:${firstSplit ? i : 0}">${w.join('')}</span></span>`).join(' ');
    h1.classList.add('split');
    if (!firstSplit) h1.querySelectorAll('.wi,em').forEach(e => e.style.animationDuration = '.01s');
    firstSplit = false;
  }

  /* ---------- hero: aurora + pointer light + 3D tilt ---------- */
  if (hero) {
    hero.insertAdjacentHTML('afterbegin', '<span class="aur" aria-hidden="true"></span><span class="lite" aria-hidden="true"></span>');
    if (FINE) {
      mock && mock.classList.add('tilt');
      let raf = 0, ev = null;
      hero.addEventListener('pointermove', e => { ev = e; if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const r = hero.getBoundingClientRect(); hero.style.setProperty('--lx', (ev.clientX - r.left) + 'px'); hero.style.setProperty('--ly', (ev.clientY - r.top) + 'px'); }); });
      hero.addEventListener('pointerleave', () => { mock && (mock.style.setProperty('--px', 0), mock.style.setProperty('--py', 0)); });
    }
  }

  /* ---------- hero mock: a small live loop (illustration of the client area, not real data) ---------- */
  if (mock && !REDUCED) {
    const bar = $('.m1 .bar i', mock), steps = $$('.m1 .step', mock), chip = $('.m1 .chip', mock), m3 = $('.m3', mock);
    let k = 0, vis = true, timer = 0;
    const frame = () => {
      k = (k + 1) % 4;
      if (k === 0) { bar.style.setProperty('--k', .33); steps[1].classList.remove('done'); steps[2].classList.remove('done'); chip.classList.remove('ok'); chip.innerHTML = `<span class="dot"></span>${esc(t('st_in_progress'))}`; }
      if (k === 1) { bar.style.setProperty('--k', .66); steps[1].classList.add('done', 'pulse'); }
      if (k === 2) { bar.style.setProperty('--k', 1); steps[2].classList.add('done', 'pulse'); }
      if (k === 3) { chip.classList.add('ok'); chip.innerHTML = `<span class="dot"></span>${esc(t('st_delivered'))}`; m3.classList.remove('ping'); void m3.offsetWidth; m3.classList.add('ping'); }
      steps.forEach(s => s.querySelector('.d').innerHTML = s.classList.contains('done') ? ic('check') : '');
      setTimeout(() => steps.forEach(s => s.classList.remove('pulse')), 450);
    };
    const run = () => { clearInterval(timer); if (vis && !document.hidden) timer = setInterval(frame, 2200); };
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { vis = es[0].isIntersecting; run(); }).observe(mock);
    document.addEventListener('visibilitychange', run);
    setTimeout(run, 1600);
  }

  /* ---------- magnetic buttons ---------- */
  function magnet(root = document) {
    if (!FINE) return;
    $$('.hero .btn.lg:not(.mag), .cta .btn.lg:not(.mag), .band .btn.lg:not(.mag)', root).forEach(b => {
      b.classList.add('mag');
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left) / r.width - .5) * 10}px ${((e.clientY - r.top) / r.height - .5) * 8}px`; });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }

  /* ---------- cards: spotlight + gentle tilt ---------- */
  function spot(root = document) {
    if (!FINE) return;
    $$('#svc .pc:not(.spot), .steps3 .card:not(.spot)', root).forEach(c => {
      c.classList.add('spot');
      const tilt = c.classList.contains('pc');
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
        if (tilt && c.classList.contains('done')) { c.classList.add('tilting'); c.style.transform = `perspective(900px) rotateX(${(.5 - y / r.height) * 5}deg) rotateY(${(x / r.width - .5) * 6}deg) translateY(-4px)`; }
      });
      c.addEventListener('pointerleave', () => { c.classList.remove('tilting'); c.style.transform = ''; });
    });
  }

  /* ---------- filter pills: sliding indicator ---------- */
  function pind() {
    const fl = $('#filters'), pills = fl && $('.pills', fl); if (!pills || fl.hidden) return;
    let i = $('.pind', pills); if (!i) { i = document.createElement('i'); i.className = 'pind'; i.setAttribute('aria-hidden', 'true'); pills.prepend(i); fl.classList.add('fslide'); }
    const on = $('.pill.on', pills); if (!on) return;
    i.style.left = on.offsetLeft + 'px'; i.style.width = on.offsetWidth + 'px';
    if (pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: on.offsetLeft - (pills.clientWidth - on.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
  }
  addEventListener('resize', () => requestAnimationFrame(pind));
  document.fonts?.ready.then(pind);

  /* ---------- how it works: line + steps light up in order ---------- */
  const s3 = $('.steps3');
  if (s3) {
    s3.insertAdjacentHTML('afterbegin', '<span class="how-line" aria-hidden="true"><i></i></span>');
    $$('.card', s3).forEach((c, k) => c.style.setProperty('--k', k));
    if ('IntersectionObserver' in window && !REDUCED) { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { s3.classList.add('go'); io.disconnect(); } }, { threshold: .35 }); io.observe(s3); }
    else s3.classList.add('go');
  }

  /* ---------- theme switch: circular reveal from the button ---------- */
  const hookTheme = () => {
    const b = $('#thm'); if (!b || b.dataset.vt || !document.startViewTransition || REDUCED) return;
    b.dataset.vt = 1; const orig = b.onclick;
    b.onclick = e => {
      const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => { orig.call(b, e); document.documentElement.classList.remove('theme-anim'); });
      vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] }, { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    };
  };

  /* ---------- re-apply after every render ---------- */
  const after = () => { splitTitle(); magnet(); spot(); pind(); };
  ['applyI18n', 'renderServices', 'applyFilter'].forEach(n => {
    const f = window[n]; if (typeof f !== 'function') return;
    window[n] = function () { const r = f.apply(this, arguments); n === 'applyI18n' ? after() : (spot(), pind()); return r; };
  });
  after(); hookTheme(); setTimeout(hookTheme, 0);
})();
