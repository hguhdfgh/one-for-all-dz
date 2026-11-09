/* pages.js — service pages (video.html, web.html, store.html).
   Shared shell (header, drawer, i18n, texts editable in admin under site_content "pages"),
   the video reel (same behaviour as the main landing #work reel, several reels on one page),
   the design viewer for landing pages / stores, and the digital store.
   Data: portfolio rows with a `section`, products of type "digital" (or meta.store) with their variants. */
const PAGE = document.body.dataset.page;
Object.assign(T, {
  n_home: ['الرئيسية', 'Accueil', 'Home'], n_video: ['الفيديو', 'Vidéo', 'Video'], n_web: ['المواقع', 'Web', 'Web'], n_store: ['المتجر', 'Boutique', 'Store'],
  pg_explore: PAGE === 'store' ? ['تصفح المتجر', 'Voir la boutique', 'Browse the store'] : PAGE === 'web' ? ['تصفح التصاميم', 'Voir les designs', 'Browse designs'] : ['شوف الأعمال', 'Voir les réalisations', 'See the work'],
  prev: ['السابق', 'Précédent', 'Previous'], next: ['التالي', 'Suivant', 'Next'],
  play_sound: ['شغّل بالصوت', 'Lire avec le son', 'Play with sound'], mute: ['الصوت', 'Son', 'Sound'], full: ['ملء الشاشة', 'Plein écran', 'Fullscreen'], open_link: ['افتح', 'Ouvrir', 'Open'],
  tap_sound: ['اضغط للصوت', 'Touchez pour le son', 'Tap for sound'], vol_lbl: ['مستوى الصوت', 'Volume', 'Volume'],
  work_word: ['عمل', 'Projet', 'Project'], ph_soon: ['يتزاد قريبا', 'Bientôt disponible', 'Coming soon'],
  order_like: ['اطلب واحد كيما هذا', 'Commander le même style', 'Order one like this'], see_live: ['شوف الموقع', 'Voir en ligne', 'See it live'],
  tour: ['جولة تلقائية', 'Visite auto', 'Auto tour'], stop: ['وقّف', 'Arrêter', 'Stop'], scroll_hint: ['اسحب للأسفل باش تشوف التصميم كامل', 'Faites défiler pour voir tout le design', 'Scroll to see the whole design'],
  designs: ['تصميم', 'designs', 'designs'], mobile: ['هاتف', 'Mobile', 'Mobile'], desktop: ['حاسوب', 'Ordinateur', 'Desktop'],
  how_t: ['كيفاش نخدمو', 'Comment on travaille', 'How we work'], pricing_t: ['الباقات والأسعار', 'Offres et prix', 'Packages & prices'],
  pricing_s: ['اطلب من حسابك وتابع كل مرحلة، أو راسلنا في واتساب.', 'Commandez depuis votre compte et suivez chaque étape, ou écrivez-nous sur WhatsApp.', 'Order from your account and follow every step, or message us on WhatsApp.'],
  cta_t: ['عندك فكرة؟ نبداو اليوم', 'Une idée ? On commence aujourd’hui', 'Got an idea? Let’s start today'], cta_s: ['سجّل مجانا، اطلب، وتابع خدمتك خطوة بخطوة.', 'Inscription gratuite, commande et suivi étape par étape.', 'Sign up free, order and follow every step.'],
  // store
  st_search: ['ابحث على منتج…', 'Rechercher un produit…', 'Search a product…'], f_all: ['الكل', 'Tout', 'All'],
  from: ['ابتداءً من', 'À partir de', 'From'], choose: ['اختر', 'Choisir', 'Choose'], buy_now: ['اشري الآن', 'Acheter', 'Buy now'],
  instant: ['تسليم فوري', 'Livraison instantanée', 'Instant delivery'], manual: ['تسليم يدوي', 'Livraison manuelle', 'Manual delivery'],
  within: ['خلال', 'sous', 'within'], hours: ['ساعة', 'h', 'h'], out_stock: ['نفد', 'Épuisé', 'Sold out'], low_stock: ['كمية محدودة', 'Stock limité', 'Low stock'],
  duration: ['المدة / الباقة', 'Durée / offre', 'Duration / plan'], whats_in: ['واش يحتوي', 'Ce qui est inclus', 'What’s included'], save_pct: ['وفّر', 'Économisez', 'Save'],
  no_results: ['ما لقينا حتى منتج', 'Aucun produit trouvé', 'No products found'], store_empty: ['المنتجات تتزاد قريبا', 'Produits bientôt disponibles', 'Products coming soon'],
  sh1: ['اختر المنتج والمدة', 'Choisissez le produit et la durée', 'Pick the product and duration'], sh2: ['ادفع بـ BaridiMob أو CCP وارفع الوصل', 'Payez par BaridiMob ou CCP et envoyez le reçu', 'Pay via BaridiMob or CCP and upload the receipt'], sh3: ['تستلم في حسابك مباشرة بعد التأكيد', 'Recevez dans votre compte dès confirmation', 'Receive it in your account once confirmed'],
  st_t1: ['دفع بالدينار', 'Paiement en DA', 'Pay in DZD'], st_t2: ['تسليم في حسابك', 'Livré dans votre compte', 'Delivered to your account'], st_t3: ['دعم في واتساب', 'Support WhatsApp', 'WhatsApp support'],
  warranty: ['الضمان', 'Garantie', 'Warranty'], qty: ['الكمية', 'Quantité', 'Quantity'],
});
const CAT_L = { subs: ['اشتراكات', 'Abonnements', 'Subscriptions'], accounts: ['حسابات', 'Comptes', 'Accounts'], ai: ['ذكاء اصطناعي', 'IA', 'AI'], design: ['تصميم', 'Design', 'Design'], tools: ['أدوات', 'Outils', 'Tools'], games: ['ألعاب', 'Jeux', 'Games'], courses: ['دورات', 'Formations', 'Courses'], digital: ['رقمي', 'Digital', 'Digital'], other: ['أخرى', 'Autres', 'Other'], creative: ['إعلانات', 'Publicités', 'Ads'], web: ['مواقع', 'Web', 'Web'], marketing: ['تسويق', 'Marketing', 'Marketing'], payment: ['دفع', 'Paiement', 'Payment'] };
ICONS.volx = ICONS.volx || '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>';
ICONS.film = '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 3v18M17 3v18M3 8h4M17 8h4M3 16h4M17 16h4M3 12h18"/>';
ICONS.monitor = '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>';
ICONS.mobile = '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>';
ICONS.zap = '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>';
ICONS.search = '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>';
ICONS.pause = '<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>';
ICONS.ext = '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';

