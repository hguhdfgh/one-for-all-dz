/* reviews-admin.js — admin: manage client reviews inside the التحليلات page (add a real quote, approve/hide, delete). */
(function () {
  function patch() {
    const A = window.Admin; if (!A || !A._ops) return false; if (A._rev) return true; A._rev = true;
    const stats0 = A.stats.bind(A);
    async function card() {
      const pg = document.getElementById('page'); if (!pg || location.hash !== '#/a/stats') return;
      let box = document.getElementById('revbox'); if (!box) { box = document.createElement('div'); box.id = 'revbox'; box.className = 'card'; box.style.marginTop = '14px'; pg.append(box); }
      const { data, error } = await sb.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) { box.innerHTML = `<h3>آراء الزبائن</h3><p class="small muted">${esc(errMsg(error))}</p>`; return; }
      const R = data || [];
      box.innerHTML = `<h3>آراء الزبائن</h3><p class="small muted">تظهر في الصفحة الرئيسية فقط بعد الموافقة. أضف آراء حقيقية من زبائن فعليين.</p>
        ${R.map(r => `<div class="li" style="cursor:default;align-items:flex-start;gap:8px"><div class="grow"><b class="small">${esc(r.author)}</b> <span class="tiny muted">${r.role ? esc(r.role) + ' · ' : ''}${'★'.repeat(r.rating)}</span><div class="small">${esc(r.body)}</div></div><button class="btn sm ${r.approved ? 'pri' : ''}" onclick="Admin.revToggle('${r.id}',${!r.approved})">${r.approved ? 'منشور' : 'نشر'}</button><button class="btn icon sm ghost danger" onclick="Admin.revDel('${r.id}')">${ic('x')}</button></div>`).join('') || '<p class="small faint">لا توجد آراء بعد.</p>'}
        <form id="revf" style="margin-top:12px;display:grid;gap:8px"><div class="row" style="gap:8px;flex-wrap:wrap"><input class="in grow" name="author" placeholder="اسم الزبون" required maxlength="80"><input class="in grow" name="role" placeholder="النشاط (اختياري)" maxlength="120"><select class="in" name="rating" style="width:90px">${[5, 4, 3].map(n => `<option value="${n}">${'★'.repeat(n)}</option>`).join('')}</select></div><textarea class="in" name="body" placeholder="نص الرأي كما قاله الزبون" required maxlength="600" rows="3"></textarea><label class="small row" style="gap:6px"><input type="checkbox" name="approved"> انشره مباشرة</label><button class="btn pri">${ic('plus')} إضافة</button></form>`;
      document.getElementById('revf').onsubmit = async e => {
        e.preventDefault(); const f = new FormData(e.target);
        await busy(e.submitter, async () => { const { error } = await sb.from('reviews').insert({ author: f.get('author').trim(), role: (f.get('role') || '').trim() || null, rating: +f.get('rating'), body: f.get('body').trim(), approved: !!f.get('approved') }); if (error) throw error; toast('تمت الإضافة'); card(); });
      };
    }
    A.stats = async function () { const r = await stats0.apply(A, arguments); card(); return r; };
    A.revToggle = async (id, v) => { const { error } = await sb.from('reviews').update({ approved: v }).eq('id', id); if (error) return toast(errMsg(error), true); card(); };
    A.revDel = async id => { if (!confirm(t('sure'))) return; const { error } = await sb.from('reviews').delete().eq('id', id); if (error) return toast(errMsg(error), true); card(); };
    return true;
  }
  const iv = setInterval(() => { if (patch()) clearInterval(iv); }, 300);
  setTimeout(() => clearInterval(iv), 60000);
})();
