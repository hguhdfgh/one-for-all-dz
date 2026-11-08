/* pwa.js - service worker registration + "install app" button (Android/desktop prompt, iOS instructions) */
(function () {
  if ('serviceWorker' in navigator) addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () { }); });
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) return;
  var dismissed = false; try { dismissed = localStorage.getItem('ofa_pwa_x') === '1'; } catch (e) { }
  if (dismissed) return;
  var ev = null, ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
  function show() {
    if (document.getElementById('pwabtn')) return;
    var b = document.createElement('div'); b.id = 'pwabtn';
    b.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 68px);inset-inline-end:12px;z-index:55;display:flex;align-items:center;gap:4px;background:#22B04B;color:#fff;border-radius:999px;padding:4px 4px 4px 14px;box-shadow:0 8px 24px rgba(0,0,0,.25);font:600 14px/1 inherit';
    b.innerHTML = '<button id="pwago" style="all:unset;cursor:pointer;min-height:44px;display:flex;align-items:center;padding:0 8px">&#x2B07; &#x62A;&#x62B;&#x628;&#x64A;&#x62A; &#x627;&#x644;&#x62A;&#x637;&#x628;&#x64A;&#x642;</button><button id="pwax" aria-label="x" style="all:unset;cursor:pointer;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:18px">&#xD7;</button>';
    document.body.appendChild(b);
    document.getElementById('pwax').onclick = function () { try { localStorage.setItem('ofa_pwa_x', '1'); } catch (e) { } b.remove(); };
    document.getElementById('pwago').onclick = function () {
      if (ev) { ev.prompt(); ev.userChoice.finally(function () { ev = null; b.remove(); }); }
      else alert(decodeURIComponent('%D9%81%D9%8A%20%D8%A2%D9%8A%D9%81%D9%88%D9%86%3A%20%D8%A7%D8%B6%D8%BA%D8%B7%20%D8%B2%D8%B1%20%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B1%D9%83%D8%A9%20%28%E2%AC%86%29%20%D8%AB%D9%85%20%22%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D8%A5%D9%84%D9%89%20%D8%A7%D9%84%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9%22.'));
    }
  }
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; show(); });
  addEventListener('appinstalled', function () { var b = document.getElementById('pwabtn'); if (b) b.remove(); });
  if (ios) addEventListener('load', function () { setTimeout(show, 2500); });
})();
