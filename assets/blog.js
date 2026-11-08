/* blog.js v2 - shared shell for the blog pages: header, drawer, footer, theme toggle, copy buttons,
   service ad banners (.bl-ad[data-ad]), related posts and the search on /blog/. No database needed. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var WA = '213784221806';
  var NAV = [['/', 'الرئيسية'], ['video.html', 'فيديوهات'], ['web.html', 'مواقع ومتاجر'], ['ads.html', 'حسابات إعلانية'], ['store.html', 'المتجر'], ['/blog/', 'المدونة']];
  var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === '/blog/' ? ' class="bl-l on"' : '') + '>' + n[1] + '</a>'; }).join('');
  var hd = $('#hd');
  if (hd && !hd.firstChild) hd.innerHTML = '<div class="wrap"><a class="brand" href="/" style="padding:0"><span class="logo">1A</span><span><b>ONE FOR ALL</b><small>وكالة تسويق رقمي</small></span></a>'
    + '<nav aria-label="main">' + links + '</nav><span class="sp"></span>'
    + '<button class="btn icon theme-t" id="themeT" aria-label="theme"></button>'
    + '<a class="btn ghost dsk" href="app.html#/login">تسجيل الدخول</a><a class="btn pri dsk" href="app.html#/register">إنشاء حساب</a>'
    + '<button class="btn icon burger" id="burger" aria-label="menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button></div>';
  if (!$('#drawer')) document.body.insertAdjacentHTML('afterbegin', '<div class="drawer" id="drawer">' + links
    + '<div class="row" style="margin-top:8px"><a class="btn grow" href="app.html#/login">تسجيل الدخول</a><a class="btn pri grow" href="app.html#/register">إنشاء حساب</a></div></div>');
  var ft = $('#ft');
  if (ft && !ft.firstChild) ft.innerHTML = '<div class="wrap row between"><div class="row"><span class="logo" style="width:30px;height:30px;font-size:12px">1A</span><span>© <span id="yr"></span> ONE FOR ALL</span></div><div class="row">'
    + NAV.filter(function (n) { return n[0] !== 'ads.html'; }).map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === '/blog/' ? ' class="bl-l"' : '') + '>' + n[1] + '</a>'; }).join('')
    + '<a class="wa-link" target="_blank" rel="noopener">WhatsApp <span class="ltr">0784 22 18 06</span></a></div></div>';

  var drawer = $('#drawer'), burger = $('#burger');
  if (burger && drawer) {
    var set = function (o) { drawer.classList.toggle('open', o); burger.setAttribute('aria-expanded', String(o)); };
    burger.onclick = function () { set(!drawer.classList.contains('open')); };
    drawer.onclick = function (e) { if (e.target.closest('a')) set(false); };
  }
  var prog = $('#prog');
  addEventListener('scroll', function () {
    if (hd) hd.classList.toggle('sc', scrollY > 10);
    if (prog) { var h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; }
  }, { passive: true });

  // theme
  var tt = $('#themeT');
  var isDark = function () { var r = document.documentElement; return r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches; };
  var paint = function () {
    if (tt) tt.innerHTML = isDark()
      ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  };
  if (tt) tt.onclick = function () { var r = document.documentElement; r.dataset.theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('ofa_theme', r.dataset.theme); } catch (e) {} paint(); };
  paint();
  var y = $('#yr'); if (y) y.textContent = new Date().getFullYear();

  // service ad banners
  var I = {
    video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    web: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    ads: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    store: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    buy: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'
  };
  var ADS = {
    video: { t: 'فيديوهات إعلانية تبيع', s: 'موشن ديزاين، فيديوهات منتجات وفيديوهات AI سينمائية للبيزنس تاعك. نخدموها بنفس الأدوات لي تقرا عليهم هنا.', b: 'شوف الفيديوهات', u: 'video.html', w: 'سلام، جيت من المدونة وحاب فيديو إعلاني للبيزنس تاعي.' },
    web: { t: 'صفحة هبوط ولا متجر إلكتروني يبيع', s: 'تصميم صفحات هبوط ومتاجر سريعة على الهاتف، مربوطة بالطلبيات تاعك.', b: 'شوف التصاميم', u: 'web.html', w: 'سلام، جيت من المدونة وحاب صفحة هبوط ولا متجر.' },
    ads: { t: 'حساب TikTok Ads ولا Facebook Ads', s: 'حسابات إعلانية جاهزة باش تبدا تشهّر، والخلاص بـ BaridiMob ولا CCP.', b: 'شوف الحسابات', u: 'ads.html', w: 'سلام، جيت من المدونة وحاب حساب إعلاني.' },
    store: { t: 'اشتراكات وأدوات رقمية بالدينار', s: 'الأدوات لي تحتاجها للخدمة بالذكاء الاصطناعي، تخلّصها بالدينار بلا كارطة بنكية.', b: 'حلّ المتجر', u: 'store.html', w: 'سلام، جيت من المدونة وحاب نسقسي على اشتراك.' },
    buy: { t: 'نشريلك من AliExpress و Temu', s: 'الصق رابط المنتج، شوف السعر بالدينار، خلّص بـ BaridiMob ولا CCP والطرد يوصل لدارك.', b: 'احسب السعر', u: 'buy.html', w: 'سلام، جيت من المدونة وحاب نشري من AliExpress.' }
  };
  var order = ['video', 'web', 'ads', 'store', 'buy'], used = {};
  document.querySelectorAll('.bl-ad').forEach(function (el, i) {
    var k = el.dataset.ad;
    if (!ADS[k]) { k = order.filter(function (x) { return !used[x]; })[0] || order[i % order.length]; }
    used[k] = 1;
    var a = ADS[k];
    el.classList.add('bl-ad-' + k);
    el.innerHTML = '<span class="bl-ad-x">إعلان · ONE FOR ALL</span><div class="bl-ad-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</svg></div>'
      + '<div class="bl-ad-c"><b>' + a.t + '</b><p>' + a.s + '</p></div>'
      + '<div class="bl-ad-b"><a class="btn" href="' + a.u + '">' + a.b + '</a><a class="btn wa wa-link" target="_blank" rel="noopener" data-wa="' + a.w + '">واتساب</a></div>';
  });

  // WhatsApp links
  document.querySelectorAll('.wa-link').forEach(function (a) {
    var t = a.dataset.wa || 'سلام، جيت من المدونة تاع ONE FOR ALL وحاب نسقسي.';
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t);
  });

  // copy buttons
  var ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  function copy(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise(function (res, rej) {
      var t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.append(t); t.select(); try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } t.remove();
    });
  }
  document.querySelectorAll('.pr').forEach(function (box) {
    var b = box.querySelector('.pr-cp'), pre = box.querySelector('pre'); if (!b || !pre) return;
    var lab = { cmd: 'كوبي الكوموند', tree: 'كوبي' }[b.dataset.k] || 'كوبي البرومبت';
    var idle = function () { b.classList.remove('ok'); b.innerHTML = ICO + '<span>' + lab + '</span>'; };
    idle();
    b.onclick = function () {
      copy(pre.innerText.replace(/ /g, ' ').trim()).then(function () {
        b.classList.add('ok'); b.innerHTML = OK + '<span>تكوبيا ✓</span>'; setTimeout(idle, 2200);
      }, function () { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); });
    };
  });
  var sh = $('#shareBtn');
  if (sh) sh.onclick = function () {
    var d = { title: document.title, url: location.href };
    if (navigator.share) navigator.share(d).catch(function () {}); else copy(location.href).then(function () { sh.textContent = 'تكوبيا الرابط ✓'; });
  };

  var P = window.BLOG_POSTS || [];
  var cardHTML = function (p) {
    return '<a class="bl-card" href="/blog/' + p.slug + '.html"><div class="cv"><span>' + p.cover + '</span>' + (p.kw ? '<i class="ltr">' + p.kw + '</i>' : '') + '</div>'
      + '<span class="bl-tag" style="align-self:flex-start">' + p.tag + '</span><h2>' + p.title + '</h2></a>';
  };
  // related posts on an article
  var post = $('.bl-post'), rel = $('#related');
  if (post && rel) {
    var others = P.filter(function (p) { return p.slug !== post.dataset.slug; }).slice(0, 6);
    rel.innerHTML = others.map(cardHTML).join('');
    if (!others.length) rel.parentNode.hidden = true;
  }

  // search on /blog/
  var q = $('#blq'), grid = $('#blgrid');
  if (q && grid) {
    var cards = [].slice.call(grid.querySelectorAll('.bl-card')), cnt = $('#blc'), empty = $('#blempty'), kws = $('#blkws');
    var norm = function (s) { return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim(); };
    var run = function () {
      var v = norm(q.value), n = 0, words = v.split(/\s+/).filter(Boolean);
      cards.forEach(function (c) {
        var s = norm(c.textContent), kw = norm((c.querySelector('.cv i') || {}).textContent);
        var ok = !words.length || words.every(function (w) { return s.indexOf(w) > -1; });
        c.hidden = !ok; c.classList.toggle('hit', !!v && kw === v); if (ok) n++;
      });
      cards.slice().sort(function (a, b) { return b.classList.contains('hit') - a.classList.contains('hit'); }).forEach(function (c) { grid.appendChild(c); });
      if (cnt) cnt.textContent = v ? n + ' صفحة' : '';
      if (empty) empty.hidden = n > 0;
      if (kws) kws.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', norm(b.textContent) === v); });
      try { history.replaceState(null, '', v ? '?q=' + encodeURIComponent(q.value.trim()) : location.pathname); } catch (e) {}
    };
    if (kws) {
      kws.innerHTML = P.filter(function (p) { return p.kw; }).map(function (p) { return '<button type="button" class="ltr">' + p.kw + '</button>'; }).join('');
      kws.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; q.value = b.classList.contains('on') ? '' : b.textContent; run(); };
    }
    q.addEventListener('input', run);
    var init = new URLSearchParams(location.search).get('q') || (location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : '');
    if (init) { q.value = init; run(); }
  }
})();
