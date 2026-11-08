/* buy-ext.js - «نشريلك» on the public pages (loaded by brand.js): a link in the header, drawer and footer,
   and on the home page a band under the services where a pasted link opens buy.html with the price check started. */
(function () {
  var lang = function () { return typeof LANG === 'string' ? LANG : 'ar'; };
  var L = function (ar, fr, en) { return [ar, fr, en][['ar', 'fr', 'en'].indexOf(lang())] || ar; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function links() {
    var lab = L('نشريلك', 'Achat pour vous', 'Buy for me');
    [['header nav', 'beforeend'], ['#drawer', 'beforeend'], ['footer .row:last-child', 'afterbegin']].forEach(function (x) {
      var box = document.querySelector(x[0]); if (!box) return;
      var a = box.querySelector('a[href="buy.html"]');
      if (!a) { box.insertAdjacentHTML(x[1], '<a href="buy.html" class="by-l" data-pg="buy"></a>'); a = box.querySelector('a[href="buy.html"]'); }
      if (a.classList.contains('by-l')) a.textContent = lab;
      if (document.body.dataset.page === 'buy') a.classList.add('on');
    });
    var dr = document.querySelector('#drawer a.by-l'), row = document.querySelector('#drawer > .row'); if (dr && row) row.before(dr);
  }
  function band() {
    var s = document.getElementById('services'); if (!s || document.getElementById('buyband')) return;
    var st = document.createElement('style');
    st.textContent = '#buyband{padding:10px 0 40px}#buyband .bb{display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:center;padding:28px;border-radius:28px;background:radial-gradient(120% 120% at 0% 0%,#0FAA60,#047B4A);color:#fff;box-shadow:0 30px 60px -30px rgba(4,123,74,.6)}'
      + '#buyband h2{color:#fff;margin:6px 0;font-size:clamp(24px,3vw,34px)}#buyband p{margin:0;opacity:.9}#buyband .eyebrow{background:rgba(255,255,255,.16);color:#fff}'
      + '#buyband form{display:flex;gap:8px;padding:8px;border-radius:18px;background:#fff}#buyband input{flex:1;min-width:0;border:0;outline:0;font-size:16px;padding:0 10px;background:transparent;color:#04110F;text-align:left}'
      + '#buyband small{display:block;margin-top:10px;opacity:.85}@media (max-width:760px){#buyband .bb{grid-template-columns:1fr;padding:22px}#buyband form{flex-wrap:wrap}#buyband input{min-height:44px;flex-basis:100%}#buyband form .btn{width:100%}}';
    document.head.append(st);
    s.insertAdjacentHTML('afterend', '<section id="buyband"><div class="wrap"><div class="bb rv"><div><span class="eyebrow">AliExpress · Temu</span><h2 class="h2" data-b="t"></h2><p data-b="s"></p></div>'
      + '<div><form action="buy.html" method="get"><input name="u" type="url" inputmode="url" dir="ltr" required autocomplete="off"><button class="btn pri" data-b="go"></button></form><small data-b="n"></small></div></div></div></section>');
    texts();
    if (typeof reveal === 'function') reveal();
  }
  function texts() {
    var b = document.getElementById('buyband'); if (!b) return;
    var T = { t: L('نشريلك من AliExpress و Temu', 'On achète pour vous sur AliExpress et Temu', 'We buy for you on AliExpress & Temu'),
      s: L('الصق رابط المنتج، شوف السعر بالدينار، خلص بـ BaridiMob ولا CCP والطرد يوصل لدارك.', 'Collez le lien, voyez le prix en dinars, payez par BaridiMob ou CCP, livré chez vous.', 'Paste the link, see the price in dinars, pay via BaridiMob or CCP, delivered to your door.'),
      go: L('احسب السعر', 'Calculer le prix', 'Get the price'), n: L('بلا كارطة بنكية. أنا نشري بكارطتي.', 'Sans carte bancaire. J’achète avec ma carte.', 'No bank card needed. I buy with mine.') };
    Object.keys(T).forEach(function (k) { var e = b.querySelector('[data-b="' + k + '"]'); if (e) e.textContent = T[k]; });
    var i = b.querySelector('input'); if (i) i.placeholder = L('الصق رابط المنتج هنا', 'Collez le lien du produit', 'Paste the product link');
  }
  function run() { try { links(); band(); texts(); } catch (e) { console.error(e); } }
  run();
  var q = 0; new MutationObserver(function () { if (!q) q = setTimeout(function () { q = 0; if (!document.querySelector('header nav a[href="buy.html"]') || (document.getElementById('services') && !document.getElementById('buyband'))) run(); else { links(); texts(); } }, 150); })
    .observe(document.body, { childList: true, subtree: true });
})();
