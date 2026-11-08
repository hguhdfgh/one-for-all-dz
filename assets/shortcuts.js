/* shortcuts.js — admin keyboard layer: Ctrl/Cmd+K palette, ?, g+letter nav, / focus search */
(function(){
  var ROUTES=[['d','dash','لوحة التحكم'],['o','orders','الطلبات'],['c','clients','الزبائن'],['p','products','المنتجات'],['f','finance','المالية'],['l','leads','الاستفسارات'],['s','site','الموقع']];
  function admin(){try{return isAdmin()}catch(e){return false}}
  function go(k){location.hash='#/a/'+k;close()}
  var el,inp,ul,sel=0,items=[];
  function build(){
    el=document.createElement('div');el.id='cmdk';
    el.innerHTML='<div class="box"><input placeholder="اكتب أمر أو صفحة…" aria-label="command"><ul></ul><div class="help">g ثم d/o/c/p/f/l/s للتنقل · / للبحث · ? للمساعدة · Esc للإغلاق</div></div>';
    document.body.appendChild(el);inp=el.querySelector('input');ul=el.querySelector('ul');
    el.addEventListener('mousedown',function(e){if(e.target===el)close()});
    inp.addEventListener('input',render);
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){sel=Math.min(sel+1,items.length-1);paint();e.preventDefault()}
      else if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);paint();e.preventDefault()}
      else if(e.key==='Enter'&&items[sel]){go(items[sel][1])}
      else if(e.key==='Escape'){close()}
    });
    ul.addEventListener('click',function(e){var li=e.target.closest('li');if(li)go(li.dataset.k)});
  }
  function render(){var q=inp.value.trim();items=ROUTES.filter(function(r){return !q||r[2].indexOf(q)>-1||r[1].indexOf(q.toLowerCase())>-1});sel=0;paint()}
  function paint(){ul.innerHTML=items.map(function(r,i){return '<li data-k="'+r[1]+'" class="'+(i===sel?'sel':'')+'"><span>'+r[2]+'</span><kbd>g '+r[0]+'</kbd></li>'}).join('')}
  function open(){if(!el)build();el.classList.add('on');inp.value='';render();inp.focus()}
  function close(){if(el)el.classList.remove('on')}
  var gPending=0;
  document.addEventListener('keydown',function(e){
    if(!admin())return;
    var tag=(e.target.tagName||'').toLowerCase(),typing=tag==='input'||tag==='textarea'||tag==='select'||e.target.isContentEditable;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el&&el.classList.contains('on')?close():open();return}
    if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==='Escape'){close();return}
    if(e.key==='?'){open();return}
    if(e.key==='/'){var s=document.querySelector('input[type=search],.in[placeholder*="بحث"]');if(s){e.preventDefault();s.focus()}return}
    if(gPending){gPending=0;var r=ROUTES.filter(function(r){return r[0]===e.key})[0];if(r)go(r[1]);return}
    if(e.key==='g'){gPending=1;setTimeout(function(){gPending=0},900)}
  });
})();
