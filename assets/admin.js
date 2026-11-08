/* ONE FOR ALL v3 — admin (loaded only for admin accounts; data is protected server-side by RLS anyway) */
Object.assign(T, {
  a_dash: ['الرئيسية', 'Accueil', 'Home'], a_orders: ['الطلبات', 'Commandes', 'Orders'], a_clients: ['العملاء', 'Clients', 'Clients'],
  a_products: ['المنتجات', 'Produits', 'Products'], a_finance: ['المالية', 'Finances', 'Finance'], a_leads: ['الطلبات القديمة', 'Prospects', 'Leads'],
  a_site: ['الموقع والإعدادات', 'Site & réglages', 'Site & settings'],
  k_todo: ['لازم تدير اليوم', "À faire aujourd'hui", 'To do today'], k_rev: ['مداخيل الشهر', 'Revenus du mois', 'Revenue this month'],
  k_review: ['وصولات للتأكيد', 'Reçus à vérifier', 'Receipts to verify'], k_quotes: ['عروض سعر', 'Devis à chiffrer', 'Quotes to price'],
  k_active: ['طلبات قيد الإنجاز', 'Commandes en cours', 'Active orders'], k_clients: ['العملاء', 'Clients', 'Clients'],
  k_follow: ['متابعات اليوم', 'Relances du jour', 'Follow-ups due'], k_new: ['حسابات جديدة (7 أيام)', 'Nouveaux comptes (7 j)', 'New accounts (7d)'],
  all_good: ['كلش مليح، ما كاين والو مستعجل', "Rien d'urgent", 'All clear, nothing urgent'],
  f_all: ['الكل', 'Tout', 'All'], f_action: ['تحتاج إجراء', 'À traiter', 'Needs action'], f_active: ['قيد الإنجاز', 'En cours', 'Active'], f_done: ['منتهية', 'Terminées', 'Done'],
  new_order: ['طلب جديد', 'Nouvelle commande', 'New order'], client: ['العميل', 'Client', 'Client'], product: ['المنتج', 'Produit', 'Product'],
  price: ['السعر', 'Prix', 'Price'], set_price: ['إرسال السعر للعميل', 'Envoyer le devis', 'Send quote'], change_status: ['تغيير الحالة', 'Changer le statut', 'Change status'],
  verify: ['تأكيد', 'Valider', 'Verify'], reject: ['رفض', 'Refuser', 'Reject'], receipt: ['الوصل', 'Reçu', 'Receipt'], add_payment: ['إضافة دفعة', 'Ajouter un paiement', 'Add payment'],
  internal: ['ملاحظة داخلية (ما يشوفهاش العميل)', 'Note interne', 'Internal (hidden from client)'], deliverable: ['ملف تسليم', 'Livrable', 'Deliverable'],
  notify_wa: ['بلّغ العميل في واتساب', 'Prévenir sur WhatsApp', 'Notify on WhatsApp'], due: ['آخر أجل', 'Échéance', 'Due date'],
  internal_notes: ['ملاحظات داخلية', 'Notes internes', 'Internal notes'], new_client: ['عميل جديد', 'Nouveau client', 'New client'],
  with_account: ['إنشاء حساب له (رقم + كلمة سر)', 'Créer un compte (tél + mot de passe)', 'Create an account (phone + password)'],
  stage: ['المرحلة', 'Étape', 'Stage'], next_action: ['الخطوة الجاية', 'Prochaine action', 'Next action'], follow_up: ['تاريخ المتابعة', 'Date de relance', 'Follow-up date'],
  notes: ['ملاحظات', 'Notes', 'Notes'], tags: ['وسوم (بفاصلة)', 'Tags (virgule)', 'Tags (comma)'], source: ['المصدر', 'Source', 'Source'],
  instagram: ['إنستغرام', 'Instagram', 'Instagram'], important_dates: ['تواريخ مهمة', 'Dates importantes', 'Important dates'],
  history: ['السجل', 'Historique', 'History'], add_note: ['إضافة ملاحظة', 'Ajouter une note', 'Add note'], sell_next: ['واش نبيعلو من بعد', 'À proposer ensuite', 'Sell next'],
  acc_actions: ['الحساب', 'Compte', 'Account'], no_account: ['ما عندوش حساب', 'Pas de compte', 'No account'], has_account: ['عنده حساب', 'A un compte', 'Has account'],
  create_acc: ['إنشاء حساب', 'Créer le compte', 'Create account'], reset_pw: ['تغيير كلمة السر', 'Réinitialiser', 'Reset password'],
  suspend: ['إيقاف', 'Suspendre', 'Suspend'], activate: ['تفعيل', 'Activer', 'Activate'], view_client: ['شوف كأنك العميل', 'Voir comme le client', 'View as client'],
  spent: ['مجموع المدفوع', 'Total payé', 'Total paid'], orders_n: ['الطلبات', 'Commandes', 'Orders'],
  type: ['النوع', 'Type', 'Type'], t_service: ['خدمة', 'Service', 'Service'], t_digital: ['منتج رقمي', 'Produit digital', 'Digital product'],
  category: ['التصنيف', 'Catégorie', 'Category'], description: ['الوصف', 'Description', 'Description'], cover: ['الصورة الرئيسية', 'Image principale', 'Cover image'],
  gallery: ['معرض الصور', 'Galerie', 'Gallery'], variants: ['الباقات والأسعار (فارغ = حسب الطلب)', 'Formules et prix (vide = devis)', 'Packages & prices (empty = quote)'],
  questions: ['أسئلة للعميل (سؤال في كل سطر، * = إجباري)', 'Questions (une par ligne, * = obligatoire)', 'Questions (one per line, * = required)'],
  stages: ['مراحل الإنجاز (مرحلة في كل سطر)', 'Étapes (une par ligne)', 'Stages (one per line)'], next_products: ['منتجات مقترحة بعده', 'Produits suggérés après', 'Suggested next products'],
  digital_file: ['الملف الرقمي (يتفتح بعد الدفع)', 'Fichier digital (après paiement)', 'Digital file (unlocks after payment)'],
  active: ['مفعّل', 'Actif', 'Active'], featured: ['مميز', 'En vedette', 'Featured'], sort: ['الترتيب', 'Ordre', 'Order'],
  delivery_days: ['مدة التسليم (أيام)', 'Délai (jours)', 'Delivery (days)'], new_product: ['منتج جديد', 'Nouveau produit', 'New product'],
  revenue: ['المداخيل', 'Revenus', 'Revenue'], expenses: ['المصاريف', 'Dépenses', 'Expenses'], profit: ['الربح', 'Bénéfice', 'Profit'],
  add_expense: ['إضافة مصروف', 'Ajouter une dépense', 'Add expense'], pending_pays: ['دفعات تنتظر التأكيد', 'Paiements en attente', 'Pending payments'],
  to_client: ['تحويل لعميل', 'Convertir en client', 'Convert to client'], imported: ['تم التحويل', 'Converti', 'Converted'],
  s_contact: ['التواصل والدفع', 'Contact et paiement', 'Contact & payment'], s_landing: ['صفحة الهبوط', "Page d'accueil", 'Landing page'],
  s_custom: ['أقسام مخصصة (HTML / كود)', 'Sections personnalisées (HTML)', 'Custom sections (HTML / code)'], s_portfolio: ['أعمالي (Portfolio)', 'Portfolio', 'Portfolio'],
  s_telegram: ['إشعارات تيليغرام', 'Notifications Telegram', 'Telegram notifications'], s_backup: ['نسخة احتياطية', 'Sauvegarde', 'Backup'],
  backup_btn: ['تحميل نسخة احتياطية لكل البيانات', 'Télécharger une sauvegarde', 'Download full backup'],
  hero_title: ['العنوان الرئيسي', 'Titre principal', 'Hero title'], hero_sub: ['النص تحت العنوان', 'Sous-titre', 'Hero subtitle'],
  position: ['المكان', 'Position', 'Position'], after_services: ['بعد الخدمات', 'Après les services', 'After services'], before_footer: ['قبل الفوتر', 'Avant le pied de page', 'Before footer'], after_hero: ['بعد الواجهة', 'Après le hero', 'After hero'],
  section_title: ['عنوان القسم', 'Titre de section', 'Section title'], code: ['الكود / المحتوى', 'Code / contenu', 'Code / content'],
  media: ['صورة أو فيديو أو رابط', 'Image, vidéo ou lien', 'Image, video or link'], title: ['العنوان', 'Titre', 'Title'],
  tg_help: ['أنشئ بوت عند @BotFather والصق التوكن هنا، ثم ابعث رسالة للبوت واكتب الـ chat id (تجيبو من @userinfobot).', 'Créez un bot avec @BotFather, collez le token, puis votre chat id (via @userinfobot).', 'Create a bot with @BotFather, paste its token, then your chat id (from @userinfobot).'],
  test: ['تجربة', 'Tester', 'Test'], copied: ['تم النسخ', 'Copié', 'Copied'],
  stg_new: ['جديد', 'Nouveau', 'New'], stg_contacted: ['تم التواصل', 'Contacté', 'Contacted'], stg_offered: ['قدمنا عرض', 'Offre envoyée', 'Offered'],
  stg_client: ['عميل', 'Client', 'Client'], stg_lost: ['ضاع', 'Perdu', 'Lost'], stg_inactive: ['غير نشط', 'Inactif', 'Inactive'],
});
const STAGES = ['new', 'contacted', 'offered', 'client', 'lost', 'inactive'];
const STATUSES = ['quote_requested', 'quoted', 'pending_payment', 'payment_review', 'paid', 'in_progress', 'in_review', 'delivered', 'completed', 'cancelled', 'refunded'];
const NOTE_TYPES = ['note', 'whatsapp', 'call', 'instagram', 'meeting', 'important'];
const CATS = ['creative', 'accounts', 'web', 'payment', 'subs', 'marketing', 'digital', 'other'];
const today = () => new Date().toISOString().slice(0, 10);
const WA_TPL = {
  quoted: o => `السلام عليكم، سعر طلبك ${o.number} واجد: ${money(o.total)}. تقدر تقبلو من حسابك.`,
  pending_payment: o => `السلام عليكم، طلبك ${o.number} في انتظار الدفع (${money(o.total)}). ارفع الوصل من حسابك.`,
  paid: o => `تم تأكيد الدفع للطلب ${o.number}. شكرا! راح نبداو الخدمة.`,
  in_progress: o => `طلبك ${o.number} راهو قيد الإنجاز.`,
  in_review: o => `طلبك ${o.number} جاهز للمراجعة في حسابك.`,
  delivered: o => `تم تسليم طلبك ${o.number}. تقدر تحمل الملفات من حسابك.`,
  completed: o => `شكرا على ثقتك! الطلب ${o.number} مكتمل.`,
};

