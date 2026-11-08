/* reviews.js — landing: shows approved client reviews between "how it works" and the FAQ. Renders nothing when there are none. */
(function () {
  const TXT = { t: ['آراء زبائننا', 'Avis de nos clients', 'What our clients say'], s: ['كلمات من زبائن خدمناهم فعلا.', 'Des mots de clients que nous avons servis.', 'Words from clients we actually served.'] };
  const li = () => (typeof LANG !== 'undefined' && LANG === 'fr') ? 1 : (typeof LANG !== 'undefined' && LANG === 'en') ? 2 : 0;
  function render(rows) {
    const faq = document.getElementById('faq'); if (!faq || !rows.length) return;
    let s = document.getElementById('reviews'); if (!s) { s = document.createElement('section'); s.id = 'reviews'; faq.parentNode.insertBefore(s, faq); }
    const i = li();
    s.innerHTML = `<div class="wrap"><div class="center" style="margin-bottom:26px"><span class="eyebrow">${esc(TXT.t[i])}</span><h2 class="h2">${esc(TXT.t[i])}</h2><p class="lead">${esc(TXT.s[i])}</p></div><div class="rv-grid">${rows.map(r => `<figure class="card rv-card" style="margin:0"><div class="rv-stars" aria-label="${r.rating}/5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div><blockquote class="rv-body" style="margin:0">${esc(r.body)}</blockquote><figcaption class="rv-by"><b>${esc(r.author)}</b>${r.role ? ' · ' + esc(r.role) : ''}</figcaption></figure>`).join('')}</div></div>`;
  }
  let rows = [];
  async function load() {
    try { if (typeof sb === 'undefined' || !sb) return; const { data } = await sb.from('reviews').select('author,role,rating,body').eq('approved', true).order('created_at', { ascending: false }).limit(6); rows = data || []; render(rows); } catch (e) { }
  }
  addEventListener('load', load);
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#lsw')) setTimeout(() => render(rows), 50); });
})();
