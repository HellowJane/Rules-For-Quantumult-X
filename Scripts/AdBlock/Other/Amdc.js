const version = 'V1.0.8';

var ua = $request.headers["User-Agent"]
    || $request.headers["user-agent"];
/(AMap|Cainiao|%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C|Hema4iPhone|Moon|DMPortal)/.test(ua)
    ? $done({body: "null"})
    : $done({});