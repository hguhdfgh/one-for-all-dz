/* media-plus.js - real photos and logos on the landing and the service pages (images from the media repo, v4).
   Home: "who I am" block (Ishak, solo founder working with AI). Every page: payment methods strip above the footer.
   Ads page: official TikTok / Meta logos. Video page: poster fallbacks + behind-the-scenes band.
   Store: product brand logos when a product has no cover, store art behind the hero orbit.
   Additive: wraps renderPage / heroStack / heroStore / coverHTML / applyI18n when they exist. */
(function () {
  var M = 'https://cdn.jsdelivr.net/gh/hguhdfgh/media@978f3ae/one-for-all/v4/';
  window.OFA_MEDIA = M;
  var L = function (ar, fr, en) { var l = typeof LANG === 'string' ? LANG : 'ar'; return l === 'fr' ? fr : l === 'en' ? en : ar; };
  var E = function (s) { return typeof esc === 'function' ? esc(s) : String(s); };
  var img = function (src, cls, alt, eager) { return '<img src="' + M + src + '"' + (cls ? ' class="' + cls + '"' : '') + ' alt="' + E(alt || '') + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async">'; };
  var page = document.body.dataset.page || 'home';

  /* ---------- brand logos for products ---------- */
  var BR = [[/netflix/i, 'netflix'], [/canva/i, 'canva'], [/chat\s*-?gpt|openai/i, 'chatgpt'], [/cap\s*-?cut|كاب\s*كات/i, 'capcut'], [/spotify|سبوتيفاي/i, 'spotify'],
    [/youtube|يوتيوب/i, 'youtube-premium'], [/prime|برايم/i, 'prime-video'], [/adobe|photoshop|premiere|illustrator|after\s*effects|أدوبي/i, 'adobe'], [/discord/i, 'discord-nitro'],
    [/duolingo/i, 'duolingo'], [/figma/i, 'figma'], [/gemini|جيميني/i, 'gemini'], [/grammarly/i, 'grammarly'], [/notion/i, 'notion'], [/telegram|تيليغرام|تلغرام/i, 'telegram-premium'],
    [/tik\s*-?tok|تيك\s*توك/i, 'tiktok'], [/facebook|meta|فايسبوك|فيسبوك|ميتا/i, 'meta']];
  function brandOf(p) {
    var n = p.name || {}, s = [p.slug, n.ar, n.fr, n.en].join(' ');
    for (var i = 0; i < BR.length; i++) if (BR[i][0].test(s)) return BR[i][1];
    return '';
  }
  window.ofaBrandOf = brandOf;
  if (typeof coverHTML === 'function') {
    var cv = coverHTML;
    coverHTML = function (p) {
      var b = !(p.cover_url || (p.gallery || [])[0]) && brandOf(p);
      return b ? '<div class="sp-cover sp-brand">' + img('brands/' + b + '.svg', '', p.name && (p.name.ar || p.name.en)) + '</div>' : cv.apply(this, arguments);
    };
  }

  /* ---------- payment methods strip (all pages) ---------- */
  function payStrip() {
    if (document.getElementById('paystrip')) document.getElementById('paystrip').remove();
    var f = document.querySelector('footer'); if (!f) return;
    f.insertAdjacentHTML('beforebegin', '<section id="paystrip" class="pay-strip"><div class="wrap"><div class="pay-in">'
      + '<span class="pay-t"><b>' + E(L('ادفع بالطريقة اللي تناسبك', 'Payez comme vous voulez', 'Pay the way that suits you')) + '</b><small>' + E(L('دفع محلي بالدينار، والتأكيد يوصلك في حسابك.', 'Paiement local en dinars, confirmé dans votre espace.', 'Local payment in dinars, confirmed in your dashboard.')) + '</small></span>'
      + '<span class="pay-l"><span class="pay-i">' + img('pay/algerie-poste.svg', '', 'Algérie Poste') + '<small>CCP</small></span>'
      + '<span class="pay-i">' + img('pay/baridimob.webp', '', 'BaridiMob') + '<small>BaridiMob</small></span>'
      + '<span class="pay-i wide">' + img('pay/edahabia.webp', '', 'Edahabia') + '<small>' + E(L('الذهبية', 'Edahabia', 'Edahabia')) + '</small></span></span>'
      + '</div></div></section>');
  }

  /* ---------- footer WhatsApp number follows the site settings ---------- */
  function waNum() {
    var w = typeof CFG === 'object' && /^213(\d{9})$/.exec(CFG.wa || ''); if (!w) return;
    var d = '0' + w[1], t = d.slice(0, 4) + ' ' + d.slice(4, 6) + ' ' + d.slice(6, 8) + ' ' + d.slice(8);
    document.querySelectorAll('footer .wa-link .ltr').forEach(function (e) { e.textContent = t; });
  }
  setTimeout(waNum, 3000);

  /* ---------- home: about us ---------- */
  function about() {
    var old = document.getElementById('about'); if (old) old.remove();
    var anchor = document.getElementById('work') || document.getElementById('how'); if (!anchor) return;
    var ph = [['office-client-call.webp', L('نسمع لمشروعك', 'J\'écoute votre projet', 'I listen to your project')],
      ['office-editing.webp', L('نصمم ونمونتي مع الـ AI', 'Je crée et monte avec l\'IA', 'I design and edit with AI')],
      ['office-results.webp', L('نتابع النتائج معاك', 'Je suis les résultats avec vous', 'I follow the results with you')]];
    anchor.insertAdjacentHTML('beforebegin', '<section id="about" class="ab"><div class="wrap ab-in">'
      + '<div class="ab-art rv">' + img('team.webp', 'ab-main', L('إسحاق، مؤسس ONE FOR ALL', 'Ishak, fondateur de ONE FOR ALL', 'Ishak, founder of ONE FOR ALL'))
      + '<span class="ab-badge">' + img('founder.webp', '', '') + '<span><b>' + E(L('إسحاق', 'Ishak', 'Ishak')) + '</b><small>' + E(L('مؤسس ONE FOR ALL', 'Fondateur de ONE FOR ALL', 'Founder of ONE FOR ALL')) + '</small></span></span></div>'
      + '<div class="ab-tx rv" style="--d:.1s"><span class="eyebrow">' + E(L('شكون أنا', 'Qui suis-je', 'Who I am')) + '</span>'
      + '<h2 class="h2">' + E(L('أنا إسحاق، الـ ONE اللي في ONE FOR ALL', 'Je suis Ishak, le ONE de ONE FOR ALL', 'I\'m Ishak, the ONE in ONE FOR ALL')) + '</h2>'
      + '<p class="lead">' + E(L('ما عنديش فريق كبير ولا مكاتب، عندي الذكاء الاصطناعي. نخدم مع أدوات وأيجنتس يكتبو، يصممو، يمونتيو ويتابعو، وأنا نقرر ونراجع كل حاجة قبل ما توصلك. فيديوهات، صفحات هبوط، متاجر وخدمات رقمية في بلاصة وحدة، بالدينار، ومع شخص واحد يعرف مشروعك مليح.', 'Pas de grande équipe ni de bureaux : j\'ai l\'IA. Je travaille avec des outils et des agents qui écrivent, conçoivent, montent et suivent, et je décide et vérifie tout avant que ça vous arrive. Vidéos, landing pages, boutiques et services digitaux au même endroit, en dinars, avec une seule personne qui connaît bien votre projet.', 'No big team, no offices: I have AI. I work with tools and agents that write, design, edit and follow up, and I decide and review everything before it reaches you. Videos, landing pages, stores and digital services in one place, in dinars, with one person who really knows your project.')) + '</p>'
      + '<div class="ab-ph">' + ph.map(function (x, i) { return '<figure style="--i:' + i + '">' + img(x[0], '', x[1]) + '<figcaption>' + E(x[1]) + '</figcaption></figure>'; }).join('') + '</div></div>'
      + '</div></section>');
  }

  /* ---------- service pages ---------- */
  function adsLogos() {
    document.querySelectorAll('.ad-plat, .ad-card').forEach(function (c) {
      var lg = c.querySelector('.ad-logo'); if (!lg || lg.dataset.m) return;
      var k = c.classList.contains('tiktok') ? 'tiktok' : 'meta';
      lg.dataset.m = 1; lg.classList.add('ad-real'); lg.innerHTML = img('brands/' + k + '.svg', '', k === 'tiktok' ? 'TikTok' : 'Meta', true);
    });
  }
  function videoBand() {
    var main = document.getElementById('pgmain'); if (!main || document.getElementById('bts')) return;
    var at = main.querySelector('.pg-steps') ? main.querySelector('.pg-steps').closest('section') : null;
    var h = '<section id="bts" class="bts"><div class="wrap bts-in">'
      + '<div class="bts-tx rv"><span class="eyebrow">' + E(L('ورا الكواليس', 'Coulisses', 'Behind the scenes')) + '</span>'
      + '<h2 class="h2">' + E(L('شخص واحد، وأدوات ذكاء اصطناعي تخدم 24/24', 'Une seule personne, des outils d\'IA qui tournent 24h/24', 'One person, AI tools working around the clock')) + '</h2>'
      + '<p class="lead">' + E(L('من السكريبت للأنيميشن للمونتاج، نخدم فيديوهاتك أنا والـ AI ونبعثلك نسخة جاهزة للإعلان.', 'Du script à l\'animation et au montage, je produis vos vidéos avec l\'IA et vous livre une version prête à diffuser.', 'From script to animation to edit, I produce your videos with AI and deliver an ad-ready cut.')) + '</p></div>'
      + '<div class="bts-art rv" style="--d:.1s">' + img('behind-scenes.webp', 'a', '') + img('office-editing.webp', 'b', '') + '</div></div></section>';
    if (at) at.insertAdjacentHTML('beforebegin', h); else main.insertAdjacentHTML('beforeend', h);
  }
  if (typeof heroStack === 'function') {
    var hs = heroStack;
    heroStack = function () {
      var r = hs.apply(this, arguments);
      document.querySelectorAll('#hart .ph-card').forEach(function (a, i) {
        if (a.querySelector('img,video')) return;
        var ic0 = a.querySelector('.ph-ic'); if (ic0) ic0.remove();
        a.insertAdjacentHTML('afterbegin', img('video-0' + (i + 1) + '.webp', '', '', true));
      });
      return r;
    };
  }
  if (typeof heroStore === 'function') {
    var hst = heroStore;
    heroStore = function () {
      var r = hst.apply(this, arguments), o = document.querySelector('#hart .orbit');
      if (o && !o.querySelector('.st-bg')) o.insertAdjacentHTML('afterbegin', img('store-hero.webp', 'st-bg', '', true));
      return r;
    };
  }
  function pageExtras() {
    try {
      if (page === 'ads') adsLogos();
      if (page === 'video') videoBand();
      payStrip(); waNum();
      if (typeof reveal === 'function') reveal();
    } catch (e) { console.error(e); }
  }
  /* video page: the studio's own reels (540x960 H.264 + faststart, ~1 Mbps, poster per video) come first in each section,
     admin items from the portfolio table follow. The first reel of each section is the hero poster. */
  var V5 = 'https://cdn.jsdelivr.net/gh/hguhdfgh/media@ea252e6/one-for-all/v5/';
  var REELS = { video_motion: ['motion-5', 'motion-2', 'motion-6', 'motion-9', 'motion-1', 'motion-3', 'motion-8', 'motion-7', 'motion-4'],
    video_ecom: ['product-4', 'product-1', 'product-6', 'product-2', 'product-5', 'product-3'],
    video_corporate: ['corp-2', 'corp-3', 'corp-1'] };
  var RT = { video_motion: ['موشن غرافيكس', 'Motion design', 'Motion graphics'], video_ecom: ['كرياتيف منتج', 'Créa produit', 'Product creative'], video_corporate: ['فيديو شركة', 'Vidéo corporate', 'Corporate video'] };
  function addReels() {
    if (page !== 'video' || typeof PG !== 'object' || !Array.isArray(PG.items) || PG.items._v5) return;
    var own = [];
    Object.keys(REELS).forEach(function (k) {
      REELS[k].forEach(function (n, i) {
        own.push({ id: 'v5-' + n, section: k, kind: 'video', media_url: V5 + n + '.mp4', poster_url: V5 + n + '.webp', meta: {},
          title: { ar: RT[k][0] + ' 0' + (i + 1), fr: RT[k][1] + ' 0' + (i + 1), en: RT[k][2] + ' 0' + (i + 1) }, description: {} });
      });
    });
    var items = own.concat(PG.items.filter(function (x) { return !/\/v5\//.test(x.media_url || ''); }));
    items._v5 = 1; PG.items = items;
  }
  /* fast posters: a 4-stop colour preview of each poster shows at once while the real poster loads, the hero posters load first,
     every poster is warmed in the background, and a jsDelivr failure switches the reels to raw GitHub */
  var LQ = {'corp-1':'585d6e,313130,1c2123,262b2e','corp-2':'a7a6a0,867f77,6f6356,8b847b','corp-3':'2a2425,554747,312d2e,191b1d','motion-1':'222220,37352f,373228,181917','motion-2':'1f273e,4b476b,3d3763,3c365f','motion-3':'c5c5c5,b7b7b7,a3a3a3,bfbfbf','motion-4':'b4ab90,c8ba97,d4c7a8,aca389','motion-5':'51454b,876168,b19da2,726f77','motion-6':'a7a78c,9a8966,b6a881,aea78f','motion-7':'dcd8d2,e0dbd5,c7b4a6,e0ddd7','motion-8':'e5e1db,e0ddd8,dedad5,e4ddd4','motion-9':'080f0b,293c30,06160d,08110c','product-1':'7d7d78,534742,494946,282e2f','product-2':'928372,a79281,947a68,836851','product-3':'a5a299,686456,59554a,928675','product-4':'8a8777,bdb4a0,bab3a6,908f83','product-5':'4c4341,2e2d2d,2d3234,070c0e','product-6':'413e3f,5d5d6c,5c5e6a,383f55'};
  var RAW = 'https://raw.githubusercontent.com/hguhdfgh/media/ea252e6/one-for-all/v5/';
  var V5raw = false;
  var toRaw = function (u) { return u && u.indexOf(V5) === 0 ? RAW + u.slice(V5.length) : u; };
  function swapRaw() {
    if (V5raw) return; V5raw = true;
    document.querySelectorAll('[poster^="' + V5 + '"]').forEach(function (v) { v.setAttribute('poster', toRaw(v.getAttribute('poster'))); });
    document.querySelectorAll('img[src^="' + V5 + '"]').forEach(function (m) { m.src = toRaw(m.getAttribute('src')); });
    document.querySelectorAll('video[data-src^="' + V5 + '"]').forEach(function (v) { v.dataset.src = toRaw(v.dataset.src); if ((v.getAttribute('src') || '').indexOf(V5) === 0) { v.src = v.dataset.src; } });
  }
  if (page === 'video') {
    var pc = document.createElement('link'); pc.rel = 'preconnect'; pc.href = 'https://cdn.jsdelivr.net'; pc.crossOrigin = ''; document.head.appendChild(pc);
    document.addEventListener('error', function (e) { var u = e.target && (e.target.currentSrc || e.target.src || ''); if (u.indexOf(V5) === 0) swapRaw(); }, true);
  }
  function fastPosters() {
    if (page !== 'video') return;
    document.querySelectorAll('video[poster*="/v5/"], #hart img[src*="/v5/"]').forEach(function (el) {
      var m = /v5\/([\w-]+)\.webp/.exec(el.getAttribute('poster') || el.getAttribute('src') || ''); if (!m || !LQ[m[1]] || el.dataset.lq) return;
      el.dataset.lq = 1; el.style.background = 'linear-gradient(#' + LQ[m[1]].split(',').join(',#') + ')';
      if (el.tagName === 'IMG') { el.loading = 'eager'; el.setAttribute('fetchpriority', 'high'); if (V5raw) el.src = toRaw(el.getAttribute('src')); }
      else if (V5raw) { el.setAttribute('poster', toRaw(el.getAttribute('poster'))); if (el.dataset.src) el.dataset.src = toRaw(el.dataset.src); }
    });
    if (fastPosters.w) return; fastPosters.w = 1;
    var all = []; Object.keys(REELS).forEach(function (k) { all = all.concat(REELS[k]); });
    var warm = function () { all.forEach(function (n, i) { setTimeout(function () { var im = new Image(); im.onerror = swapRaw; im.src = (V5raw ? RAW : V5) + n + '.webp'; }, i * 60); }); };
    if (document.readyState === 'complete') setTimeout(warm, 300); else window.addEventListener('load', function () { setTimeout(warm, 300); });
  }

  /* video hero: an animated motion badge (spinning caption ring + play button) in place of the plain decorative ring */
  function motionBadge() {
    if (page !== 'video') return;
    var hart = document.getElementById('hart'); if (!hart) return;
    var o = hart.querySelector('.mo-badge'); if (o) o.remove();
    var tx = L('موشن • فيديو • ريلز • إعلانات • ', 'MOTION • VIDÉO • REELS • PUB • ', 'MOTION • VIDEO • REELS • ADS • ');
    hart.insertAdjacentHTML('beforeend', '<a class="mo-badge" href="#pgmain" aria-label="' + E(L('شوف الفيديوهات', 'Voir les vidéos', 'See the videos')) + '">'
      + '<svg class="mo-txt" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="moc" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>'
      + '<text><textPath href="#moc">' + E(tx + tx) + '</textPath></text></svg>'
      + '<span class="mo-core"><i class="mo-wave"></i><i class="mo-wave b"></i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>'
      + '<span class="mo-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></a>');
    // fit the caption to the full circle by font size (textLength would break Arabic letter joining)
    var fit = function () { try { var t = hart.querySelector('.mo-txt text'); if (!t) return; t.style.fontSize = ''; var n = t.getComputedTextLength(), f = parseFloat(getComputedStyle(t).fontSize); if (n > 0) t.style.fontSize = (f * 458 / n).toFixed(2) + 'px'; } catch (e) {} };
    fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  if (typeof renderPage === 'function') {
    var rp = renderPage;
    renderPage = function () { addReels(); var r = rp.apply(this, arguments); pageExtras(); try { fastPosters(); motionBadge(); } catch (e) { console.error(e); } return r; };
  }

  /* ---------- language switch re-renders the injected blocks ---------- */
  function home() { try { about(); payStrip(); waNum(); if (typeof reveal === 'function') reveal(); } catch (e) { console.error(e); } }
  var ai = window.applyI18n;
  if (typeof ai === 'function') window.applyI18n = function () {
    var r = ai.apply(this, arguments);
    if (page === 'home') home(); else { var b = document.getElementById('bts'); if (b) b.remove(); pageExtras(); try { fastPosters(); motionBadge(); } catch (e) { console.error(e); } }
    return r;
  };
  // loaded async by brand.js: if the page already rendered, render it again so the wrappers above apply
  var pm = document.getElementById('pgmain');
  if (page === 'home') home();
  else if (pm && typeof PG === 'object' && PG.loaded && typeof renderPage === 'function') { try { renderPage(); } catch (e) { console.error(e); pageExtras(); } }
  else pageExtras();
})();