/* ---------- page texts: defaults, overridden by admin (site_content key "pages") ---------- */
const L3 = (ar, fr, en) => ({ ar, fr, en });
const PAGES_DEF = {
  video: {
    eyebrow: L3('إنتاج الفيديو', 'Production vidéo', 'Video production'),
    title: L3('فيديوهات *توقف السكرول* وتبيع', 'Des vidéos qui *stoppent le scroll* et vendent', 'Videos that *stop the scroll* and sell'),
    sub: L3('فيديوهات بالذكاء الاصطناعي، كرياتيفز للمنتجات، موشن غرافيكس وفيديوهات الشركات. نكتبو السكريبت، نصممو ونسلمو جاهز للنشر والإعلان.', 'Vidéos IA, créas e-commerce, motion design et vidéos corporate. Script, création et livraison prêtes à publier.', 'AI videos, e-commerce creatives, motion graphics and corporate videos. Script, production and delivery ready to post and advertise.'),
    sections: {
      video_ai: { title: L3('فيديوهات الذكاء الاصطناعي', 'Vidéos IA', 'AI Videos'), sub: L3('مشاهد سينمائية، عارضو أزياء ومحتوى إبداعي فائق الدقة بالذكاء الاصطناعي.', 'Scènes cinématiques, avatars et créas hyper-réalistes générés par IA.', 'Cinematic visuals, AI models and photorealistic creative content.') },
      video_ecom: { title: L3('كرياتيفز المنتجات', 'Créas e-commerce', 'E-commerce creatives'), sub: L3('فيديوهات إعلانية قصيرة للمتاجر، مصممة باش تبيع في تيك توك وميتا.', 'Pubs courtes pour boutiques, pensées pour vendre sur TikTok et Meta.', 'Short ad videos for stores, built to sell on TikTok and Meta.') },
      video_motion: { title: L3('موشن غرافيكس', 'Motion design', 'Motion graphics'), sub: L3('أنيميشن يشرح منتجك ويخلي علامتك تتفكر.', 'Une animation qui explique votre produit et marque les esprits.', 'Animation that explains your product and makes your brand stick.') },
      video_corporate: { title: L3('فيديوهات الشركات', 'Vidéos corporate', 'Corporate videos'), sub: L3('تقديم الشركة، الفريق والخدمات بصورة احترافية تبني الثقة.', 'Présentez votre entreprise, équipe et services avec une image pro.', 'Present your company, team and services with a professional image.') },
    },
    steps: [L3('نفهمو منتجك وجمهورك', 'On comprend votre produit et votre audience', 'We learn your product and audience'), L3('سكريبت وستوري بورد', 'Script et storyboard', 'Script and storyboard'), L3('تصوير، أنيميشن ومونتاج', 'Tournage, animation et montage', 'Shooting, animation and editing'), L3('تسليم بكل المقاسات', 'Livraison dans tous les formats', 'Delivery in every format')],
    cats: ['creative'],
  },
  web: {
    eyebrow: L3('المواقع والمتاجر', 'Sites et boutiques', 'Websites & stores'),
    title: L3('صفحات هبوط ومتاجر *مصممة باش تبيع*', 'Landing pages et boutiques *conçues pour vendre*', 'Landing pages and stores *built to sell*'),
    sub: L3('تصفح تصاميمنا كيما يشوفهم زبونك: اهبط واطلع في كل صفحة من الأول للأخير، على الهاتف وعلى الحاسوب.', 'Parcourez nos designs comme vos clients : défilez chaque page de haut en bas, sur mobile et ordinateur.', 'Browse our designs the way your customers will: scroll each page top to bottom, on mobile and desktop.'),
    sections: {
      web_landing: { title: L3('صفحات الهبوط', 'Landing pages', 'Landing pages'), sub: L3('صفحة وحدة مركزة على منتج واحد، من العنوان حتى زر الطلب.', 'Une page centrée sur un produit, du titre au bouton de commande.', 'One page focused on one product, from headline to order button.') },
      web_store: { title: L3('المتاجر الإلكترونية', 'Boutiques en ligne', 'Online stores'), sub: L3('متجر كامل: منتجات، سلة، طلبات وتوصيل لكل الولايات.', 'Une boutique complète : produits, panier, commandes et livraison 58 wilayas.', 'A full store: products, cart, orders and delivery to every province.') },
    },
    steps: [L3('دراسة المنتج والمنافسين', 'Étude produit et concurrence', 'Product and competitor research'), L3('كتابة المحتوى والعروض', 'Rédaction et offres', 'Copy and offers'), L3('التصميم والبرمجة', 'Design et intégration', 'Design and build'), L3('الربط بالبيكسل والطلبات', 'Pixels et commandes', 'Pixels and order setup')],
    cats: ['web'],
  },
  store: {
    eyebrow: L3('المتجر الرقمي', 'Boutique digitale', 'Digital store'),
    title: L3('اشتراكات وحسابات *بالدينار وبلا تعقيد*', 'Abonnements et comptes *en dinars, sans prise de tête*', 'Subscriptions and accounts *in dinars, no hassle*'),
    sub: L3('اختر المنتج والمدة، ادفع بـ BaridiMob أو CCP، وتستلم في حسابك.', 'Choisissez le produit et la durée, payez par BaridiMob ou CCP, recevez-le dans votre compte.', 'Pick the product and duration, pay with BaridiMob or CCP, receive it in your account.'),
    cats: {},
  },
};
const PG = { content: {}, items: [], products: [] };
const pc = () => { const d = PAGES_DEF[PAGE] || {}, c = (PG.content || {})[PAGE] || {}; return { ...d, ...c, sections: { ...(d.sections || {}), ...(c.sections || {}) } }; };
const txt = o => tr(o) || '';
const rich = s => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const isRTL = () => document.dir === 'rtl';
const flip = () => { if (isRTL()) $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)'); };
const catName = k => { const c = (pc().cats || {})[k]; return (c && txt(c)) || (CAT_L[k] ? CAT_L[k][LI()] : k); };

/* ---------- shell ---------- */
function applyI18n() {
  $$('[data-i]').forEach(e => { const ico = e.dataset.icon ? ic(e.dataset.icon) + ' ' : ''; e.innerHTML = ico + esc(t(e.dataset.i)); });
  $$('[data-ii]').forEach(e => { e.innerHTML = (e.dataset.icon === 'wa' ? ic('wa') + ' ' : '') + esc(t(e.dataset.ii)) + (e.dataset.icon === 'arrow' ? ' ' + ic('arrow', 'ico flip go') : ''); });
  $$('[data-icon]:not([data-i]):not([data-ii])').forEach(e => e.innerHTML = ic(e.dataset.icon));
  $('#lsw').innerHTML = langSwitch('applyI18n');
  const c = pc();
  $('#eyb').innerHTML = ic(PAGE === 'video' ? 'film' : PAGE === 'web' ? 'monitor' : 'bag') + ' ' + esc(txt(c.eyebrow));
  $('#htitle').innerHTML = rich(txt(c.title));
  $('#hsub').textContent = txt(c.sub);
  document.title = txt(c.eyebrow) + ' · ONE FOR ALL';
  const wa = waLink(waMsg());
  $$('.wa-link').forEach(a => a.href = wa);
  $('#yr').textContent = new Date().getFullYear();
  if (PG.loaded) renderPage(); flip(); reveal();
}
const waMsg = (extra) => (LANG === 'ar' ? 'السلام عليكم، حاب نطلب: ' : LANG === 'fr' ? 'Bonjour, je souhaite commander : ' : 'Hello, I would like to order: ') + (extra || txt(pc().eyebrow));
function renderPage() { if (PAGE === 'video') renderVideo(); else if (PAGE === 'web') renderWeb(); else renderStore(); }
(() => {
  const hd = $('#hd'), prog = $('#prog'), mbar = $('#mbar'), drawer = $('#drawer'), burger = $('#burger'); let lastY = scrollY, tick = 0;
  const onScroll = () => {
    tick = 0; const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    hd.classList.toggle('sc', y > 8);
    if (!drawer.classList.contains('open')) hd.classList.toggle('hide', y > lastY && y > 320);
    mbar.classList.toggle('show', y > innerHeight * 0.55);
    lastY = y;
  };
  addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(onScroll); }, { passive: true });
  const setDrawer = open => { drawer.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); if (open) hd.classList.remove('hide'); };
  burger.onclick = () => setDrawer(!drawer.classList.contains('open'));
  drawer.onclick = e => { if (e.target.closest('a')) setDrawer(false); };
  addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });
  $$(`.hd nav a[data-pg="${PAGE}"], .drawer a[data-pg="${PAGE}"]`).forEach(a => { a.classList.add('on'); a.setAttribute('aria-current', 'page'); });
  onScroll();
})();
sb && sb.auth.getSession().then(({ data }) => { if (data.session) { T.register = [...T.account]; $$('a[href="app.html#/register"]').forEach(a => a.href = 'app.html#/'); applyI18n(); } });

