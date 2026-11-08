/* Brand artwork: service covers and portfolio placeholders (icons come from window.OFA_CDN, set by brand.js) */
(() => {
  const A = { creative_ads: 'ads', tiktok_acc: 'growth', meta_acc: 'growth', landing: 'web', capcut: 'video' },
    C = { creative: 'ads', accounts: 'growth', web: 'web', subs: 'video', marketing: 'growth', payment: 'pay', digital: 'files', other: 'shield' };
  const art = k => { const l = k === 'ads' || k === 'play'; return `<span class="art${l ? '' : ' n'}"><img src="${l ? `assets/img/${k}.jpg?v=34` : `${window.OFA_CDN}${k}.webp`}" alt="" loading="lazy" decoding="async"></span>`; };
  const swap = () => {
    $$('#svc .pc').forEach(c => {
      const cv = c.querySelector('.cover'); if (!cv || cv.querySelector('img,.art')) return;
      const slug = decodeURIComponent(((c.querySelector('.actions a') || {}).getAttribute?.('href') || '').split('/p/')[1] || '');
      cv.innerHTML = art(A[slug] || C[c.dataset.cat] || 'shield');
    });
    $$('.slide.ph .ph-ic').forEach(e => { if (!e.querySelector('.art')) e.innerHTML = art('video'); });
  };
  ['renderServices', 'renderPortfolio'].forEach(n => { const f = window[n]; if (typeof f === 'function') window[n] = function () { const r = f.apply(this, arguments); swap(); return r; }; });
  swap();
})();

/* day / night toggle (uses core.js toggleTheme + saved choice) */
(() => {
  const root = document.documentElement, meta = document.querySelector('meta[name=theme-color]');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  const lbl = { ar: ['الوضع الليلي', 'الوضع النهاري'], fr: ['Mode sombre', 'Mode clair'], en: ['Dark mode', 'Light mode'] };
  const hd = document.querySelector('.hd .wrap'), sw = document.getElementById('lsw'); if (!hd || !sw) return;
  const b = document.createElement('button'); b.id = 'thm'; b.type = 'button'; b.className = 'btn icon ghost'; sw.after(b);
  const paint = () => {
    const d = isDark(); b.innerHTML = ic(d ? 'sun' : 'moon'); const l = (lbl[LANG] || lbl.en)[d ? 1 : 0]; b.setAttribute('aria-label', l); b.title = l;
    if (meta) meta.content = d ? '#07110B' : '#22B04B';
  };
  b.onclick = () => { root.classList.add('theme-anim'); toggleTheme(); paint(); clearTimeout(b._t); b._t = setTimeout(() => root.classList.remove('theme-anim'), 450); };
  matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change', paint);
  const f = window.applyI18n; if (typeof f === 'function') window.applyI18n = function () { const r = f.apply(this, arguments); paint(); return r; };
  paint();
})();