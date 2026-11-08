/* home-pages.js - main landing: the services section (#services) is a motion presentation of the service pages
   (video / web / ads accounts / store) instead of a product grid; ordering happens on each page.
   Also adds the pages to the nav, drawer and footer, and keeps page-only portfolio items (portfolio.section)
   out of the home reel unless the admin ticked "show on home" (meta.home).
   Additive: replaces renderServices, wraps renderPortfolio and applyI18n from landing.js. */
(function () {
  var L = function (ar, fr, en) { return [ar, fr, en][['ar', 'fr', 'en'].indexOf(typeof LANG === 'string' ? LANG : 'ar')] || ar; };
  var PG = [
    { h: 'video.html', k: 'video', c: '#22B04B', cats: ['creative', 'design'],
      n: function () { return L('فيديو', 'Vidéo', 'Video'); }, t: function () { return L('الفيديوهات', 'Vidéos', 'Videos'); },
      s: function () { return L('فيديوهات توقف السكرول وتبيع: نكتبو السكريبت، نصممو ونسلمو جاهز للإعلان.', 'Des vidéos qui stoppent le scroll et vendent : script, création, livraison prête à diffuser.', 'Videos that stop the scroll and sell: script, production and delivery ready to advertise.'); },
      x: function () { return [L('موشن غرافيكس', 'Motion design', 'Motion graphics'), L('كرياتيفز المنتجات', 'Créas e-commerce', 'Product creatives'), L('فيديوهات الشركات', 'Vidéos corporate', 'Corporate videos')]; } },
    { h: 'web.html', k: 'web', c: '#2D5FA8', cats: ['web'],
      n: function () { return L('ويب', 'Web', 'Web'); }, t: function () { return L('صفحات الهبوط والمتاجر', 'Landing pages et boutiques', 'Landing pages & stores'); },
      s: function () { return L('صفحات ومتاجر مصممة باش تبيع. تصفح تصاميمنا كاملة داخل شاشة حقيقية.', 'Des pages et boutiques conçues pour vendre. Parcourez nos designs dans un vrai écran.', 'Pages and stores built to sell. Scroll our designs inside a real screen.'); },
      x: function () { return [L('صفحات الهبوط', 'Landing pages', 'Landing pages'), L('المتاجر الإلكترونية', 'Boutiques en ligne', 'Online stores')]; } },
    { h: 'ads.html', k: 'ads', c: '#FE2C55', cats: ['accounts', 'payment', 'marketing'],
      n: function () { return L('إعلانات', 'Pub', 'Ads'); }, t: function () { return L('حسابات الإعلانات', 'Comptes publicitaires', 'Ad accounts'); },
      s: function () { return L('حسابات تيك توك أدس وفايسبوك أدس، تدفع بالدينار وتستلم في حسابك.', 'Comptes TikTok Ads et Facebook Ads, payés en dinars, livrés dans votre espace.', 'TikTok Ads and Facebook Ads accounts, paid in dinars, delivered to your dashboard.'); },
      x: function () { return ['TikTok Ads', 'Facebook Ads']; } },
    { h: 'store.html', k: 'store', c: '#E08A1E', digital: true,
      n: function () { return L('المتجر', 'Boutique', 'Store'); }, t: function () { return L('المتجر الرقمي', 'Boutique digitale', 'Digital store'); },
      s: function () { return L('اشتراكات، حسابات وأدوات رقمية بالدينار، اختار المدة واستلم بسرعة.', 'Abonnements, comptes et outils digitaux en dinars, choisissez la durée.', 'Subscriptions, accounts and digital tools in dinars, pick the duration.'); },
      x: function () { return [L('اشتراكات', 'Abonnements', 'Subscriptions'), L('حسابات', 'Comptes', 'Accounts'), L('أدوات', 'Outils', 'Tools')]; } }
  ];
  function art(k) {
    if (k === 'video') return '<span class="hp-art hp-v"><i></i><i></i><i></i><b>' + ic('play') + '</b></span>';
    if (k === 'web') return '<span class="hp-art hp-w"><span class="hp-scr"><span class="hp-pg"><i></i><i></i><i></i><i></i><i></i><i></i></span></span></span>';
    if (k === 'ads') return '<span class="hp-art hp-a"><span class="hp-ac t"><em>TikTok Ads</em></span><span class="hp-ac m"><em>Facebook Ads</em></span><span class="hp-bars"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>';
    return '<span class="hp-art hp-s"><b>' + ic('bag') + '</b><i></i><i></i><i></i></span>';
  }
  // lowest active price of the products that page sells (from the products the landing already loaded)
  function from(p) {
    var list = (typeof SITE === 'object' && SITE.products) || [], m = null;
    list.forEach(function (x) {
      if (p.digital ? !(x.type === 'digital' || (x.meta || {}).store) : (x.type === 'digital' || p.cats.indexOf(x.category) < 0)) return;
      (x.product_variants || []).forEach(function (v) { if (v.active && v.price > 0 && (m === null || v.price < m)) m = v.price; });
    });
    return m;
  }
  function show() {
    var s = document.getElementById('services'); if (!s) return;
    s.classList.add('hs');
    s.innerHTML = '<div class="wrap"><div class="center rv" style="margin-bottom:30px"><span class="eyebrow">' + esc(t('n_services')) + '</span>'
      + '<h2 class="h2">' + esc(L('كل خدمة عندها صفحتها', 'Chaque service a sa page', 'Every service has its own page')) + '</h2>'
      + '<p class="lead">' + esc(L('اختار الخدمة، شوف أعمالنا واطلب من صفحتها مباشرة.', 'Choisissez un service, voyez nos réalisations et commandez depuis sa page.', 'Pick a service, see our work and order right from its page.')) + '</p></div>'
      + '<div class="hs-stack">' + PG.map(function (p, i) {
        var pr = from(p);
        return '<a class="hs-panel" style="--i:' + i + ';--c:' + p.c + '" href="' + p.h + '">'
          + '<span class="hs-tx"><span class="hs-n">0' + (i + 1) + ' / 0' + PG.length + '</span><b>' + esc(p.t()) + '</b><small>' + esc(p.s()) + '</small>'
          + '<span class="hs-x">' + p.x().map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</span>'
          + '<span class="hs-ft"><span class="btn pri">' + esc(L('ادخل واطلب', 'Voir et commander', 'View & order')) + ' ' + ic('arrow', 'ico flip go') + '</span>'
          + (pr ? '<span class="hs-pr"><small>' + esc(L('ابتداءً من', 'À partir de', 'From')) + '</small>&nbsp;<b>' + money(pr) + '</b></span>' : '') + '</span></span>'
          + art(p.k) + '</a>';
      }).join('') + '</div></div>';
    stack();
  }
  // stacked sticky panels: the panel underneath shrinks and dims as the next one slides over it
  function stack() {
    var paint = function () {
      stack.tick = 0;
      var ps = document.querySelectorAll('#services .hs-panel');
      var still = REDUCED || matchMedia('(max-width:860px)').matches;
      ps.forEach(function (p, i) {
        var nx = ps[i + 1]; if (still || !nx) { p.style.setProperty('--k', 0); return; }
        var a = p.getBoundingClientRect(), b = nx.getBoundingClientRect();
        p.style.setProperty('--k', Math.max(0, Math.min(1, 1 - (b.top - a.top) / Math.max(1, a.height))).toFixed(3));
      });
    };
    if (!stack.on) {
      stack.on = true;
      addEventListener('scroll', function () { if (!stack.tick) stack.tick = requestAnimationFrame(paint); }, { passive: true });
      addEventListener('resize', paint);
    }
    paint();
  }
  function links() {
    var lab = PG.map(function (p) { return '<a href="' + p.h + '" class="hp-l">' + esc(p.t()) + '</a>'; }).join('');
    var short = PG.map(function (p) { return '<a href="' + p.h + '" class="hp-l">' + esc(p.n()) + '</a>'; }).join('');
    document.querySelectorAll('header nav .hp-l, #drawer .hp-l, footer .hp-l').forEach(function (a) { a.remove(); });
    var nav = document.querySelector('header nav'); if (nav) nav.insertAdjacentHTML('beforeend', short);
    var dr = document.getElementById('drawer'); if (dr) { var f = dr.querySelector('a[href="#faq"]'); f ? f.insertAdjacentHTML('afterend', lab) : dr.insertAdjacentHTML('afterbegin', lab); }
    var ft = document.querySelector('footer .row:last-child'); if (ft) ft.insertAdjacentHTML('afterbegin', lab);
  }
  function after() { try { links(); show(); if (typeof flip === 'function') flip(); if (typeof reveal === 'function') reveal(); } catch (e) { console.error(e); } }
  // the product grid is gone from the home page: products are ordered from their service page
  window.renderServices = function () { };
  if (typeof renderPortfolio === 'function') {
    var rp = renderPortfolio;
    renderPortfolio = function () {
      if (typeof SITE === 'object' && SITE.portfolio) SITE.portfolio = SITE.portfolio.filter(function (x) { return !x.section || (x.meta || {}).home; });
      return rp.apply(this, arguments);
    };
  }
  var ai = window.applyI18n;
  if (typeof ai === 'function') window.applyI18n = function () { var r = ai.apply(this, arguments); after(); return r; };
  after();
})();