/* sticky section tabs with a sliding indicator; highlights the section on screen */
function sectionTabs(list) {
  const box = $('#ptabs'); if (!box) return;
  box.hidden = list.length < 2;
  box.innerHTML = `<div class="pills" role="tablist"><i class="pind" aria-hidden="true"></i>${list.map(s => `<a class="pill" href="#${s.id}" data-t="${s.id}">${esc(s.label)}${s.n ? ` <span class="n">${s.n}</span>` : ''}</a>`).join('')}</div>`;
  const pills = $('.pills', box), ind = $('.pind', box);
  const mark = id => {
    $$('.pill', box).forEach(p => p.classList.toggle('on', p.dataset.t === id));
    const on = $('.pill.on', box); if (!on) return;
    ind.style.left = on.offsetLeft + 'px'; ind.style.width = on.offsetWidth + 'px';
    if (pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: on.offsetLeft - (pills.clientWidth - on.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
  };
  if (sectionTabs.io) sectionTabs.io.disconnect();
  if ('IntersectionObserver' in window) {
    sectionTabs.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    list.forEach(s => { const el = document.getElementById(s.id); if (el) sectionTabs.io.observe(el); });
  }
  requestAnimationFrame(() => mark(list[0] && list[0].id));
}

/* products of the page category, as order cards (same look as the landing services) */
function offerCards(cats) {
  const list = PG.products.filter(p => cats.includes(p.category) && p.type !== 'digital');
  if (!list.length) return '';
  return `<section id="offers"><div class="wrap"><div class="center rv" style="margin-bottom:28px"><span class="eyebrow">${ic('cash')} ${esc(t('pricing_t'))}</span><h2 class="h2">${esc(t('pricing_t'))}</h2><p class="lead">${esc(t('pricing_s'))}</p></div>
    <div class="grid g3">${list.map((p, i) => {
      const vs = (p.product_variants || []).filter(v => v.active); const ps = vs.map(v => v.price).filter(x => x > 0); const pr = ps.length ? Math.min(...ps) : null; const c = p.cover_url || (p.gallery || [])[0];
      return `<div class="card pc rv" style="--d:${(i % 3) * 0.08}s"><div class="cover">${c ? `<img src="${esc(c)}" alt="" loading="lazy">` : ic('spark')}</div><div class="body"><h3 style="margin:0">${esc(tr(p.name))}</h3><p class="small muted" style="margin:0">${esc(tr(p.description))}</p>
        <div class="row between"><span class="price">${pr ? money(pr) : t('on_quote')}</span>${p.delivery_days ? `<span class="tiny muted row" style="gap:4px">${ic('clock', 'ico" style="width:14px;height:14px')} ${p.delivery_days} ${t('days')}</span>` : ''}</div>
        <div class="actions"><a class="btn pri" href="app.html#/p/${encodeURIComponent(p.slug)}">${pr ? t('order_now') : t('request_quote')}</a><a class="btn wa icon" aria-label="WhatsApp" target="_blank" rel="noopener" href="${waLink(waMsg(tr(p.name)))}">${ic('wa')}</a></div></div></div>`;
    }).join('')}</div></div></section>`;
}
function stepsHTML(steps) {
  return `<section id="process"><div class="wrap"><div class="center rv" style="margin-bottom:30px"><span class="eyebrow">${ic('spark')} ${esc(t('how_t'))}</span><h2 class="h2">${esc(t('how_t'))}</h2></div>
    <ol class="pg-steps">${steps.map((s, i) => `<li class="rv" style="--d:${i * 0.08}s"><span class="k">0${i + 1}</span><b>${esc(txt(s))}</b></li>`).join('')}</ol></div></section>`;
}
const ctaHTML = () => `<section style="padding-top:10px"><div class="wrap"><div class="cta center rv zoom"><span class="blob drift"></span><span class="ring drift b"></span><h2 class="h2">${esc(t('cta_t'))}</h2><p class="lead">${esc(t('cta_s'))}</p><div class="row" style="justify-content:center;margin-top:18px"><a class="btn pri lg" href="app.html#/register">${esc(t('register'))} ${ic('arrow', 'ico flip go')}</a><a class="btn wa lg" target="_blank" rel="noopener" href="${waLink(waMsg())}">${ic('wa')} ${esc(t('wa_order'))}</a></div></div></div></section>`;
const sectionItems = key => PG.items.filter(x => x.section === key && x.media_url);
const secOn = (c, key) => (c.sections[key] || {}).active !== false;

/* ======================================================================
   VIDEO — one reel per category. Same reel as the main landing (smart sound, progress, autoplay next),
   several on the page: only the reel that is most on screen plays; sound settings are shared.
   ====================================================================== */
const RS = { snd: false, vol: 0.8, reels: [] };
try { const v = parseFloat(localStorage.getItem('ofa_vol')); if (v >= 0 && v <= 1) RS.vol = v; } catch (e) {}
const AUTO = !REDUCED && !(navigator.connection && navigator.connection.saveData);
const VOLOK = (() => { try { const a = document.createElement('audio'); a.volume = 0.5; return a.volume === 0.5; } catch (e) { return false; } })();
if (!VOLOK) document.documentElement.classList.add('novol');
function level(v, to, fast) {
  cancelAnimationFrame(v._fr); const from = v.volume, t0 = performance.now(), dur = fast ? 120 : 380;
  const st = n => { const k = Math.min(1, (n - t0) / dur); try { v.volume = from + (to - from) * k; } catch (e) {} if (k < 1) v._fr = requestAnimationFrame(st); };
  v._fr = requestAnimationFrame(st);
}
function slideHTML(x, i) {
  const cap = (title, desc, tag) => `<div class="cap">${tag ? `<span class="chip">${esc(tag)}</span>` : ''}<h3>${esc(title)}</h3>${desc ? `<p>${esc(desc)}</p>` : ''}</div>`;
  if (x.ph) return `<div class="slide ph" data-i="${i}" role="group" aria-label="${i + 1}"><span class="ph-ic">${ic('play')}</span>${cap(`${t('work_word')} 0${i + 1}`, t('ph_soon'))}</div>`;
  const url = x.media_url || ''; const yt = ytId(url); const client = (x.meta || {}).client;
  let media = '', play = '', extra = '';
  if (yt) { media = `<img src="${esc(x.poster_url || `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`)}" alt="" loading="lazy">`; play = `<button class="play" data-a="yt" data-yt="${yt}" aria-label="${t('play_sound')}">${ic('play')}</button>`; }
  else if (x.kind === 'video') {
    media = `<video data-src="${esc(url)}" ${x.poster_url ? `poster="${esc(x.poster_url)}"` : ''} muted playsinline preload="none" disablepictureinpicture></video>`;
    play = `<button class="play" data-a="play" aria-label="${t('play_sound')}">${ic('play')}</button>`;
    extra = `<span class="rl-bar" aria-hidden="true"><i></i></span><button class="rl-hint" data-a="snd">${ic('volx')}<span>${esc(t('tap_sound'))}</span></button>`
      + `<div class="rl-vol"><div class="rl-rail" role="slider" tabindex="0" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(t('vol_lbl'))}"><i class="rl-fill"></i><b class="rl-knob"></b><span class="rl-pct"></span></div>`
      + `<button class="rl-spk" data-a="mute" aria-label="${esc(t('mute'))}">${ic('volx')}<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></button></div>`
      + `<div class="sbtns"><button data-a="full" aria-label="${t('full')}">${ic('full')}</button></div>`;
  }
  else if (x.kind === 'image') { media = `<img src="${esc(url)}" alt="${esc(tr(x.title))}" loading="lazy">`; }
  else { media = `<span class="ph-ic" style="position:absolute;inset:0;margin:auto">${ic('globe')}</span>`; play = `<a class="play" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${t('open_link')}">${ic('arrow')}</a>`; }
  return `<div class="slide" data-i="${i}" role="group" aria-label="${i + 1}">${media}${play}${extra}${cap(tr(x.title), tr(x.description), client)}</div>`;
}
class Reel {
  constructor(root, items) {
    this.root = root; this.track = $('.track', root); this.cur = -1; this.ratio = 0; this.vis = false; this.idle = 0; this.pr = 0; this.raf = 0;
    const list = items.length ? items : [1, 2, 3].map(() => ({ ph: 1 }));
    this.track.innerHTML = list.map(slideHTML).join('');
    $('.dots', root).innerHTML = list.map((_, i) => `<button role="tab" aria-label="${i + 1}"></button>`).join('');
    this.slides = $$('.slide', this.track);
    this.slides.forEach(s => {
      const v = s.querySelector('video'); if (!v) return;
      v.addEventListener('playing', () => { s.classList.add('run'); if (s === this.slide()) { cancelAnimationFrame(this.pr); this.pr = requestAnimationFrame(() => this.tick()); } });
      v.addEventListener('pause', () => s.classList.remove('run'));
      v.addEventListener('ended', () => {
        if (s !== this.slide()) return;
        if (AUTO && this.slides.length > 1) this.goTo((this.cur + 1) % this.slides.length);
        else if (AUTO) { v.currentTime = 0; v.play().catch(() => {}); }
      });
    });
    this.wire(); RS.reels.push(this);
    requestAnimationFrame(() => this.pick());
  }
  slide() { return this.slides[this.cur]; }
  pick() {
    const r = this.track.getBoundingClientRect(), c = r.left + r.width / 2; let best = 0, bd = 1e9;
    this.slides.forEach((s, i) => { const b = s.getBoundingClientRect(); const d = Math.abs(b.left + b.width / 2 - c); if (d < bd) { bd = d; best = i; } });
    if (best !== this.cur) this.set(best);
  }
  set(i) {
    this.cur = i; const n = this.slides.length, nx = (i + 1) % n;
    this.slides.forEach((s, j) => {
      s.classList.toggle('on', j === i); s.classList.toggle('near', Math.abs(j - i) === 1); s.setAttribute('aria-hidden', j !== i);
      const v = s.querySelector('video');
      if (v) {
        const keep = j === i || (j === nx && this.vis);
        if (keep && !v.getAttribute('src') && v.dataset.src && (j !== i || this.vis || this.near)) { v.preload = j === i ? 'auto' : 'metadata'; v.src = v.dataset.src; }
        if (j !== i) this.leave(s, v);
        if (!keep && Math.abs(j - i) > 1 && v.getAttribute('src')) { v.removeAttribute('src'); v.load(); }
      }
      if (j !== i) { delete s.dataset.hold; delete s.dataset.go; const f = s.querySelector('iframe'); if (f) { f.remove(); s.classList.remove('playing'); } }
    });
    this.sync();
    $$('.dots button', this.root).forEach((d, j) => { d.classList.toggle('on', j === i); d.setAttribute('aria-selected', j === i); });
    const cnt = $('.wk-count', this.root); if (cnt) cnt.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b> / ${String(n).padStart(2, '0')}`;
    const pv = $('[data-r=prev]', this.root), nv = $('[data-r=next]', this.root); if (pv) pv.disabled = i === 0; if (nv) nv.disabled = i === n - 1;
  }
  goTo(i) { i = Math.max(0, Math.min(this.slides.length - 1, i)); const s = this.slides[i]; if (!s) return; const tr = this.track, l = s.offsetLeft - (tr.clientWidth - s.offsetWidth) / 2; tr.scrollTo({ left: l, behavior: REDUCED ? 'auto' : 'smooth' }); }
  target() { return RS.snd ? RS.vol * (0.25 + 0.75 * Math.min(1, Math.max(0, (this.ratio - 0.4) / 0.45))) : 0; }
  leave(s, v) {
    if (v.paused) { v.muted = true; return; }
    level(v, 0, true);
    setTimeout(() => { if (s !== this.slide() || !this.vis) { v.pause(); v.muted = true; if (s !== this.slide() && v.duration) v.currentTime = 0; } }, 160);
  }
  sync() {
    const s = this.slide(); if (!s) return;
    const v = s.querySelector('video'); this.paint();
    if (!v) return;
    if (this.vis && !v.getAttribute('src') && v.dataset.src) { v.preload = 'auto'; v.src = v.dataset.src; }
    const want = this.vis && !document.hidden && (AUTO || s.dataset.go === '1') && s.dataset.hold !== '1';
    if (!want) { if (!v.paused) this.leave(s, v); return; }
    v.muted = !RS.snd;
    if (!v.paused) return RS.snd && level(v, this.target());
    if (RS.snd) { cancelAnimationFrame(v._fr); try { v.volume = 0; } catch (e) {} }
    v.play().then(() => RS.snd && level(v, this.target())).catch(() => {
      if (v.muted) return;
      RS.snd = false; v.muted = true; this.paint();
      v.play().catch(() => {});
    });
  }
  tick() {
    const s = this.slide(), v = s && s.querySelector('video'); if (!v || v.paused) return;
    const bar = s.querySelector('.rl-bar i'); if (bar && v.duration) bar.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`;
    this.pr = requestAnimationFrame(() => this.tick());
  }
  paint() {
    const s = this.slide(); if (!s) return;
    this.slides.forEach(x => x.classList.toggle('snd', RS.snd && x === s));
    s.classList.toggle('vz', RS.vol < 0.01);
    s.style.setProperty('--v', RS.vol.toFixed(3));
    const r = s.querySelector('.rl-rail'); if (r) r.setAttribute('aria-valuenow', Math.round(RS.vol * 100));
    const p = s.querySelector('.rl-pct'); if (p) p.textContent = Math.round(RS.vol * 100) + '%';
  }
  soundOn() { if (RS.vol < 0.05) RS.vol = 0.6; RS.snd = true; this.openVol(); }
  setVol(x) {
    RS.vol = Math.round(Math.min(1, Math.max(0, x)) * 100) / 100;
    try { localStorage.setItem('ofa_vol', String(RS.vol)); } catch (e) {}
    if (!RS.snd && RS.vol > 0) this.soundOn();
    const v = this.slide()?.querySelector('video'); if (v && RS.snd) { v.muted = false; level(v, this.target(), true); }
    this.paint(); this.openVol();
  }
  openVol(drag) {
    const b = this.slide()?.querySelector('.rl-vol'); if (!b) return;
    b.classList.add('open'); b.classList.toggle('drag', !!drag);
    clearTimeout(this.idle); this.idle = setTimeout(() => b.classList.remove('open', 'drag'), drag ? 1e9 : 2600);
  }
  wire() {
    const track = this.track, R = this;
    track.addEventListener('scroll', () => { if (R.raf) return; R.raf = requestAnimationFrame(() => { R.raf = 0; R.pick(); }); }, { passive: true });
    $('[data-r=prev]', this.root).onclick = () => R.goTo(R.cur - 1);
    $('[data-r=next]', this.root).onclick = () => R.goTo(R.cur + 1);
    $('.dots', this.root).onclick = e => { const b = e.target.closest('button'); if (b) R.goTo([...b.parentNode.children].indexOf(b)); };
    track.addEventListener('keydown', e => { if (e.target.closest('.rl-rail')) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); R.goTo(R.cur + ((e.key === 'ArrowRight') !== isRTL() ? 1 : -1)); } });
    track.addEventListener('click', e => {
      const s = e.target.closest('.slide'); if (!s || e.target.closest('.rl-rail')) return; const i = +s.dataset.i;
      if (i !== R.cur) { e.preventDefault(); return R.goTo(i); }
      const a = e.target.closest('[data-a]')?.dataset.a; const v = s.querySelector('video');
      if (a === 'yt') { const id = e.target.closest('[data-a]').dataset.yt; s.insertAdjacentHTML('afterbegin', `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="video"></iframe>`); s.classList.add('playing'); return; }
      if (a === 'full') { const el = v || s; (el.requestFullscreen || el.webkitEnterFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); return; }
      if (!v) return;
      if (a === 'mute') { if (RS.snd && RS.vol > 0) { RS.snd = false; v.muted = true; R.paint(); } else { R.soundOn(); R.sync(); } return; }
      if (a === 'play' || a === 'snd' || v.paused) { s.dataset.go = '1'; delete s.dataset.hold; if (a !== undefined || !RS.snd) R.soundOn(); Reel.focus(R); R.sync(); }
      else if (!RS.snd) { R.soundOn(); R.sync(); }
      else { s.dataset.hold = '1'; v.pause(); }
    });
    track.addEventListener('pointerdown', e => {
      const r = e.target.closest('.rl-rail'); if (!r) return;
      e.preventDefault(); r.setPointerCapture?.(e.pointerId);
      const set = ev => { const b = r.getBoundingClientRect(); R.setVol(1 - (ev.clientY - b.top) / b.height); R.openVol(true); };
      set(e); r.onpointermove = set;
      r.onpointerup = r.onpointercancel = () => { r.onpointermove = r.onpointerup = r.onpointercancel = null; R.openVol(); };
    });
    track.addEventListener('wheel', e => { if (!e.target.closest('.rl-vol')) return; e.preventDefault(); R.setVol(RS.vol - Math.sign(e.deltaY) * 0.05); }, { passive: false });
    track.addEventListener('keydown', e => {
      if (!e.target.closest('.rl-rail')) return; const k = { ArrowUp: .05, ArrowRight: .05, ArrowDown: -.05, ArrowLeft: -.05, Home: -1, End: 1 }[e.key];
      if (k === undefined) return; e.preventDefault(); e.stopImmediatePropagation(); R.setVol(RS.vol + k);
    }, true);
    track.addEventListener('pointerover', e => { if (e.pointerType === 'mouse' && e.target.closest('.rl-vol')) R.openVol(); });
    let down = null;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button,a,.rl-vol')) return; down = { x: e.clientX, sl: track.scrollLeft, moved: false }; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 5 && !down.moved) { down.moved = true; track.classList.add('drag'); } if (down.moved) track.scrollLeft = down.sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; const moved = down.moved; down = null; if (moved) { track.classList.remove('drag'); R.pick(); R.goTo(R.cur); } });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => {
      R.ratio = Math.min(1, es[0].intersectionRatio / Math.min(1, innerHeight / (track.offsetHeight || 1)));
      R.near = es[0].isIntersecting; Reel.arbitrate();
    }, { threshold: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1], rootMargin: '200px 0px' }).observe(track);
  }
  /* only the reel most on screen plays */
  static arbitrate() {
    let best = null; RS.reels.forEach(r => { if (r.ratio >= 0.4 && (!best || r.ratio > best.ratio)) best = r; });
    if (RS.forced && RS.forced.ratio >= 0.4) best = RS.forced;
    RS.reels.forEach(r => {
      const vis = r === best;
      if (vis !== r.vis) { r.vis = vis; r.sync(); }
      else if (vis) { const v = r.slide()?.querySelector('video'); if (v && !v.paused && RS.snd) level(v, r.target()); }
    });
  }
  static focus(r) { RS.forced = r; clearTimeout(RS.ft); RS.ft = setTimeout(() => { RS.forced = null; }, 4000); Reel.arbitrate(); }
}
document.addEventListener('visibilitychange', () => RS.reels.forEach(r => r.sync()));

