/* buy.js - «نشريلك»: buy for me from AliExpress / Temu (buy.html, loaded after pages.js + pages-plus.js).
   Customer pastes a product link -> edge function price-check returns the USD price -> final DZD price
   = (usd*qty*(1+margin) + shipping) * rate, rounded up (settings buy_rate / buy_margin / buy_min_profit / buy_round, same formula as
   the database function buy_price, which sets the real order total). If the price can't be fetched, the customer types it.
   Order -> rpc create_buy_order -> app.html#/order/<id> (normal BaridiMob / CCP receipt flow). */
Object.assign(T, {
  n_buy: ['نشريلك', 'Achat pour vous', 'Buy for me'],
  by_ph: ['الصق رابط المنتج من AliExpress ولا Temu', 'Collez le lien du produit AliExpress ou Temu', 'Paste the AliExpress or Temu product link'],
  by_go: ['احسب السعر', 'Calculer le prix', 'Get the price'],
  by_wait: ['نجيبو السعر من الموقع…', 'On récupère le prix…', 'Fetching the price…'],
  by_final: ['السعر النهائي لدارك', 'Prix final livré', 'Final price, delivered'],
  by_incl: ['يشمل الشراء والخدمة. الدفع بالدينار.', 'Achat et service inclus. Paiement en dinars.', 'Purchase and service included. Pay in dinars.'],
  by_manual_t: ['ما قدرناش نجيبو السعر أوتوماتيكيا', 'Prix non récupéré automatiquement', 'We could not fetch the price automatically'],
  by_manual_s: ['اكتب سعر المنتج بالدولار كيما راهو في الموقع، ونحسبهولك بالدينار مباشرة.', 'Écrivez le prix en dollars affiché sur le site, on le convertit en dinars.', 'Type the dollar price shown on the site and we convert it to dinars right away.'],
  by_usd: ['سعر المنتج ($)', 'Prix du produit ($)', 'Product price ($)'], by_ship: ['سعر الشحن ($) إذا كاين', 'Livraison ($) si payante', 'Shipping ($) if any'],
  by_name: ['اسم المنتج (اختياري)', 'Nom du produit (optionnel)', 'Product name (optional)'],
  by_opts: ['الخيارات: اللون، المقاس، الموديل…', 'Options : couleur, taille, modèle…', 'Options: color, size, model…'],
  by_addr: ['عنوان التوصيل الكامل', 'Adresse de livraison complète', 'Full delivery address'],
  by_addr_ph: ['الولاية، البلدية، الحي والشارع، الرمز البريدي', 'Wilaya, commune, quartier et rue, code postal', 'Wilaya, town, street, postal code'],
  by_order: ['اطلب ونشريهولك', 'Commander', 'Order it'],
  by_login: ['سجّل حساب مجاني باش تكمل الطلب، والمعلومات تبقى محفوظة.', 'Créez un compte gratuit pour finaliser, vos infos restent enregistrées.', 'Create a free account to finish, your details stay saved.'],
  by_typed: ['السعر كتبتو انت: نتأكدو منو قبل الشراء.', 'Prix saisi par vous : vérifié avant l’achat.', 'Price typed by you: we check it before buying.'],
  by_e_link: ['الصق رابط صحيح', 'Collez un lien valide', 'Paste a valid link'], by_e_addr: ['اكتب العنوان كامل', 'Écrivez l’adresse complète', 'Write the full address'],
  by_e_price: ['اكتب السعر بالدولار', 'Écrivez le prix en dollars', 'Type the price in dollars'],
  by_try: ['جرب رابط آخر', 'Autre lien', 'Another link'],
  by_cond_t: ['قبل ما تطلب', 'Avant de commander', 'Before you order'],
  by_faq_t: ['أسئلة شائعة', 'Questions fréquentes', 'FAQ'],
});
T.pg_explore = ['كيفاش تخدم', 'Comment ça marche', 'How it works'];
PAGES_DEF.buy = {
  eyebrow: L3('نشريلك من AliExpress و Temu', 'On achète pour vous sur AliExpress et Temu', 'We buy for you on AliExpress & Temu'),
  title: L3('الصق الرابط، *شوف السعر بالدينار*، ويوصلك لدارك', 'Collez le lien, *voyez le prix en dinars*, livré chez vous', 'Paste the link, *see the price in dinars*, delivered home'),
  sub: L3('ما عندكش كارطة؟ ماشي مشكل. تخلص بالدينار بـ BaridiMob ولا CCP، أنا نشريلك بكارطتي والطرد يجي مباشرة لعنوانك.', 'Pas de carte ? Payez en dinars par BaridiMob ou CCP, j’achète avec ma carte et le colis arrive chez vous.', 'No card? Pay in dinars via BaridiMob or CCP, I buy with my card and the parcel ships straight to you.'),
  steps: [L3('الصق رابط المنتج', 'Collez le lien', 'Paste the link'), L3('شوف السعر بالدينار واطلب', 'Voyez le prix et commandez', 'See the price and order'), L3('خلص بـ BaridiMob ولا CCP', 'Payez par BaridiMob ou CCP', 'Pay via BaridiMob or CCP'), L3('نشريلك وتتبع الطرد حتى لدارك', 'J’achète, suivez le colis jusqu’à chez vous', 'I buy it, track the parcel to your door')],
};
const BY = { cfg: { rate: 258, margin: 30, minp: 0, round: 50 }, res: null, busy: false };
const BYDRAFT = 'ofa_buy';
const byLoad = () => { try { return JSON.parse(localStorage.getItem(BYDRAFT) || 'null'); } catch { return null; } };
const bySave = d => { try { d ? localStorage.setItem(BYDRAFT, JSON.stringify(d)) : localStorage.removeItem(BYDRAFT); } catch { } };
function byPrice(usd, ship, qty) {
  const c = BY.cfg, q = Math.max(1, Math.min(+qty || 1, 20)); usd = +usd || 0; ship = +ship || 0;
  const base = (usd * q + ship) * c.rate, profit = Math.max(usd * q * c.margin / 100 * c.rate, c.minp);
  return Math.ceil((base + profit) / Math.max(c.round, 1)) * Math.max(c.round, 1);
}
const srcName = s => s === 'aliexpress' ? 'AliExpress' : s === 'temu' ? 'Temu' : L('موقع آخر', 'Autre site', 'Other site');
ICONS.link = ICONS.link || '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>';
ICONS.info = ICONS.info || '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';
function L(ar, fr, en) { return [ar, fr, en][['ar', 'fr', 'en'].indexOf(LANG)] || ar; }