const Admin = {
  nav() {
    return [
      { k: 'dash', h: '#/a/dash', i: 'home', l: t('a_dash') },
      { k: 'orders', h: '#/a/orders', i: 'bag', l: t('a_orders'), c: S.counts.adm },
      { k: 'clients', h: '#/a/clients', i: 'users', l: t('a_clients') },
      { k: 'products', h: '#/a/products', i: 'box', l: t('a_products') },
      { k: 'finance', h: '#/a/finance', i: 'chart', l: t('a_finance') },
      { k: 'leads', h: '#/a/leads', i: 'inbox', l: t('a_leads') },
      { k: 'site', h: '#/a/site', i: 'settings', l: t('a_site') },
    ];
  },
  sh(k, title, body, o = {}) { return shell(k, title, body, { nav: this.nav(), ...o }); },
  route(b, c) {
    const m = { dash: 'dash', orders: 'orders', order: 'order', clients: 'clients', client: 'client', products: 'products', finance: 'finance', leads: 'leads', site: 'site' }[b] || 'dash';
    this[m](c);
  },
  async counts() {
    const { data } = await sb.from('orders').select('status').in('status', ['quote_requested', 'payment_review']);
    S.counts.adm = (data || []).length || 0;
  },

  /* ---------- dashboard ---------- */
  async dash() {
    const pg = this.sh('dash', t('a_dash'), '<div class="spin"></div>');
    const m0 = new Date(); m0.setDate(1); m0.setHours(0, 0, 0, 0);
    const wk = new Date(Date.now() - 7 * 864e5).toISOString();
    const [ord, pays, cl, fu] = await Promise.all([
      sb.from('orders').select('id,number,title,status,total,created_at,client_id,profiles!orders_client_id_fkey(full_name)').not('status', 'in', '(completed,cancelled,refunded)').order('created_at', { ascending: false }),
      sb.from('payments').select('amount,status,created_at').gte('created_at', m0.toISOString()),
      sb.from('profiles').select('id,created_at,role').eq('role', 'client'),
      sb.from('profiles').select('id,full_name,next_action,next_follow_up,phone').lte('next_follow_up', today()).not('next_follow_up', 'is', null).order('next_follow_up'),
    ]);
    await this.counts();
    const O = ord.data || [];
    const rev = (pays.data || []).filter(p => p.status === 'verified').reduce((s, p) => s + +p.amount, 0);
    const rv = O.filter(o => o.status === 'payment_review'), qt = O.filter(o => o.status === 'quote_requested');
    const act = O.filter(o => ['paid', 'in_progress', 'in_review'].includes(o.status));
    const newc = (cl.data || []).filter(c => c.created_at > wk).length;
    const oRow = o => `<a class="li" href="#/a/order/${o.id}" style="text-decoration:none;color:inherit"><div class="grow"><div class="row between nowrap"><b class="ell small">${esc(o.title)}</b><span class="tiny faint ltr">${o.number}</span></div><div class="row tiny muted">${esc(o.profiles?.full_name || '')} · ${stChip(o.status)} <span class="num">${money(o.total)}</span></div></div></a>`;
    const block = (title, arr, row) => arr.length ? `<div class="card"><h3>${title} <span class="chip">${arr.length}</span></h3><div class="list">${arr.slice(0, 8).map(row).join('')}</div></div>` : '';
    pg.innerHTML = `
      <div class="grid g4" style="margin-bottom:14px">
        <div class="card kpi"><span>${t('k_rev')}</span><b class="num">${money(rev)}</b></div>
        <div class="card kpi"><span>${t('k_review')}</span><b>${rv.length}</b></div>
        <div class="card kpi"><span>${t('k_quotes')}</span><b>${qt.length}</b></div>
        <div class="card kpi"><span>${t('k_active')}</span><b>${act.length}</b></div>
        <div class="card kpi"><span>${t('k_clients')}</span><b>${(cl.data || []).length}</b></div>
        <div class="card kpi"><span>${t('k_new')}</span><b>${newc}</b></div>
      </div>
      <h2 style="font-size:17px">${t('k_todo')}</h2>
      <div class="grid g2" style="align-items:start">
        ${block(t('k_review'), rv, oRow)}${block(t('k_quotes'), qt, oRow)}
        ${block(t('k_follow'), fu.data || [], c => `<a class="li" href="#/a/client/${c.id}" style="text-decoration:none;color:inherit"><span class="av">${esc(initials(c.full_name))}</span><div class="grow"><b class="small">${esc(c.full_name)}</b><div class="tiny muted">${esc(c.next_action || '')} · ${fdate(c.next_follow_up)}</div></div></a>`)}
        ${block(t('k_active'), act, oRow)}
      </div>
      ${!rv.length && !qt.length && !(fu.data || []).length && !act.length ? `<div class="card empty">${ic('check')}<p>${t('all_good')}</p></div>` : ''}`;
  },

  /* ---------- orders ---------- */
  async orders() {
    const f = sessionStorage.getItem('ofa_of') || 'action';
    const pg = this.sh('orders', t('a_orders'), '<div class="spin"></div>');
    const { data } = await sb.from('orders').select('id,number,title,status,total,created_at,source,profiles!orders_client_id_fkey(full_name,phone)').order('created_at', { ascending: false }).limit(500);
    await this.counts();
    const groups = { all: () => true, action: o => ['quote_requested', 'payment_review', 'paid', 'in_review'].includes(o.status), active: o => ['quoted', 'pending_payment', 'in_progress', 'delivered'].includes(o.status), done: o => ['completed', 'cancelled', 'refunded'].includes(o.status) };
    const render = q => {
      const list = (data || []).filter(groups[f]).filter(o => !q || (o.number + o.title + (o.profiles?.full_name || '') + (o.profiles?.phone || '')).toLowerCase().includes(q.toLowerCase()));
      $('#ol').innerHTML = list.length ? list.map(o => `<a class="li" href="#/a/order/${o.id}" style="text-decoration:none;color:inherit"><div class="grow"><div class="row between nowrap"><b class="ell">${esc(o.title)}</b><span class="tiny faint ltr">${o.number}</span></div><div class="row small muted" style="margin-top:3px">${esc(o.profiles?.full_name || '')} ${stChip(o.status)} <span class="num">${money(o.total)}</span><span class="tiny faint">${fdate(o.created_at)}</span>${o.source !== 'portal' ? `<span class="chip">${o.source}</span>` : ''}</div></div></a>`).join('') : `<div class="empty">—</div>`;
    };
    pg.innerHTML = `<div class="row" style="margin-bottom:12px"><div class="pills grow">${Object.keys(groups).map(k => `<button class="pill ${k === f ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_of','${k}');Admin.orders()">${t('f_' + k)} <span class="faint">${(data || []).filter(groups[k]).length}</span></button>`).join('')}</div><input class="in" style="max-width:260px" placeholder="${t('search')}" oninput="this._r(this.value)" id="oq"></div>
      <div class="card" style="padding:6px 14px"><div class="list" id="ol"></div></div><button class="fab" onclick="Admin.newOrder()" aria-label="${t('new_order')}">${ic('plus')}</button>`;
    $('#oq')._r = render; render('');
  },
  async newOrder(clientId) {
    await loadProducts(true);
    const { data: cl } = await sb.from('profiles').select('id,full_name,phone').eq('role', 'client').order('full_name');
    const body = modal(t('new_order'), `<form id="nf">
      <div class="f"><label>${t('client')}</label><select name="client_id" required>${(cl || []).map(c => `<option value="${c.id}" ${c.id === clientId ? 'selected' : ''}>${esc(c.full_name)} · ${showPhone(c.phone)}</option>`).join('')}</select></div>
      <div class="f"><label>${t('product')}</label><select name="product_id" required>${S.products.map(p => `<option value="${p.id}">${esc(tr(p.name))}</option>`).join('')}</select></div>
      <div class="f"><label>${t('package')}</label><select name="variant_id"></select></div>
      <div class="f"><label>${t('price')} (DZD)</label><input name="total" type="number" min="0" step="1"></div>
      <div class="f"><label>${t('status')}</label><select name="status">${STATUSES.map(s => `<option value="${s}" ${s === 'pending_payment' ? 'selected' : ''}>${t('st_' + s)}</option>`).join('')}</select></div>
      <div class="f"><label>${t('source')}</label><select name="source"><option value="whatsapp">WhatsApp</option><option value="admin">Admin</option><option value="website">Website</option></select></div>
      <div class="f"><label>${t('internal_notes')}</label><textarea name="internal_notes"></textarea></div>
      <button class="btn pri block">${t('save')}</button></form>`);
    const f = $('#nf', body);
    const fillV = () => { const p = S.products.find(x => x.id === f.product_id.value); f.variant_id.innerHTML = (p?.variants || []).map(v => `<option value="${v.id}" data-p="${v.price || ''}">${esc(tr(v.name))} · ${money(v.price > 0 ? v.price : null)}</option>`).join(''); f.total.value = f.variant_id.selectedOptions[0]?.dataset.p || ''; };
    f.product_id.onchange = fillV; f.variant_id.onchange = () => f.total.value = f.variant_id.selectedOptions[0]?.dataset.p || ''; fillV();
    f.onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f)); const p = S.products.find(x => x.id === d.product_id); const v = p?.variants.find(x => x.id === d.variant_id);
      await busy(e.submitter, async () => {
        const { data, error } = await sb.from('orders').insert({ client_id: d.client_id, product_id: d.product_id, variant_id: d.variant_id || null, title: tr(p.name) + (v ? ' · ' + tr(v.name) : ''), unit_price: d.total || null, total: d.total || null, cost: v?.cost || null, status: d.status, source: d.source, internal_notes: d.internal_notes || null, stages: [] }).select('id').single();
        if (error) throw error; closeModal(); go('#/a/order/' + data.id);
      });
    };
  },
  async order(id) {
    const pg = this.sh('orders', t('a_orders'), '<div class="spin"></div>', { back: '#/a/orders' });
    let d; try { d = await fetchOrder(id); } catch { pg.innerHTML = `<div class="card empty">${t('e_generic')}</div>`; return; }
    const { o, pays, cm, fl } = d;
    const { data: c } = await sb.from('profiles').select('id,full_name,phone,business').eq('id', o.client_id).single();
    const paid = pays.filter(x => x.status === 'verified').reduce((s, x) => s + +x.amount, 0);
    const stages = o.stages || [];
    const tpl = WA_TPL[o.status];
    pg.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">
     <div class="col">
      <div class="card"><div class="row between"><span class="tiny faint ltr">${o.number} · ${fdt(o.created_at)} · ${o.source}</span>${stChip(o.status)}</div>
        <h2 style="font-size:19px;margin:8px 0">${esc(o.title)}</h2>
        <a class="li" href="#/a/client/${c.id}" style="text-decoration:none;color:inherit;padding:8px 0"><span class="av">${esc(initials(c.full_name))}</span><div class="grow"><b>${esc(c.full_name)}</b><div class="small muted ltr" style="text-align:start">${showPhone(c.phone)}${c.business ? ' · ' + esc(c.business) : ''}</div></div>${ic('arrow', 'ico flip')}</a>
        <div class="row between small"><span class="muted">${t('total')}</span><b class="num">${money(o.total)}</b></div>
        <div class="row between small"><span class="muted">${t('spent')}</span><b class="num">${money(paid)}</b></div>
        ${Object.keys(o.answers || {}).length ? `<div class="sep"></div>${Object.entries(o.answers).map(([k, v]) => `<p class="small"><b>${esc(k)}</b><br><span class="muted">${esc(v)}</span></p>`).join('')}` : ''}
        <div class="row" style="margin-top:10px"><a class="btn wa sm grow" target="_blank" rel="noopener" href="${waLink(tpl ? tpl(o) : `بخصوص طلبك ${o.number}`, c.phone)}">${ic('wa')} ${t('notify_wa')}</a></div>
      </div>
      <div class="card"><h3>${t('change_status')}</h3>
        <div class="row nowrap"><select id="ost" class="in grow">${STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${t('st_' + s)}</option>`).join('')}</select><button class="btn pri" onclick="Admin.setStatus('${o.id}',this)">${t('save')}</button></div>
        ${['quote_requested', 'quoted'].includes(o.status) || !o.total ? `<div class="row nowrap" style="margin-top:10px"><input id="oprice" class="in grow" type="number" min="1" placeholder="${t('price')} DZD" value="${o.total || ''}"><button class="btn" onclick="Admin.setPrice('${o.id}',this)">${t('set_price')}</button></div>` : ''}
        <div class="row nowrap" style="margin-top:10px"><label class="small muted" style="white-space:nowrap">${t('due')}</label><input id="odue" class="in grow" type="date" value="${o.due_date || ''}" onchange="Admin.upd('${o.id}',{due_date:this.value||null})"></div>
        <div class="f" style="margin:10px 0 0"><label>${t('internal_notes')}</label><textarea onchange="Admin.upd('${o.id}',{internal_notes:this.value||null})">${esc(o.internal_notes || '')}</textarea></div>
      </div>
      <div class="card"><div class="row between"><h3 style="margin:0">${t('progress')} <span class="num faint">${stagePct(o)}%</span></h3></div>
        <div class="steps" style="margin-top:8px">${stages.map((s, i) => `<label class="step check ${s.done ? 'done' : ''}"><input type="checkbox" ${s.done ? 'checked' : ''} onchange="Admin.toggleStage('${o.id}',${i},this.checked)" style="width:18px;height:18px"> ${esc(s.name)}</label>`).join('') || '<p class="small faint">—</p>'}</div>
        <form class="row nowrap" style="margin-top:8px" onsubmit="Admin.addStage(event,'${o.id}')"><input class="in grow" name="s" placeholder="+ ${t('add')}"><button class="btn sm">${ic('plus')}</button></form>
      </div>
     </div>
     <div class="col">
      <div class="card"><div class="row between"><h3 style="margin:0">${t('payments')}</h3><button class="btn sm" onclick="Admin.addPayment('${o.id}','${o.client_id}',${Math.max(0, (o.total || 0) - paid)})">${ic('plus')} ${t('add_payment')}</button></div>
        ${pays.map(x => `<div class="li" style="cursor:default"><div class="grow"><div class="row"><b class="num">${money(x.amount)}</b><span class="chip ${x.status === 'verified' ? 'g' : x.status === 'rejected' ? 'b' : 'w'}">${t('pst_' + x.status)}</span></div><div class="tiny muted">${fdt(x.created_at)} · ${t('m_' + x.method)}</div></div>
          ${x.receipt_path ? `<button class="btn sm" onclick="openFile('receipts','${esc(x.receipt_path)}')">${ic('image')} ${t('receipt')}</button>` : ''}
          ${x.status === 'pending' ? `<button class="btn sm pri" onclick="Admin.payStatus('${x.id}','verified',this)">${t('verify')}</button><button class="btn sm danger" onclick="Admin.payStatus('${x.id}','rejected',this)">${t('reject')}</button>` : ''}</div>`).join('') || '<p class="small faint">—</p>'}
      </div>
      <div class="card"><div class="row between"><h3 style="margin:0">${t('files')}</h3><button class="btn sm" onclick="Admin.uploadDeliverable('${o.id}','${o.client_id}',this)">${ic('upload')} ${t('deliverable')}</button></div>
        <div class="list">${fl.map(f => fileRow(f).replace('</div>' + ic('download'), `</div><span class="chip">${f.kind}</span>` + ic('download'))).join('') || '<p class="small faint">—</p>'}</div></div>
      <div class="card"><h3>${t('comments')}</h3><div class="col" id="cms" style="max-height:380px;overflow:auto">${cm.map(x => `<div class="cmt ${x.internal ? 'int' : x.author_id === S.me.id ? 'me' : ''}"><div class="small">${esc(x.body)}</div><div class="tiny faint">${fdt(x.created_at)}${x.internal ? ' · 🔒' : ''}</div></div>`).join('') || '<p class="small faint">—</p>'}</div>
        <form style="margin-top:10px" onsubmit="Admin.comment(event,'${o.id}')"><div class="row nowrap"><input class="in grow" name="b" placeholder="${t('write_msg')}" required maxlength="2000"><button class="btn pri icon">${ic('send', 'ico flip')}</button></div><label class="check small" style="margin-top:6px"><input type="checkbox" name="internal"> ${t('internal')}</label></form></div>
     </div></div>`;
    if (document.dir === 'rtl') $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
    const cc = $('#cms'); if (cc) cc.scrollTop = cc.scrollHeight;
    this._o = o;
  },
  async upd(id, patch, reload) { const { error } = await sb.from('orders').update(patch).eq('id', id); if (error) return toast(errMsg(error), true); toast(t('saved')); if (reload) route(); },
  async setStatus(id, btn) {
    const st = $('#ost').value; const patch = { status: st };
    if (st === 'delivered') patch.delivered_at = new Date().toISOString();
    await busy(btn, async () => { const { error } = await sb.from('orders').update(patch).eq('id', id); if (error) throw error; toast(t('saved')); route(); });
  },
  async setPrice(id, btn) {
    const v = +$('#oprice').value; if (!(v > 0)) return;
    await busy(btn, async () => { const { error } = await sb.from('orders').update({ total: v, unit_price: v, status: 'quoted' }).eq('id', id); if (error) throw error; toast(t('saved')); route(); });
  },
  async toggleStage(id, i, done) {
    const s = [...(this._o.stages || [])]; s[i] = { ...s[i], done, at: done ? new Date().toISOString() : null };
    const patch = { stages: s }; if (done && this._o.status === 'paid') patch.status = 'in_progress';
    await this.upd(id, patch, true);
  },
  async addStage(e, id) { e.preventDefault(); const n = e.target.s.value.trim(); if (!n) return; await this.upd(id, { stages: [...(this._o.stages || []), { name: n, done: false }] }, true); },
  async payStatus(pid, st, btn) { await busy(btn, async () => { const { error } = await sb.from('payments').update({ status: st }).eq('id', pid); if (error) throw error; toast(t('saved')); route(); }); },
  addPayment(orderId, clientId, due) {
    const body = modal(t('add_payment'), `<form id="apf"><div class="f"><label>${t('amount')}</label><input name="amount" type="number" min="1" value="${due || ''}" required></div>
      <div class="f"><label>${t('method')}</label><select name="method">${['baridimob', 'ccp', 'cash', 'card', 'other'].map(m => `<option value="${m}">${t('m_' + m)}</option>`).join('')}</select></div>
      <div class="f"><label>${t('date')}</label><input name="paid_on" type="date" value="${today()}"></div>
      <button class="btn pri block">${t('save')}</button></form>`);
    $('#apf', body).onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
      await busy(e.submitter, async () => {
        const { data, error } = await sb.from('payments').insert({ order_id: orderId, client_id: clientId, amount: +d.amount, method: d.method, paid_on: d.paid_on || null }).select('id').single();
        if (error) throw error;
        await sb.from('payments').update({ status: 'verified' }).eq('id', data.id);
        closeModal(); route();
      });
    };
  },
  async uploadDeliverable(orderId, clientId, btn) {
    const files = await pickFile('*/*', true); if (!files || !files.length) return;
    await busy(btn, async () => {
      for (const file of files) {
        const path = `${clientId}/${orderId}/${Date.now()}-${safeName(file.name)}`;
        const u = await upload('client-files', path, file);
        const { error } = await sb.from('files').insert({ client_id: clientId, order_id: orderId, kind: 'deliverable', bucket: 'client-files', path, label: file.name, size_bytes: u.size, uploaded_by: S.me.id });
        if (error) throw error;
      }
      route();
    });
  },
  async comment(e, id) {
    e.preventDefault(); const f = e.target;
    await busy(e.submitter, async () => { const { error } = await sb.from('order_comments').insert({ order_id: id, author_id: S.me.id, body: f.b.value.trim(), internal: f.internal.checked }); if (error) throw error; route(); });
  },

  /* ---------- clients ---------- */
  async clients() {
    const pg = this.sh('clients', t('a_clients'), '<div class="spin"></div>');
    const st = sessionStorage.getItem('ofa_cs') || 'all';
    const { data } = await sb.from('profiles').select('id,full_name,phone,business,stage,status,user_id,next_follow_up,created_at').eq('role', 'client').order('created_at', { ascending: false });
    const render = q => {
      const list = (data || []).filter(c => st === 'all' || c.stage === st).filter(c => !q || (c.full_name + c.phone + (c.business || '')).toLowerCase().includes(q.toLowerCase()));
      $('#cl').innerHTML = list.map(c => `<a class="li" href="#/a/client/${c.id}" style="text-decoration:none;color:inherit"><span class="av">${esc(initials(c.full_name))}</span><div class="grow"><div class="row between nowrap"><b class="ell">${esc(c.full_name)}</b><span class="chip ${c.stage === 'client' ? 'g' : c.stage === 'lost' ? 'b' : ''}">${t('stg_' + c.stage)}</span></div><div class="row tiny muted"><span class="ltr">${showPhone(c.phone)}</span>${c.business ? '· ' + esc(c.business) : ''}${c.user_id ? ` · ${ic('user', 'ico" style="width:13px;height:13px')}` : ''}${c.status === 'suspended' ? ` <span class="chip b">${t('suspend')}</span>` : ''}${c.next_follow_up ? ` · ${ic('clock', 'ico" style="width:13px;height:13px')} ${fdate(c.next_follow_up)}` : ''}</div></div></a>`).join('') || `<div class="empty">—</div>`;
    };
    pg.innerHTML = `<div class="row" style="margin-bottom:12px"><div class="pills grow">${['all', ...STAGES].map(k => `<button class="pill ${k === st ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_cs','${k}');Admin.clients()">${k === 'all' ? t('f_all') : t('stg_' + k)} <span class="faint">${(data || []).filter(c => k === 'all' || c.stage === k).length}</span></button>`).join('')}</div><input class="in" id="cq" style="max-width:260px" placeholder="${t('search')}"></div>
      <div class="card" style="padding:6px 14px"><div class="list" id="cl"></div></div><button class="fab" onclick="Admin.newClient()" aria-label="${t('new_client')}">${ic('plus')}</button>`;
    $('#cq').oninput = e => render(e.target.value); render('');
  },
  newClient(prefill = {}) {
    const body = modal(t('new_client'), `<form id="ncf"><div class="f"><label>${t('name')}</label><input name="full_name" required value="${esc(prefill.name || '')}"></div>
      <div class="f"><label>${t('phone')}</label><input name="phone" type="tel" required class="ltr" style="text-align:start" value="${esc(prefill.phone || '')}"></div>
      <div class="f"><label>${t('business')}</label><input name="business" value="${esc(prefill.business || '')}"></div>
      <label class="check" style="margin-bottom:10px"><input type="checkbox" name="acc" onchange="this.form.password.parentElement.hidden=!this.checked"> ${t('with_account')}</label>
      <div class="f" hidden><label>${t('password')}</label><input name="password" minlength="6" value="${Math.random().toString(36).slice(2, 10)}"></div>
      <button class="btn pri block">${t('save')}</button></form>`);
    $('#ncf', body).onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); const phone = normPhone(d.phone);
      if (!phone) return toast(t('e_phone'), true);
      await busy(e.submitter, async () => {
        let id;
        const ex = await sb.from('profiles').select('id').eq('phone', phone).maybeSingle();
        if (ex.data) id = ex.data.id;
        else { const { data, error } = await sb.from('profiles').insert({ full_name: d.full_name.trim(), phone, business: d.business || null, source: prefill.source || 'admin', stage: 'new' }).select('id').single(); if (error) throw error; id = data.id; }
        if (d.acc) await this.fn({ action: 'create_client', full_name: d.full_name.trim(), phone, password: d.password });
        if (prefill.leadId) await sb.from('leads').update({ imported: true, imported_at: new Date().toISOString(), client_ref: id }).eq('id', prefill.leadId);
        closeModal(); if (d.acc) this.shareCreds(d.full_name, phone, d.password); go('#/a/client/' + id);
      });
    };
  },
  shareCreds(name, phone, pw) {
    const msg = `مرحبا ${name}، تم إنشاء حسابك في ONE FOR ALL\nالرابط: ${location.origin}${location.pathname}\nالرقم: ${showPhone(phone)}\nكلمة السر: ${pw}\nتقدر تبدلها من حسابك.`;
    modal(t('has_account'), `<pre class="card flat small" style="white-space:pre-wrap;margin:0 0 12px">${esc(msg)}</pre><a class="btn wa block" target="_blank" rel="noopener" href="${waLink(msg, phone)}">${ic('wa')} WhatsApp</a>`);
  },
  async fn(body) {
    const { data, error } = await sb.functions.invoke('admin-users', { body });
    if (error) { let m = error.message; try { m = (await error.context.json()).error || m; } catch {} throw new Error(m === 'exists' ? t('e_exists') : m); }
    return data;
  },
  async client(id) {
    const pg = this.sh('clients', t('a_clients'), '<div class="spin"></div>', { back: '#/a/clients' });
    const [cr, or, nr, pr] = await Promise.all([
      sb.from('profiles').select('*').eq('id', id).single(),
      sb.from('orders').select('id,number,title,status,total,created_at,product_id,products(slug)').eq('client_id', id).order('created_at', { ascending: false }),
      sb.from('notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      sb.from('payments').select('amount,status').eq('client_id', id),
    ]);
    await loadProducts();
    const c = cr.data; if (!c) { pg.innerHTML = `<div class="card empty">—</div>`; return; }
    const O = or.data || []; const spent = (pr.data || []).filter(p => p.status === 'verified').reduce((s, p) => s + +p.amount, 0);
    const bought = new Set(O.filter(o => !['cancelled', 'refunded'].includes(o.status)).map(o => o.products?.slug));
    const next = [...new Set(S.products.filter(p => bought.has(p.slug)).flatMap(p => p.next_products || []))].filter(s => !bought.has(s)).map(s => S.products.find(p => p.slug === s)).filter(Boolean);
    const sugg = next.length ? next : S.products.filter(p => p.active && p.featured && !bought.has(p.slug));
    this._c = c;
    pg.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">
     <div class="col">
      <div class="card"><div class="row nowrap"><span class="av" style="width:56px;height:56px;font-size:20px">${esc(initials(c.full_name))}</span><div class="grow"><h2 style="font-size:19px;margin:0">${esc(c.full_name)}</h2><div class="small muted ltr" style="text-align:start">${showPhone(c.phone)}</div><div class="row" style="margin-top:4px"><span class="chip ${c.stage === 'client' ? 'g' : ''}">${t('stg_' + c.stage)}</span><span class="chip ${c.user_id ? 'g' : ''}">${c.user_id ? t('has_account') : t('no_account')}</span>${c.status === 'suspended' ? `<span class="chip b">${t('suspend')}</span>` : ''}</div></div></div>
        <div class="grid g4" style="margin-top:14px"><div class="card flat kpi" style="padding:10px"><span>${t('spent')}</span><b class="num" style="font-size:18px">${money(spent)}</b></div><div class="card flat kpi" style="padding:10px"><span>${t('orders_n')}</span><b style="font-size:18px">${O.length}</b></div></div>
        <div class="row" style="margin-top:12px"><a class="btn wa sm" target="_blank" rel="noopener" href="${waLink('السلام عليكم ' + c.full_name, c.phone)}">${ic('wa')} WhatsApp</a><a class="btn sm" href="tel:+${c.phone}">${ic('phone')}</a><button class="btn sm pri" onclick="Admin.newOrder('${c.id}')">${ic('plus')} ${t('new_order')}</button></div>
      </div>
      <div class="card"><h3>${t('acc_actions')}</h3><div class="row">
        ${c.user_id ? `<button class="btn sm" onclick="Admin.resetPw()">${ic('key')} ${t('reset_pw')}</button>
          <button class="btn sm ${c.status === 'suspended' ? '' : 'danger'}" onclick="Admin.suspend(this)">${ic('ban')} ${c.status === 'suspended' ? t('activate') : t('suspend')}</button>
          <button class="btn sm" onclick="Admin.viewAs()">${ic('eye')} ${t('view_client')}</button>`
        : `<button class="btn sm pri" onclick="Admin.createAcc()">${ic('user')} ${t('create_acc')}</button>`}</div></div>
      ${sugg.length ? `<div class="card"><h3>${ic('spark')} ${t('sell_next')}</h3>${sugg.slice(0, 4).map(p => `<div class="row between small" style="padding:6px 0"><span>${esc(tr(p.name))}</span><a class="btn sm wa" target="_blank" rel="noopener" href="${waLink(`السلام عليكم ${c.full_name}، عندنا ${tr(p.name)} ${priceOf(p) ? 'بـ ' + money(priceOf(p)) : ''} — يناسبك؟`, c.phone)}">${ic('wa')}</a></div>`).join('')}</div>` : ''}
      <div class="card"><h3>${t('orders_n')}</h3><div class="list">${O.map(o => `<a class="li" href="#/a/order/${o.id}" style="text-decoration:none;color:inherit"><div class="grow"><div class="row between nowrap"><b class="small ell">${esc(o.title)}</b><span class="tiny faint ltr">${o.number}</span></div><div class="row tiny">${stChip(o.status)}<span class="num muted">${money(o.total)}</span><span class="faint">${fdate(o.created_at)}</span></div></div></a>`).join('') || '<p class="small faint">—</p>'}</div></div>
     </div>
     <div class="col">
      <div class="card"><h3>${t('profile')}</h3><form id="cf">
        <div class="grid g2" style="gap:0 12px">
          <div class="f"><label>${t('name')}</label><input name="full_name" value="${esc(c.full_name)}" required></div>
          <div class="f"><label>${t('phone')}</label><input name="phone" value="${esc(c.phone)}" class="ltr" ${c.user_id ? 'readonly' : ''}></div>
          <div class="f"><label>${t('stage')}</label><select name="stage">${STAGES.map(s => `<option value="${s}" ${s === c.stage ? 'selected' : ''}>${t('stg_' + s)}</option>`).join('')}</select></div>
          <div class="f"><label>${t('business')}</label><input name="business" value="${esc(c.business || '')}"></div>
          <div class="f"><label>${t('wilaya')}</label><input name="wilaya" value="${esc(c.wilaya || '')}"></div>
          <div class="f"><label>${t('instagram')}</label><input name="instagram" value="${esc(c.instagram || '')}"></div>
          <div class="f"><label>${t('next_action')}</label><input name="next_action" value="${esc(c.next_action || '')}"></div>
          <div class="f"><label>${t('follow_up')}</label><input name="next_follow_up" type="date" value="${c.next_follow_up || ''}"></div>
          <div class="f"><label>${t('source')}</label><input name="source" value="${esc(c.source || '')}"></div>
          <div class="f"><label>${t('tags')}</label><input name="tags" value="${esc((c.tags || []).join(', '))}"></div>
        </div>
        <div class="f"><label>${t('important_dates')}</label><input name="important_dates" value="${esc(c.important_dates || '')}"></div>
        <div class="f"><label>${t('notes')}</label><textarea name="notes">${esc(c.notes || '')}</textarea></div>
        <button class="btn pri block">${t('save')}</button></form></div>
      <div class="card"><h3>${t('history')}</h3>
        <form class="col" onsubmit="Admin.addNote(event,'${c.id}')" style="gap:6px;margin-bottom:10px"><div class="row nowrap"><select name="type" class="in" style="width:auto">${NOTE_TYPES.map(n => `<option>${n}</option>`).join('')}</select><input name="body" class="in grow" placeholder="${t('add_note')}" required maxlength="5000"><button class="btn pri icon">${ic('plus')}</button></div></form>
        ${(nr.data || []).map(n => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div class="row tiny faint"><span class="chip">${n.type}</span>${fdt(n.created_at)}</div><div class="small" style="margin-top:4px;white-space:pre-wrap">${esc(n.body)}</div></div>`).join('') || '<p class="small faint">—</p>'}</div>
     </div></div>`;
    if (document.dir === 'rtl') $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
    $('#cf').onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
      const patch = { ...d, tags: d.tags ? d.tags.split(',').map(s => s.trim()).filter(Boolean) : [], next_follow_up: d.next_follow_up || null };
      if (!c.user_id) { const p = normPhone(d.phone); if (!p) return toast(t('e_phone'), true); patch.phone = p; } else delete patch.phone;
      ['business', 'wilaya', 'instagram', 'next_action', 'source', 'important_dates', 'notes'].forEach(k => patch[k] = patch[k] || null);
      await busy(e.submitter, async () => { const { error } = await sb.from('profiles').update(patch).eq('id', c.id); if (error) throw error; toast(t('saved')); });
    };
  },
  async addNote(e, id) { e.preventDefault(); const f = e.target; await busy(e.submitter, async () => { const { error } = await sb.from('notes').insert({ client_id: id, type: f.type.value, body: f.body.value.trim(), author_id: S.me.id }); if (error) throw error; route(); }); },
  resetPw() {
    const c = this._c; const pw = Math.random().toString(36).slice(2, 10);
    const body = modal(t('reset_pw'), `<form id="rpf"><div class="f"><label>${t('new_pw')}</label><input name="pw" value="${pw}" minlength="6" required></div><button class="btn pri block">${t('save')}</button></form>`);
    $('#rpf', body).onsubmit = async e => { e.preventDefault(); const p = e.target.pw.value; await busy(e.submitter, async () => { await this.fn({ action: 'reset_password', profile_id: c.id, password: p }); closeModal(); this.shareCreds(c.full_name, c.phone, p); }); };
  },
  async suspend(btn) { if (!confirm(t('sure'))) return; const c = this._c; await busy(btn, async () => { await this.fn({ action: c.status === 'suspended' ? 'activate' : 'suspend', profile_id: c.id }); toast(t('saved')); route(); }); },
  createAcc() {
    const c = this._c; const pw = Math.random().toString(36).slice(2, 10);
    const body = modal(t('create_acc'), `<form id="caf"><p class="small muted ltr">${showPhone(c.phone)}</p><div class="f"><label>${t('password')}</label><input name="pw" value="${pw}" minlength="6" required></div><button class="btn pri block">${t('create_acc')}</button></form>`);
    $('#caf', body).onsubmit = async e => { e.preventDefault(); const p = e.target.pw.value; await busy(e.submitter, async () => { await this.fn({ action: 'create_client', full_name: c.full_name, phone: c.phone, password: p }); closeModal(); this.shareCreds(c.full_name, c.phone, p); setTimeout(route, 300); }); };
  },
  viewAs() { S.viewAs = this._c; go('#/'); },

  /* ---------- products ---------- */
  async products() {
    const pg = this.sh('products', t('a_products'), '<div class="spin"></div>');
    await loadProducts(true);
    pg.innerHTML = `<div class="grid g3">${S.products.map(p => `<div class="card pc click" onclick="Admin.editProduct('${p.id}')" style="${p.active ? '' : 'opacity:.55'}"><div class="cover">${coverOf(p) ? `<img src="${esc(coverOf(p))}" alt="" loading="lazy">` : ic('image')}</div><div class="body"><div class="row between"><b>${esc(tr(p.name))}</b><span class="chip">${t('t_' + p.type)}</span></div><div class="price">${money(priceOf(p))}</div><div class="row tiny muted">${p.active ? t('active') : '—'} ${p.featured ? '· ★' : ''} · ${(p.variants || []).length} ${t('package')}</div></div></div>`).join('')}</div>
      <button class="fab" onclick="Admin.editProduct()" aria-label="${t('new_product')}">${ic('plus')}</button>`;
  },
  editProduct(id) {
    const p = S.products.find(x => x.id === id) || { type: 'service', category: 'other', name: {}, description: {}, gallery: [], questions: [], stages: [], next_products: [], active: true, featured: false, sort: S.products.length + 1, delivery_days: 3, variants: [] };
    const st = { cover: p.cover_url || '', gallery: [...(p.gallery || [])], digital: p.digital_path || '' };
    const vs = p.variants.length ? p.variants : [{ name: { ar: 'الباقة الأساسية', fr: 'Offre de base', en: 'Standard' }, price: null, cost: null, active: true }];
    const L = ['ar', 'fr', 'en'];
    const body = modal(id ? tr(p.name) : t('new_product'), `<form id="pf">
      <div class="grid g2" style="gap:0 12px">
        <div class="f"><label>${t('type')}</label><select name="type"><option value="service" ${p.type === 'service' ? 'selected' : ''}>${t('t_service')}</option><option value="digital" ${p.type === 'digital' ? 'selected' : ''}>${t('t_digital')}</option></select></div>
        <div class="f"><label>${t('category')}</label><select name="category">${CATS.map(c => `<option ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="f"><label>Slug (a-z)</label><input name="slug" value="${esc(p.slug || '')}" pattern="[a-z0-9_\\-]{2,60}" required class="ltr"></div>
        <div class="f"><label>${t('delivery_days')}</label><input name="delivery_days" type="number" min="0" max="365" value="${p.delivery_days ?? ''}"></div>
      </div>
      ${L.map(l => `<div class="f"><label>${t('name')} (${l.toUpperCase()})</label><input name="name_${l}" value="${esc(p.name?.[l] || '')}" ${l === 'ar' ? 'required' : ''}></div>`).join('')}
      ${L.map(l => `<div class="f"><label>${t('description')} (${l.toUpperCase()})</label><textarea name="desc_${l}" rows="2">${esc(p.description?.[l] || '')}</textarea></div>`).join('')}
      <div class="f"><label>${t('cover')}</label><div class="upl" id="pcov"></div><button type="button" class="btn sm" id="bcov">${ic('image')} ${t('upload_file')}</button></div>
      <div class="f"><label>${t('gallery')}</label><div class="upl" id="pgal"></div><button type="button" class="btn sm" id="bgal">${ic('image')} ${t('add')}</button></div>
      <div class="f"><label>${t('variants')}</label><div id="pvs" class="col" style="gap:6px"></div><button type="button" class="btn sm" id="bvar">${ic('plus')} ${t('add')}</button></div>
      <div class="f"><label>${t('questions')}</label><textarea name="questions" rows="3">${esc((p.questions || []).map(q => (q.required ? '*' : '') + tr(q.label) + (q.type === 'textarea' ? ' [long]' : '')).join('\n'))}</textarea></div>
      <div class="f"><label>${t('stages')}</label><textarea name="stages" rows="3">${esc((p.stages || []).join('\n'))}</textarea></div>
      <div class="f"><label>${t('next_products')}</label><div class="row">${S.products.filter(x => x.id !== p.id).map(x => `<label class="check small"><input type="checkbox" name="np" value="${x.slug}" ${(p.next_products || []).includes(x.slug) ? 'checked' : ''}> ${esc(tr(x.name))}</label>`).join('')}</div></div>
      <div class="f" id="pdig"><label>${t('digital_file')}</label><div class="row"><span class="small muted ell grow" id="pdn">${esc(st.digital || '—')}</span><button type="button" class="btn sm" id="bdig">${ic('upload')} ${t('upload_file')}</button></div></div>
      <div class="row" style="margin-bottom:14px"><label class="check"><input type="checkbox" name="active" ${p.active ? 'checked' : ''}> ${t('active')}</label><label class="check"><input type="checkbox" name="featured" ${p.featured ? 'checked' : ''}> ${t('featured')}</label><label class="check">${t('sort')} <input name="sort" type="number" class="in" style="width:80px;min-height:36px" value="${p.sort || 0}"></label></div>
      <button class="btn pri block lg">${t('save')}</button></form>`, { wide: true });
    const f = $('#pf', body);
    const drawImgs = () => {
      $('#pcov').innerHTML = st.cover ? `<div class="u"><img src="${esc(st.cover)}" alt=""><button type="button" data-x="cov">×</button></div>` : '';
      $('#pgal').innerHTML = st.gallery.map((u, i) => `<div class="u"><img src="${esc(u)}" alt=""><button type="button" data-x="${i}">×</button></div>`).join('');
    };
    body.addEventListener('click', e => { const x = e.target.dataset?.x; if (x == null) return; if (x === 'cov') st.cover = ''; else st.gallery.splice(+x, 1); drawImgs(); });
    const up = async (file) => { const path = `products/${Date.now()}-${safeName(file.name)}`; await upload('public-media', path, file); return publicUrl(path); };
    $('#bcov').onclick = async e => { const fl = await pickFile('image/*'); if (fl) await busy(e.currentTarget, async () => { st.cover = await up(fl); drawImgs(); }); };
    $('#bgal').onclick = async e => { const fls = await pickFile('image/*', true); if (fls?.length) await busy(e.currentTarget, async () => { for (const fl of fls) st.gallery.push(await up(fl)); drawImgs(); }); };
    $('#bdig').onclick = async e => { const fl = await pickFile(); if (fl) await busy(e.currentTarget, async () => { const path = `${f.slug.value || 'product'}/${Date.now()}-${safeName(fl.name)}`; const { error } = await sb.storage.from('digital').upload(path, fl, { upsert: true }); if (error) throw error; st.digital = path; $('#pdn').textContent = path; }); };
    const vRow = v => `<div class="row nowrap vr" data-id="${v.id || ''}"><input class="in grow" placeholder="${t('package')} (AR)" value="${esc(v.name?.ar || '')}" data-k="ar"><input class="in" style="width:110px" type="number" min="0" placeholder="${t('price')}" value="${v.price ?? ''}" data-k="price"><input class="in" style="width:90px" type="number" min="0" placeholder="cost" value="${v.cost ?? ''}" data-k="cost"><label class="check tiny"><input type="checkbox" data-k="active" ${v.active !== false ? 'checked' : ''}></label></div>`;
    $('#pvs').innerHTML = vs.map(vRow).join('');
    $('#bvar').onclick = () => $('#pvs').insertAdjacentHTML('beforeend', vRow({ name: {}, active: true }));
    const togDig = () => $('#pdig').hidden = f.type.value !== 'digital'; f.type.onchange = togDig; togDig();
    drawImgs();
    f.onsubmit = async e => {
      e.preventDefault(); const d = new FormData(f);
      const row = {
        type: d.get('type'), category: d.get('category'), slug: d.get('slug').trim(), delivery_days: d.get('delivery_days') ? +d.get('delivery_days') : null,
        name: Object.fromEntries(L.map(l => [l, d.get('name_' + l) || d.get('name_ar')])), description: Object.fromEntries(L.map(l => [l, d.get('desc_' + l) || d.get('desc_ar') || ''])),
        cover_url: st.cover || null, gallery: st.gallery, digital_path: st.digital || null,
        questions: d.get('questions').split('\n').map(s => s.trim()).filter(Boolean).map((s, i) => { const req = s.startsWith('*'); let lab = s.replace(/^\*/, '').trim(); const long = /\[long\]$/.test(lab); lab = lab.replace(/\s*\[long\]$/, ''); return { key: 'q' + i, label: { ar: lab, fr: lab, en: lab }, type: long ? 'textarea' : 'text', required: req }; }),
        stages: d.get('stages').split('\n').map(s => s.trim()).filter(Boolean), next_products: d.getAll('np'),
        active: !!d.get('active'), featured: !!d.get('featured'), sort: +d.get('sort') || 0,
      };
      await busy(e.submitter, async () => {
        let pid = p.id;
        if (pid) { const { error } = await sb.from('products').update(row).eq('id', pid); if (error) throw error; }
        else { const { data, error } = await sb.from('products').insert(row).select('id').single(); if (error) throw error; pid = data.id; }
        const rows = $$('.vr', body).map((r, i) => { const g = k => r.querySelector(`[data-k=${k}]`); const nm = g('ar').value.trim() || 'الباقة الأساسية'; return { id: r.dataset.id || undefined, product_id: pid, name: { ar: nm, fr: nm, en: nm }, price: g('price').value ? +g('price').value : null, cost: g('cost').value ? +g('cost').value : null, active: g('active').checked, sort: i + 1 }; });
        for (const v of rows) { const { id: vid, ...rest } = v; if (vid) { const old = vs.find(x => x.id === vid); if (old?.name) rest.name = { ...old.name, ar: rest.name.ar }; const { error } = await sb.from('product_variants').update(rest).eq('id', vid); if (error) throw error; } else { const { error } = await sb.from('product_variants').insert(rest); if (error) throw error; } }
        closeModal(); toast(t('saved')); this.products();
      });
    };
  },

  /* ---------- finance ---------- */
  async finance() {
    const mk = sessionStorage.getItem('ofa_fm') || new Date().toISOString().slice(0, 7);
    const pg = this.sh('finance', t('a_finance'), '<div class="spin"></div>');
    const a = mk + '-01'; const b = new Date(+mk.slice(0, 4), +mk.slice(5, 7), 1).toISOString().slice(0, 10);
    const [p, e, pend] = await Promise.all([
      sb.from('payments').select('*, profiles!payments_client_id_fkey(full_name), orders(number,title)').eq('status', 'verified').gte('created_at', a).lt('created_at', b).order('created_at', { ascending: false }),
      sb.from('expenses').select('*').gte('spent_on', a).lt('spent_on', b).order('spent_on', { ascending: false }),
      sb.from('payments').select('*, profiles!payments_client_id_fkey(full_name), orders(id,number)').eq('status', 'pending').order('created_at'),
    ]);
    const rev = (p.data || []).reduce((s, x) => s + +x.amount, 0), exp = (e.data || []).reduce((s, x) => s + +x.amount, 0);
    pg.innerHTML = `<div class="row" style="margin-bottom:12px"><input type="month" class="in" style="width:auto" value="${mk}" onchange="sessionStorage.setItem('ofa_fm',this.value);Admin.finance()"><button class="btn sm" onclick="Admin.addExpense()">${ic('plus')} ${t('add_expense')}</button></div>
      <div class="grid g4" style="margin-bottom:14px"><div class="card kpi"><span>${t('revenue')}</span><b class="num">${money(rev)}</b></div><div class="card kpi"><span>${t('expenses')}</span><b class="num">${money(exp)}</b></div><div class="card kpi"><span>${t('profit')}</span><b class="num" style="color:${rev - exp >= 0 ? 'var(--green-ink)' : 'var(--bad)'}">${money(rev - exp)}</b></div></div>
      ${(pend.data || []).length ? `<div class="card" style="margin-bottom:14px"><h3>${t('pending_pays')}</h3>${pend.data.map(x => `<a class="li" href="#/a/order/${x.orders?.id}" style="text-decoration:none;color:inherit"><div class="grow"><b class="num">${money(x.amount)}</b> <span class="small muted">· ${esc(x.profiles?.full_name || '')} · ${x.orders?.number || ''}</span></div>${ic('arrow', 'ico flip')}</a>`).join('')}</div>` : ''}
      <div class="grid g2" style="align-items:start">
        <div class="card"><h3>${t('revenue')}</h3><table class="t"><tbody>${(p.data || []).map(x => `<tr><td class="small">${fdate(x.created_at)}</td><td class="small">${esc(x.profiles?.full_name || '')}<div class="tiny faint">${x.orders?.number || ''}</div></td><td class="num"><b>${money(x.amount)}</b></td></tr>`).join('') || '<tr><td class="faint">—</td></tr>'}</tbody></table></div>
        <div class="card"><h3>${t('expenses')}</h3><table class="t"><tbody>${(e.data || []).map(x => `<tr><td class="small">${fdate(x.spent_on)}</td><td class="small">${esc(x.category || '')}<div class="tiny faint">${esc(x.note || '')}</div></td><td class="num">${money(x.amount)}</td><td><button class="btn icon sm ghost danger" onclick="Admin.delExpense('${x.id}')">${ic('x')}</button></td></tr>`).join('') || '<tr><td class="faint">—</td></tr>'}</tbody></table></div>
      </div>`;
    if (document.dir === 'rtl') $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
  },
  addExpense() {
    const body = modal(t('add_expense'), `<form id="ef"><div class="f"><label>${t('amount')}</label><input name="amount" type="number" min="1" required></div><div class="f"><label>${t('category')}</label><input name="category" list="ecat" placeholder="ads, tools, subscriptions…"><datalist id="ecat"><option>ads</option><option>tools</option><option>subscriptions</option><option>freelancer</option><option>other</option></datalist></div><div class="f"><label>${t('notes')}</label><input name="note"></div><div class="f"><label>${t('date')}</label><input name="spent_on" type="date" value="${today()}"></div><button class="btn pri block">${t('save')}</button></form>`);
    $('#ef', body).onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await busy(e.submitter, async () => { const { error } = await sb.from('expenses').insert({ amount: +d.amount, category: d.category || null, note: d.note || null, spent_on: d.spent_on }); if (error) throw error; closeModal(); this.finance(); }); };
  },
  async delExpense(id) { if (!confirm(t('sure'))) return; await sb.from('expenses').delete().eq('id', id); this.finance(); },

  /* ---------- leads (old website form) ---------- */
  async leads() {
    const pg = this.sh('leads', t('a_leads'), '<div class="spin"></div>');
    const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(300);
    this._leads = data || [];
    pg.innerHTML = `<div class="card" style="padding:6px 14px"><div class="list">${(data || []).map(l => `<div class="li" style="cursor:default"><div class="grow"><div class="row between nowrap"><b>${esc(l.name)}</b><span class="tiny faint">${fdate(l.created_at)}</span></div><div class="small muted ltr" style="text-align:start">${esc(l.whatsapp)} · ${esc(l.service || '')}</div>${l.message ? `<div class="small">${esc(l.message)}</div>` : ''}</div>
      <a class="btn sm wa icon" target="_blank" rel="noopener" href="${waLink('السلام عليكم ' + l.name, normPhone(l.whatsapp) || '')}">${ic('wa')}</a>
      ${l.imported ? `<span class="chip g">${t('imported')}</span>` : `<button class="btn sm" onclick="Admin.leadToClient('${l.id}')">${t('to_client')}</button>`}</div>`).join('') || `<div class="empty">—</div>`}</div></div>`;
  },
  leadToClient(id) { const l = this._leads.find(x => x.id === id); this.newClient({ name: l.name, phone: l.whatsapp, business: l.business, source: 'website', leadId: l.id }); },

  /* ---------- site & settings ---------- */
  async site() {
    const pg = this.sh('site', t('a_site'), '<div class="spin"></div>');
    const [s, sc, pf] = await Promise.all([sb.from('settings').select('*'), sb.from('site_content').select('*'), sb.from('portfolio').select('*').order('sort')]);
    const set = {}; (s.data || []).forEach(r => set[r.key] = r.value);
    const cont = {}; (sc.data || []).forEach(r => cont[r.key] = r.value);
    const pi = set.payment_info || {}; const hero = cont.hero || {}; const secs = cont.sections || [];
    this._secs = secs; this._pf = pf.data || [];
    const L = ['ar', 'fr', 'en'];
    pg.innerHTML = `<div class="grid g2" style="align-items:start">
      <div class="col">
        <div class="card"><h3>${t('s_contact')}</h3><form id="sf1">
          <div class="f"><label>WhatsApp</label><input name="whatsapp" class="ltr" value="${esc(set.whatsapp || '')}"></div>
          <div class="f"><label>BaridiMob RIP</label><input name="baridimob" class="ltr" value="${esc(pi.baridimob || '')}"></div>
          <div class="f"><label>CCP</label><input name="ccp" class="ltr" value="${esc(pi.ccp || '')}"></div>
          <div class="f"><label>${t('name')}</label><input name="pname" value="${esc(pi.name || '')}"></div>
          <button class="btn pri block">${t('save')}</button></form></div>
        <div class="card"><h3>${t('s_telegram')}</h3><p class="small muted">${t('tg_help')}</p><form id="sf2">
          <div class="f"><label>Bot token</label><input name="tok" class="ltr" type="password" value="${esc(set.telegram_bot_token || '')}" autocomplete="off"></div>
          <div class="f"><label>Chat ID</label><input name="chat" class="ltr" value="${esc(set.telegram_chat_id || '')}"></div>
          <button class="btn pri block">${t('save')}</button></form></div>
        <div class="card"><h3>${t('s_backup')}</h3><button class="btn block" onclick="Admin.backup(this)">${ic('download')} ${t('backup_btn')}</button></div>
      </div>
      <div class="col">
        <div class="card"><h3>${t('s_landing')}</h3><form id="sf3">
          ${L.map(l => `<div class="f"><label>${t('hero_title')} (${l.toUpperCase()})</label><input name="t_${l}" value="${esc(hero.title?.[l] || '')}"></div><div class="f"><label>${t('hero_sub')} (${l.toUpperCase()})</label><textarea name="s_${l}" rows="2">${esc(hero.sub?.[l] || '')}</textarea></div>`).join('')}
          <button class="btn pri block">${t('save')}</button></form></div>
        <div class="card"><div class="row between"><h3 style="margin:0">${t('s_custom')}</h3><button class="btn sm" onclick="Admin.editSection()">${ic('plus')}</button></div>
          <div class="list">${secs.map((x, i) => `<div class="li" onclick="Admin.editSection(${i})"><div class="grow"><b class="small">${esc(x.title || '—')}</b><div class="tiny muted">${t(x.position || 'after_services')} ${x.active === false ? '· off' : ''}</div></div>${ic('settings')}</div>`).join('') || '<p class="small faint">—</p>'}</div></div>
        <div class="card"><div class="row between"><h3 style="margin:0">${t('s_portfolio')}</h3><button class="btn sm" onclick="Admin.addPortfolio(this)">${ic('plus')}</button></div>
          <div class="upl" style="margin-top:10px">${this._pf.map(x => `<div class="u">${x.kind === 'image' ? `<img src="${esc(x.media_url)}" alt="">` : `<span class="thumb" style="display:grid;place-items:center;width:72px;height:72px">${ic(x.kind === 'video' ? 'play' : 'globe')}</span>`}<button type="button" onclick="Admin.delPortfolio('${x.id}')">×</button></div>`).join('') || '<p class="small faint">—</p>'}</div></div>
      </div></div>`;
    const saveSet = async (key, value, pub) => { const { error } = await sb.from('settings').upsert({ key, value, is_public: pub }); if (error) throw error; };
    $('#sf1').onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await busy(e.submitter, async () => { await saveSet('whatsapp', normPhone(d.whatsapp) || d.whatsapp, true); await saveSet('payment_info', { ...pi, baridimob: d.baridimob, ccp: d.ccp, name: d.pname }, true); S.settings = await publicSettings(); toast(t('saved')); }); };
    $('#sf2').onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await busy(e.submitter, async () => { await saveSet('telegram_bot_token', d.tok.trim(), false); await saveSet('telegram_chat_id', d.chat.trim(), false); toast(t('saved')); }); };
    $('#sf3').onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await busy(e.submitter, async () => { const { error } = await sb.from('site_content').upsert({ key: 'hero', value: { title: Object.fromEntries(L.map(l => [l, d['t_' + l]])), sub: Object.fromEntries(L.map(l => [l, d['s_' + l]])) } }); if (error) throw error; toast(t('saved')); }); };
  },
  editSection(i) {
    const x = i != null ? this._secs[i] : { title: '', html: '', position: 'after_services', active: true };
    const body = modal(t('s_custom'), `<form id="secf"><div class="f"><label>${t('section_title')}</label><input name="title" value="${esc(x.title)}"></div>
      <div class="f"><label>${t('position')}</label><select name="position">${['after_hero', 'after_services', 'before_footer'].map(p => `<option value="${p}" ${p === x.position ? 'selected' : ''}>${t(p)}</option>`).join('')}</select></div>
      <div class="f"><label>${t('code')}</label><textarea name="html" rows="10" class="ltr" style="font-family:ui-monospace,monospace;font-size:13px">${esc(x.html)}</textarea></div>
      <label class="check" style="margin-bottom:12px"><input type="checkbox" name="active" ${x.active !== false ? 'checked' : ''}> ${t('active')}</label>
      <div class="row"><button class="btn pri grow">${t('save')}</button>${i != null ? `<button type="button" class="btn danger" id="secdel">${t('delete')}</button>` : ''}</div></form>`, { wide: true });
    const save = async arr => { const { error } = await sb.from('site_content').upsert({ key: 'sections', value: arr }); if (error) throw error; closeModal(); this.site(); };
    $('#secf', body).onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); const arr = [...this._secs]; const v = { title: d.title, html: d.html, position: d.position, active: !!d.active }; if (i != null) arr[i] = v; else arr.push(v); await busy(e.submitter, () => save(arr)); };
    const del = $('#secdel', body); if (del) del.onclick = () => { if (confirm(t('sure'))) { const arr = [...this._secs]; arr.splice(i, 1); save(arr); } };
  },
  addPortfolio() {
    const body = modal(t('s_portfolio'), `<form id="pff"><div class="f"><label>${t('title')}</label><input name="title"></div>
      <div class="f"><label>${t('media')}</label><select name="kind"><option value="image">Image</option><option value="video">Video (link)</option><option value="link">Link</option></select></div>
      <div class="f"><label>URL</label><input name="url" class="ltr" placeholder="https://"></div><button type="button" class="btn sm" id="pfu" style="margin-bottom:12px">${ic('image')} ${t('upload_file')}</button>
      <button class="btn pri block">${t('save')}</button></form>`);
    const f = $('#pff', body);
    $('#pfu', body).onclick = async e => { const fl = await pickFile('image/*,video/mp4'); if (fl) await busy(e.currentTarget, async () => { const path = `portfolio/${Date.now()}-${safeName(fl.name)}`; await upload('public-media', path, fl); f.url.value = publicUrl(path); f.kind.value = fl.type.startsWith('video') ? 'video' : 'image'; }); };
    f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); if (!d.url) return; await busy(e.submitter, async () => { const { error } = await sb.from('portfolio').insert({ title: { ar: d.title, fr: d.title, en: d.title }, media_url: d.url, kind: d.kind, sort: this._pf.length + 1, active: true }); if (error) throw error; closeModal(); this.site(); }); };
  },
  async delPortfolio(id) { if (!confirm(t('sure'))) return; await sb.from('portfolio').delete().eq('id', id); this.site(); },
  async backup(btn) {
    await busy(btn, async () => {
      const tabs = ['profiles', 'products', 'product_variants', 'orders', 'payments', 'order_comments', 'files', 'notes', 'tasks', 'expenses', 'site_content', 'portfolio', 'settings', 'leads', 'invoices', 'referrals', 'wallet_transactions'];
      const out = { exported_at: new Date().toISOString() };
      for (const tb of tabs) { const { data } = await sb.from(tb).select('*').limit(10000); out[tb] = (data || []).map(r => tb === 'settings' && /token/.test(r.key) ? { ...r, value: '***' } : r); }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' })); a.download = `oneforall-backup-${today()}.json`; a.click();
    });
  },
};
window.Admin = Admin;