function renderVideo() {
  const c = pc(), keys = Object.keys(c.sections).filter(k => secOn(c, k));
  const main = $('#pgmain');
  RS.reels.forEach(r => r.slides.forEach(s => { const v = s.querySelector('video'); if (v) { v.pause(); v.removeAttribute('src'); } })); RS.reels = [];
  main.innerHTML = keys.map((k, n) => {
    const s = c.sections[k], items = sectionItems(k);
    return `<section class="vsec" id="${k}" aria-roledescription="carousel"><span class="blob drift"></span><span class="ring drift b"></span>
      <div class="wrap wk-head"><div class="rv"><span class="eyebrow"><span class="ix">0${n + 1}</span> ${esc(txt(s.title))}</span><h2 class="h2">${esc(txt(s.title))}</h2><p class="lead" style="margin:0">${esc(txt(s.sub))}</p></div>
      <div class="wk-ctl rv" style="--d:.1s"><button class="btn" data-r="prev" aria-label="${t('prev')}">${ic('back', 'ico flip')}</button><span class="wk-count"></span><button class="btn pri" data-r="next" aria-label="${t('next')}">${ic('arrow', 'ico flip')}</button></div></div>
      <div class="track rv zoom" tabindex="0" style="--d:.15s"></div><div class="dots" role="tablist"></div>
      <div class="wrap center vsec-cta rv"><a class="btn wa" target="_blank" rel="noopener" href="${waLink(waMsg(txt(s.title)))}">${ic('wa')} ${esc(t('wa_order'))} · ${esc(txt(s.title))}</a></div></section>`;
  }).join('') + stepsHTML(c.steps) + offerCards(c.cats || []) + ctaHTML();
  $$('.vsec', main).forEach(sec => new Reel(sec, sectionItems(sec.id)));
  sectionTabs(keys.map(k => ({ id: k, label: txt(c.sections[k].title), n: sectionItems(k).length })));
  heroStack(keys);
}
/* hero art: a fan of three phones, one poster per category */
function heroStack(keys) {
  const box = $('#hart'); if (!box) return;
  const firsts = keys.map(k => ({ k, x: sectionItems(k)[0] })).slice(0, 3);
  box.innerHTML = `<div class="fan">${firsts.map((f, i) => {
    const x = f.x, yt = x && ytId(x.media_url), poster = x && (x.poster_url || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : x.kind === 'image' ? x.media_url : ''));
    const vid = x && x.kind === 'video' && !yt && !poster ? `<video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video>` : '';
    return `<a class="ph-card c${i}" href="#${f.k}" style="--i:${i}">${poster ? `<img src="${esc(poster)}" alt="" loading="lazy">` : vid || `<span class="ph-ic">${ic('play')}</span>`}<span class="lbl">${esc(txt(pc().sections[f.k].title))}</span></a>`;
  }).join('')}</div>`;
}

