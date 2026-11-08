/* pages-plus.js - loaded after pages.js on every service page (video / web / ads / store).
   Adds the ads accounts page (ads.html: TikTok Ads / Facebook Ads accounts), the 4th page link label, and fills
   admin-edited section texts with their defaults, so saving one field in the admin keeps the other default texts.
   Additive: wraps renderPage and applyI18n from pages.js. */
Object.assign(T, {
  n_ads: ['الإعلانات', 'Pub', 'Ads'],
  ad_why: ['علاش تاخذ حسابك من عندنا', 'Pourquoi chez nous', 'Why get it from us'], ad_order: ['اطلب الحساب', 'Commander le compte', 'Order the account'],
  ad_b1: ['ادفع بالدينار', 'Payez en dinars', 'Pay in dinars'], ad_b1s: ['BaridiMob أو CCP، بلا بطاقة أجنبية', 'BaridiMob ou CCP, sans carte étrangère', 'BaridiMob or CCP, no foreign card'],
  ad_b2: ['تسليم في حسابك', 'Livré dans votre compte', 'Delivered to your account'], ad_b2s: ['تتبع طلبك خطوة بخطوة من لوحة التحكم', 'Suivez votre commande depuis votre espace', 'Track your order from your dashboard'],
  ad_b3: ['مرافقة في واتساب', 'Accompagnement WhatsApp', 'WhatsApp support'], ad_b3s: ['نجاوبوك على أي سؤال قبل وبعد التسليم', 'On répond avant et après la livraison', 'We answer before and after delivery'],
  ad_b4: ['جاهز للإعلان', 'Prêt à diffuser', 'Ready to advertise'], ad_b4s: ['تطلق حملتك مباشرة بعد الاستلام', 'Lancez votre campagne dès réception', 'Launch your campaign right after delivery'],
  ad_more: ['خدمات أخرى للإعلان', 'Autres services pub', 'More ad services'],
  ad_spend: ['المصاريف', 'Dépenses', 'Spend'], ad_res: ['النتائج', 'Résultats', 'Results'],
});
if (PAGE === 'ads') T.pg_explore = ['شوف الحسابات', 'Voir les comptes', 'See the accounts'];
ICONS.tt = '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.6 2.7 2.5 4.5 5.5 4.8"/>';
ICONS.fb = '<path d="M2.5 15.2c0-4.3 2.2-8.2 4.8-8.2 3.9 0 6 10 9.6 10 2.4 0 4.6-2.6 4.6-6 0-2.4-1.3-4-3.2-4-3.8 0-6.1 10-10.6 10-2.6 0-5.2-.4-5.2-1.8z"/>';
ICONS.mega = '<path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8M8 15l1 5"/>';
PAGES_DEF.ads = {
  eyebrow: L3('حسابات الإعلانات', 'Comptes publicitaires', 'Ad accounts'),
  title: L3('حسابات تيك توك أدس وفايسبوك أدس *جاهزة للإطلاق*', 'Comptes TikTok Ads et Facebook Ads *prêts à lancer*', 'TikTok Ads and Facebook Ads accounts *ready to launch*'),
  sub: L3('اطلب حسابك الإعلاني، ادفع بالدينار وتستلمو في حسابك. نرافقوك حتى تطلق أول حملة.', 'Commandez votre compte publicitaire, payez en dinars et recevez-le dans votre espace. On vous accompagne jusqu’à la première campagne.', 'Order your ad account, pay in dinars and receive it in your dashboard. We help you until your first campaign is live.'),
  sections: {
    ads_tiktok: { title: L3('حساب تيك توك أدس', 'Compte TikTok Ads', 'TikTok Ads account'), sub: L3('وصّل منتجك لجمهور تيك توك في الجزائر بفيديوهات قصيرة تبيع.', 'Touchez l’audience TikTok en Algérie avec des vidéos courtes qui vendent.', 'Reach TikTok audiences in Algeria with short videos that sell.'),
      feat: L3('حساب إعلاني جاهز تطلق بيه حملاتك\nالدفع بالدينار: BaridiMob أو CCP\nمرافقة في واتساب حتى أول حملة', 'Compte publicitaire prêt pour vos campagnes\nPaiement en dinars : BaridiMob ou CCP\nAccompagnement WhatsApp jusqu’à la 1re campagne', 'Ad account ready for your campaigns\nPay in dinars: BaridiMob or CCP\nWhatsApp support until your first campaign') },
    ads_meta: { title: L3('حساب فايسبوك أدس', 'Compte Facebook Ads', 'Facebook Ads account'), sub: L3('إعلانات فايسبوك وإنستغرام من حساب واحد، باش توصل لزبونك وين ما كان.', 'Publicités Facebook et Instagram depuis un seul compte.', 'Facebook and Instagram ads from a single account.'),
      feat: L3('إعلانات فايسبوك وإنستغرام\nالدفع بالدينار: BaridiMob أو CCP\nمرافقة في واتساب حتى أول حملة', 'Publicités Facebook et Instagram\nPaiement en dinars : BaridiMob ou CCP\nAccompagnement WhatsApp jusqu’à la 1re campagne', 'Facebook and Instagram ads\nPay in dinars: BaridiMob or CCP\nWhatsApp support until your first campaign') },
  },
  steps: [L3('اختر المنصة', 'Choisissez la plateforme', 'Pick the platform'), L3('ادفع وارفع الوصل', 'Payez et envoyez le reçu', 'Pay and upload the receipt'), L3('تستلم الحساب في حسابك', 'Recevez le compte dans votre espace', 'Receive the account in your dashboard'), L3('أطلق حملتك', 'Lancez votre campagne', 'Launch your campaign')],
  cats: ['accounts', 'payment', 'marketing'],
};

