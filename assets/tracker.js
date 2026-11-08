/* tracker.js (v2.0) — ONE FOR ALL 360° Behavioral & Conversion Analytics Engine */
(function () {
  if (typeof window === 'undefined') return;
  if (window.__OFA_TRACKER_LOADED__) return;
  window.__OFA_TRACKER_LOADED__ = true;

  var SB_URL = 'https://fvuowkqyrugygcrvkwwp.supabase.co';
  var SB_KEY = 'sb_publishable_iBRUEPugJshK4s5fytF7Tg_AUry3L7Z';

  // Ignore admin session to avoid skewing public analytics
  try {
    if (location.hash && location.hash.indexOf('#/a/') === 0) return;
  } catch (e) {}

  function uuid(prefix) {
    return (prefix || '') + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  function getStorage(k, isSession) {
    try {
      var s = isSession ? sessionStorage : localStorage;
      var v = s.getItem(k);
      if (!v) {
        v = uuid(isSession ? 's_' : 'v_');
        s.setItem(k, v);
      }
      return v;
    } catch (e) {
      return uuid(isSession ? 's_' : 'v_');
    }
  }

  var visitorId = getStorage('ofa_vid', false);
  var sessionId = getStorage('ofa_sid', true);

  // Normalize page name
  var rawPath = location.pathname || '/';
  var page = rawPath.replace(/\/index\.html$/, '/') || '/';
  if (page.indexOf('/capcut') === 0) page = '/capcut';
  else if (page.indexOf('/app') === 0) page = '/app';
  else if (page.indexOf('/store') === 0) page = '/store';
  else if (page.indexOf('/video-ads') === 0) page = '/video-ads';
  else if (page.indexOf('/tiktok-ads') === 0) page = '/tiktok-ads';
  else if (page.indexOf('/video') === 0) page = '/video';
  else if (page.indexOf('/web') === 0) page = '/web';
  else if (page.indexOf('/ads') === 0) page = '/ads';

  var ua = navigator.userAgent || '';

  // In-App browser detection & standard browsers
  var browser = 'متصفح قياسي';
  if (/Instagram/i.test(ua)) browser = 'Instagram In-App';
  else if (/TikTok|trill|bytedance/i.test(ua)) browser = 'TikTok In-App';
  else if (/FBAN|FBAV/i.test(ua)) browser = 'Facebook In-App';
  else if (/WhatsApp/i.test(ua)) browser = 'WhatsApp';
  else if (/Snapchat/i.test(ua)) browser = 'Snapchat In-App';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

  // Device Model & OS
  var os = 'أخرى';
  var deviceModel = 'هاتف ذكي';
  if (/iPhone/i.test(ua)) { os = 'iOS'; deviceModel = 'Apple iPhone'; }
  else if (/iPad/i.test(ua)) { os = 'iPadOS'; deviceModel = 'Apple iPad'; }
  else if (/Android/i.test(ua)) {
    os = 'Android';
    if (/SM-|Samsung/i.test(ua)) deviceModel = 'Samsung Galaxy';
    else if (/Redmi|POCO|Xiaomi/i.test(ua)) deviceModel = 'Xiaomi / Redmi';
    else if (/CPH|RMX|Oppo|Realme/i.test(ua)) deviceModel = 'Oppo / Realme';
    else if (/HUAWEI|Honor/i.test(ua)) deviceModel = 'Huawei / Honor';
    else deviceModel = 'هاتف Android';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows'; deviceModel = 'Windows PC';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS'; deviceModel = 'Apple Mac';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux'; deviceModel = 'Linux PC';
  }

  // Device type
  var w = window.innerWidth || screen.width || 0;
  var deviceType = 'desktop';
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || w <= 768) {
    deviceType = 'mobile';
  } else if (/iPad|Tablet/i.test(ua) || (w > 768 && w <= 1024)) {
    deviceType = 'tablet';
  }

  // Connection type
  var connType = 'غير محدد';
  try {
    if (navigator.connection) {
      connType = (navigator.connection.effectiveType || '').toUpperCase() || 'WiFi/Cellular';
    }
  } catch (e) {}

  // Referrer & Source
  var ref = document.referrer || '';
  var refDomain = 'مباشر (Direct)';
  if (ref) {
    try {
      var u = new URL(ref);
      var host = u.hostname.replace(/^www\./, '');
      if (host === location.hostname) {
        refDomain = 'تنقل داخلي (Internal)';
      } else if (/instagram\.com|l\.instagram\.com/i.test(host)) {
        refDomain = 'Instagram';
      } else if (/tiktok\.com/i.test(host)) {
        refDomain = 'TikTok';
      } else if (/facebook\.com|l\.facebook\.com|m\.facebook\.com/i.test(host)) {
        refDomain = 'Facebook';
      } else if (/google\./i.test(host)) {
        refDomain = 'Google';
      } else if (/whatsapp\.com/i.test(host)) {
        refDomain = 'WhatsApp';
      } else if (/youtube\.com|youtu\.be/i.test(host)) {
        refDomain = 'YouTube';
      } else if (/t\.co|twitter\.com|x\.com/i.test(host)) {
        refDomain = 'X (Twitter)';
      } else {
        refDomain = host;
      }
    } catch (e) {
      refDomain = 'موقع خارجي (Referral)';
    }
  }

  // If in-app browser without referrer, tag domain by in-app browser
  if (refDomain === 'مباشر (Direct)') {
    if (browser === 'Instagram In-App') refDomain = 'Instagram';
    else if (browser === 'TikTok In-App') refDomain = 'TikTok';
    else if (browser === 'Facebook In-App') refDomain = 'Facebook';
    else if (browser === 'WhatsApp') refDomain = 'WhatsApp';
  }

  // UTM parameters
  var urlParams = new URLSearchParams(location.search);
  var utmSource = urlParams.get('utm_source') || null;
  var utmMedium = urlParams.get('utm_medium') || null;
  var utmCampaign = urlParams.get('utm_campaign') || null;

  if (utmSource) {
    refDomain = utmSource + (refDomain !== 'مباشر (Direct)' ? ' (' + refDomain + ')' : '');
  }

  // Location & Algerian Wilaya detection
  var country = 'الجزائر (DZ)';
  var city = 'الجزائر العاصمة';
  var wilaya = '16 - الجزائر العاصمة';
  var ispName = 'اتصالات الجزائر';

  var WILAYA_DICT = {
    'algiers': '16 - الجزائر العاصمة', 'oran': '31 - وهران', 'constantine': '25 - قسنطينة',
    'setif': '19 - سطيف', 'sétif': '19 - سطيف', 'batna': '05 - باتنة', 'annaba': '23 - عنابة',
    'blida': '09 - البليدة', 'tlemcen': '13 - تلمسان', 'chlef': '02 - الشلف', 'bejaia': '06 - بجاية',
    'biskra': '07 - بسكرة', 'tizi ouzou': '15 - تيزي وزو', 'djelfa': '17 - الجلفة', 'jijel': '18 - جيجل',
    'saida': '20 - سعيدة', 'skikda': '21 - سكيكدة', 'sidi bel abbes': '22 - سيدي بلعباس',
    'guelma': '24 - قالمة', 'medea': '26 - المدية', 'mostaganem': '27 - مستغانم', 'msila': '28 - المسيلة',
    'mascara': '29 - معسكر', 'ouargla': '30 - ورقلة', 'el bayadh': '32 - البيض', 'bordj bou arreridj': '34 - برج بوعريريج',
    'boumerdes': '35 - بومرداس', 'el oued': '39 - الوادي', 'khenchela': '40 - خنشلة', 'souk ahras': '41 - سوق أهراس',
    'tipaza': '42 - تيبازة', 'mila': '43 - ميلة', 'ain defla': '44 - عين الدفلى', 'ain temouchent': '46 - عين تموشنت',
    'ghardaia': '47 - غرداية', 'relizane': '48 - غليزان', 'timimoun': '49 - تيميمون', 'ouled djellal': '51 - أولاد جلال',
    'beni abbes': '52 - بني عباس', 'in salah': '53 - عين صالح', 'touggourt': '55 - تقرت', 'djanet': '56 - جانت'
  };

  var rowId = null;
  var startTime = Date.now();
  var maxScrollDepth = 0;
  var videoWatchSec = 0;
  var videoWatched = false;
  var lastFaqClicked = null;

  var initialPayload = {
    page: page,
    title: document.title || 'ONE FOR ALL',
    referrer: ref || 'direct',
    referrer_domain: refDomain,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    device_type: deviceType,
    device_model: deviceModel,
    browser: browser,
    os: os,
    connection_type: connType,
    screen_res: (screen.width || 0) + 'x' + (screen.height || 0),
    language: navigator.language || 'ar',
    visitor_id: visitorId,
    session_id: sessionId,
    country: country,
    city: city,
    wilaya: wilaya,
    isp: ispName,
    scroll_depth: 0,
    video_watched: false,
    video_watch_sec: 0,
    duration_sec: 0,
    last_seen_at: new Date().toISOString()
  };

  // Send initial pageview
  function sendInitial() {
    fetch(SB_URL + '/rest/v1/page_views', {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(initialPayload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data[0] && data[0].id) {
        rowId = data[0].id;
      }
    })
    .catch(function () {});
  }

  // Periodic heartbeat & update state (Active Now radar pulse)
  function sendPulse(isFinal) {
    if (!rowId) return;
    var duration = Math.min(3600, Math.round((Date.now() - startTime) / 1000));
    var pulseData = {
      duration_sec: duration,
      scroll_depth: maxScrollDepth,
      video_watched: videoWatched,
      video_watch_sec: Math.round(videoWatchSec),
      faq_opened: lastFaqClicked,
      last_seen_at: new Date().toISOString()
    };

    var url = SB_URL + '/rest/v1/page_views?id=eq.' + rowId;
    var body = JSON.stringify(pulseData);

    if (isFinal && navigator.sendBeacon) {
      var blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + SB_KEY,
          'Content-Type': 'application/json'
        },
        body: body,
        keepalive: !!isFinal
      }).catch(function () {});
    }
  }

  // Scroll depth calculator (25%, 50%, 75%, 100%)
  function checkScroll() {
    var h = document.documentElement, b = document.body;
    var st = 'scrollTop' in h ? h.scrollTop : b.scrollTop;
    var sh = 'scrollHeight' in h ? h.scrollHeight : b.scrollHeight;
    var ch = h.clientHeight;
    if (sh <= ch) return;
    var pct = Math.min(100, Math.round(((st + ch) / sh) * 100));

    var milestone = 0;
    if (pct >= 90) milestone = 100;
    else if (pct >= 70) milestone = 75;
    else if (pct >= 45) milestone = 50;
    else if (pct >= 20) milestone = 25;

    if (milestone > maxScrollDepth) {
      maxScrollDepth = milestone;
    }
  }
  window.addEventListener('scroll', checkScroll, { passive: true });

  // Video watch tracker
  function setupVideoTracking() {
    var vids = document.querySelectorAll('video');
    vids.forEach(function (v) {
      v.addEventListener('play', function () { videoWatched = true; });
      v.addEventListener('timeupdate', function () {
        videoWatched = true;
        if (v.currentTime > videoWatchSec) {
          videoWatchSec = Math.round(v.currentTime);
        }
      });
    });
  }

  // FAQ click tracker
  document.addEventListener('click', function (e) {
    var sum = e.target.closest('summary');
    if (sum) {
      lastFaqClicked = (sum.innerText || '').trim().substring(0, 100);
    }
  }, true);

  // Conversion Event Tracker (WhatsApp click)
  window.ofaTrackConversion = function (eventName, planName, price) {
    try {
      var decisionLatency = Math.round((Date.now() - startTime) / 1000);
      var convPayload = {
        page: page,
        event_name: eventName || 'whatsapp_click',
        plan_name: planName || 'غير محدد',
        price: price || 0,
        visitor_id: visitorId,
        session_id: sessionId,
        referrer_domain: refDomain,
        device_type: deviceType,
        browser: browser,
        city: city,
        wilaya: wilaya,
        decision_latency_sec: decisionLatency,
        scroll_depth_at_click: maxScrollDepth
      };

      var convUrl = SB_URL + '/rest/v1/conversion_events';
      var convBody = JSON.stringify(convPayload);

      if (navigator.sendBeacon) {
        var blob = new Blob([convBody], { type: 'application/json' });
        navigator.sendBeacon(convUrl, blob);
      } else {
        fetch(convUrl, {
          method: 'POST',
          headers: {
            'apikey': SB_KEY,
            'Authorization': 'Bearer ' + SB_KEY,
            'Content-Type': 'application/json'
          },
          body: convBody,
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) {}
  };

  // Auto-bind to WhatsApp conversion links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') >= 0 || href.indexOf('whatsapp.com') >= 0) {
      var plan = 'طلب واتساب عام';
      var price = 0;
      if (/1,?500/i.test(href) || /باقة شهر/i.test(href)) { plan = 'باقة شهر (1,500 دج)'; price = 1500; }
      else if (/2,?500/i.test(href) || /3 أشهر/i.test(href)) { plan = 'باقة 3 أشهر (2,500 دج)'; price = 2500; }
      else if (/4,?500/i.test(href) || /6 أشهر/i.test(href)) { plan = 'باقة 6 أشهر (4,500 دج)'; price = 4500; }
      else if (/8,?000/i.test(href) || /عام كامل|VIP/i.test(href)) { plan = 'باقة عام كامل VIP (8,000 دج)'; price = 8000; }
      else if (/ضمان/i.test(href)) { plan = 'استفسار عن الضمان'; }
      window.ofaTrackConversion('whatsapp_click', plan, price);
    }
  }, true);

  // Initialize
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    sendInitial();
    setupVideoTracking();
  } else {
    window.addEventListener('DOMContentLoaded', function () {
      sendInitial();
      setupVideoTracking();
    });
  }

  // Heartbeat pulse every 8s (Powers the Live Radar & Active Visitors Counter)
  setInterval(function () {
    sendPulse(false);
  }, 8000);

  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') sendPulse(true);
  });
  window.addEventListener('pagehide', function () { sendPulse(true); });
  window.addEventListener('beforeunload', function () { sendPulse(true); });

  // Asynchronous Geo & ISP lookup
  try {
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        if (!geo || !rowId) return;
        var c = geo.country_name || country;
        var rawCity = (geo.city || geo.region || '').toLowerCase();
        var matchedWilaya = wilaya;

        for (var k in WILAYA_DICT) {
          if (rawCity.indexOf(k) >= 0) {
            matchedWilaya = WILAYA_DICT[k];
            break;
          }
        }

        var org = (geo.org || '').toLowerCase();
        var isp = 'اتصالات الجزائر';
        if (org.indexOf('mobilis') >= 0 || org.indexOf('atm') >= 0) isp = 'Mobilis (موبيليس)';
        else if (org.indexOf('djezzy') >= 0 || org.indexOf('ota') >= 0) isp = 'Djezzy (جيزي)';
        else if (org.indexOf('ooredoo') >= 0 || org.indexOf('wataniya') >= 0) isp = 'Ooredoo (أوريدو)';
        else if (org.indexOf('algerie telecom') >= 0 || org.indexOf('anep') >= 0) isp = 'Algérie Télécom (Fibre/4G)';

        city = geo.city || city;
        wilaya = matchedWilaya;
        ispName = isp;

        fetch(SB_URL + '/rest/v1/page_views?id=eq.' + rowId, {
          method: 'PATCH',
          headers: {
            'apikey': SB_KEY,
            'Authorization': 'Bearer ' + SB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            country: geo.country_code === 'DZ' ? 'الجزائر (DZ)' : c,
            city: city,
            wilaya: wilaya,
            isp: ispName
          })
        }).catch(function () {});
      })
      .catch(function () {});
  } catch (e) {}
})();
