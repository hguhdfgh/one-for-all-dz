/* ONE FOR ALL v3 — app: auth + client portal (admin lives in admin.js, loaded only for admins) */
const S = { user: null, me: null, settings: {}, products: [], viewAs: null, counts: {} };
const cid = () => (S.viewAs || S.me).id;
const readOnly = () => !!S.viewAs;
const isAdmin = () => S.me && S.me.role === 'admin';
const root = () => $('#app');

/* ---------- boot ---------- */
async function boot() {
  if (!sb) { root().innerHTML = `<div class="auth"><div class="card"><p>${t('e_generic')}</p></div></div>`; return; }
  sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') { S.user = S.me = null; route(); } });
  const { data } = await sb.auth.getSession();
  S.user = data.session?.user || null;
  S.settings = await publicSettings().catch(() => ({}));
  if (S.user) await loadMe();
  window.addEventListener('hashchange', route);
  route();
}
async function loadMe() {
  const { data } = await sb.from('profiles').select('*').eq('user_id', S.user.id).maybeSingle();
  S.me = data;
  if (!S.me) return;
  if (S.me.status === 'suspended') { toast(t('e_banned'), true); await sb.auth.signOut(); return; }
  if (S.me.lang && S.me.lang !== LANG && !localStorage.getItem('ofa_lang')) setLang(S.me.lang);
  if (isAdmin() && !window.Admin) await loadScript('assets/admin.js?v=' + (window.OFA_V || 1));
}
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s); }); }
async function loadProducts(force) {
  if (S.products.length && !force) return S.products;
  const { data } = await sb.from('products').select('*, product_variants(*)').order('sort');
  S.products = (data || []).map(p => ({ ...p, variants: (p.product_variants || []).filter(v => v.active || isAdmin()).sort((a, b) => a.sort - b.sort) }));
  return S.products;
}
const priceOf = p => { const v = (p.variants || []).filter(v => v.active); if (!v.length) return null; const ps = v.map(x => x.price).filter(x => x > 0); return ps.length ? Math.min(...ps) : null; };
const coverOf = p => p.cover_url || (p.gallery || [])[0] || '';

