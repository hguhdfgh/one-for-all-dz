/* life.js — admin "حياتي": deep-focus sessions, habits, monthly goals, personal expenses. Chains onto Admin after ops.js. */
(function () {
  const TPL = [['ساعتان + 15 د راحة', 120, 15], ['90 د + 15 د راحة', 90, 15], ['50 د + 10 د راحة', 50, 10], ['25 د + 5 د راحة', 25, 5]];
  const pad = n => String(n).padStart(2, '0');
  const fmt = s => pad(Math.floor(s / 60)) + ':' + pad(s % 60);
  const dstr = d => d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  const algToday = () => dstr(new Date(Date.now() + 36e5));
  let F = null, tick = null; // running focus session
  try { F = JSON.parse(localStorage.getItem('ofa_focus') || 'null'); } catch (e) { }

  function bar() {
    let b = document.getElementById('focusbar');
    if (!F) { if (b) b.remove(); clearInterval(tick); tick = null; return; }
    if (!b) { b = document.createElement('div'); b.id = 'focusbar'; b.style.cssText = 'position:fixed;inset-inline:12px;bottom:84px;z-index:60;background:#2a1d4d;color:#fff;border-radius:16px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 10px 30px rgba(0,0,0,.3)'; document.body.append(b); }
    const left = Math.max(0, Math.round((F.end - Date.now()) / 1000));
    b.innerHTML = `<span class="grow" style="font-weight:600">${esc(F.title)}</span><b class="num" style="font-size:20px;direction:ltr">${fmt(left)}</b><button class="btn sm" onclick="Admin.focusStop(false)">إنهاء</button>`;
    if (left <= 0) { Admin.focusStop(true); }
  }
  if (F) { tick = setInterval(bar, 1000); setTimeout(bar, 200); }

  function patch() {
    const A = window.Admin; if (!A || !A._ops) return false; if (A._life) return true; A._life = true;
    const nav0 = A.nav.bind(A), route0 = A.route.bind(A);
    A.nav = function () { const n = nav0(); const i = n.findIndex(x => x.k === 'stats'); n.splice(i < 0 ? n.length - 1 : i + 1, 0, { k: 'life', h: '#/a/life', i: 'sun', l: 'حياتي' }); return n; };
    A.route = function (b, c) { if (b === 'life') return A.life(c); return route0(b, c); };

    A.life = async function () {
      const pg = A.sh('life', 'حياتي', '<div class="spin"></div>');
      const m0 = algToday().slice(0, 7) + '-01', today = algToday();
      const [h, hl, g, ex, tl] = await Promise.all([
        sb.from('habits').select('*').eq('active', true).order('created_at'),
        sb.from('habit_logs').select('habit_id,day').gte('day', dstr(new Date(Date.now() - 30 * 864e5))),
        sb.from('goals').select('*').eq('month', m0).order('created_at'),
        sb.from('personal_expenses').select('*').gte('spent_on', m0).order('spent_on', { ascending: false }),
        sb.from('time_logs').select('minutes,logged_on').gte('logged_on', dstr(new Date(Date.now() - 7 * 864e5))),
      ]);
      const H = h.data || [], L = hl.data || [], G = g.data || [], X = ex.data || [];
      const done = new Set(L.filter(x => x.day === today).map(x => x.habit_id));
      const streak = id => { let n = 0; const s = new Set(L.filter(x => x.habit_id === id).map(x => x.day)); for (let i = 0; i < 30; i++) { const d = dstr(new Date(Date.now() + 36e5 - i * 864e5)); if (s.has(d)) n++; else if (i > 0) break; } return n; };
      const total = X.reduce((s, x) => s + +x.amount, 0), mins = (tl.data || []).reduce((s, x) => s + x.minutes, 0);
      pg.innerHTML = `<div class="grid g2" style="align-items:start">
        <div class="card"><h3>نافذة التركيز العميق</h3><p class="small muted">اختر القالب في كل مرة. هذا الأسبوع: <b>${Math.round(mins / 6) / 10} ساعة</b> تركيز مسجلة.</p>
          ${F ? `<p class="small">جلسة جارية: <b>${esc(F.title)}</b></p>` : `<form id="ff"><div class="f"><label>العنوان</label><input class="in" name="title" placeholder="مثال: تصميم إعلان" required></div>${TPL.map((t, i) => `<label class="card flat check" style="padding:10px 12px;margin-bottom:6px"><input type="radio" name="tpl" value="${i}" ${i === 0 ? 'checked' : ''}> <span class="grow">${t[0]}</span></label>`).join('')}<button class="btn pri block" style="margin-top:8px">ابدأ التركيز</button></form>`}</div>
        <div class="card"><h3>العادات</h3>${H.map(x => `<div class="li" style="cursor:default"><button class="btn icon sm ${done.has(x.id) ? 'pri' : ''}" onclick="Admin.habitToggle('${x.id}',${done.has(x.id)})">${ic('check')}</button><div class="grow"><b class="small">${esc(x.name)}</b><div class="tiny muted">سلسلة: ${streak(x.id)} يوم</div></div><button class="btn icon sm ghost danger" onclick="Admin.habitDel('${x.id}')">${ic('x')}</button></div>`).join('') || '<p class="small faint">—</p>'}
          <form id="hf" class="row" style="margin-top:10px"><input class="in grow" name="name" placeholder="عادة جديدة" required maxlength="100"><button class="btn pri">${ic('plus')}</button></form></div>
        <div class="card"><h3>أهداف الشهر</h3>${G.map(x => `<div style="padding:8px 0"><div class="row between small"><b>${esc(x.title)}</b><span class="num">${x.progress}%</span></div><input type="range" min="0" max="100" step="5" value="${x.progress}" style="width:100%" onchange="Admin.goalSet('${x.id}',this.value)"><button class="btn sm ghost danger" onclick="Admin.goalDel('${x.id}')">${ic('x')}</button></div>`).join('') || '<p class="small faint">—</p>'}
          <form id="gf" class="row" style="margin-top:10px"><input class="in grow" name="title" placeholder="هدف جديد لهذا الشهر" required maxlength="200"><button class="btn pri">${ic('plus')}</button></form></div>
        <div class="card"><h3>مصاريف شخصية</h3><div class="kpi" style="padding:0 0 10px"><span>مجموع هذا الشهر</span><b class="num">${money(total)}</b></div>
          <form id="pf" class="row" style="flex-wrap:wrap;gap:8px"><input class="in" style="width:110px" name="amount" type="number" min="1" placeholder="المبلغ" required><input class="in grow" name="category" placeholder="الفئة (أكل، مواصلات…)"><button class="btn pri">${ic('plus')}</button></form>
          <div class="list" style="margin-top:8px">${X.slice(0, 8).map(x => `<div class="li" style="cursor:default"><div class="grow small">${esc(x.category || '—')} <span class="tiny faint">${x.spent_on.slice(5)}</span></div><b class="num small">${money(x.amount)}</b><button class="btn icon sm ghost danger" onclick="Admin.pexDel('${x.id}')">${ic('x')}</button></div>`).join('')}</div></div>
      </div>`;
      const ff = $('#ff'); if (ff) ff.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(ff)); await A.focusStart(d.title.trim(), TPL[+d.tpl]); };
      $('#hf').onsubmit = async e => { e.preventDefault(); const n = new FormData(e.target).get('name').trim(); await busy(e.submitter, async () => { const { error } = await sb.from('habits').insert({ name: n }); if (error) throw error; A.life(); }); };
      $('#gf').onsubmit = async e => { e.preventDefault(); const n = new FormData(e.target).get('title').trim(); await busy(e.submitter, async () => { const { error } = await sb.from('goals').insert({ title: n, month: m0 }); if (error) throw error; A.life(); }); };
      $('#pf').onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); await busy(e.submitter, async () => { const { error } = await sb.from('personal_expenses').insert({ amount: +d.amount, category: d.category || 'other' }); if (error) throw error; A.life(); }); };
    };
    A.habitToggle = async (id, on) => { const q = on ? sb.from('habit_logs').delete().eq('habit_id', id).eq('day', algToday()) : sb.from('habit_logs').upsert({ habit_id: id, day: algToday() }, { onConflict: 'habit_id,day' }); const { error } = await q; if (error) return toast(errMsg(error), true); A.life(); };
    A.habitDel = async id => { if (!confirm(t('sure'))) return; const { error } = await sb.from('habits').update({ active: false }).eq('id', id); if (error) return toast(errMsg(error), true); A.life(); };
    A.goalSet = async (id, v) => { const { error } = await sb.from('goals').update({ progress: +v }).eq('id', id); if (error) return toast(errMsg(error), true); A.life(); };
    A.goalDel = async id => { if (!confirm(t('sure'))) return; const { error } = await sb.from('goals').delete().eq('id', id); if (error) return toast(errMsg(error), true); A.life(); };
    A.pexDel = async id => { if (!confirm(t('sure'))) return; const { error } = await sb.from('personal_expenses').delete().eq('id', id); if (error) return toast(errMsg(error), true); A.life(); };

    A.focusStart = async (title, tpl) => {
      const start = new Date(), end = new Date(start.getTime() + tpl[1] * 60000);
      const { data, error } = await sb.from('calendar_blocks').insert({ title: '🎯 ' + title, kind: 'focus', starts_at: start.toISOString(), ends_at: end.toISOString(), remind: false }).select('id').single();
      if (error) return toast(errMsg(error), true);
      F = { id: data.id, title, start: start.getTime(), end: end.getTime(), brk: tpl[2] };
      try { localStorage.setItem('ofa_focus', JSON.stringify(F)); } catch (e) { }
      clearInterval(tick); tick = setInterval(bar, 1000); bar(); toast('بدأ التركيز. أقفل الإشعارات.'); A.life();
    };
    A.focusStop = async finished => {
      if (!F) return; const f = F; F = null; try { localStorage.removeItem('ofa_focus'); } catch (e) { } bar();
      const mins = Math.max(1, Math.round((Math.min(Date.now(), f.end) - f.start) / 60000));
      await sb.from('time_logs').insert({ block_id: f.id, minutes: mins, note: f.title, logged_on: algToday() });
      await sb.from('calendar_blocks').update({ status: 'done', ends_at: new Date(Math.min(Date.now(), f.end)).toISOString() }).eq('id', f.id);
      toast(finished ? `انتهت الجلسة (${mins} د). خذ راحة ${f.brk} د.` : `سُجّلت ${mins} د تركيز.`);
      if (location.hash === '#/a/life') A.life();
    };
    return true;
  }
  const iv = setInterval(() => { if (patch()) clearInterval(iv); }, 300);
  setTimeout(() => clearInterval(iv), 60000);
})();