/* ======================================================================
   WEB — design studio: list of designs + a device frame you scroll like the real page,
   minimap with a draggable window, auto tour, fullscreen viewer.
   ====================================================================== */
const SD = {}; // per section state
function renderWeb() {
  const c = pc(), keys = Object.keys(c.sections).filter(k => secOn(c, k));
  const main = $('#pgmain');
  main.innerHTML = keys.map((k, n) => {
    const s = c.sections[k], items = sectionItems(k);
    return `<section class="wsec" id="${k}"><div class="wrap">
      <div class="wk-head" style="margin-bottom:22px"><div class="rv"><span class="eyebrow"><span class="ix">0${n + 1}</span> ${esc(txt(s.title))}</span><h2 class="h2">${esc(txt(s.title))}</h2><p class="lead" style="margin:0">${esc(txt(s.sub))}</p></div>
      <span class="chip g rv">${items.length} ${esc(t('designs'))}</span></div>
      ${items.length ? `<div class="studio rv zoom" data-k="${k}"><div class="std-list" role="listbox">${items.map((x, i) => thumbHTML(x, i)).join('')}</div><div class="std-stage"></div></div>`
        : `<div class="studio empty rv"><div class="std-stage">${deviceHTML(null, 'mobile')}</div></div>`}
    </div></section>`;
  }).join('') + stepsHTML(c.steps) + offerCards(c.cats || []) + ctaHTML();
  $$('.studio[data-k]', main).forEach(st => { const k = st.dataset.k; SD[k] = { i: 0, items: sectionItems(k) }; showDesign(st, 0); });
  main.onclick = e => {
    const th = e.target.closest('.std-th'); if (th) { const st = th.closest('.studio'); showDesign(st, +th.dataset.i); return; }
    const b = e.target.closest('[data-v]'); if (!b) return; const st = b.closest('.studio'); const S = SD[st.dataset.k];
    if (b.dataset.v === 'tour') toggleTour(st);
    if (b.dataset.v === 'full') openViewer(st.dataset.k, S.i);
    if (b.dataset.v === 'nx' || b.dataset.v === 'pv') showDesign(st, (S.i + (b.dataset.v === 'nx' ? 1 : -1) + S.items.length) % S.items.length);
  };
  sectionTabs(keys.map(k => ({ id: k, label: txt(c.sections[k].title), n: sectionItems(k).length })));
  heroDevice(keys);
}
const devOf = x => ((x && x.meta) || {}).device === 'desktop' ? 'desktop' : 'mobile';
const thumbOf = x => x.poster_url || x.media_url;
function thumbHTML(x, i) {
  return `<button class="std-th" data-i="${i}" role="option"><span class="tw ${devOf(x)}"><img src="${esc(thumbOf(x))}" alt="" loading="lazy"></span><span class="tt"><b>${esc(tr(x.title) || '—')}</b><small>${ic(devOf(x) === 'desktop' ? 'monitor' : 'mobile')} ${esc(((x.meta || {}).client) || t(devOf(x)))}</small></span></button>`;
}
function deviceHTML(x, dev) {
  const host = x && (x.meta || {}).link ? (() => { try { return new URL(x.meta.link).host; } catch (e) { return ''; } })() : 'oneforall.dz';
  return `<div class="dev ${dev}"><div class="dev-bar">${dev === 'desktop' ? `<i></i><i></i><i></i><span class="url">${esc(host || 'oneforall.dz')}</span>` : '<span class="notch"></span>'}</div>
    <div class="dev-body"><div class="dev-screen" tabindex="0">${x ? `<img class="dev-img" src="${esc(x.media_url)}" alt="${esc(tr(x.title))}" decoding="async">` : `<div class="dev-ph">${ic('image')}<p>${esc(t('ph_soon'))}</p></div>`}</div>
    ${x ? `<div class="dev-hint"><span class="mouse"><i></i></span>${esc(t('scroll_hint'))}</div>` : ''}</div>
    <div class="dev-prog"><i></i></div></div>`;
}
function showDesign(st, i) {
  const S = SD[st.dataset.k]; const x = S.items[i]; if (!x) return; S.i = i; stopTour(st);
  $$('.std-th', st).forEach(b => { b.classList.toggle('on', +b.dataset.i === i); b.setAttribute('aria-selected', +b.dataset.i === i); });
  const on = $('.std-th.on', st); const ls = $('.std-list', st); if (on && ls && ls.scrollWidth > ls.clientWidth + 4) ls.scrollTo({ left: on.offsetLeft - (ls.clientWidth - on.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
  const link = (x.meta || {}).link;
  $('.std-stage', st).innerHTML = `<div class="std-frame">${deviceHTML(x, devOf(x))}<div class="mini" aria-hidden="true"><img src="${esc(x.media_url)}" alt=""><span class="win"></span></div></div>
    <div class="std-info"><div><b>${esc(tr(x.title))}</b>${tr(x.description) ? `<p class="small muted" style="margin:2px 0 0">${esc(tr(x.description))}</p>` : ''}</div>
    <div class="std-tools">${S.items.length > 1 ? `<button class="btn icon" data-v="pv" aria-label="${t('prev')}">${ic('back', 'ico flip')}</button>` : ''}
      <button class="btn" data-v="tour">${ic('play')} <span>${esc(t('tour'))}</span></button>
      <button class="btn icon" data-v="full" aria-label="${t('full')}">${ic('full')}</button>
      ${link ? `<a class="btn icon" href="${esc(link)}" target="_blank" rel="noopener" aria-label="${t('see_live')}" title="${t('see_live')}">${ic('ext')}</a>` : ''}
      ${S.items.length > 1 ? `<button class="btn icon" data-v="nx" aria-label="${t('next')}">${ic('arrow', 'ico flip')}</button>` : ''}</div>
    <a class="btn pri block" href="${waLink(waMsg(`${txt(pc().sections[st.dataset.k].title)} · ${tr(x.title)}`))}" target="_blank" rel="noopener">${ic('wa')} ${esc(t('order_like'))}</a></div>`;
  flip(); wireScreen($('.std-frame', st));
}
/* scroll screen <-> progress bar + minimap window (drag the window to scroll) */
function wireScreen(frame) {
  const sc = $('.dev-screen', frame), bar = $('.dev-prog i', frame), mini = $('.mini', frame), win = mini && $('.win', mini), hint = $('.dev-hint', frame); if (!sc) return;
  const paint = () => {
    const max = sc.scrollHeight - sc.clientHeight, k = max > 0 ? sc.scrollTop / max : 0;
    bar.style.transform = `scaleY(${k.toFixed(4)})`;
    if (win && mini.offsetHeight) { const mi = $('img', mini), h = mi.offsetHeight || 1, vh = Math.min(1, sc.clientHeight / (sc.scrollHeight || 1)); win.style.height = (vh * h) + 'px'; win.style.transform = `translateY(${(sc.scrollTop / (sc.scrollHeight || 1)) * h}px)`; }
    if (sc.scrollTop > 30 && hint) hint.classList.add('gone');
  };
  sc.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
  const img = $('.dev-img', frame); if (img) { img.addEventListener('load', paint); }
  const mi = mini && $('img', mini); if (mi) mi.addEventListener('load', paint);
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev => sc.addEventListener(ev, () => { const st = frame.closest('.studio,.viewer'); if (st && st._tour) stopTour(st); }, { passive: true }));
  if (mini) {
    const go = e => { const r = $('img', mini).getBoundingClientRect(), k = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)); sc.scrollTop = k * sc.scrollHeight - sc.clientHeight / 2; };
    mini.addEventListener('pointerdown', e => { e.preventDefault(); const st = frame.closest('.studio,.viewer'); if (st) stopTour(st); mini.setPointerCapture?.(e.pointerId); go(e); mini.onpointermove = go; mini.onpointerup = mini.onpointercancel = () => { mini.onpointermove = mini.onpointerup = null; }; });
  }
  paint();
}
function toggleTour(st) { if (st._tour) return stopTour(st); const sc = $('.dev-screen', st); if (!sc) return;
  if (sc.scrollTop >= sc.scrollHeight - sc.clientHeight - 4) sc.scrollTop = 0;
  const b = $('[data-v=tour]', st); if (b) b.innerHTML = `${ic('pause')} <span>${esc(t('stop'))}</span>`; st.classList.add('touring');
  let last = 0; const speed = Math.max(140, sc.clientHeight * 0.32); // px per second
  const step = n => { if (!st._tour) return; if (last) sc.scrollTop += speed * Math.min(0.05, (n - last) / 1000); last = n;
    if (sc.scrollTop >= sc.scrollHeight - sc.clientHeight - 1) return stopTour(st); st._tour = requestAnimationFrame(step); };
  st._tour = requestAnimationFrame(step);
}
function stopTour(st) { if (!st._tour) return; cancelAnimationFrame(st._tour); st._tour = 0; st.classList.remove('touring'); const b = $('[data-v=tour]', st); if (b) b.innerHTML = `${ic('play')} <span>${esc(t('tour'))}</span>`; }
/* fullscreen viewer */
function openViewer(k, i) {
  const S = SD[k]; const x = S.items[i]; if (!x) return;
  closeViewer(); const v = document.createElement('div'); v.className = 'viewer'; v.id = 'viewer'; v.dataset.k = k; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
  const link = (x.meta || {}).link;
  v.innerHTML = `<div class="vw-top"><div class="vw-t"><b>${esc(tr(x.title))}</b><small class="ltr">${i + 1} / ${S.items.length}</small></div><div class="row nowrap">
    <button class="btn" data-v="tour">${ic('play')} <span>${esc(t('tour'))}</span></button>${link ? `<a class="btn icon" href="${esc(link)}" target="_blank" rel="noopener" aria-label="${t('see_live')}">${ic('ext')}</a>` : ''}
    <button class="btn icon" data-v="x" aria-label="${t('close')}">${ic('x')}</button></div></div>
    <div class="vw-stage">${S.items.length > 1 ? `<button class="vw-nav pv" data-v="pv" aria-label="${t('prev')}">${ic('back', 'ico flip')}</button>` : ''}<div class="std-frame">${deviceHTML(x, devOf(x))}<div class="mini" aria-hidden="true"><img src="${esc(x.media_url)}" alt=""><span class="win"></span></div></div>${S.items.length > 1 ? `<button class="vw-nav nx" data-v="nx" aria-label="${t('next')}">${ic('arrow', 'ico flip')}</button>` : ''}</div>
    <div class="vw-foot"><a class="btn pri" target="_blank" rel="noopener" href="${waLink(waMsg(`${txt(pc().sections[k].title)} · ${tr(x.title)}`))}">${ic('wa')} ${esc(t('order_like'))}</a></div>`;
  document.body.append(v); document.body.style.overflow = 'hidden'; flip();
  wireScreen($('.std-frame', v));
  v.onclick = e => { const b = e.target.closest('[data-v]'); if (!b) { if (e.target === v) closeViewer(); return; }
    const a = b.dataset.v; if (a === 'x') closeViewer(); if (a === 'tour') toggleTour(v);
    if (a === 'nx' || a === 'pv') openViewer(k, (i + (a === 'nx' ? 1 : -1) + S.items.length) % S.items.length); };
  v._key = e => { if (e.key === 'Escape') closeViewer(); if (S.items.length > 1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) openViewer(k, (i + ((e.key === 'ArrowRight') !== isRTL() ? 1 : -1) + S.items.length) % S.items.length); };
  addEventListener('keydown', v._key); $('.dev-screen', v).focus({ preventScroll: true });
}
function closeViewer() { const v = $('#viewer'); if (!v) return; stopTour(v); removeEventListener('keydown', v._key); v.remove(); document.body.style.overflow = ''; }
/* hero art: laptop + phone, the phone scrolls the first design slowly */
function heroDevice(keys) {
  const box = $('#hart'); if (!box) return;
  const all = keys.flatMap(k => sectionItems(k)); const m = all.find(x => devOf(x) === 'mobile'), d = all.find(x => devOf(x) === 'desktop') || all.find(x => x !== m);
  box.innerHTML = `<div class="duo"><div class="lap"><div class="dev desktop"><div class="dev-bar"><i></i><i></i><i></i><span class="url">oneforall.dz</span></div><div class="dev-body"><div class="auto">${d ? `<img src="${esc(d.media_url)}" alt="" loading="lazy">` : '<span class="sk"></span><span class="sk s"></span><span class="sk"></span>'}</div></div></div></div>
    <div class="pho"><div class="dev mobile"><div class="dev-bar"><span class="notch"></span></div><div class="dev-body"><div class="auto">${m ? `<img src="${esc(m.media_url)}" alt="" loading="lazy">` : '<span class="sk"></span><span class="sk s"></span><span class="sk"></span><span class="sk"></span>'}</div></div></div></div></div>`;
}