/* ---------- router ---------- */
function route() {
  closeModal();
  const h = location.hash.replace(/^#\/?/, ''); const [a, b, c] = h.split('/');
  if (!S.user || !S.me) return renderAuth(a === 'register' || a === 'p' ? 'register' : 'login', a === 'p' ? b : null);
  if (a === 'a' && isAdmin() && !S.viewAs) return Admin.route(b, c);
  if (isAdmin() && !S.viewAs && (!a || a === '')) { location.hash = '#/a/dash'; return; }
  const pending = sessionStorage.getItem('ofa_after');
  if (pending) { sessionStorage.removeItem('ofa_after'); location.hash = '#/p/' + pending; return; }
  if (a === 'orders') return viewOrders();
  if (a === 'order') return viewOrder(b);
  if (a === 'account') return viewAccount();
  if (a === 'p') return viewServices(b);
  return viewServices();
}
function go(h) { if (location.hash === h) route(); else location.hash = h; }

/* ---------- shell ---------- */
function clientNav() {
  return [
    { k: 'services', h: '#/', i: 'grid', l: t('services') },
    { k: 'orders', h: '#/orders', i: 'bag', l: t('my_orders'), c: S.counts.action },
    { k: 'account', h: '#/account', i: 'user', l: t('account') },
  ];
}
function shell(active, title, body, { nav, actions = '', back } = {}) {
  nav = nav || clientNav();
  const vb = S.viewAs ? `<div class="banner i" style="margin:0;border-radius:0;justify-content:center">${ic('eye')} ${t('view_as')}: <b>${esc(S.viewAs.full_name)}</b> <button class="btn sm" onclick="exitViewAs()">${t('exit_view')}</button></div>` : '';
  root().innerHTML = `${vb}<div class="shell">
  <aside class="side">
    <a class="brand" href="index.html"><span class="logo">1A</span><span><b>ONE FOR ALL</b><small>${t('tagline')}</small></span></a>
    ${nav.map(n => `<a class="nav ${n.k === active ? 'on' : ''}" href="${n.h}">${ic(n.i)}<span>${n.l}</span>${n.c ? `<span class="cnt">${n.c}</span>` : ''}</a>`).join('')}
    <div style="margin-top:auto" class="col">
      <div class="row">${langSwitch('route')}<button class="btn icon sm ghost" onclick="toggleTheme()" aria-label="theme">${ic('moon')}</button></div>
      <button class="nav" onclick="logout()">${ic('logout')}<span>${t('logout')}</span></button>
    </div>
  </aside>
  <main class="main">
    <div class="top">${back ? `<a class="btn icon sm ghost" href="${back}" aria-label="back">${ic('back', 'ico flip')}</a>` : ''}<h1 class="grow ell">${esc(title)}</h1>${actions}</div>
    <div class="page" id="page">${body}</div>
  </main></div>
  <nav class="bnav">${nav.slice(0, 5).map(n => `<button class="${n.k === active ? 'on' : ''}" onclick="go('${n.h}')">${ic(n.i)}<span>${n.l}</span>${n.c ? `<span class="cnt">${n.c}</span>` : ''}</button>`).join('')}</nav>`;
  if (document.dir === 'rtl') $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
  return $('#page');
}
async function logout() { await sb.auth.signOut(); S.viewAs = null; location.hash = '#/'; }
function exitViewAs() { const id = S.viewAs.id; S.viewAs = null; go('#/a/client/' + id); }

/* ---------- auth ---------- */
function renderAuth(mode, slug) {
  if (slug) sessionStorage.setItem('ofa_after', slug);
  const reg = mode === 'register';
  root().innerHTML = `<div class="auth"><div class="card">
    <div class="row between" style="margin-bottom:18px"><a class="brand" style="padding:0" href="index.html"><span class="logo">1A</span><span><b>ONE FOR ALL</b><small>${t('tagline')}</small></span></a>${langSwitch('route')}</div>
    <div class="seg" style="margin-bottom:18px"><button class="${!reg ? 'on' : ''}" onclick="go('#/login')">${t('login')}</button><button class="${reg ? 'on' : ''}" onclick="go('#/register')">${t('register')}</button></div>
    <form id="af" novalidate>
      ${reg ? `<div class="f"><label for="an">${t('name')}</label><input id="an" name="full_name" autocomplete="name" required maxlength="80"></div>` : ''}
      <div class="f"><label for="ap">${t('phone')}</label><input id="ap" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="05XX XX XX XX" required class="ltr" style="text-align:start"></div>
      <div class="f"><label for="aw">${t('password')}</label><input id="aw" name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" required minlength="6"><small class="faint">${reg ? t('pw_hint') : ''}</small></div>
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="err" id="ae" role="alert"></p>
      <button class="btn pri lg block" type="submit">${reg ? t('register') : t('login')}</button>
    </form>
    ${!reg ? `<p class="small" style="text-align:center;margin-top:12px"><a href="${waLink('نسيت كلمة السر / Mot de passe oublié')}" target="_blank" rel="noopener">${t('forgot')}</a></p>` : ''}
    <div class="sep"></div>
    <p class="small muted" style="text-align:center">${t('or_wa')}</p>
    <a class="btn wa block" href="${waLink('السلام عليكم، حاب نطلب خدمة')}" target="_blank" rel="noopener">${ic('wa')} ${t('wa_order')}</a>
  </div></div>`;
  $('#af').onsubmit = e => { e.preventDefault(); doAuth(reg, e.submitter); };
}
async function doAuth(reg, btn) {
  const f = Object.fromEntries(new FormData($('#af'))); const err = $('#ae'); err.textContent = '';
  const phone = normPhone(f.phone);
  if (reg && (f.full_name || '').trim().length < 2) return err.textContent = t('e_name');
  if (!phone) return err.textContent = t('e_phone');
  if ((f.password || '').length < 6) return err.textContent = t('e_password');
  await busy(btn, async () => {
    if (reg) {
      const r = await fetch(CFG.url + '/functions/v1/register', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.key }, body: JSON.stringify({ full_name: f.full_name.trim(), phone, password: f.password, lang: LANG, website: f.website }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { err.textContent = T['e_' + j.error] ? t('e_' + j.error) : t('e_generic'); if (j.error === 'exists') setTimeout(() => go('#/login'), 1500); return; }
    }
    const { data, error } = await sb.auth.signInWithPassword({ email: `${phone}@${CFG.aliasDomain}`, password: f.password });
    if (error) { err.textContent = errMsg(error); return; }
    S.user = data.user; await loadMe();
    if (!S.me) { err.textContent = t('e_generic'); return; }
    if (location.hash.startsWith('#/login') || location.hash.startsWith('#/register') || location.hash.startsWith('#/p/')) location.hash = '#/'; else route();
  });
}

/* ---------- client: services ---------- */
async function viewServices(openSlug) {
  const name = (S.viewAs || S.me).full_name.split(' ')[0];
  const pg = shell('services', t('services'), `<div class="spin"></div>`);
  await loadProducts();
  await refreshCounts();
  const list = S.products.filter(p => p.active);
  pg.innerHTML = `<div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,var(--green-2),var(--green-deep));color:#fff;border:0">
      <h2 style="font-size:22px;margin:0">${t('hello')} ${esc(name)} 👋</h2><p style="margin:4px 0 0;opacity:.9">${t('welcome_sub')}</p></div>
    <div class="grid g3">${list.map(productCard).join('')}</div>`;
  if (openSlug) { const p = list.find(x => x.slug === openSlug); if (p) openProduct(p.id); }
}
function productCard(p) {
  const pr = priceOf(p); const c = coverOf(p);
  return `<div class="card pc">
    <div class="cover">${c ? `<img src="${esc(c)}" alt="" loading="lazy">` : ic(p.type === 'digital' ? 'download' : 'spark')}</div>
    <div class="body"><div class="row between"><h3 style="margin:0">${esc(tr(p.name))}</h3>${p.featured ? `<span class="chip g">${ic('star', 'ico" style="width:12px;height:12px')}</span>` : ''}</div>
    <p class="small muted" style="margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(tr(p.description))}</p>
    <div class="price">${pr ? money(pr) : t('on_quote')}</div>
    <div class="actions"><button class="btn pri" onclick="openProduct('${p.id}')">${pr ? t('order_now') : t('request_quote')}</button></div></div></div>`;
}
function openProduct(id) {
  const p = S.products.find(x => x.id === id); if (!p) return;
  const imgs = [p.cover_url, ...(p.gallery || [])].filter(Boolean);
  const vs = (p.variants || []).filter(v => v.active);
  const qs = Array.isArray(p.questions) ? p.questions : [];
  const body = modal(tr(p.name), `
    ${imgs.length ? `<div class="gal" style="margin-bottom:12px">${imgs.map(u => `<img src="${esc(u)}" alt="" loading="lazy">`).join('')}</div>` : ''}
    <p class="muted">${esc(tr(p.description))}</p>
    ${p.delivery_days ? `<p class="small row">${ic('clock')} ${t('delivery')}: ${p.delivery_days} ${t('days')}</p>` : ''}
    <form id="of">
      ${vs.length > 1 ? `<div class="f"><label>${t('package')}</label>${vs.map((v, i) => `<label class="card flat check" style="padding:12px;margin-bottom:6px"><input type="radio" name="variant" value="${v.id}" ${i === 0 ? 'checked' : ''}> <span class="grow">${esc(tr(v.name))}</span><b>${money(v.price > 0 ? v.price : null)}</b></label>`).join('')}</div>` : `<input type="hidden" name="variant" value="${vs[0]?.id || ''}">`}
      ${qs.map((q, i) => `<div class="f"><label for="q${i}">${esc(tr(q.label))}${q.required ? ' *' : ''}</label>${q.type === 'textarea' ? `<textarea id="q${i}" name="q_${esc(q.key || i)}" ${q.required ? 'required' : ''}></textarea>` : `<input id="q${i}" name="q_${esc(q.key || i)}" ${q.required ? 'required' : ''}>`}</div>`).join('')}
      <div class="row between card flat" style="padding:12px 16px;margin:8px 0 14px"><span class="muted">${t('total')}</span><b id="otot" class="num" style="font-size:20px"></b></div>
      ${readOnly() ? '' : `<button class="btn pri lg block" type="submit">${t('confirm_order')}</button>`}
      <a class="btn wa block" style="margin-top:8px" target="_blank" rel="noopener" href="${waLink(`السلام عليكم، حاب نطلب: ${tr(p.name)}`)}">${ic('wa')} ${t('wa_order')}</a>
    </form>`);
  const f = $('#of', body);
  const upd = () => { const v = vs.find(x => x.id === new FormData(f).get('variant')); $('#otot').textContent = money(v && v.price > 0 ? v.price : null); };
  f.onchange = upd; upd();
  f.onsubmit = async e => {
    e.preventDefault(); if (!f.reportValidity()) return;
    const fd = new FormData(f); const answers = {};
    qs.forEach((q, i) => { const k = q.key || i; const v = fd.get('q_' + k); if (v) answers[tr(q.label) || k] = String(v).slice(0, 2000); });
    await busy(e.submitter, async () => {
      const { data, error } = await sb.from('orders').insert({ client_id: S.me.id, product_id: p.id, variant_id: fd.get('variant') || null, qty: 1, answers }).select('id').single();
      if (error) throw error;
      toast(t('order_sent')); closeModal(); go('#/order/' + data.id);
    });
  };
}

/* ---------- client: orders ---------- */
const ACTION_ST = ['quoted', 'pending_payment', 'in_review', 'delivered'];
async function refreshCounts() {
  const { data } = await sb.from('orders').select('status').eq('client_id', cid());
  S.counts.action = (data || []).filter(o => ACTION_ST.includes(o.status)).length || 0;
}
function stChip(s) {
  const cls = { quote_requested: 'w', quoted: 'i', pending_payment: 'w', payment_review: 'i', paid: 'g', in_progress: 'i', in_review: 'w', delivered: 'g', completed: 'g', cancelled: 'b', refunded: 'b' }[s] || '';
  return `<span class="chip ${cls}"><span class="dot"></span>${t('st_' + s)}</span>`;
}
const stagePct = o => { const s = o.stages || []; return s.length ? Math.round(100 * s.filter(x => x.done).length / s.length) : (['completed', 'delivered'].includes(o.status) ? 100 : 0); };
async function viewOrders() {
  const pg = shell('orders', t('my_orders'), `<div class="spin"></div>`);
  const { data } = await sb.from('orders').select('*, products(cover_url,gallery,type)').eq('client_id', cid()).order('created_at', { ascending: false });
  await refreshCounts();
  if (!data || !data.length) { pg.innerHTML = `<div class="card empty">${ic('bag')}<p>${t('no_orders')}</p><a class="btn pri" href="#/">${t('browse')}</a></div>`; return; }
  pg.innerHTML = `<div class="card" style="padding:6px 14px"><div class="list">${data.map(o => {
    const c = o.products ? coverOf(o.products) : '';
    return `<a class="li" href="#/order/${o.id}" style="text-decoration:none;color:inherit">${c ? `<img class="thumb" src="${esc(c)}" alt="">` : `<span class="thumb" style="display:grid;place-items:center">${ic('bag')}</span>`}
      <div class="grow"><div class="row between nowrap"><b class="ell">${esc(o.title)}</b><span class="tiny faint ltr">${o.number}</span></div>
      <div class="row" style="margin-top:4px">${stChip(o.status)}<span class="small muted num">${money(o.total)}</span></div>
      ${(o.stages || []).length ? `<div class="bar" style="margin-top:8px"><i style="width:${stagePct(o)}%"></i></div>` : ''}</div></a>`;
  }).join('')}</div></div>`;
}

async function fetchOrder(id) {
  const [o, pays, cm, fl] = await Promise.all([
    sb.from('orders').select('*, products(*)').eq('id', id).single(),
    sb.from('payments').select('*').eq('order_id', id).order('created_at'),
    sb.from('order_comments').select('*').eq('order_id', id).order('created_at'),
    sb.from('files').select('*').eq('order_id', id).order('created_at'),
  ]);
  if (o.error) throw o.error;
  return { o: o.data, pays: pays.data || [], cm: cm.data || [], fl: fl.data || [] };
}
async function viewOrder(id) {
  const pg = shell('orders', t('my_orders'), `<div class="spin"></div>`, { back: '#/orders' });
  let d; try { d = await fetchOrder(id); } catch (e) { pg.innerHTML = `<div class="card empty">${t('e_generic')}</div>`; return; }
  const { o, pays, cm, fl } = d; const p = o.products || {};
  const paid = pays.filter(x => x.status === 'verified').reduce((s, x) => s + +x.amount, 0);
  const due = o.total ? Math.max(0, o.total - paid) : 0;
  const pi = S.settings.payment_info || {};
  let act = '';
  const ro = readOnly();
  if (o.status === 'quote_requested') act = `<div class="banner">${ic('clock')} ${t('quote_wait')}</div>`;
  if (o.status === 'quoted') act = `<div class="banner i">${ic('cash')} ${t('total')}: <b class="num">${money(o.total)}</b></div>${ro ? '' : `<div class="row"><button class="btn pri grow" onclick="rpcOrder('accept_quote','${o.id}',this)">${t('accept_quote')}</button><button class="btn danger" onclick="rpcOrder('cancel_my_order','${o.id}',this,true)">${t('cancel_order')}</button></div>`}`;
  if (o.status === 'pending_payment') act = `<h3>${t('pay_info')}</h3>
    <div class="card flat" style="background:var(--surface-2)">
      ${pi.baridimob ? `<p class="row between"><span class="muted">BaridiMob RIP</span><b class="ltr" style="user-select:all">${esc(pi.baridimob)}</b></p>` : ''}
      ${pi.ccp ? `<p class="row between"><span class="muted">CCP</span><b class="ltr" style="user-select:all">${esc(pi.ccp)}</b></p>` : ''}
      ${pi.name ? `<p class="row between"><span class="muted">${t('name')}</span><b>${esc(pi.name)}</b></p>` : ''}
      <p class="row between" style="margin:0"><span class="muted">${t('amount')}</span><b class="num" style="font-size:18px;color:var(--green-ink)">${money(due)}</b></p>
      ${pi.note ? `<p class="small muted" style="margin:8px 0 0">${esc(tr(pi.note))}</p>` : ''}
      ${!pi.baridimob && !pi.ccp ? `<p class="small" style="margin:8px 0 0"><a target="_blank" rel="noopener" href="${waLink('معلومات الدفع للطلب ' + o.number)}">${t('contact_us')}</a></p>` : ''}
    </div>
    ${ro ? '' : `<div class="row" style="margin-top:12px"><select id="pm" class="in" style="width:auto">${['baridimob', 'ccp'].map(m => `<option value="${m}">${t('m_' + m)}</option>`).join('')}</select><button class="btn pri grow" onclick="sendReceipt('${o.id}',${due},this)">${ic('upload')} ${t('upload_receipt')}</button></div>
    <button class="btn ghost danger sm" style="margin-top:8px" onclick="rpcOrder('cancel_my_order','${o.id}',this,true)">${t('cancel_order')}</button>`}`;
  if (o.status === 'payment_review') act = `<div class="banner i">${ic('clock')} ${t('receipt_sent')}</div>`;
  if (['in_review', 'delivered'].includes(o.status) && !ro) act = `<button class="btn pri block" onclick="rpcOrder('approve_delivery','${o.id}',this)">${ic('check')} ${t('approve')}</button>`;
  let dig = '';
  if (p.type === 'digital' && p.digital_path) dig = ['paid', 'completed', 'delivered'].includes(o.status)
    ? `<button class="btn pri block" onclick="dlDigital('${esc(p.digital_path)}',this)">${ic('download')} ${t('your_file')}</button>`
    : `<p class="small muted row">${ic('lock')} ${t('paid_unlock')}</p>`;
  const stages = o.stages || [];
  pg.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">
   <div class="col">
    <div class="card"><div class="row between"><span class="tiny faint ltr">${o.number} · ${fdate(o.created_at)}</span>${stChip(o.status)}</div>
      <h2 style="font-size:19px;margin:8px 0">${esc(o.title)}</h2>
      <div class="row between"><span class="muted">${t('total')}</span><b class="num">${money(o.total)}</b></div>
      ${Object.keys(o.answers || {}).length ? `<div class="sep"></div>${Object.entries(o.answers).map(([k, v]) => `<p class="small"><b>${esc(k)}</b><br><span class="muted">${esc(v)}</span></p>`).join('')}` : ''}
    </div>
    ${act || dig ? `<div class="card col">${act}${dig}</div>` : ''}
    ${stages.length ? `<div class="card"><div class="row between"><h3 style="margin:0">${t('progress')}</h3><b class="num">${stagePct(o)}%</b></div><div class="bar" style="margin:10px 0"><i style="width:${stagePct(o)}%"></i></div>
      <div class="steps">${stages.map(s => `<div class="step ${s.done ? 'done' : ''}"><span class="d">${s.done ? ic('check') : ''}</span><span>${esc(s.name)}</span></div>`).join('')}</div></div>` : ''}
    ${pays.length ? `<div class="card"><h3>${t('payments')}</h3>${pays.map(x => `<div class="row between small" style="padding:6px 0"><span>${fdate(x.created_at)} · ${t('m_' + x.method)}</span><span class="row"><b class="num">${money(x.amount)}</b><span class="chip ${x.status === 'verified' ? 'g' : x.status === 'rejected' ? 'b' : 'w'}">${t('pst_' + x.status)}</span></span></div>`).join('')}</div>` : ''}
   </div>
   <div class="col">
    <div class="card"><div class="row between"><h3 style="margin:0">${t('files')}</h3>${ro ? '' : `<button class="btn sm" onclick="clientUpload('${o.id}',this)">${ic('upload')} ${t('upload_file')}</button>`}</div>
      <div class="list" style="margin-top:6px">${fl.length ? fl.map(fileRow).join('') : `<p class="small faint">—</p>`}</div></div>
    <div class="card"><h3>${t('comments')}</h3><div class="col" id="cms" style="max-height:360px;overflow:auto">${cm.map(c => `<div class="cmt ${c.author_id === S.me.id ? 'me' : ''}"><div class="small">${esc(c.body)}</div><div class="tiny faint">${fdt(c.created_at)}</div></div>`).join('') || `<p class="small faint">—</p>`}</div>
      ${ro ? '' : `<form class="row nowrap" style="margin-top:10px" onsubmit="sendComment(event,'${o.id}')"><input class="in grow" name="b" placeholder="${t('write_msg')}" maxlength="2000" required><button class="btn pri icon" aria-label="${t('send')}">${ic('send', 'ico flip')}</button></form>`}
      <a class="btn wa block sm" style="margin-top:10px" target="_blank" rel="noopener" href="${waLink(`بخصوص الطلب ${o.number}`)}">${ic('wa')} WhatsApp</a></div>
   </div></div>`;
  if (document.dir === 'rtl') $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
  const c = $('#cms'); if (c) c.scrollTop = c.scrollHeight;
}
function fileRow(f) {
  return `<div class="li" onclick="openFile('${f.bucket}','${esc(f.path || '')}','${esc(f.url || '')}')">${ic(f.kind === 'deliverable' ? 'download' : 'file')}<div class="grow"><div class="small ell">${esc(f.label || f.path || f.url)}</div><div class="tiny faint">${fdate(f.created_at)}${f.kind === 'deliverable' ? ' · ★' : ''}</div></div>${ic('download')}</div>`;
}
async function openFile(bucket, path, url) {
  if (url) return window.open(url, '_blank', 'noopener');
  try { window.open(await signedUrl(bucket, path), '_blank', 'noopener'); } catch (e) { toast(errMsg(e), true); }
}
async function dlDigital(path, btn) { await busy(btn, async () => window.open(await signedUrl('digital', path, true), '_blank', 'noopener')); }
async function rpcOrder(fn, id, btn, confirmIt) {
  if (confirmIt && !confirm(t('sure'))) return;
  await busy(btn, async () => { const { error } = await sb.rpc(fn, { p_order: id }); if (error) throw error; route(); });
}
async function sendReceipt(orderId, amount, btn) {
  const file = await pickFile('image/*,application/pdf'); if (!file) return;
  await busy(btn, async () => {
    const path = `${S.me.id}/${orderId}/${Date.now()}-${safeName(file.name)}`;
    await upload('receipts', path, file);
    const { error } = await sb.from('payments').insert({ order_id: orderId, client_id: S.me.id, amount, method: $('#pm')?.value || 'baridimob', receipt_path: path });
    if (error) throw error; toast(t('receipt_sent')); route();
  });
}
async function clientUpload(orderId, btn) {
  const file = await pickFile(); if (!file) return;
  await busy(btn, async () => {
    const path = `${S.me.id}/${orderId}/${Date.now()}-${safeName(file.name)}`;
    const u = await upload('client-files', path, file);
    const { error } = await sb.from('files').insert({ client_id: S.me.id, order_id: orderId, kind: 'brief', bucket: 'client-files', path, label: file.name, size_bytes: u.size });
    if (error) throw error; route();
  });
}
async function sendComment(e, orderId) {
  e.preventDefault(); const b = e.target.b.value.trim(); if (!b) return;
  await busy(e.submitter, async () => { const { error } = await sb.from('order_comments').insert({ order_id: orderId, author_id: S.me.id, body: b }); if (error) throw error; route(); });
}

/* ---------- client: account ---------- */
function viewAccount() {
  const m = S.viewAs || S.me; const ro = readOnly();
  const pg = shell('account', t('account'), `
  <div class="grid g2" style="align-items:start">
    <div class="card"><div class="row" style="margin-bottom:14px"><span class="av" style="width:52px;height:52px;font-size:18px">${esc(initials(m.full_name))}</span><div><b>${esc(m.full_name)}</b><div class="small muted ltr">${showPhone(m.phone)}</div></div></div>
      <form id="pf"><div class="f"><label>${t('name')}</label><input name="full_name" value="${esc(m.full_name)}" required maxlength="80"></div>
      <div class="f"><label>${t('business')}</label><input name="business" value="${esc(m.business || '')}" maxlength="120"></div>
      <div class="f"><label>${t('wilaya')}</label><input name="wilaya" value="${esc(m.wilaya || '')}" maxlength="60"></div>
      <div class="f"><label>${t('language')}</label><select name="lang">${LANGS.map(l => `<option value="${l}" ${m.lang === l ? 'selected' : ''}>${{ ar: 'العربية', fr: 'Français', en: 'English' }[l]}</option>`).join('')}</select></div>
      ${ro ? '' : `<button class="btn pri block">${t('save')}</button>`}</form></div>
    ${ro ? '' : `<div class="col"><div class="card"><h3>${t('change_pw')}</h3><form id="pwf"><div class="f"><label>${t('new_pw')}</label><input name="pw" type="password" minlength="6" required autocomplete="new-password"></div><button class="btn block">${t('save')}</button></form></div>
      <div class="card col"><a class="btn wa block" target="_blank" rel="noopener" href="${waLink('السلام عليكم')}">${ic('wa')} ${t('contact_us')}</a><button class="btn danger block" onclick="logout()">${ic('logout')} ${t('logout')}</button></div></div>`}
  </div>`);
  if (ro) return;
  $('#pf').onsubmit = async e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    await busy(e.submitter, async () => {
      const { data, error } = await sb.from('profiles').update({ full_name: f.full_name.trim(), business: f.business || null, wilaya: f.wilaya || null, lang: f.lang }).eq('id', S.me.id).select().single();
      if (error) throw error; S.me = data; setLang(f.lang); toast(t('saved')); route();
    });
  };
  $('#pwf').onsubmit = async e => {
    e.preventDefault(); const pw = e.target.pw.value; if (pw.length < 6) return toast(t('e_password'), true);
    await busy(e.submitter, async () => { const { error } = await sb.auth.updateUser({ password: pw }); if (error) throw error; e.target.reset(); toast(t('saved')); });
  };
}

boot();
