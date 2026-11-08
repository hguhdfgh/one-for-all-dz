/* motion.js - shared motion helpers for every page.
   - tier: html.mo-low on weak devices (head script + a one-time frame probe), html.mo-fine for mouse pointers
   - pauses CSS animations inside boxes that are off screen
   - app pages: word-rise titles, row cascade, count-up numbers, card spotlight/tilt, circular theme switch */
(() => {
  const H = document.documentElement, C = H.classList;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (FINE) C.add('mo-fine');
  const MO = window.MO = { rm: RM, fine: FINE, get low() { return C.contains('mo-low'); } };

  /* ---------- frame probe: if the page can't hold ~40fps once loaded, switch to the light tier (remembered 7 days) ---------- */
  const KEY = 'ofa_lowfx';
  function probe() {
    if (RM || MO.low || document.hidden) return;
    const f = []; let last = 0;
    const tick = n => { if (last) f.push(n - last); last = n; if (f.length < 60) requestAnimationFrame(tick); else done(); };
    const done = () => {
      const s = f.sort((a, b) => a - b), med = s[30], slow = f.filter(x => x > 34).length;
      if (med > 24 || slow > 18) { C.add('mo-low'); try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
    };
    requestAnimationFrame(tick);
  }
  addEventListener('load', () => setTimeout(probe, 1800), { once: true });

  /* ---------- pause animations off screen ---------- */
  const offIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('mo-off', !e.isIntersecting)), { rootMargin: '80px 0px' }) : null;
  MO.pauseOff = (sel, root = document) => { if (offIO) root.querySelectorAll(sel).forEach(el => { if (!el.dataset.moOff) { el.dataset.moOff = 1; offIO.observe(el); } }); };

  /* ---------- reveal on scroll ---------- */
  const rvIO = 'IntersectionObserver' in window && !RM ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('mo-on'); rvIO.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;

  /* ---------- count-up for numbers like "12 500 DA", "1,200", "37" ---------- */
  const ease = x => 1 - Math.pow(1 - x, 3);
  MO.countUp = el => {
    if (RM || el.dataset.moNum) return; el.dataset.moNum = 1;
    if (el.children.length) return;
    const txt = el.textContent, m = txt.match(/\d[\d\s  ,.]*\d|\d/); if (!m) return;
    const raw = m[0], digits = raw.replace(/\D/g, ''); if (digits.length > 12 || /[.,]\d{1,2}$/.test(raw)) return;
    const end = +digits; if (!end) return;
    const sep = (raw.match(/[\s  ,.]/) || [''])[0];
    const fmt = v => { const s = String(v); return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s; };
    const pre = txt.slice(0, m.index), post = txt.slice(m.index + raw.length), dur = 700 + Math.min(500, digits.length * 60);
    el.classList.add('mo-num'); let t0 = 0;
    const node = el.firstChild; if (!node || node.nodeType !== 3) return;
    const step = n => { if (!t0) t0 = n; const k = Math.min(1, (n - t0) / dur); node.nodeValue = pre + fmt(Math.round(end * ease(k))) + post; if (k < 1 && el.isConnected) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* ---------- words rise (plain-text titles only, Arabic words are never split inside) ---------- */
  MO.words = el => {
    if (RM || el.dataset.moW || el.children.length) return; el.dataset.moW = 1;
    const ws = el.textContent.trim().split(/\s+/); if (!ws[0]) return;
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    el.innerHTML = ws.map((w, i) => `<span class="mo-w"><span class="mo-wi" style="--i:${i}">${esc(w)}</span></span>`).join(' ');
  };

  /* ---------- card spotlight + gentle tilt (mouse only) ---------- */
  MO.spot = (el, tilt) => {
    if (!FINE || RM || el.dataset.moSpot) return; el.dataset.moSpot = 1; el.classList.add('mo-spot'); if (tilt) el.classList.add('mo-tilt');
    let raf = 0, ev = null;
    el.addEventListener('pointermove', e => { ev = e; if (raf) return; raf = requestAnimationFrame(() => {
      raf = 0; const r = el.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if (tilt && !MO.low) { el.classList.add('mo-tilting'); el.style.transform = `perspective(800px) rotateX(${((.5 - y / r.height) * 4).toFixed(2)}deg) rotateY(${((x / r.width - .5) * 5).toFixed(2)}deg) translateY(-3px)`; }
    }); });
    el.addEventListener('pointerleave', () => { el.classList.remove('mo-tilting'); el.style.transform = ''; });
  };

  /* ---------- circular theme switch (pages without the landing's own hook) ---------- */
  let px = innerWidth / 2, py = 0;
  addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; }, { capture: true, passive: true });
  function hookTheme() {
    const orig = window.toggleTheme;
    if (typeof orig !== 'function' || orig.mo || document.getElementById('hero')) return;
    const wrapped = function () {
      if (RM || MO.low || !document.startViewTransition) return orig.apply(this, arguments);
      const a = arguments, self = this, rad = Math.hypot(Math.max(px, innerWidth - px), Math.max(py, innerHeight - py));
      const vt = document.startViewTransition(() => orig.apply(self, a));
      vt.ready.then(() => H.animate({ clipPath: [`circle(0 at ${px}px ${py}px)`, `circle(${rad}px at ${px}px ${py}px)`] }, { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    };
    wrapped.mo = 1; window.toggleTheme = wrapped;
  }

  /* ---------- app pages (#app): enhance whatever each route renders ---------- */
  const app = document.getElementById('app');
  if (app) {
    let routeAt = performance.now(), queued = 0;
    addEventListener('hashchange', () => { routeAt = performance.now(); });
    const ROWS = '.page .list>.li, .page .list>a.li, .page table.t tbody>tr, .page .grid>.card.click';
    const enhance = () => {
      queued = 0;
      $$('.top h1:not([data-mo-w])').forEach(MO.words);
      $$('.kpi b, .today .tdn, .page .kpi .num').forEach(MO.countUp);
      $$('.kpi, .page .card.click, .page .pc').forEach(el => MO.spot(el, el.classList.contains('kpi')));
      MO.pauseOff('.page .spin, .page .svc-skel');
      if (RM) return;
      const fresh = performance.now() - routeAt < 1600;
      let i = 0;
      $$(ROWS).forEach(el => {
        if (el.dataset.moRow) return; el.dataset.moRow = 1;
        if (!fresh) return; // re-renders from typing/filters stay still
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight) { if (i < 14) { el.style.setProperty('--i', i++); el.classList.add('mo-in'); el.addEventListener('animationend', () => el.classList.remove('mo-in'), { once: true }); } }
        else if (rvIO) { el.classList.add('mo-rv'); rvIO.observe(el); }
      });
    };
    const $$ = (s, r = document) => r.querySelectorAll(s);
    new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(enhance); }).observe(app, { childList: true, subtree: true });
    hookTheme(); addEventListener('load', hookTheme, { once: true });
  }

  /* ---------- landing: pause decorative loops while their section is off screen ---------- */
  if (document.getElementById('hero')) {
    const go = () => MO.pauseOff('.hero, .mq, #work, .band, .cta, #how, #services');
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
  }
})();
