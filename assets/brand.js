/* ONE FOR ALL brand layer (loaded on both pages): logo, favicon, art for empty states and the sign-in page.
   Images are served from jsDelivr (repo hguhdfgh/media, pinned to a commit). */
(() => {
  const CDN = 'https://cdn.jsdelivr.net/gh/hguhdfgh/media@9ca1c13/one-for-all/';
  window.OFA_CDN = CDN;
  const LOGO = 'https://cdn.jsdelivr.net/gh/hguhdfgh/media@978f3ae/one-for-all/v4/logo-mark.svg';
  const st = document.createElement('style');
  st.textContent = '.logo.img{background:none;padding:0;overflow:hidden;box-shadow:none}.logo.img img{width:100%;height:100%;object-fit:contain}'
    + '.card.empty .eimg{width:128px;height:128px;margin:0 auto 6px;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(21,132,58,.22))}'
    + '.auth-art{display:none}@media (min-width:960px){.auth.has-art{grid-template-columns:minmax(0,420px) minmax(0,400px);gap:56px;justify-content:center}.auth-art{display:block;width:100%;max-height:78vh;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(21,132,58,.18))}}';
  document.head.append(st);
  const fav = document.querySelector('link[rel=icon]'); if (fav) { fav.type = 'image/svg+xml'; fav.href = LOGO; }
  const pass = () => {
    document.querySelectorAll('.logo:not(.img)').forEach(e => { e.classList.add('img'); e.innerHTML = `<img src="${LOGO}" alt="ONE FOR ALL" decoding="async">`; });
    document.querySelectorAll('.card.empty:not([data-b])').forEach(c => {
      c.dataset.b = 1; const s = c.querySelector(':scope > svg.ico'); if (!s || typeof ICONS === 'undefined') return;
      const k = s.innerHTML === ICONS.bag ? 'box' : s.innerHTML === ICONS.check ? 'ok' : '';
      if (k) s.replaceWith(Object.assign(document.createElement('img'), { className: 'eimg', src: `${CDN}${k}.webp`, alt: '', loading: 'lazy', decoding: 'async' }));
    });
    document.querySelectorAll('.auth:not(.has-art)').forEach(a => {
      a.classList.add('has-art'); a.append(Object.assign(document.createElement('img'), { className: 'auth-art', src: CDN.replace('9ca1c13', 'bececcb') + 'auth.webp', alt: '', decoding: 'async' }));
    });
  };
  let q = 0; const sched = () => { if (!q) q = requestAnimationFrame(() => { q = 0; pass(); }); };
  new MutationObserver(sched).observe(document.body, { childList: true, subtree: true });
  pass();
  // real photos and logos (media-plus) on the landing and the service pages, not in the dashboard
  if (document.getElementById('work') || document.getElementById('pgmain')) {
    document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'assets/media-plus.css?v=1' }));
    document.body.append(Object.assign(document.createElement('script'), { src: 'assets/media-plus.js?v=1' }));
  }
  // «نشريلك» (AliExpress / Temu buying): order + admin extras in the dashboard, links and home band on the public pages
  document.body.append(Object.assign(document.createElement('script'), { src: document.getElementById('app') ? 'assets/buy-app.js?v=1' : 'assets/buy-ext.js?v=1' }));
  // blog link («المدونة») in the header, drawer and footer of the public pages
  if (!document.getElementById('app')) document.body.append(Object.assign(document.createElement('script'), { src: '/assets/blog-ext.js?v=1' }));
})();
