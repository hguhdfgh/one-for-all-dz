/* blog-ext.js - adds the «المدونة» (blog) link to the header, drawer and footer of every public page (loaded by brand.js). */
(function () {
  var lang = function () { return typeof LANG === 'string' ? LANG : 'ar'; };
  var lab = function () { return { ar: 'المدونة', fr: 'Blog', en: 'Blog' }[lang()] || 'المدونة'; };
  var on = /^\/blog(\/|$)/.test(location.pathname);
  function run() {
    [['header nav', 'beforeend'], ['#drawer', 'beforeend'], ['footer .row:last-child', 'afterbegin']].forEach(function (x) {
      var box = document.querySelector(x[0]); if (!box) return;
      var a = box.querySelector('a[href="/blog/"]');
      if (!a) { box.insertAdjacentHTML(x[1], '<a href="/blog/" class="bl-l" data-pg="blog"></a>'); a = box.querySelector('a[href="/blog/"]'); }
      if (a.classList.contains('bl-l') && a.textContent !== lab()) a.textContent = lab();
      if (on && !a.classList.contains('on')) a.classList.add('on');
    });
    var dr = document.querySelector('#drawer a.bl-l'), row = document.querySelector('#drawer > .row'); if (dr && row && dr.nextElementSibling !== row) row.before(dr);
  }
  try { run(); } catch (e) { console.error(e); }
  var q = 0; new MutationObserver(function () { if (!q) q = setTimeout(function () { q = 0; try { run(); } catch (e) {} }, 200); })
    .observe(document.body, { childList: true, subtree: true });
})();