/* admin texts replace whole section objects: merge each one over its defaults */
function fillSections() {
  const d = (PAGES_DEF[PAGE] || {}).sections || {}, c = (PG.content || {})[PAGE];
  if (!c || !c.sections) return;
  Object.keys(c.sections).forEach(k => { c.sections[k] = { ...(d[k] || {}), ...c.sections[k] }; });
}
const renderPage0 = renderPage;
renderPage = function () { fillSections(); return PAGE === 'ads' ? renderAds() : renderPage0(); };
const applyI18n0 = applyI18n;
applyI18n = function () {
  applyI18n0.apply(this, arguments);
  if (PAGE === 'ads') { const e = $('#eyb'); if (e) e.innerHTML = ic('mega') + ' ' + esc(txt(pc().eyebrow)); }
};

/* order cards for the other ad products (pages.js offerCards, plus products to skip and a title) */
function adOffers(cats, skip, title) {
  const list = PG.products.filter(p => cats.includes(p.category) && p.type !== 'digital' && !(skip || []).includes(p));
  if (!list.length) return '';
  return `<section id="offers"><div class="wrap"><div class="center rv" style="margin-bottom:28px"><span class="eyebrow">${ic('cash')} ${esc(title || t('pricing_t'))}</span><h2 class="h2">${esc(title || t('pricing_t'))}</h2><p class="lead">${esc(t('pricing_s'))}</p></div>
    <div class="grid g3">${list.map((p, i) => {
      const vs = (p.product_variants || []).filter(v => v.active); const ps = vs.map(v => v.price).filter(x => x > 0); const pr = ps.length ? Math.min(...ps) : null; const c = p.cover_url || (p.gallery || [])[0];
      return `<div class="card pc rv" style="--d:${(i % 3) * 0.08}s"><div class="cover">${c ? `<img src="${esc(c)}" alt="" loading="lazy">` : ic('spark')}</div><div class="body"><h3 style="margin:0">${esc(tr(p.name))}</h3><p class="small muted" style="margin:0">${esc(tr(p.description))}</p>
        <div class="row between"><span class="price">${pr ? money(pr) : t('on_quote')}</span>${p.delivery_days ? `<span class="tiny muted row" style="gap:4px">${ic('clock', 'ico" style="width:14px;height:14px')} ${p.delivery_days} ${t('days')}</span>` : ''}</div>
        <div class="actions"><a class="btn pri" href="app.html#/p/${encodeURIComponent(p.slug)}">${pr ? t('order_now') : t('request_quote')}</a><a class="btn wa icon" aria-label="WhatsApp" target="_blank" rel="noopener" href="${waLink(waMsg(tr(p.name)))}">${ic('wa')}</a></div></div></div>`;
    }).join('')}</div></div></section>`;
}
/* ---------- ads page: each platform card orders its own product (meta.platform, else slug / name) ---------- */
const PLAT = {
  ads_tiktok: { k: 'tiktok', ico: 'tt', re: /tik\s*tok|تيك/i },
  ads_meta: { k: 'meta', ico: 'fb', re: /facebook|meta|فايسبوك|فيسبوك|ميتا/i },
};
const platProduct = key => { const P = PLAT[key]; return PG.products.find(p => p.type !== 'digital' && (pMeta(p).platform === P.k || P.re.test(`${p.slug} ${(p.name || {}).ar || ''} ${(p.name || {}).fr || ''} ${(p.name || {}).en || ''}`))); };
function dashArt(k) {
  return `<div class="ad-dash ${k}" aria-hidden="true"><div class="ad-dh"><span class="ad-dot"></span><i></i><i class="s"></i></div>
    <div class="ad-bars">${[38, 52, 46, 64, 58, 78, 92].map((h, i) => `<i style="--h:${h}%;--i:${i}"></i>`).join('')}</div>
    <svg class="ad-line" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 34 L16 30 L32 31 L48 22 L64 24 L80 12 L100 4"/></svg>
    <div class="ad-kpi"><span><small>${esc(t('ad_spend'))}</small><b>▲</b></span><span><small>${esc(t('ad_res'))}</small><b>▲</b></span></div></div>`;
}
function renderAds() {
  const c = pc(), keys = Object.keys(c.sections).filter(k => secOn(c, k) && PLAT[k]);
  const main = $('#pgmain'); const used = [];
  main.innerHTML = `<section id="plats"><div class="wrap"><div class="ad-plats">${keys.map((k, i) => {
      const s = c.sections[k], P = PLAT[k], p = platProduct(k); if (p) used.push(p);
      const vs = p ? (p.product_variants || []).filter(v => v.active).sort((a, b) => (a.sort || 0) - (b.sort || 0)) : [];
      const ps = vs.map(v => v.price).filter(x => x > 0), pr = ps.length ? Math.min(...ps) : null;
      const feats = (txt(s.feat) || '').split('\n').map(x => x.trim()).filter(Boolean);
      const href = p ? `app.html#/p/${encodeURIComponent(p.slug)}` : '';
      return `<article class="ad-plat ${P.k} rv" id="${k}" style="--d:${i * 0.1}s">
        <div class="ad-top"><span class="ad-logo">${ic(P.ico)}</span>${dashArt(P.k)}</div>
        <div class="ad-body"><h2>${esc(txt(s.title))}</h2><p class="muted">${esc(txt(s.sub))}</p>
          ${feats.length ? `<ul class="ticks">${feats.map(f => `<li>${ic('check')}<span>${esc(f)}</span></li>`).join('')}</ul>` : ''}
          ${vs.length > 1 ? `<div class="ad-vs">${vs.map(v => `<a href="${href}/${v.id}"><span>${esc(tr(v.name))}</span><b>${v.price > 0 ? money(v.price) : esc(t('on_quote'))}</b></a>`).join('')}</div>` : ''}
          <div class="ad-foot"><span class="ad-pr">${pr ? `${vs.length > 1 ? `<small>${esc(t('from'))}</small>` : ''}<b>${money(pr)}</b>` : `<b>${esc(t('on_quote'))}</b>`}${p && p.delivery_days ? `<small class="ad-del">${ic('clock')} ${p.delivery_days * 24 <= 48 ? p.delivery_days * 24 + ' ' + t('hours') : p.delivery_days + ' ' + t('days')}</small>` : ''}</span>
          <span class="row" style="gap:8px">${href ? `<a class="btn pri" href="${href}">${esc(t('ad_order'))} ${ic('arrow', 'ico flip go')}</a>` : ''}<a class="btn wa${href ? ' icon' : ''}" aria-label="WhatsApp" target="_blank" rel="noopener" href="${waLink(waMsg(txt(s.title)))}">${ic('wa')}${href ? '' : ' ' + esc(t('wa_order'))}</a></span></div>
        </div></article>`;
    }).join('')}</div></div></section>
    <section id="why"><div class="wrap"><div class="center rv" style="margin-bottom:26px"><span class="eyebrow">${ic('spark')} ${esc(t('ad_why'))}</span><h2 class="h2">${esc(t('ad_why'))}</h2></div>
      <div class="ad-why">${[['cash', 1], ['inbox', 2], ['wa', 3], ['mega', 4]].map(([i, n], j) => `<div class="rv" style="--d:${j * 0.07}s"><span class="ad-wi">${ic(i)}</span><b>${esc(t('ad_b' + n))}</b><small class="muted">${esc(t('ad_b' + n + 's'))}</small></div>`).join('')}</div></div></section>`
    + stepsHTML(c.steps || []) + adOffers(c.cats || [], used, t('ad_more')) + ctaHTML();
  sectionTabs(keys.map(k => ({ id: k, label: txt(c.sections[k].title) })));
  const box = $('#hart'); if (box) box.innerHTML = `<div class="ad-hero"><div class="ad-card tiktok"><span class="ad-logo">${ic('tt')}</span><b>TikTok Ads</b>${dashArt('tiktok')}</div><div class="ad-card meta"><span class="ad-logo">${ic('fb')}</span><b>Facebook Ads</b>${dashArt('meta')}</div><span class="ad-spark s1">${ic('spark')}</span><span class="ad-spark s2">${ic('mega')}</span></div>`;
}
applyI18n();