/* ======================================================================
   STORE — digital products with durations / packages (product_variants + meta)
   ====================================================================== */
const STORE = { cat: 'all', q: '' };
const vMeta = v => v.meta || {};
const pMeta = p => p.meta || {};
const storeList = () => PG.products.filter(p => p.type === 'digital' || pMeta(p).store).map(p => ({ ...p, vs: (p.product_variants || []).filter(v => v.active).sort((a, b) => (a.sort || 0) - (b.sort || 0)) }));
const vLabel = v => txt(vMeta(v).duration) || tr(v.name);
const minPrice = p => { const ps = p.vs.map(v => v.price).filter(x => x > 0); return ps.length ? Math.min(...ps) : null; };
const pct = v => { const o = +vMeta(v).old_price; return o > 0 && v.price > 0 && o > v.price ? Math.round(100 * (1 - v.price / o)) : 0; };
const delivTxt = p => { const m = pMeta(p); return m.delivery === 'instant' ? t('instant') : (p.delivery_days ? `${t('manual')} · ${t('within')} ${p.delivery_days * 24 <= 48 ? p.delivery_days * 24 + ' ' + t('hours') : p.delivery_days + ' ' + t('days')}` : t('manual')); };
const ART = { subs: 'video', accounts: 'growth', ai: 'spark', design: 'web', tools: 'box', games: 'video', courses: 'files', digital: 'files', other: 'shield' };
function coverHTML(p) {
  const c = p.cover_url || (p.gallery || [])[0], col = pMeta(p).color;
  return `<div class="sp-cover" ${col ? `style="--c:${esc(col)}"` : ''}>${c ? `<img src="${esc(c)}" alt="${esc(tr(p.name))}" loading="lazy">` : `<span class="sp-mono">${esc((tr(p.name) || '?').trim().slice(0, 2))}</span>`}</div>`;
}
function renderStore() {
  const list = storeList(); const main = $('#pgmain');
  const cats = [...new Set(list.map(p => p.category).filter(Boolean))];
  main.innerHTML = `<section id="shop" class="shop"><div class="wrap">
      <div class="shop-bar rv"><label class="sbox">${ic('search')}<input id="sq" type="search" placeholder="${esc(t('st_search'))}" value="${esc(STORE.q)}" autocomplete="off"></label>
      <div class="filters" id="scat" ${cats.length < 2 ? 'hidden' : ''}><div class="pills" role="tablist"><i class="pind" aria-hidden="true"></i>${['all', ...cats].map(k => `<button class="pill ${k === STORE.cat ? 'on' : ''}" data-c="${esc(k)}">${esc(k === 'all' ? t('f_all') : catName(k))}</button>`).join('')}</div></div></div>
      <div class="sgrid" id="sgrid">${list.length ? list.map(cardHTML).join('') : `<div class="card empty" style="grid-column:1/-1">${ic('bag')}<p>${esc(t('store_empty'))}</p><a class="btn wa" target="_blank" rel="noopener" href="${waLink(waMsg())}">${ic('wa')} ${esc(t('wa_order'))}</a></div>`}</div>
      <p class="center muted" id="snone" hidden>${esc(t('no_results'))}</p>
    </div></section>
    <section id="store-how" style="padding-top:20px"><div class="wrap"><ol class="pg-steps s3">${['sh1', 'sh2', 'sh3'].map((k, i) => `<li class="rv" style="--d:${i * 0.08}s"><span class="k">0${i + 1}</span><b>${esc(t(k))}</b></li>`).join('')}</ol></div></section>` + ctaHTML();
  const q = $('#sq'); q.oninput = () => { STORE.q = q.value; filterStore(); };
  $('#scat').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; STORE.cat = b.dataset.c; filterStore(); };
  $('#sgrid').onclick = e => { const c = e.target.closest('[data-p]'); if (c) openStoreProduct(c.dataset.p); };
  filterStore(true); openFromHash();
  heroStore(list);
}
function cardHTML(p, i) {
  const m = pMeta(p), pr = minPrice(p), out = p.vs.length && p.vs.every(v => vMeta(v).stock === 'out'), best = Math.max(0, ...p.vs.map(pct));
  return `<article class="sp card rv${out ? ' out' : ''}" style="--d:${(i % 4) * 0.06}s" data-p="${esc(p.slug)}" data-cat="${esc(p.category || '')}" data-q="${esc((tr(p.name) + ' ' + tr(p.description) + ' ' + (p.category || '')).toLowerCase())}" tabindex="0" role="button" aria-label="${esc(tr(p.name))}">
    ${coverHTML(p)}<div class="sp-badges">${m.badge ? `<span class="chip g">${ic('star', 'ico" style="width:12px;height:12px')} ${esc(txt(m.badge) || m.badge)}</span>` : ''}${best ? `<span class="chip w">-${best}%</span>` : ''}${out ? `<span class="chip b">${esc(t('out_stock'))}</span>` : ''}</div>
    <div class="sp-body"><h3>${esc(tr(p.name))}</h3><p class="small muted">${esc(tr(p.description))}</p>
    ${p.vs.length > 1 ? `<div class="sp-durs">${p.vs.slice(0, 3).map(v => `<span>${esc(vLabel(v))}</span>`).join('')}${p.vs.length > 3 ? `<span>+${p.vs.length - 3}</span>` : ''}</div>` : ''}
    <div class="sp-foot"><span class="sp-del ${m.delivery === 'instant' ? 'fast' : ''}">${ic(m.delivery === 'instant' ? 'zap' : 'clock')} ${esc(m.delivery === 'instant' ? t('instant') : t('manual'))}</span>
    <span class="sp-pr">${pr ? `<small>${esc(t('from'))}</small> <b>${money(pr)}</b>` : `<b>${esc(t('on_quote'))}</b>`}</span></div></div></article>`;
}
function filterStore(first) {
  const q = STORE.q.trim().toLowerCase(); let n = 0;
  $$('#sgrid .sp').forEach((c, i) => { const show = (STORE.cat === 'all' || c.dataset.cat === STORE.cat) && (!q || c.dataset.q.includes(q)); c.classList.toggle('hide', !show); if (show) { n++; if (!first && !REDUCED) { c.classList.add('shown', 'done'); c.classList.remove('show'); void c.offsetWidth; c.style.animationDelay = (i % 8) * 0.03 + 's'; c.classList.add('show'); } } });
  const none = $('#snone'); if (none) none.hidden = n > 0 || !$$('#sgrid .sp').length;
  const box = $('#scat'); if (!box) return; $$('.pill', box).forEach(b => b.classList.toggle('on', b.dataset.c === STORE.cat));
  const on = $('.pill.on', box), ind = $('.pind', box); if (on && ind) { ind.style.left = on.offsetLeft + 'px'; ind.style.width = on.offsetWidth + 'px'; }
}
function openFromHash() { const m = location.hash.match(/^#p=([\w-]+)/); if (m) openStoreProduct(m[1]); }
addEventListener('hashchange', () => { if (PAGE === 'store') openFromHash(); });
function openStoreProduct(slug) {
  const p = storeList().find(x => x.slug === slug); if (!p) return;
  if (location.hash !== '#p=' + slug) history.replaceState(null, '', '#p=' + slug);
  const m = pMeta(p), feats = (txt(m.features) || '').split('\n').map(s => s.trim()).filter(Boolean);
  const first = p.vs.find(v => vMeta(v).stock !== 'out') || p.vs[0];
  const imgs = [...new Set([p.cover_url, ...(p.gallery || [])].filter(Boolean))];
  const body = modal(tr(p.name), `<div class="spx">
    <div class="spx-head">${coverHTML(p)}<div><p class="muted" style="margin:0 0 8px">${esc(tr(p.description))}</p><div class="row" style="gap:6px"><span class="chip ${m.delivery === 'instant' ? 'g' : ''}">${ic(m.delivery === 'instant' ? 'zap' : 'clock', 'ico" style="width:13px;height:13px')} ${esc(delivTxt(p))}</span>${m.warranty ? `<span class="chip i">${ic('shield', 'ico" style="width:13px;height:13px')} ${esc(t('warranty'))}: ${esc(txt(m.warranty) || m.warranty)}</span>` : ''}</div></div></div>
    ${imgs.length > 1 ? `<div class="gal">${imgs.map(u => `<img src="${esc(u)}" alt="" loading="lazy">`).join('')}</div>` : ''}
    ${p.vs.length ? `<h4 class="spx-h">${esc(t('duration'))}</h4><div class="vopts" role="radiogroup">${p.vs.map(v => { const vm = vMeta(v), out = vm.stock === 'out', d = pct(v);
      return `<label class="vopt${out ? ' out' : ''}"><input type="radio" name="sv" value="${v.id}" ${v === first ? 'checked' : ''} ${out ? 'disabled' : ''}>
        <span class="vo-in">${vm.badge ? `<span class="vo-badge">${esc(txt(vm.badge) || vm.badge)}</span>` : ''}<b class="vo-l">${esc(vLabel(v))}</b>
        <span class="vo-p">${v.price > 0 ? money(v.price) : esc(t('on_quote'))}</span>${+vm.old_price > 0 && d ? `<span class="vo-o"><s>${money(+vm.old_price)}</s> <em>-${d}%</em></span>` : ''}
        ${out ? `<span class="vo-st">${esc(t('out_stock'))}</span>` : vm.stock === 'low' ? `<span class="vo-st low">${esc(t('low_stock'))}</span>` : ''}</span></label>`; }).join('')}</div>` : ''}
    <div id="vfeat"></div>
    ${feats.length ? `<h4 class="spx-h">${esc(t('whats_in'))}</h4><ul class="ticks">${feats.map(f => `<li>${ic('check')}<span>${esc(f)}</span></li>`).join('')}</ul>` : ''}
    ${txt(m.delivery_note) ? `<p class="small muted spx-note">${ic('clock', 'ico" style="width:14px;height:14px')} ${esc(txt(m.delivery_note))}</p>` : ''}
    <div class="spx-buy"><div class="row between"><span class="muted">${esc(t('total'))}</span><b id="stot" class="num"></b></div>
      <a class="btn pri lg block" id="sbuy">${ic('bag')} ${esc(t('buy_now'))}</a><a class="btn wa block" id="swa" target="_blank" rel="noopener">${ic('wa')} ${esc(t('wa_order'))}</a></div>
    <ol class="mini-steps">${['sh1', 'sh2', 'sh3'].map((k, i) => `<li><span>${i + 1}</span>${esc(t(k))}</li>`).join('')}</ol></div>`, { wide: true });
  const upd = () => {
    const id = ($('input[name=sv]:checked', body) || {}).value; const v = p.vs.find(x => x.id === id);
    $('#stot', body).textContent = v ? (v.price > 0 ? money(v.price) : t('on_quote')) : (minPrice(p) ? money(minPrice(p)) : t('on_quote'));
    $('#sbuy', body).href = `app.html#/p/${encodeURIComponent(p.slug)}${v ? '/' + v.id : ''}`;
    $('#swa', body).href = waLink(waMsg(`${tr(p.name)}${v ? ' · ' + vLabel(v) + (v.price > 0 ? ' (' + money(v.price) + ')' : '') : ''}`));
    const vf = v ? (txt(vMeta(v).features) || '').split('\n').map(s => s.trim()).filter(Boolean) : [];
    $('#vfeat', body).innerHTML = vf.length ? `<ul class="ticks sm">${vf.map(f => `<li>${ic('check')}<span>${esc(f)}</span></li>`).join('')}</ul>` : '';
  };
  body.addEventListener('change', upd); upd();
  const mo = $('#modal'); if (mo) { mo.classList.add('store-sheet'); mo.addEventListener('click', e => { if (e.target === mo || e.target.closest('[data-close]')) history.replaceState(null, '', location.pathname); }); }
}
function heroStore(list) {
  const box = $('#hart'); if (!box) return;
  const top = list.slice(0, 5);
  box.innerHTML = `<div class="orbit">${top.length ? top.map((p, i) => `<button class="ob o${i}" data-p="${esc(p.slug)}" style="--i:${i}">${coverHTML(p)}<span><b>${esc(tr(p.name))}</b>${minPrice(p) ? `<small>${money(minPrice(p))}</small>` : ''}</span></button>`).join('') : ''}<span class="core">${ic('bag')}</span></div>`;
  box.onclick = e => { const b = e.target.closest('[data-p]'); if (b) openStoreProduct(b.dataset.p); };
}

/* ---------- load ---------- */
async function loadPage() {
  if (!sb) { PG.loaded = true; return applyI18n(); }
  try {
    const [c, pf, pr] = await Promise.all([
      sb.from('site_content').select('key,value').eq('key', 'pages'),
      PAGE === 'store' ? Promise.resolve({ data: [] }) : sb.from('portfolio').select('*').eq('active', true).order('sort'),
      sb.from('products').select('*, product_variants(*)').eq('active', true).order('sort'),
      publicSettings(),
    ]);
    PG.content = ((c.data || [])[0] || {}).value || {};
    PG.items = (pf.data || []).filter(x => x.section);
    PG.products = pr.data || [];
  } catch (e) { console.error(e); }
  PG.loaded = true; $('#pgmain').classList.remove('loading');
  applyI18n();
}
applyI18n(); loadPage();