function byBox() {
  const d = byLoad() || {};
  return `<form class="by-box hi" id="byf" style="--d:.3s" novalidate><span class="by-ico">${ic('link')}</span>
    <input class="in" name="url" type="url" inputmode="url" autocomplete="off" dir="ltr" placeholder="${esc(t('by_ph'))}" value="${esc(d.url || '')}" aria-label="${esc(t('by_ph'))}">
    <button class="btn pri">${esc(t('by_go'))}</button></form>
    <div class="by-src row hi" style="--d:.36s"><span class="chip">AliExpress</span><span class="chip">Temu</span><span class="chip g">${ic('cash')} BaridiMob · CCP</span></div>`;
}
function byResult() {
  const r = BY.res; if (!r) return '';
  const d = byLoad() || {};
  if (r.loading) return `<div class="card by-res"><div class="row" style="gap:12px"><span class="spin" style="margin:0"></span><b>${esc(t('by_wait'))}</b></div></div>`;
  const man = !r.ok;
  const usd = man ? (d.usd || '') : r.usd, ship = man ? (d.ship_usd || '') : (r.ship_usd || 0), qty = d.qty || 1;
  return `<form class="card by-res" id="byo" novalidate>
    <div class="by-prod">${r.image ? `<img src="${esc(r.image)}" alt="" loading="lazy">` : `<span class="by-ph">${ic('bag')}</span>`}
      <div class="grow" style="min-width:0"><span class="chip ${man ? 'w' : 'g'}">${esc(srcName(r.source))}</span>
      <b class="by-title">${esc(r.title || d.title || r.url)}</b><a class="tiny muted ell" dir="ltr" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.url)}</a></div></div>
    ${man ? `<div class="by-man"><b>${esc(t('by_manual_t'))}</b><p class="small muted">${esc(t('by_manual_s'))}</p>
      <div class="grid g2"><div class="f"><label>${esc(t('by_usd'))}</label><input name="usd" type="number" min="0.1" step="0.01" inputmode="decimal" dir="ltr" value="${esc(usd)}" required></div>
      <div class="f"><label>${esc(t('by_ship'))}</label><input name="ship_usd" type="number" min="0" step="0.01" inputmode="decimal" dir="ltr" value="${esc(ship)}"></div></div>
      <div class="f"><label>${esc(t('by_name'))}</label><input name="title" maxlength="150" value="${esc(d.title || '')}"></div></div>`
      : `<div class="tiny muted">${esc(r.usd)} $${r.ship_usd ? ' + ' + esc(r.ship_usd) + ' $' : ''}</div>`}
    <div class="by-final"><span><small>${esc(t('by_final'))}</small><b id="bytot">—</b><small class="muted">${esc(t('by_incl'))}</small></span>
      <label class="by-q"><span class="small muted">${esc(t('qty'))}</span><input class="in" name="qty" type="number" min="1" max="20" value="${esc(qty)}" dir="ltr"></label></div>
    <div class="f"><label>${esc(t('by_opts'))}</label><input name="options" maxlength="280" value="${esc(d.options || '')}"></div>
    <div class="f"><label>${esc(t('by_addr'))}</label><textarea name="address" rows="2" maxlength="380" placeholder="${esc(t('by_addr_ph'))}">${esc(d.address || '')}</textarea></div>
    ${man ? `<p class="tiny muted">${ic('info')} ${esc(t('by_typed'))}</p>` : ''}
    <div class="row" style="gap:8px"><button class="btn pri lg grow">${esc(t('by_order'))} ${ic('arrow', 'ico flip go')}</button><button type="button" class="btn ghost" id="byreset">${esc(t('by_try'))}</button></div>
    <p class="tiny muted" id="bylog" hidden>${esc(t('by_login'))}</p></form>`;
}
function byTotal() {
  const f = $('#byo'); if (!f || !BY.res) return;
  const r = BY.res, usd = r.ok ? r.usd : f.usd.value, ship = r.ok ? r.ship_usd : f.ship_usd.value;
  $('#bytot').textContent = +usd > 0 ? money(byPrice(usd, ship, f.qty.value)) : '—';
}
function byDraft() {
  const f = $('#byo'), r = BY.res; if (!f || !r) return;
  bySave({ url: r.url, key: r.key || null, source: r.source, title: r.ok ? r.title : f.title.value, usd: r.ok ? '' : f.usd.value, ship_usd: r.ok ? '' : f.ship_usd.value, qty: f.qty.value, options: f.options.value, address: f.address.value, res: r });
}
function byPaint() {
  const box = $('#byres'); if (!box) return;
  box.innerHTML = byResult(); byTotal();
  const f = $('#byo'); if (!f) return;
  f.addEventListener('input', () => { byTotal(); byDraft(); });
  $('#byreset').onclick = () => { BY.res = null; bySave(null); byPaint(); const u = $('#byf input'); if (u) { u.value = ''; u.focus(); } };
  f.onsubmit = byOrder;
}
async function byCheck(e) {
  e.preventDefault();
  const u = (e.target.url.value.match(/https?:\/\/\S+/) || [])[0];
  if (!u) return toast(t('by_e_link'), true);
  if (BY.busy) return; BY.busy = true;
  BY.res = { loading: true }; byPaint(); $('#byres').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
  let r;
  try {
    const x = await fetch(CFG.url + '/functions/v1/price-check', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.key }, body: JSON.stringify({ url: u }) });
    r = await x.json();
  } catch { r = null; }
  BY.busy = false;
  if (!r || !r.url) r = { ok: false, manual: true, url: u, source: /aliexpress\./i.test(u) ? 'aliexpress' : /temu\.com/i.test(u) ? 'temu' : 'other' };
  BY.res = r; const d = byLoad() || {}; if (d.url !== r.url) bySave({ url: r.url, address: d.address, res: r }); byPaint(); byDraft();
}
async function byOrder(e) {
  e.preventDefault();
  const f = e.target, r = BY.res;
  if (!r.ok && !(+f.usd.value > 0)) return toast(t('by_e_price'), true);
  if (f.address.value.trim().length < 8) return toast(t('by_e_addr'), true);
  byDraft();
  const { data } = await sb.auth.getSession();
  if (!data.session) { $('#bylog').hidden = false; location.href = 'app.html#/register'; return; }
  await busy(e.submitter, async () => {
    const p = { url: r.url, key: r.ok ? r.key : null, qty: f.qty.value, options: f.options.value, address: f.address.value };
    if (!r.ok) Object.assign(p, { usd: f.usd.value, ship_usd: f.ship_usd.value || 0, title: f.title.value });
    const { data: id, error } = await sb.rpc('create_buy_order', { p });
    if (error) throw error;
    bySave(null); location.href = 'app.html#/order/' + id;
  });
}
function renderBuy() {
  const c = pc(), main = $('#pgmain');
  const hero = $('#hero .wrap > div');
  if (hero) { const old = $('#byf'), v = old ? old.url.value : null; $$('#byf, .by-src').forEach(x => x.remove()); hero.insertAdjacentHTML('beforeend', byBox()); if (v !== null) $('#byf').url.value = v; $('#byf').onsubmit = byCheck; }
  const cond = [
    L('الدفع كامل قبل الشراء، بـ BaridiMob ولا CCP.', 'Paiement complet avant l’achat, par BaridiMob ou CCP.', 'Full payment before purchase, via BaridiMob or CCP.'),
    L('الطرد يتبعث مباشرة لعنوانك، ورقم التتبع يبانلك في حسابك.', 'Le colis est envoyé à votre adresse, suivi dans votre espace.', 'The parcel ships to your address, tracking in your dashboard.'),
    L('مدة التوصيل حسب الموقع والشحن، عادة من 10 حتى 30 يوم.', 'Délai selon le site et la livraison, souvent 10 à 30 jours.', 'Delivery time depends on the site, usually 10 to 30 days.'),
    L('للاستعمال الشخصي برك. ما نشريوش: بطاريات وحدها، عطور وبخاخات، أسلحة، أدوية.', 'Usage personnel uniquement. Exclus : batteries seules, parfums et aérosols, armes, médicaments.', 'Personal use only. Not allowed: loose batteries, perfumes and sprays, weapons, medicine.'),
    L('السعر يتبدل في هاد المواقع: إذا طلع قبل ما نشري، نقولك وتختار تكمل ولا نرجعولك دراهمك.', 'Les prix changent : s’il augmente avant l’achat, vous choisissez de compléter ou d’être remboursé.', 'Prices change: if it rises before I buy, you choose to top up or get refunded.'),
  ];
  const faq = [
    [L('منين تجيبو السعر؟', 'D’où vient le prix ?', 'Where does the price come from?'), L('من الموقع نيشان، بالدولار، وبعدها نحسبوه بالدينار. إذا ما خرجش، تكتبو انت ونتأكدو منو.', 'Directement du site, en dollars, puis converti en dinars. Sinon vous le saisissez et on vérifie.', 'Straight from the site in dollars, then converted to dinars. If not, you type it and I check it.')],
    [L('نقدر نطلب بزاف المنتجات؟', 'Plusieurs produits ?', 'Several products?'), L('إيه، كل منتج طلب وحدو. الكمية حتى 20 للمنتج.', 'Oui, une commande par produit, jusqu’à 20 pièces.', 'Yes, one order per product, up to 20 pieces.')],
    [L('شكون يشري؟', 'Qui achète ?', 'Who buys it?'), L('أنا إسحاق، نشري بكارطتي ونتبع طلبك حتى يوصل.', 'Moi, Ishak, avec ma carte, et je suis votre commande.', 'Me, Ishak, with my own card, and I follow your order.')],
  ];
  main.innerHTML = `<section id="buy"><div class="wrap"><div id="byres"></div></div></section>`
    + stepsHTML(c.steps || [])
    + `<section id="cond"><div class="wrap"><div class="center rv" style="margin-bottom:22px"><span class="eyebrow">${ic('info')} ${esc(t('by_cond_t'))}</span><h2 class="h2">${esc(t('by_cond_t'))}</h2></div>
      <ul class="ticks by-cond rv">${cond.map(x => `<li>${ic('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div></section>
      <section id="bfaq"><div class="wrap"><div class="center rv" style="margin-bottom:22px"><h2 class="h2">${esc(t('by_faq_t'))}</h2></div>
      <div class="by-faq">${faq.map(([q, a]) => `<details class="card rv"><summary><b>${esc(q)}</b></summary><p class="muted">${esc(a)}</p></details>`).join('')}</div></div></section>`
    + ctaHTML();
  const box = $('#hart'); if (box) box.innerHTML = `<div class="by-hero"><div class="by-hc"><span class="chip">AliExpress</span><b dir="ltr">$10.00</b></div><span class="by-arrow">${ic('arrow', 'ico flip')}</span><div class="by-hc g"><span class="chip g">DZD</span><b>${money(byPrice(10, 0, 1))}</b></div><span class="by-truck">${ic('inbox')}</span></div>`;
  const d = byLoad(); if (d && d.res && !BY.res) BY.res = d.res;
  byPaint();
  // buy.html?u=<link> (from the home page band): start the price check right away
  const u = new URLSearchParams(location.search).get('u');
  if (u && !BY.auto) { BY.auto = 1; history.replaceState(null, '', location.pathname); $('#byf').url.value = u; $('#byf').requestSubmit(); }
}
const renderPageB = renderPage;
renderPage = function () { return PAGE === 'buy' ? renderBuy() : renderPageB(); };
const applyI18nB = applyI18n;
applyI18n = function () { applyI18nB.apply(this, arguments); if (PAGE === 'buy') { const e = $('#eyb'); if (e) e.innerHTML = ic('bag') + ' ' + esc(txt(pc().eyebrow)); } };
if (sb) sb.from('settings').select('key,value').in('key', ['buy_rate', 'buy_margin', 'buy_min_profit', 'buy_round']).then(({ data }) => {
  (data || []).forEach(r => { const v = +r.value; if (!isFinite(v)) return; if (r.key === 'buy_rate') BY.cfg.rate = v; if (r.key === 'buy_margin') BY.cfg.margin = v; if (r.key === 'buy_min_profit') BY.cfg.minp = v; if (r.key === 'buy_round') BY.cfg.round = v; });
  if (PG.loaded) renderPage();
});
applyI18n();
