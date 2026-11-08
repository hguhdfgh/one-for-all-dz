/* ops.js — admin calendar / work hours / effort / Telegram settings. Patches window.Admin once it loads. */
(function () {
  const KINDS = { client: ['شغل زبون', '#0FAA60'], internal: ['شغل داخلي', '#2B7BD9'], focus: ['تركيز عميق', '#7B4FD9'], personal: ['شخصي', '#D98A2B'], appointment: ['موعد', '#D94F6B'], prayer: ['صلاة/راحة', '#6B7B72'] };
  const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const tz = '+01:00'; // Africa/Algiers, no DST
  const pad = n => String(n).padStart(2, '0');
  const dstr = d => d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  const algNow = () => new Date(Date.now() + 36e5);
  const hm = iso => { const d = new Date(new Date(iso).getTime() + 36e5); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); };
  const dayOf = iso => dstr(new Date(new Date(iso).getTime() + 36e5));
  const mondayless = off => { const n = algNow(); const d = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() - n.getUTCDay() + off * 7)); return d; }; // Sunday-start week
  const addDays = (d, k) => new Date(d.getTime() + k * 864e5);
  const toIso = (day, time) => new Date(day + 'T' + time + ':00' + tz).toISOString();

  function patch() {
    const A = window.Admin; if (!A || A._ops) return !!(A && A._ops); A._ops = true;
    const nav0 = A.nav.bind(A), route0 = A.route.bind(A);
    A.nav = function () { const n = nav0(); const i = n.findIndex(x => x.k === 'orders'); n.splice(i + 1, 0, { k: 'cal', h: '#/a/cal', i: 'clock', l: 'الجدول' }); const j = n.findIndex(x => x.k === 'finance'); n.splice(j + 1, 0, { k: 'stats', h: '#/a/stats', i: 'chart', l: 'التحليلات' }); return n; };
    A.route = function (b, c) { if (b === 'cal') return A.cal(c); if (b === 'stats') return A.stats(c); return route0(b, c); };

    A.cal = async function () {
      const off = +(sessionStorage.getItem('ofa_cw') || 0);
      const start = mondayless(off), end = addDays(start, 7);
      const pg = A.sh('cal', 'الجدول', '<div class="spin"></div>');
      const [bl, wh, pr, st, ord] = await Promise.all([
        sb.from('calendar_blocks').select('*, orders(number,title)').gte('starts_at', toIso(dstr(start), '00:00')).lt('starts_at', toIso(dstr(end), '00:00')).order('starts_at'),
        sb.from('work_hours').select('*').order('dow'),
        sb.from('products').select('id,name').eq('type', 'service').order('sort'),
        sb.from('settings').select('key,value').in('key', ['telegram_bot_token', 'telegram_chat_id']),
        sb.from('orders').select('id,number,title').in('status', ['paid', 'in_progress', 'in_review']),
      ]);
      const eff = await sb.from('package_effort').select('*');
      A._cal = { orders: ord.data || [], blocks: bl.data || [] };
      const effMap = Object.fromEntries((eff.data || []).map(x => [x.product_id, x.hours]));
      const S0 = Object.fromEntries((st.data || []).map(x => [x.key, x.value]));
      const hasTok = !!(S0.telegram_bot_token && String(S0.telegram_bot_token).replace(/"/g, '')), chat = String(S0.telegram_chat_id ?? '').replace(/"/g, '');
      const todayS = dstr(algNow());
      const cols = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i), ds = dstr(d), items = (bl.data || []).filter(b => dayOf(b.starts_at) === ds);
        return `<div class="card" style="padding:12px;${ds === todayS ? 'outline:2px solid var(--green)' : ''}"><div class="row between" style="margin-bottom:8px"><b>${DAYS[d.getUTCDay()]}</b><span class="tiny faint">${ds.slice(5)}</span></div>${items.map(b => {
          const k = KINDS[b.kind] || KINDS.internal;
          return `<div class="li" style="padding:8px 4px;cursor:default;flex-wrap:wrap;opacity:${b.status === 'done' ? .55 : 1}"><span style="width:4px;align-self:stretch;border-radius:4px;background:${k[1]}"></span><div class="grow" style="min-width:140px"><b class="small" style="${b.status === 'done' ? 'text-decoration:line-through' : ''}">${esc(b.title)}</b><div class="tiny muted">${hm(b.starts_at)}–${hm(b.ends_at)} · ${k[0]}${b.orders ? ' · ' + esc(b.orders.number || '') : ''}${b.status === 'postponed' ? ' · مؤجل' : ''}</div></div><div class="row" style="gap:4px"><button class="btn icon sm ghost" title="تم" onclick="Admin.calDone('${b.id}')">${ic('check')}</button><button class="btn icon sm ghost" title="غدا" onclick="Admin.calPostpone('${b.id}')">${ic('arrow', 'ico flip')}</button><button class="btn icon sm ghost danger" onclick="Admin.calDel('${b.id}')">${ic('x')}</button></div></div>`;
        }).join('') || '<p class="tiny faint" style="margin:0">—</p>'}</div>`;
      }).join('');
      const who = (wh.data || []).map(w => `<tr><td>${DAYS[w.dow]}</td><td><input type="checkbox" data-f="enabled" data-d="${w.dow}" ${w.enabled ? 'checked' : ''}></td><td><input class="in" style="min-height:40px;min-width:118px" type="time" data-f="start_time" data-d="${w.dow}" value="${w.start_time.slice(0, 5)}"></td><td><input class="in" style="min-height:40px;min-width:118px" type="time" data-f="end_time" data-d="${w.dow}" value="${w.end_time.slice(0, 5)}"></td><td><input class="in" style="min-height:40px;width:72px" type="number" step="0.5" min="0" max="24" data-f="client_hours" data-d="${w.dow}" value="${w.client_hours}"></td></tr>`).join('');
      const prods = (pr.data || []).map(p => `<div class="row" style="margin-bottom:8px"><span class="grow small">${esc((p.name || {}).ar || (p.name || {}).fr || '')}</span><input class="in" style="width:90px;min-height:40px" type="number" min="0.5" step="0.5" placeholder="auto" data-pe="${p.id}" value="${effMap[p.id] ?? ''}"></div>`).join('');
      pg.innerHTML = `<div class="row" style="margin-bottom:12px"><button class="btn icon" onclick="Admin.calWeek(-1)">${ic('arrow')}</button><b class="grow" style="text-align:center">${dstr(start)} → ${dstr(addDays(start, 6))}</b><button class="btn icon" onclick="Admin.calWeek(1)">${ic('arrow', 'ico flip')}</button><button class="btn sm" onclick="Admin.calWeek(0)">اليوم</button><button class="btn pri sm" onclick="Admin.calAdd()">${ic('plus')} بلوك</button></div>
        <div class="grid" style="margin-bottom:16px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">${cols}</div>
        <div class="grid g2" style="align-items:start">
          <div class="card"><h3>ساعات العمل للزبائن (أسبوعيا)</h3><p class="small muted">"ساعات الزبائن" هي الصافية بعد الراحة والصلاة. تُستعمل لحساب المدة التقريبية.</p><div style="overflow-x:auto"><table class="t"><thead><tr><th></th><th>مفعل</th><th>من</th><th>إلى</th><th>ساعات</th></tr></thead><tbody>${who}</tbody></table></div><button class="btn pri block" style="margin-top:12px" onclick="Admin.calSaveHours(this)">${t('save')}</button></div>
          <div class="col" style="gap:16px">
            <div class="card"><h3>جهد الباقة (ساعات)</h3><p class="small muted">فارغ = تقدير تلقائي من مدة التسليم.</p>${prods || '—'}<button class="btn pri block" onclick="Admin.calSaveEffort(this)">${t('save')}</button></div>
            <div class="card"><h3>تنبيهات تيليغرام</h3><p class="small muted">للإشعارات فقط: تذكير قبل كل بلوك بـ10 دقائق، ملخص 08:00 ومراجعة 20:00. التوكن ${hasTok ? 'محفوظ ✓' : 'غير مضاف'}.</p>
              <form id="tgf"><div class="f"><label>Bot token</label><input class="in" name="tok" type="password" autocomplete="off" placeholder="${hasTok ? '•••••• (اتركه فارغا للإبقاء)' : 'من BotFather'}"></div><div class="f"><label>Chat ID</label><input class="in" name="chat" inputmode="numeric" value="${esc(chat)}"></div><div class="row"><button class="btn pri grow">${t('save')}</button><button type="button" class="btn grow" onclick="Admin.calTest(this)">اختبار</button></div></form></div>
          </div>
        </div>`;
      document.dir === 'rtl' && $$('.flip').forEach(s => s.style.transform = 'scaleX(-1)');
      $('#tgf').onsubmit = async e => {
        e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
        await busy(e.submitter, async () => {
          if (d.tok.trim()) { const r = await sb.from('settings').upsert({ key: 'telegram_bot_token', value: d.tok.trim(), is_public: false }); if (r.error) throw r.error; }
          if (d.chat.trim()) { const r = await sb.from('settings').upsert({ key: 'telegram_chat_id', value: d.chat.trim(), is_public: false }); if (r.error) throw r.error; }
          toast(t('saved')); A.cal();
        });
      };
    };
    A.calWeek = d => { sessionStorage.setItem('ofa_cw', d === 0 ? 0 : (+(sessionStorage.getItem('ofa_cw') || 0) + d)); A.cal(); };
    A.calAdd = function () {
      const opts = A._cal.orders.map(o => `<option value="${o.id}">${esc(o.number || '')} ${esc(o.title || '')}</option>`).join('');
      const body = modal('بلوك جديد', `<form id="bf"><div class="f"><label>العنوان</label><input class="in" name="title" required maxlength="200"></div><div class="f"><label>النوع</label><select class="in" name="kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></div><div class="f"><label>اليوم</label><input class="in" type="date" name="day" value="${dstr(algNow())}" required></div><div class="row"><div class="f grow"><label>من</label><input class="in" type="time" name="from" value="09:00" required></div><div class="f grow"><label>إلى</label><input class="in" type="time" name="to" value="11:00" required></div></div><div class="f"><label>الطلب (اختياري)</label><select class="in" name="order_id"><option value="">—</option>${opts}</select></div><label class="row" style="margin-bottom:12px"><input type="checkbox" name="remind" checked> تذكير تيليغرام</label><button class="btn pri block">${t('save')}</button></form>`);
      $('#bf', body).onsubmit = async e => {
        e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
        if (d.to <= d.from) return toast('وقت النهاية لازم يكون بعد البداية', true);
        await busy(e.submitter, async () => {
          const { error } = await sb.from('calendar_blocks').insert({ title: d.title.trim(), kind: d.kind, starts_at: toIso(d.day, d.from), ends_at: toIso(d.day, d.to), order_id: d.order_id || null, remind: !!d.remind });
          if (error) throw error; closeModal(); A.cal();
        });
      };
    };
    A.calDone = async id => { const { error } = await sb.from('calendar_blocks').update({ status: 'done' }).eq('id', id); if (error) return toast(errMsg(error), true); A.cal(); };
    A.calPostpone = async id => {
      const b = (A._cal.blocks || []).find(x => x.id === id); if (!b) return;
      const { error } = await sb.from('calendar_blocks').update({ starts_at: new Date(new Date(b.starts_at).getTime() + 864e5).toISOString(), ends_at: new Date(new Date(b.ends_at).getTime() + 864e5).toISOString(), status: 'postponed' }).eq('id', id);
      if (error) return toast(errMsg(error), true); toast('تم التأجيل ليوم غد'); A.cal();
    };
    A.calDel = async id => { if (!confirm(t('sure'))) return; const { error } = await sb.from('calendar_blocks').delete().eq('id', id); if (error) return toast(errMsg(error), true); A.cal(); };
    A.calSaveHours = async btn => {
      await busy(btn, async () => {
        const rows = [...Array(7).keys()].map(d => { const g = f => $(`[data-f="${f}"][data-d="${d}"]`); return { dow: d, enabled: g('enabled').checked, start_time: g('start_time').value, end_time: g('end_time').value, client_hours: +g('client_hours').value || 0 }; });
        const { error } = await sb.from('work_hours').upsert(rows); if (error) throw error; toast(t('saved'));
      });
    };
    A.calSaveEffort = async btn => {
      await busy(btn, async () => {
        const ins = [], del = [];
        $$('[data-pe]').forEach(i => { const v = parseFloat(i.value); if (v > 0) ins.push({ product_id: i.dataset.pe, hours: v }); else del.push(i.dataset.pe); });
        if (ins.length) { const { error } = await sb.from('package_effort').upsert(ins); if (error) throw error; }
        if (del.length) { const { error } = await sb.from('package_effort').delete().in('product_id', del); if (error) throw error; }
        toast(t('saved'));
      });
    };
    A.calTest = async btn => { await busy(btn, async () => { const { error } = await sb.rpc('ops_test_telegram'); if (error) throw error; toast('أُرسل اختبار — راجع تيليغرام'); }); };
    /* mobile bottom bar holds 5: keep 4 + "more" so no admin page becomes unreachable */
    const shell0 = window.shell;
    window.shell = function (active, title, body, o = {}) {
      const r = shell0(active, title, body, o); const nav = o.nav || [];
      const bn = $('.bnav'); if (bn && nav.length > 5) {
        const rest = nav.slice(4); A._more = rest;
        bn.innerHTML = nav.slice(0, 4).map(n => `<button class="${n.k === active ? 'on' : ''}" onclick="go('${n.h}')">${ic(n.i)}<span>${n.l}</span>${n.c ? `<span class="cnt">${n.c}</span>` : ''}</button>`).join('') + `<button class="${rest.some(n => n.k === active) ? 'on' : ''}" onclick="Admin.calMore()">${ic('menu')}<span>المزيد</span></button>`;
      }
      return r;
    };
    A.calMore = () => { const b = modal('المزيد', `<div class="list">${(A._more || []).map(n => `<a class="li" href="${n.h}" style="text-decoration:none;color:inherit" onclick="closeModal()">${ic(n.i)}<div class="grow">${n.l}</div></a>`).join('')}</div>`); };
    /* ---- analytics + computed client segments (no schema changes; all derived) ---- */
    const SEG = { vip: ['VIP', 'g'], regular: ['عادي', 'i'], new: ['جديد', ''], dormant: ['خامل', 'w'] };
    A.stats = async function () {
      const pg = A.sh('stats', 'التحليلات', '<div class="spin"></div>');
      const wk0 = mondayless(0), wk1 = addDays(wk0, 7);
      const [o, p, e, c, pr, bl, wh] = await Promise.all([
        sb.from('orders').select('id,client_id,product_id,total,status,created_at'),
        sb.from('payments').select('amount,client_id,order_id,created_at').eq('status', 'verified'),
        sb.from('expenses').select('amount,spent_on'),
        sb.from('profiles').select('id,full_name,business,created_at').eq('role', 'client'),
        sb.from('products').select('id,name'),
        sb.from('calendar_blocks').select('kind,starts_at,ends_at,status').gte('starts_at', toIso(dstr(wk0), '00:00')).lt('starts_at', toIso(dstr(wk1), '00:00')),
        sb.from('work_hours').select('*'),
      ]);
      const O = o.data || [], P = p.data || [], E = e.data || [], C = c.data || [];
      const pname = Object.fromEntries((pr.data || []).map(x => [x.id, (x.name || {}).ar || (x.name || {}).fr || '']));
      const mk = d => String(d).slice(0, 7);
      const months = [...Array(6).keys()].map(i => { const d = new Date(Date.UTC(algNow().getUTCFullYear(), algNow().getUTCMonth() - (5 - i), 1)); return dstr(d).slice(0, 7); });
      const rev = Object.fromEntries(months.map(m => [m, 0])), exp = { ...rev };
      P.forEach(x => { const m = mk(x.created_at); if (m in rev) rev[m] += +x.amount; });
      E.forEach(x => { const m = mk(x.spent_on); if (m in exp) exp[m] += +x.amount; });
      const cur = months[5], prev = months[4], max = Math.max(1, ...months.map(m => rev[m]));
      const delta = rev[prev] ? Math.round(100 * (rev[cur] - rev[prev]) / rev[prev]) : null;
      const done = O.filter(x => ['completed', 'delivered'].includes(x.status)), act = O.filter(x => ['paid', 'in_progress', 'in_review'].includes(x.status));
      const aov = done.length ? done.reduce((s, x) => s + (+x.total || 0), 0) / done.length : 0;
      const spend = {}, ordN = {}, last = {};
      P.forEach(x => { spend[x.client_id] = (spend[x.client_id] || 0) + +x.amount; });
      O.forEach(x => { ordN[x.client_id] = (ordN[x.client_id] || 0) + 1; if (!last[x.client_id] || x.created_at > last[x.client_id]) last[x.client_id] = x.created_at; });
      const seg = c => { const s = spend[c.id] || 0, n = ordN[c.id] || 0, idle = last[c.id] ? (Date.now() - new Date(last[c.id])) / 864e5 : 9999;
        if (s >= 100000 || n >= 4) return 'vip'; if (n >= 1 && idle > 60) return 'dormant'; if (n >= 1) return 'regular'; return 'new'; };
      const counts = { vip: 0, regular: 0, new: 0, dormant: 0 }; C.forEach(c => counts[seg(c)]++);
      const top = [...C].sort((a, b) => (spend[b.id] || 0) - (spend[a.id] || 0)).slice(0, 8);
      const prodRev = {}; O.filter(x => !['cancelled', 'refunded', 'quote_requested'].includes(x.status)).forEach(x => { const k = x.product_id || '—'; prodRev[k] = prodRev[k] || { n: 0, t: 0 }; prodRev[k].n++; prodRev[k].t += +x.total || 0; });
      const topP = Object.entries(prodRev).sort((a, b) => b[1].t - a[1].t).slice(0, 5);
      const hrs = (bl.data || []).filter(b => b.status !== 'postponed').reduce((s, b) => { s.all += (new Date(b.ends_at) - new Date(b.starts_at)) / 36e5; if (b.kind === 'client') s.client += (new Date(b.ends_at) - new Date(b.starts_at)) / 36e5; return s; }, { all: 0, client: 0 });
      const cap = (wh.data || []).filter(w => w.enabled).reduce((s, w) => s + +w.client_hours, 0);
      const repeat = C.filter(c => (ordN[c.id] || 0) >= 2).length, buyers = C.filter(c => (ordN[c.id] || 0) >= 1).length;
      const kpi = (l, v, sub) => `<div class="card kpi"><span>${l}</span><b class="num">${v}</b>${sub ? `<div class="tiny faint">${sub}</div>` : ''}</div>`;
      pg.innerHTML = `<div class="grid g4" style="margin-bottom:14px">
          ${kpi('مداخيل هذا الشهر', money(rev[cur]), delta == null ? '' : (delta >= 0 ? '▲ ' : '▼ ') + Math.abs(delta) + '% عن الشهر الماضي')}
          ${kpi('الربح هذا الشهر', money(rev[cur] - exp[cur]))}
          ${kpi('طلبات نشطة', act.length, 'مكتملة: ' + done.length)}
          ${kpi('متوسط قيمة الطلب', money(Math.round(aov)))}
          ${kpi('زبائن يعاودون الشراء', buyers ? Math.round(100 * repeat / buyers) + '%' : '—', repeat + ' من ' + buyers)}
          ${kpi('ساعات هذا الأسبوع', Math.round(hrs.all * 10) / 10 + ' س', 'للزبائن: ' + Math.round(hrs.client * 10) / 10 + ' / ' + cap + ' س سعة')}
        </div>
        <div class="grid g2" style="align-items:start">
          <div class="card"><h3>المداخيل آخر 6 أشهر</h3><div style="display:flex;align-items:flex-end;gap:10px;height:150px;margin-top:10px">${months.map(m => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><span class="tiny faint num">${rev[m] ? Math.round(rev[m] / 1000) + 'k' : ''}</span><div style="width:100%;height:${Math.max(3, 100 * rev[m] / max * 1.1)}px;background:var(--green);border-radius:6px 6px 2px 2px;opacity:${m === cur ? 1 : .55}"></div><span class="tiny muted" style="margin-top:4px">${m.slice(5)}</span></div>`).join('')}</div></div>
          <div class="card"><h3>تصنيف الزبائن</h3><p class="small muted">VIP: إنفاق 100,000 دج أو 4 طلبات فأكثر. خامل: بدون طلب منذ 60 يوم. محسوب تلقائيا.</p><div class="row" style="flex-wrap:wrap;gap:8px">${Object.entries(SEG).map(([k, v]) => `<span class="chip ${v[1]}">${v[0]} <b>${counts[k]}</b></span>`).join('')}</div></div>
          <div class="card"><h3>أفضل الخدمات</h3>${topP.map(([id, x]) => `<div class="row between small" style="padding:6px 0"><span>${esc(pname[id] || '—')} <span class="faint">· ${x.n}</span></span><b class="num">${money(x.t)}</b></div>`).join('') || '<p class="faint small">—</p>'}</div>
          <div class="card"><h3>أفضل الزبائن</h3><div class="list">${top.map(c => { const sg = SEG[seg(c)]; return `<a class="li" href="#/a/client/${c.id}" style="text-decoration:none;color:inherit"><div class="grow"><b class="small">${esc(c.full_name)}</b><div class="tiny muted">${ordN[c.id] || 0} طلب</div></div><span class="chip ${sg[1]}">${sg[0]}</span><b class="num small">${money(spend[c.id] || 0)}</b></a>`; }).join('') || '<p class="faint small">—</p>'}</div></div>
        </div>`;
    };
    return true;
  }
  const iv = setInterval(() => { if (patch()) clearInterval(iv); }, 300);
  setTimeout(() => clearInterval(iv), 60000);
})();

/* ---- client: estimated delivery + deposit comparison inside the product modal ---- */
(function () {
  if (typeof window.openProduct !== 'function') return;
  const L = { ar: { h: 'المدة التقريبية للتسليم', pos: 'ترتيبك في الطابور', d0: 'بدون عربون', d25: 'عربون 25%', d50: 'عربون 50%', d100: 'دفع كامل', tip: 'كلما دفعت عربون أكبر، تقدم في الطابور وتسلّم أبكر. تقدير فقط.', to: 'إلى', up: 'قبل' },
    fr: { h: 'Délai estimé', pos: 'Votre rang', d0: 'Sans acompte', d25: 'Acompte 25%', d50: 'Acompte 50%', d100: 'Paiement total', tip: 'Plus l’acompte est élevé, plus vous passez devant. Estimation.', to: 'à', up: 'avant' },
    en: { h: 'Estimated delivery', pos: 'Your queue position', d0: 'No deposit', d25: '25% deposit', d50: '50% deposit', d100: 'Full payment', tip: 'A higher deposit moves you ahead. Estimate only.', to: 'to', up: 'by' } };
  const open0 = window.openProduct;
  window.openProduct = function (id) {
    open0(id);
    const p = (S.products || []).find(x => x.id === id);
    if (!p || p.type === 'digital') return;
    const row = $('#otot') && $('#otot').closest('.row'); if (!row) return;
    const lg = L[LANG] || L.ar, box = document.createElement('div');
    box.className = 'card flat'; box.style.cssText = 'padding:12px 16px;margin:8px 0';
    box.innerHTML = `<div class="row small" style="gap:8px">${ic('clock')}<b>${lg.h}</b></div><div class="spin" style="margin:8px auto;width:18px;height:18px;border-width:2px"></div>`;
    row.before(box);
    Promise.all([0, 25, 50, 100].map(pct => sb.rpc('queue_estimate', { p_product: id, p_paid_pct: pct }).then(r => r.data))).then(r => {
      if (!r[0] || !r[0].end) return box.remove();
      const f = x => fdate(x);
      const line = (lbl, e, best) => `<div class="row between small" style="padding:6px 0;${best ? 'font-weight:700;color:var(--green-ink)' : ''}"><span>${lbl}</span><span>${f(e.start)} ${lg.to} ${f(e.end_safe)}</span></div>`;
      box.innerHTML = `<div class="row small" style="gap:8px">${ic('clock')}<b>${lg.h}</b></div><div class="small muted" style="margin:4px 0 6px">${lg.pos}: #${r[0].position}</div>${line(lg.d0, r[0])}${line(lg.d25, r[1])}${line(lg.d50, r[2])}${line(lg.d100, r[3], true)}<p class="tiny faint" style="margin:6px 0 0">${lg.tip}</p>`;
    }).catch(() => box.remove());
  };
})();
