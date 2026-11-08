/* tracker.js — ONE FOR ALL privacy-friendly, high-accuracy analytics tracker */
(function () {
  if (typeof window === 'undefined') return;
  if (window.__OFA_TRACKER_LOADED__) return;
  window.__OFA_TRACKER_LOADED__ = true;

  var SB_URL = 'https://fvuowkqyrugygcrvkwwp.supabase.co';
  var SB_KEY = 'sb_publishable_iBRUEPugJshK4s5fytF7Tg_AUry3L7Z';

  // Ignore admin visits to avoid polluting conversion stats
  try {
    if (location.hash && location.hash.indexOf('#/a/') === 0) return;
    if (localStorage.getItem('ofa_theme') && localStorage.getItem('ofa_dense')) {
      // Possible admin device, but allow if not on admin route
    }
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
  if (page.indexOf('/app') === 0) page = '/app';
  if (page.indexOf('/store') === 0) page = '/store';
  if (page.indexOf('/video-ads') === 0) page = '/video-ads';
  if (page.indexOf('/tiktok-ads') === 0) page = '/tiktok-ads';
  if (page.indexOf('/video') === 0 && page !== '/video-ads') page = '/video';
  if (page.indexOf('/web') === 0) page = '/web';
  if (page.indexOf('/ads') === 0 && page !== '/tiktok-ads' && page !== '/video-ads') page = '/ads';

  var ua = navigator.userAgent || '';

  // In-App browser detection & standard browsers
  var browser = 'أخرى';
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

  // OS Detection
  var os = 'أخرى';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Device type
  var w = window.innerWidth || screen.width || 0;
  var deviceType = 'desktop';
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || w <= 768) {
    deviceType = 'mobile';
  } else if (/iPad|Tablet/i.test(ua) || (w > 768 && w <= 1024)) {
    deviceType = 'tablet';
  }

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

  // Geo / Location defaults from TimeZone
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  var country = 'الجزائر (DZ)';
  var city = 'الجزائر العاصمة';

  if (tz) {
    if (/Algiers/i.test(tz)) { country = 'الجزائر (DZ)'; city = 'الجزائر العاصمة'; }
    else if (/Paris/i.test(tz)) { country = 'فرنسا (FR)'; city = 'باريس'; }
    else if (/London/i.test(tz)) { country = 'بريطانيا (UK)'; city = 'لندن'; }
    else if (/Tunis/i.test(tz)) { country = 'تونس (TN)'; city = 'تونس'; }
    else if (/Casablanca/i.test(tz)) { country = 'المغرب (MA)'; city = 'الدار البيضاء'; }
    else if (/Dubai/i.test(tz)) { country = 'الإمارات (AE)'; city = 'دبي'; }
    else if (/Riyadh/i.test(tz)) { country = 'السعودية (SA)'; city = 'الرياض'; }
    else if (/Cairo/i.test(tz)) { country = 'مصر (EG)'; city = 'القاهرة'; }
    else if (/New_York|Chicago|Los_Angeles/i.test(tz)) { country = 'أمريكا (US)'; city = tz.split('/')[1] || ''; }
    else {
      var parts = tz.split('/');
      country = parts[0] || 'غير محدد';
      city = (parts[1] || '').replace(/_/g, ' ');
    }
  }

  var rowId = null;
  var startTime = Date.now();

  var payload = {
    page: page,
    title: document.title || 'ONE FOR ALL',
    referrer: ref || 'direct',
    referrer_domain: refDomain,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    device_type: deviceType,
    browser: browser,
    os: os,
    screen_res: (screen.width || 0) + 'x' + (screen.height || 0),
    language: navigator.language || 'ar',
    visitor_id: visitorId,
    session_id: sessionId,
    country: country,
    city: city,
    duration_sec: 0
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
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data[0] && data[0].id) {
        rowId = data[0].id;
      }
    })
    .catch(function () {});
  }

  // Update duration on leave or heartbeat
  function updateDuration() {
    if (!rowId) return;
    var duration = Math.min(3600, Math.round((Date.now() - startTime) / 1000));
    if (duration <= 0) return;

    var url = SB_URL + '/rest/v1/page_views?id=eq.' + rowId;
    var body = JSON.stringify({ duration_sec: duration });

    if (navigator.sendBeacon) {
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
        keepalive: true
      }).catch(function () {});
    }
  }

  // Conversion event tracking
  window.ofaTrackConversion = function (eventName, planName, price) {
    try {
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
        city: city
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

  // Automatically track clicks on WhatsApp conversion buttons
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

  // Trigger initial
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    sendInitial();
  } else {
    window.addEventListener('DOMContentLoaded', sendInitial);
  }

  // Heartbeat every 15s to update duration in real time
  var timer = setInterval(function () {
    if (!rowId) return;
    var duration = Math.min(3600, Math.round((Date.now() - startTime) / 1000));
    fetch(SB_URL + '/rest/v1/page_views?id=eq.' + rowId, {
      method: 'PATCH',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ duration_sec: duration })
    }).catch(function () {});
  }, 15000);

  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') updateDuration();
  });
  window.addEventListener('pagehide', updateDuration);
  window.addEventListener('beforeunload', updateDuration);

  // Optional: Try to fetch accurate Algerian Wilaya asynchronously via non-blocking API
  try {
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        if (!geo || !rowId) return;
        var c = geo.country_name || country;
        var ci = geo.city || geo.region || city;
        if (geo.country_code === 'DZ') c = 'الجزائر (DZ)';
        if (c || ci) {
          fetch(SB_URL + '/rest/v1/page_views?id=eq.' + rowId, {
            method: 'PATCH',
            headers: {
              'apikey': SB_KEY,
              'Authorization': 'Bearer ' + SB_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country: c, city: ci })
          }).catch(function () {});
        }
      })
      .catch(function () {});
  } catch (e) {}
})();
