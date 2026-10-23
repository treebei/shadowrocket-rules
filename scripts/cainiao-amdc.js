// Cainiao-only AMDC fallback; references: ddgksf2013/Rewrite CainiaoAds.conf
// and fmz200/wool_scripts Scripts/header.js. Does not log request data.
(function () {
  try {
    const headers = $request.headers || {};
    const key = Object.keys(headers).find(k => k.toLowerCase() === "user-agent");
    const ua = key ? String(headers[key]) : "";
    if (/^https?:\/\/amdc\.m\.taobao\.com\/amdc\/mobileDispatch(?:[/?]|$)/.test($request.url) &&
        /Cainiao/i.test(ua)) {
      $done({ body: "" });
      return;
    }
  } catch (_) {}
  $done({});
})();
