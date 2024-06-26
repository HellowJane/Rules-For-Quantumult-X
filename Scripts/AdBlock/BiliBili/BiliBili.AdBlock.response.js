class e {
    static name = "Lodash";
    static version = "1.2.2";

    static about() {
        return console.log(`\n🟧 ${this.name} v${this.version}\n`)
    }

    static get(e = {}, t = "", n = void 0) {
        Array.isArray(t) || (t = this.toPath(t));
        const i = t.reduce(((e, t) => Object(e)[t]), e);
        return void 0 === i ? n : i
    }

    static set(e = {}, t = "", n) {
        return Array.isArray(t) || (t = this.toPath(t)), t.slice(0, -1).reduce(((e, n, i) => Object(e[n]) === e[n] ? e[n] : e[n] = /^\d+$/.test(t[i + 1]) ? [] : {}), e)[t[t.length - 1]] = n, e
    }

    static unset(e = {}, t = "") {
        return Array.isArray(t) || (t = this.toPath(t)), t.reduce(((e, n, i) => i === t.length - 1 ? (delete e[n], !0) : Object(e)[n]), e)
    }

    static toPath(e) {
        return e.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean)
    }

    static escape(e) {
        const t = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};
        return e.replace(/[&<>"']/g, (e => t[e]))
    }

    static unescape(e) {
        const t = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'"};
        return e.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (e => t[e]))
    }
}

class t {
    static name = "$Storage";
    static version = "1.0.9";

    static about() {
        return console.log(`\n🟧 ${this.name} v${this.version}\n`)
    }

    static data = null;
    static dataFile = "box.dat";
    static#e = /^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;

    static #t() {
        return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : "undefined" != typeof Egern ? "Egern" : void 0
    }

    static getItem(t = new String, n = null) {
        let i = n;
        if (!0 === t.startsWith("@")) {
            const {key: n, path: r} = t.match(this.#e)?.groups;
            t = n;
            let a = this.getItem(t, {});
            "object" != typeof a && (a = {}), i = e.get(a, r);
            try {
                i = JSON.parse(i)
            } catch (e) {
            }
        } else {
            switch (this.#t()) {
                case"Surge":
                case"Loon":
                case"Stash":
                case"Egern":
                case"Shadowrocket":
                    i = $persistentStore.read(t);
                    break;
                case"Quantumult X":
                    i = $prefs.valueForKey(t);
                    break;
                case"Node.js":
                    this.data = this.#n(this.dataFile), i = this.data?.[t];
                    break;
                default:
                    i = this.data?.[t] || null
            }
            try {
                i = JSON.parse(i)
            } catch (e) {
            }
        }
        return i ?? n
    }

    static setItem(t = new String, n = new String) {
        let i = !1;
        if ("object" == typeof n) n = JSON.stringify(n); else n = String(n);
        if (!0 === t.startsWith("@")) {
            const {key: r, path: a} = t.match(this.#e)?.groups;
            t = r;
            let s = this.getItem(t, {});
            "object" != typeof s && (s = {}), e.set(s, a, n), i = this.setItem(t, s)
        } else switch (this.#t()) {
            case"Surge":
            case"Loon":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
                i = $persistentStore.write(n, t);
                break;
            case"Quantumult X":
                i = $prefs.setValueForKey(n, t);
                break;
            case"Node.js":
                this.data = this.#n(this.dataFile), this.data[t] = n, this.#i(this.dataFile), i = !0;
                break;
            default:
                i = this.data?.[t] || null
        }
        return i
    }

    static removeItem(t) {
        let n = !1;
        if (!0 === t.startsWith("@")) {
            const {key: i, path: r} = t.match(this.#e)?.groups;
            t = i;
            let a = this.getItem(t);
            "object" != typeof a && (a = {}), keyValue = e.unset(a, r), n = this.setItem(t, a)
        } else switch (this.#t()) {
            case"Surge":
            case"Loon":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
            case"Node.js":
            default:
                n = !1;
                break;
            case"Quantumult X":
                n = $prefs.removeValueForKey(t)
        }
        return n
    }

    static clear() {
        let e = !1;
        switch (this.#t()) {
            case"Surge":
            case"Loon":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
            case"Node.js":
            default:
                e = !1;
                break;
            case"Quantumult X":
                e = $prefs.removeAllValues()
        }
        return e
    }

    static #n(e) {
        if (!this.isNode()) return {};
        {
            this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
            const t = this.path.resolve(e), n = this.path.resolve(process.cwd(), e), i = this.fs.existsSync(t),
                r = !i && this.fs.existsSync(n);
            if (!i && !r) return {};
            {
                const e = i ? t : n;
                try {
                    return JSON.parse(this.fs.readFileSync(e))
                } catch (e) {
                    return {}
                }
            }
        }
    }

    static #i(e = this.dataFile) {
        if (this.isNode()) {
            this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
            const t = this.path.resolve(e), n = this.path.resolve(process.cwd(), e), i = this.fs.existsSync(t),
                r = !i && this.fs.existsSync(n), a = JSON.stringify(this.data);
            i ? this.fs.writeFileSync(t, a) : r ? this.fs.writeFileSync(n, a) : this.fs.writeFileSync(t, a)
        }
    }
}

class n {
    static name = "ENV";
    static version = "1.8.3";

    static about() {
        return console.log(`\n🟧 ${this.name} v${this.version}\n`)
    }

    constructor(e, t) {
        console.log(`\n🟧 ${n.name} v${n.version}\n`), this.name = e, this.logs = [], this.isMute = !1, this.isMuteLog = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, t), this.log(`\n🚩 开始!\n${e}\n`)
    }

    environment() {
        switch (this.platform()) {
            case"Surge":
                return $environment.app = "Surge", $environment;
            case"Stash":
                return $environment.app = "Stash", $environment;
            case"Egern":
                return $environment.app = "Egern", $environment;
            case"Loon":
                let e = $loon.split(" ");
                return {device: e[0], ios: e[1], "loon-version": e[2], app: "Loon"};
            case"Quantumult X":
                return {app: "Quantumult X"};
            case"Node.js":
                return process.env.app = "Node.js", process.env;
            default:
                return {}
        }
    }

    platform() {
        return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : "undefined" != typeof Egern ? "Egern" : void 0
    }

    isNode() {
        return "Node.js" === this.platform()
    }

    isQuanX() {
        return "Quantumult X" === this.platform()
    }

    isSurge() {
        return "Surge" === this.platform()
    }

    isLoon() {
        return "Loon" === this.platform()
    }

    isShadowrocket() {
        return "Shadowrocket" === this.platform()
    }

    isStash() {
        return "Stash" === this.platform()
    }

    isEgern() {
        return "Egern" === this.platform()
    }

    async getScript(e) {
        return await this.fetch(e).then((e => e.body))
    }

    async runScript(e, n) {
        let i = t.getItem("@chavy_boxjs_userCfgs.httpapi");
        i = i?.replace?.(/\n/g, "")?.trim();
        let r = t.getItem("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = 1 * r ?? 20, r = n?.timeout ?? r;
        const [a, s] = i.split("@"), o = {
            url: `http://${s}/v1/scripting/evaluate`,
            body: {script_text: e, mock_type: "cron", timeout: r},
            headers: {"X-Key": a, Accept: "*/*"},
            timeout: r
        };
        await this.fetch(o).then((e => e.body), (e => this.logErr(e)))
    }

    initGotEnv(e) {
        this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, e && (e.headers = e.headers ? e.headers : {}, void 0 === e.headers.Cookie && void 0 === e.cookieJar && (e.cookieJar = this.ckjar))
    }

    async fetch(t = {} || "", n = {}) {
        switch (t.constructor) {
            case Object:
                t = {...n, ...t};
                break;
            case String:
                t = {...n, url: t}
        }
        t.method || (t.method = "GET", (t.body ?? t.bodyBytes) && (t.method = "POST")), delete t.headers?.Host, delete t.headers?.[":authority"], delete t.headers?.["Content-Length"], delete t.headers?.["content-length"];
        const i = t.method.toLocaleLowerCase();
        switch (this.platform()) {
            case"Loon":
            case"Surge":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
            default:
                return t.timeout && (t.timeout = parseInt(t.timeout, 10), this.isSurge() || (t.timeout = 1e3 * t.timeout)), t.policy && (this.isLoon() && (t.node = t.policy), this.isStash() && e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy)), this.isShadowrocket() && e.set(t, "headers.X-Surge-Proxy", t.policy)), "boolean" == typeof t.redirection && (t["auto-redirect"] = t.redirection), t.bodyBytes && !t.body && (t.body = t.bodyBytes, delete t.bodyBytes), await new Promise(((e, n) => {
                    $httpClient[i](t, ((i, r, a) => {
                        i ? n(i) : (r.ok = /^2\d\d$/.test(r.status), r.statusCode = r.status, a && (r.body = a, 1 == t["binary-mode"] && (r.bodyBytes = a)), e(r))
                    }))
                }));
            case"Quantumult X":
                return t.policy && e.set(t, "opts.policy", t.policy), "boolean" == typeof t["auto-redirect"] && e.set(t, "opts.redirection", t["auto-redirect"]), t.body instanceof ArrayBuffer ? (t.bodyBytes = t.body, delete t.body) : ArrayBuffer.isView(t.body) ? (t.bodyBytes = t.body.buffer.slice(t.body.byteOffset, t.body.byteLength + t.body.byteOffset), delete object.body) : t.body && delete t.bodyBytes, await $task.fetch(t).then((e => (e.ok = /^2\d\d$/.test(e.statusCode), e.status = e.statusCode, e)), (e => Promise.reject(e.error)));
            case"Node.js":
                let n = require("iconv-lite");
                this.initGotEnv(t);
                const {url: r, ...a} = t;
                return await this.got[i](r, a).on("redirect", ((e, t) => {
                    try {
                        if (e.headers["set-cookie"]) {
                            const n = e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                            n && this.ckjar.setCookieSync(n, null), t.cookieJar = this.ckjar
                        }
                    } catch (e) {
                        this.logErr(e)
                    }
                })).then((e => (e.statusCode = e.status, e.body = n.decode(e.rawBody, this.encoding), e.bodyBytes = e.rawBody, e)), (e => Promise.reject(e.message)))
        }
    }

    time(e, t = null) {
        const n = t ? new Date(t) : new Date;
        let i = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "H+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds()
        };
        /(y+)/.test(e) && (e = e.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (let t in i) new RegExp("(" + t + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? i[t] : ("00" + i[t]).substr(("" + i[t]).length)));
        return e
    }

    msg(e = name, t = "", n = "", i) {
        const r = e => {
            switch (typeof e) {
                case void 0:
                    return e;
                case"string":
                    switch (this.platform()) {
                        case"Surge":
                        case"Stash":
                        case"Egern":
                        default:
                            return {url: e};
                        case"Loon":
                        case"Shadowrocket":
                            return e;
                        case"Quantumult X":
                            return {"open-url": e};
                        case"Node.js":
                            return
                    }
                case"object":
                    switch (this.platform()) {
                        case"Surge":
                        case"Stash":
                        case"Egern":
                        case"Shadowrocket":
                        default:
                            return {url: e.url || e.openUrl || e["open-url"]};
                        case"Loon":
                            return {
                                openUrl: e.openUrl || e.url || e["open-url"],
                                mediaUrl: e.mediaUrl || e["media-url"]
                            };
                        case"Quantumult X":
                            return {
                                "open-url": e["open-url"] || e.url || e.openUrl,
                                "media-url": e["media-url"] || e.mediaUrl,
                                "update-pasteboard": e["update-pasteboard"] || e.updatePasteboard
                            };
                        case"Node.js":
                            return
                    }
                default:
                    return
            }
        };
        if (!this.isMute) switch (this.platform()) {
            case"Surge":
            case"Loon":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
            default:
                $notification.post(e, t, n, r(i));
                break;
            case"Quantumult X":
                $notify(e, t, n, r(i));
            case"Node.js":
        }
        if (!this.isMuteLog) {
            let i = ["", "==============📣系统通知📣=============="];
            i.push(e), t && i.push(t), n && i.push(n), console.log(i.join("\n")), this.logs = this.logs.concat(i)
        }
    }

    log(...e) {
        e.length > 0 && (this.logs = [...this.logs, ...e]), console.log(e.join(this.logSeparator))
    }

    logErr(e) {
        switch (this.platform()) {
            case"Surge":
            case"Loon":
            case"Stash":
            case"Egern":
            case"Shadowrocket":
            case"Quantumult X":
            default:
                this.log("", `❗️ ${this.name}, 错误!`, e);
                break;
            case"Node.js":
                this.log("", `❗️${this.name}, 错误!`, e.stack)
        }
    }

    wait(e) {
        return new Promise((t => setTimeout(t, e)))
    }

    done(t = {}) {
        const n = ((new Date).getTime() - this.startTime) / 1e3;
        switch (this.log("", `🚩 ${this.name}, 结束! 🕛 ${n} 秒`, ""), this.platform()) {
            case"Surge":
                t.policy && e.set(t, "headers.X-Surge-Policy", t.policy), $done(t);
                break;
            case"Loon":
                t.policy && (t.node = t.policy), $done(t);
                break;
            case"Stash":
                t.policy && e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy)), $done(t);
                break;
            case"Egern":
            case"Shadowrocket":
            default:
                $done(t);
                break;
            case"Quantumult X":
                t.policy && e.set(t, "opts.policy", t.policy), delete t["auto-redirect"], delete t["auto-cookie"], delete t["binary-mode"], delete t.charset, delete t.host, delete t.insecure, delete t.method, delete t.opt, delete t.path, delete t.policy, delete t["policy-descriptor"], delete t.scheme, delete t.sessionIndex, delete t.statusCode, delete t.timeout, t.body instanceof ArrayBuffer ? (t.bodyBytes = t.body, delete t.body) : ArrayBuffer.isView(t.body) ? (t.bodyBytes = t.body.buffer.slice(t.body.byteOffset, t.body.byteLength + t.body.byteOffset), delete t.body) : t.body && delete t.bodyBytes, $done(t);
                break;
            case"Node.js":
                process.exit(1)
        }
    }
}

var i = {Switch: !0}, r = {Settings: i}, a = {
    Switch: !0,
    Detail: {
        splash: !0,
        feed: !0,
        activity: !1,
        story: !0,
        cinema: !0,
        view: !0,
        search: !0,
        xlive: !0,
        Hot_search: !0,
        Hot_topics: !0,
        Most_visited: !0,
        Dynamic_adcard: !0
    }
}, s = {Settings: a}, o = Database = {
    Default: Object.freeze({__proto__: null, Settings: i, default: r}),
    ADBlock: Object.freeze({__proto__: null, Settings: a, default: s})
};

function l(n, i, r) {
    console.log("☑️ Set Environment Variables", "");
    let {Settings: a, Caches: s, Configs: o} = function (n, i, r) {
        let a = t.getItem(n, r), s = {};
        if ("undefined" != typeof $argument && Boolean($argument)) {
            let t = Object.fromEntries($argument.split("&").map((e => e.split("=").map((e => e.replace(/\"/g, ""))))));
            for (let n in t) e.set(s, n, t[n])
        }
        const o = {Settings: r?.Default?.Settings || {}, Configs: r?.Default?.Configs || {}, Caches: {}};
        Array.isArray(i) || (i = [i]);
        for (let e of i) o.Settings = {...o.Settings, ...r?.[e]?.Settings, ...s, ...a?.[e]?.Settings}, o.Configs = {...o.Configs, ...r?.[e]?.Configs}, a?.[e]?.Caches && "string" == typeof a?.[e]?.Caches && (a[e].Caches = JSON.parse(a?.[e]?.Caches)), o.Caches = {...o.Caches, ...a?.[e]?.Caches};
        return function e(t, n) {
            for (var i in t) {
                var r = t[i];
                t[i] = "object" == typeof r && null !== r ? e(r, n) : n(i, r)
            }
            return t
        }(o.Settings, ((e, t) => ("true" === t || "false" === t ? t = JSON.parse(t) : "string" == typeof t && (t = t.includes(",") ? t.split(",").map((e => l(e))) : l(t)), t))), o;

        function l(e) {
            return e && !isNaN(e) && (e = parseInt(e, 10)), e
        }
    }(n, i, r);
    return Array.isArray(a?.Locales) || (a.Locales = a.Locales ? [a.Locales] : []), console.log(`✅ Set Environment Variables, Settings: ${typeof a}, Settings内容: ${JSON.stringify(a)}`, ""), {
        Settings: a,
        Caches: s,
        Configs: o
    }
}

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
function c(e) {
    let t = e.length;
    for (; --t >= 0;) e[t] = 0
}

const d = 256, h = 286, u = 30, f = 15,
    p = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]),
    m = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
    g = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]),
    w = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), b = new Array(576);
c(b);
const y = new Array(60);
c(y);
const _ = new Array(512);
c(_);
const k = new Array(256);
c(k);
const v = new Array(29);
c(v);
const T = new Array(u);

function N(e, t, n, i, r) {
    this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = i, this.max_length = r, this.has_stree = e && e.length
}

let B, x, U;

function E(e, t) {
    this.dyn_tree = e, this.max_code = 0, this.stat_desc = t
}

c(T);
const S = e => e < 256 ? _[e] : _[256 + (e >>> 7)], I = (e, t) => {
    e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255
}, R = (e, t, n) => {
    e.bi_valid > 16 - n ? (e.bi_buf |= t << e.bi_valid & 65535, I(e, e.bi_buf), e.bi_buf = t >> 16 - e.bi_valid, e.bi_valid += n - 16) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n)
}, D = (e, t, n) => {
    R(e, n[2 * t], n[2 * t + 1])
}, O = (e, t) => {
    let n = 0;
    do {
        n |= 1 & e, e >>>= 1, n <<= 1
    } while (--t > 0);
    return n >>> 1
}, $ = (e, t, n) => {
    const i = new Array(16);
    let r, a, s = 0;
    for (r = 1; r <= f; r++) s = s + n[r - 1] << 1, i[r] = s;
    for (a = 0; a <= t; a++) {
        let t = e[2 * a + 1];
        0 !== t && (e[2 * a] = O(i[t]++, t))
    }
}, A = e => {
    let t;
    for (t = 0; t < h; t++) e.dyn_ltree[2 * t] = 0;
    for (t = 0; t < u; t++) e.dyn_dtree[2 * t] = 0;
    for (t = 0; t < 19; t++) e.bl_tree[2 * t] = 0;
    e.dyn_ltree[512] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0
}, L = e => {
    e.bi_valid > 8 ? I(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0
}, F = (e, t, n, i) => {
    const r = 2 * t, a = 2 * n;
    return e[r] < e[a] || e[r] === e[a] && i[t] <= i[n]
}, j = (e, t, n) => {
    const i = e.heap[n];
    let r = n << 1;
    for (; r <= e.heap_len && (r < e.heap_len && F(t, e.heap[r + 1], e.heap[r], e.depth) && r++, !F(t, i, e.heap[r], e.depth));) e.heap[n] = e.heap[r], n = r, r <<= 1;
    e.heap[n] = i
}, z = (e, t, n) => {
    let i, r, a, s, o = 0;
    if (0 !== e.sym_next) do {
        i = 255 & e.pending_buf[e.sym_buf + o++], i += (255 & e.pending_buf[e.sym_buf + o++]) << 8, r = e.pending_buf[e.sym_buf + o++], 0 === i ? D(e, r, t) : (a = k[r], D(e, a + d + 1, t), s = p[a], 0 !== s && (r -= v[a], R(e, r, s)), i--, a = S(i), D(e, a, n), s = m[a], 0 !== s && (i -= T[a], R(e, i, s)))
    } while (o < e.sym_next);
    D(e, 256, t)
}, C = (e, t) => {
    const n = t.dyn_tree, i = t.stat_desc.static_tree, r = t.stat_desc.has_stree, a = t.stat_desc.elems;
    let s, o, l, c = -1;
    for (e.heap_len = 0, e.heap_max = 573, s = 0; s < a; s++) 0 !== n[2 * s] ? (e.heap[++e.heap_len] = c = s, e.depth[s] = 0) : n[2 * s + 1] = 0;
    for (; e.heap_len < 2;) l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[2 * l] = 1, e.depth[l] = 0, e.opt_len--, r && (e.static_len -= i[2 * l + 1]);
    for (t.max_code = c, s = e.heap_len >> 1; s >= 1; s--) j(e, n, s);
    l = a;
    do {
        s = e.heap[1], e.heap[1] = e.heap[e.heap_len--], j(e, n, 1), o = e.heap[1], e.heap[--e.heap_max] = s, e.heap[--e.heap_max] = o, n[2 * l] = n[2 * s] + n[2 * o], e.depth[l] = (e.depth[s] >= e.depth[o] ? e.depth[s] : e.depth[o]) + 1, n[2 * s + 1] = n[2 * o + 1] = l, e.heap[1] = l++, j(e, n, 1)
    } while (e.heap_len >= 2);
    e.heap[--e.heap_max] = e.heap[1], ((e, t) => {
        const n = t.dyn_tree, i = t.max_code, r = t.stat_desc.static_tree, a = t.stat_desc.has_stree,
            s = t.stat_desc.extra_bits, o = t.stat_desc.extra_base, l = t.stat_desc.max_length;
        let c, d, h, u, p, m, g = 0;
        for (u = 0; u <= f; u++) e.bl_count[u] = 0;
        for (n[2 * e.heap[e.heap_max] + 1] = 0, c = e.heap_max + 1; c < 573; c++) d = e.heap[c], u = n[2 * n[2 * d + 1] + 1] + 1, u > l && (u = l, g++), n[2 * d + 1] = u, d > i || (e.bl_count[u]++, p = 0, d >= o && (p = s[d - o]), m = n[2 * d], e.opt_len += m * (u + p), a && (e.static_len += m * (r[2 * d + 1] + p)));
        if (0 !== g) {
            do {
                for (u = l - 1; 0 === e.bl_count[u];) u--;
                e.bl_count[u]--, e.bl_count[u + 1] += 2, e.bl_count[l]--, g -= 2
            } while (g > 0);
            for (u = l; 0 !== u; u--) for (d = e.bl_count[u]; 0 !== d;) h = e.heap[--c], h > i || (n[2 * h + 1] !== u && (e.opt_len += (u - n[2 * h + 1]) * n[2 * h], n[2 * h + 1] = u), d--)
        }
    })(e, t), $(n, c, e.bl_count)
}, W = (e, t, n) => {
    let i, r, a = -1, s = t[1], o = 0, l = 7, c = 4;
    for (0 === s && (l = 138, c = 3), t[2 * (n + 1) + 1] = 65535, i = 0; i <= n; i++) r = s, s = t[2 * (i + 1) + 1], ++o < l && r === s || (o < c ? e.bl_tree[2 * r] += o : 0 !== r ? (r !== a && e.bl_tree[2 * r]++, e.bl_tree[32]++) : o <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++, o = 0, a = r, 0 === s ? (l = 138, c = 3) : r === s ? (l = 6, c = 3) : (l = 7, c = 4))
}, V = (e, t, n) => {
    let i, r, a = -1, s = t[1], o = 0, l = 7, c = 4;
    for (0 === s && (l = 138, c = 3), i = 0; i <= n; i++) if (r = s, s = t[2 * (i + 1) + 1], !(++o < l && r === s)) {
        if (o < c) do {
            D(e, r, e.bl_tree)
        } while (0 != --o); else 0 !== r ? (r !== a && (D(e, r, e.bl_tree), o--), D(e, 16, e.bl_tree), R(e, o - 3, 2)) : o <= 10 ? (D(e, 17, e.bl_tree), R(e, o - 3, 3)) : (D(e, 18, e.bl_tree), R(e, o - 11, 7));
        o = 0, a = r, 0 === s ? (l = 138, c = 3) : r === s ? (l = 6, c = 3) : (l = 7, c = 4)
    }
};
let P = !1;
const Z = (e, t, n, i) => {
    R(e, 0 + (i ? 1 : 0), 3), L(e), I(e, n), I(e, ~n), n && e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n
};
var M = (e, t, n, i) => {
    let r, a, s = 0;
    e.level > 0 ? (2 === e.strm.data_type && (e.strm.data_type = (e => {
        let t, n = 4093624447;
        for (t = 0; t <= 31; t++, n >>>= 1) if (1 & n && 0 !== e.dyn_ltree[2 * t]) return 0;
        if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return 1;
        for (t = 32; t < d; t++) if (0 !== e.dyn_ltree[2 * t]) return 1;
        return 0
    })(e)), C(e, e.l_desc), C(e, e.d_desc), s = (e => {
        let t;
        for (W(e, e.dyn_ltree, e.l_desc.max_code), W(e, e.dyn_dtree, e.d_desc.max_code), C(e, e.bl_desc), t = 18; t >= 3 && 0 === e.bl_tree[2 * w[t] + 1]; t--) ;
        return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
    })(e), r = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= r && (r = a)) : r = a = n + 5, n + 4 <= r && -1 !== t ? Z(e, t, n, i) : 4 === e.strategy || a === r ? (R(e, 2 + (i ? 1 : 0), 3), z(e, b, y)) : (R(e, 4 + (i ? 1 : 0), 3), ((e, t, n, i) => {
        let r;
        for (R(e, t - 257, 5), R(e, n - 1, 5), R(e, i - 4, 4), r = 0; r < i; r++) R(e, e.bl_tree[2 * w[r] + 1], 3);
        V(e, e.dyn_ltree, t - 1), V(e, e.dyn_dtree, n - 1)
    })(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, s + 1), z(e, e.dyn_ltree, e.dyn_dtree)), A(e), i && L(e)
}, K = {
    _tr_init: e => {
        P || ((() => {
            let e, t, n, i, r;
            const a = new Array(16);
            for (n = 0, i = 0; i < 28; i++) for (v[i] = n, e = 0; e < 1 << p[i]; e++) k[n++] = i;
            for (k[n - 1] = i, r = 0, i = 0; i < 16; i++) for (T[i] = r, e = 0; e < 1 << m[i]; e++) _[r++] = i;
            for (r >>= 7; i < u; i++) for (T[i] = r << 7, e = 0; e < 1 << m[i] - 7; e++) _[256 + r++] = i;
            for (t = 0; t <= f; t++) a[t] = 0;
            for (e = 0; e <= 143;) b[2 * e + 1] = 8, e++, a[8]++;
            for (; e <= 255;) b[2 * e + 1] = 9, e++, a[9]++;
            for (; e <= 279;) b[2 * e + 1] = 7, e++, a[7]++;
            for (; e <= 287;) b[2 * e + 1] = 8, e++, a[8]++;
            for ($(b, 287, a), e = 0; e < u; e++) y[2 * e + 1] = 5, y[2 * e] = O(e, 5);
            B = new N(b, p, 257, h, f), x = new N(y, m, 0, u, f), U = new N(new Array(0), g, 0, 19, 7)
        })(), P = !0), e.l_desc = new E(e.dyn_ltree, B), e.d_desc = new E(e.dyn_dtree, x), e.bl_desc = new E(e.bl_tree, U), e.bi_buf = 0, e.bi_valid = 0, A(e)
    },
    _tr_stored_block: Z,
    _tr_flush_block: M,
    _tr_tally: (e, t, n) => (e.pending_buf[e.sym_buf + e.sym_next++] = t, e.pending_buf[e.sym_buf + e.sym_next++] = t >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = n, 0 === t ? e.dyn_ltree[2 * n]++ : (e.matches++, t--, e.dyn_ltree[2 * (k[n] + d + 1)]++, e.dyn_dtree[2 * S(t)]++), e.sym_next === e.sym_end),
    _tr_align: e => {
        R(e, 2, 3), D(e, 256, b), (e => {
            16 === e.bi_valid ? (I(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8)
        })(e)
    }
};
var X = (e, t, n, i) => {
    let r = 65535 & e, a = e >>> 16 & 65535, s = 0;
    for (; 0 !== n;) {
        s = n > 2e3 ? 2e3 : n, n -= s;
        do {
            r = r + t[i++] | 0, a = a + r | 0
        } while (--s);
        r %= 65521, a %= 65521
    }
    return r | a << 16
};
const J = new Uint32Array((() => {
    let e, t = [];
    for (var n = 0; n < 256; n++) {
        e = n;
        for (var i = 0; i < 8; i++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
        t[n] = e
    }
    return t
})());
var G = (e, t, n, i) => {
    const r = J, a = i + n;
    e ^= -1;
    for (let n = i; n < a; n++) e = e >>> 8 ^ r[255 & (e ^ t[n])];
    return ~e
}, H = {
    2: "need dictionary",
    1: "stream end",
    0: "",
    "-1": "file error",
    "-2": "stream error",
    "-3": "data error",
    "-4": "insufficient memory",
    "-5": "buffer error",
    "-6": "incompatible version"
}, Y = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
};
const {_tr_init: q, _tr_stored_block: Q, _tr_flush_block: ee, _tr_tally: te, _tr_align: ne} = K, {
        Z_NO_FLUSH: ie,
        Z_PARTIAL_FLUSH: re,
        Z_FULL_FLUSH: ae,
        Z_FINISH: se,
        Z_BLOCK: oe,
        Z_OK: le,
        Z_STREAM_END: ce,
        Z_STREAM_ERROR: de,
        Z_DATA_ERROR: he,
        Z_BUF_ERROR: ue,
        Z_DEFAULT_COMPRESSION: fe,
        Z_FILTERED: pe,
        Z_HUFFMAN_ONLY: me,
        Z_RLE: ge,
        Z_FIXED: we,
        Z_DEFAULT_STRATEGY: be,
        Z_UNKNOWN: ye,
        Z_DEFLATED: _e
    } = Y, ke = 258, ve = 262, Te = 42, Ne = 113, Be = 666, xe = (e, t) => (e.msg = H[t], t),
    Ue = e => 2 * e - (e > 4 ? 9 : 0), Ee = e => {
        let t = e.length;
        for (; --t >= 0;) e[t] = 0
    }, Se = e => {
        let t, n, i, r = e.w_size;
        t = e.hash_size, i = t;
        do {
            n = e.head[--i], e.head[i] = n >= r ? n - r : 0
        } while (--t);
        t = r, i = t;
        do {
            n = e.prev[--i], e.prev[i] = n >= r ? n - r : 0
        } while (--t)
    };
let Ie = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask;
const Re = e => {
    const t = e.state;
    let n = t.pending;
    n > e.avail_out && (n = e.avail_out), 0 !== n && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, 0 === t.pending && (t.pending_out = 0))
}, De = (e, t) => {
    ee(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Re(e.strm)
}, Oe = (e, t) => {
    e.pending_buf[e.pending++] = t
}, $e = (e, t) => {
    e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t
}, Ae = (e, t, n, i) => {
    let r = e.avail_in;
    return r > i && (r = i), 0 === r ? 0 : (e.avail_in -= r, t.set(e.input.subarray(e.next_in, e.next_in + r), n), 1 === e.state.wrap ? e.adler = X(e.adler, t, r, n) : 2 === e.state.wrap && (e.adler = G(e.adler, t, r, n)), e.next_in += r, e.total_in += r, r)
}, Le = (e, t) => {
    let n, i, r = e.max_chain_length, a = e.strstart, s = e.prev_length, o = e.nice_match;
    const l = e.strstart > e.w_size - ve ? e.strstart - (e.w_size - ve) : 0, c = e.window, d = e.w_mask, h = e.prev,
        u = e.strstart + ke;
    let f = c[a + s - 1], p = c[a + s];
    e.prev_length >= e.good_match && (r >>= 2), o > e.lookahead && (o = e.lookahead);
    do {
        if (n = t, c[n + s] === p && c[n + s - 1] === f && c[n] === c[a] && c[++n] === c[a + 1]) {
            a += 2, n++;
            do {
            } while (c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && c[++a] === c[++n] && a < u);
            if (i = ke - (u - a), a = u - ke, i > s) {
                if (e.match_start = t, s = i, i >= o) break;
                f = c[a + s - 1], p = c[a + s]
            }
        }
    } while ((t = h[t & d]) > l && 0 != --r);
    return s <= e.lookahead ? s : e.lookahead
}, Fe = e => {
    const t = e.w_size;
    let n, i, r;
    do {
        if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - ve) && (e.window.set(e.window.subarray(t, t + t - i), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, e.insert > e.strstart && (e.insert = e.strstart), Se(e), i += t), 0 === e.strm.avail_in) break;
        if (n = Ae(e.strm, e.window, e.strstart + e.lookahead, i), e.lookahead += n, e.lookahead + e.insert >= 3) for (r = e.strstart - e.insert, e.ins_h = e.window[r], e.ins_h = Ie(e, e.ins_h, e.window[r + 1]); e.insert && (e.ins_h = Ie(e, e.ins_h, e.window[r + 3 - 1]), e.prev[r & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = r, r++, e.insert--, !(e.lookahead + e.insert < 3));) ;
    } while (e.lookahead < ve && 0 !== e.strm.avail_in)
}, je = (e, t) => {
    let n, i, r, a = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, s = 0, o = e.strm.avail_in;
    do {
        if (n = 65535, r = e.bi_valid + 42 >> 3, e.strm.avail_out < r) break;
        if (r = e.strm.avail_out - r, i = e.strstart - e.block_start, n > i + e.strm.avail_in && (n = i + e.strm.avail_in), n > r && (n = r), n < a && (0 === n && t !== se || t === ie || n !== i + e.strm.avail_in)) break;
        s = t === se && n === i + e.strm.avail_in ? 1 : 0, Q(e, 0, 0, s), e.pending_buf[e.pending - 4] = n, e.pending_buf[e.pending - 3] = n >> 8, e.pending_buf[e.pending - 2] = ~n, e.pending_buf[e.pending - 1] = ~n >> 8, Re(e.strm), i && (i > n && (i = n), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + i), e.strm.next_out), e.strm.next_out += i, e.strm.avail_out -= i, e.strm.total_out += i, e.block_start += i, n -= i), n && (Ae(e.strm, e.strm.output, e.strm.next_out, n), e.strm.next_out += n, e.strm.avail_out -= n, e.strm.total_out += n)
    } while (0 === s);
    return o -= e.strm.avail_in, o && (o >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= o && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - o, e.strm.next_in), e.strstart), e.strstart += o, e.insert += o > e.w_size - e.insert ? e.w_size - e.insert : o), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), s ? 4 : t !== ie && t !== se && 0 === e.strm.avail_in && e.strstart === e.block_start ? 2 : (r = e.window_size - e.strstart, e.strm.avail_in > r && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, r += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), r > e.strm.avail_in && (r = e.strm.avail_in), r && (Ae(e.strm, e.window, e.strstart, r), e.strstart += r, e.insert += r > e.w_size - e.insert ? e.w_size - e.insert : r), e.high_water < e.strstart && (e.high_water = e.strstart), r = e.bi_valid + 42 >> 3, r = e.pending_buf_size - r > 65535 ? 65535 : e.pending_buf_size - r, a = r > e.w_size ? e.w_size : r, i = e.strstart - e.block_start, (i >= a || (i || t === se) && t !== ie && 0 === e.strm.avail_in && i <= r) && (n = i > r ? r : i, s = t === se && 0 === e.strm.avail_in && n === i ? 1 : 0, Q(e, e.block_start, n, s), e.block_start += n, Re(e.strm)), s ? 3 : 1)
}, ze = (e, t) => {
    let n, i;
    for (; ;) {
        if (e.lookahead < ve) {
            if (Fe(e), e.lookahead < ve && t === ie) return 1;
            if (0 === e.lookahead) break
        }
        if (n = 0, e.lookahead >= 3 && (e.ins_h = Ie(e, e.ins_h, e.window[e.strstart + 3 - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== n && e.strstart - n <= e.w_size - ve && (e.match_length = Le(e, n)), e.match_length >= 3) if (i = te(e, e.strstart - e.match_start, e.match_length - 3), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= 3) {
            e.match_length--;
            do {
                e.strstart++, e.ins_h = Ie(e, e.ins_h, e.window[e.strstart + 3 - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart
            } while (0 != --e.match_length);
            e.strstart++
        } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = Ie(e, e.ins_h, e.window[e.strstart + 1]); else i = te(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
        if (i && (De(e, !1), 0 === e.strm.avail_out)) return 1
    }
    return e.insert = e.strstart < 2 ? e.strstart : 2, t === se ? (De(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.sym_next && (De(e, !1), 0 === e.strm.avail_out) ? 1 : 2
}, Ce = (e, t) => {
    let n, i, r;
    for (; ;) {
        if (e.lookahead < ve) {
            if (Fe(e), e.lookahead < ve && t === ie) return 1;
            if (0 === e.lookahead) break
        }
        if (n = 0, e.lookahead >= 3 && (e.ins_h = Ie(e, e.ins_h, e.window[e.strstart + 3 - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, 0 !== n && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - ve && (e.match_length = Le(e, n), e.match_length <= 5 && (e.strategy === pe || 3 === e.match_length && e.strstart - e.match_start > 4096) && (e.match_length = 2)), e.prev_length >= 3 && e.match_length <= e.prev_length) {
            r = e.strstart + e.lookahead - 3, i = te(e, e.strstart - 1 - e.prev_match, e.prev_length - 3), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
            do {
                ++e.strstart <= r && (e.ins_h = Ie(e, e.ins_h, e.window[e.strstart + 3 - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart)
            } while (0 != --e.prev_length);
            if (e.match_available = 0, e.match_length = 2, e.strstart++, i && (De(e, !1), 0 === e.strm.avail_out)) return 1
        } else if (e.match_available) {
            if (i = te(e, 0, e.window[e.strstart - 1]), i && De(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return 1
        } else e.match_available = 1, e.strstart++, e.lookahead--
    }
    return e.match_available && (i = te(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < 2 ? e.strstart : 2, t === se ? (De(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.sym_next && (De(e, !1), 0 === e.strm.avail_out) ? 1 : 2
};

function We(e, t, n, i, r) {
    this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = i, this.func = r
}

const Ve = [new We(0, 0, 0, 0, je), new We(4, 4, 8, 4, ze), new We(4, 5, 16, 8, ze), new We(4, 6, 32, 32, ze), new We(4, 4, 16, 16, Ce), new We(8, 16, 32, 32, Ce), new We(8, 16, 128, 128, Ce), new We(8, 32, 128, 256, Ce), new We(32, 128, 258, 1024, Ce), new We(32, 258, 258, 4096, Ce)];

function Pe() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = _e, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), Ee(this.dyn_ltree), Ee(this.dyn_dtree), Ee(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), Ee(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), Ee(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
}

const Ze = e => {
    if (!e) return 1;
    const t = e.state;
    return !t || t.strm !== e || t.status !== Te && 57 !== t.status && 69 !== t.status && 73 !== t.status && 91 !== t.status && 103 !== t.status && t.status !== Ne && t.status !== Be ? 1 : 0
}, Me = e => {
    if (Ze(e)) return xe(e, de);
    e.total_in = e.total_out = 0, e.data_type = ye;
    const t = e.state;
    return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = 2 === t.wrap ? 57 : t.wrap ? Te : Ne, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = -2, q(t), le
}, Ke = e => {
    const t = Me(e);
    var n;
    return t === le && ((n = e.state).window_size = 2 * n.w_size, Ee(n.head), n.max_lazy_match = Ve[n.level].max_lazy, n.good_match = Ve[n.level].good_length, n.nice_match = Ve[n.level].nice_length, n.max_chain_length = Ve[n.level].max_chain, n.strstart = 0, n.block_start = 0, n.lookahead = 0, n.insert = 0, n.match_length = n.prev_length = 2, n.match_available = 0, n.ins_h = 0), t
}, Xe = (e, t, n, i, r, a) => {
    if (!e) return de;
    let s = 1;
    if (t === fe && (t = 6), i < 0 ? (s = 0, i = -i) : i > 15 && (s = 2, i -= 16), r < 1 || r > 9 || n !== _e || i < 8 || i > 15 || t < 0 || t > 9 || a < 0 || a > we || 8 === i && 1 !== s) return xe(e, de);
    8 === i && (i = 9);
    const o = new Pe;
    return e.state = o, o.strm = e, o.status = Te, o.wrap = s, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = r + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3), o.window = new Uint8Array(2 * o.w_size), o.head = new Uint16Array(o.hash_size), o.prev = new Uint16Array(o.w_size), o.lit_bufsize = 1 << r + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new Uint8Array(o.pending_buf_size), o.sym_buf = o.lit_bufsize, o.sym_end = 3 * (o.lit_bufsize - 1), o.level = t, o.strategy = a, o.method = n, Ke(e)
};
var Je = {
    deflateInit: (e, t) => Xe(e, t, _e, 15, 8, be),
    deflateInit2: Xe,
    deflateReset: Ke,
    deflateResetKeep: Me,
    deflateSetHeader: (e, t) => Ze(e) || 2 !== e.state.wrap ? de : (e.state.gzhead = t, le),
    deflate: (e, t) => {
        if (Ze(e) || t > oe || t < 0) return e ? xe(e, de) : de;
        const n = e.state;
        if (!e.output || 0 !== e.avail_in && !e.input || n.status === Be && t !== se) return xe(e, 0 === e.avail_out ? ue : de);
        const i = n.last_flush;
        if (n.last_flush = t, 0 !== n.pending) {
            if (Re(e), 0 === e.avail_out) return n.last_flush = -1, le
        } else if (0 === e.avail_in && Ue(t) <= Ue(i) && t !== se) return xe(e, ue);
        if (n.status === Be && 0 !== e.avail_in) return xe(e, ue);
        if (n.status === Te && 0 === n.wrap && (n.status = Ne), n.status === Te) {
            let t = _e + (n.w_bits - 8 << 4) << 8, i = -1;
            if (i = n.strategy >= me || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3, t |= i << 6, 0 !== n.strstart && (t |= 32), t += 31 - t % 31, $e(n, t), 0 !== n.strstart && ($e(n, e.adler >>> 16), $e(n, 65535 & e.adler)), e.adler = 1, n.status = Ne, Re(e), 0 !== n.pending) return n.last_flush = -1, le
        }
        if (57 === n.status) if (e.adler = 0, Oe(n, 31), Oe(n, 139), Oe(n, 8), n.gzhead) Oe(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), Oe(n, 255 & n.gzhead.time), Oe(n, n.gzhead.time >> 8 & 255), Oe(n, n.gzhead.time >> 16 & 255), Oe(n, n.gzhead.time >> 24 & 255), Oe(n, 9 === n.level ? 2 : n.strategy >= me || n.level < 2 ? 4 : 0), Oe(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (Oe(n, 255 & n.gzhead.extra.length), Oe(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = G(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69; else if (Oe(n, 0), Oe(n, 0), Oe(n, 0), Oe(n, 0), Oe(n, 0), Oe(n, 9 === n.level ? 2 : n.strategy >= me || n.level < 2 ? 4 : 0), Oe(n, 3), n.status = Ne, Re(e), 0 !== n.pending) return n.last_flush = -1, le;
        if (69 === n.status) {
            if (n.gzhead.extra) {
                let t = n.pending, i = (65535 & n.gzhead.extra.length) - n.gzindex;
                for (; n.pending + i > n.pending_buf_size;) {
                    let r = n.pending_buf_size - n.pending;
                    if (n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex, n.gzindex + r), n.pending), n.pending = n.pending_buf_size, n.gzhead.hcrc && n.pending > t && (e.adler = G(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex += r, Re(e), 0 !== n.pending) return n.last_flush = -1, le;
                    t = 0, i -= r
                }
                let r = new Uint8Array(n.gzhead.extra);
                n.pending_buf.set(r.subarray(n.gzindex, n.gzindex + i), n.pending), n.pending += i, n.gzhead.hcrc && n.pending > t && (e.adler = G(e.adler, n.pending_buf, n.pending - t, t)), n.gzindex = 0
            }
            n.status = 73
        }
        if (73 === n.status) {
            if (n.gzhead.name) {
                let t, i = n.pending;
                do {
                    if (n.pending === n.pending_buf_size) {
                        if (n.gzhead.hcrc && n.pending > i && (e.adler = G(e.adler, n.pending_buf, n.pending - i, i)), Re(e), 0 !== n.pending) return n.last_flush = -1, le;
                        i = 0
                    }
                    t = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, Oe(n, t)
                } while (0 !== t);
                n.gzhead.hcrc && n.pending > i && (e.adler = G(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex = 0
            }
            n.status = 91
        }
        if (91 === n.status) {
            if (n.gzhead.comment) {
                let t, i = n.pending;
                do {
                    if (n.pending === n.pending_buf_size) {
                        if (n.gzhead.hcrc && n.pending > i && (e.adler = G(e.adler, n.pending_buf, n.pending - i, i)), Re(e), 0 !== n.pending) return n.last_flush = -1, le;
                        i = 0
                    }
                    t = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, Oe(n, t)
                } while (0 !== t);
                n.gzhead.hcrc && n.pending > i && (e.adler = G(e.adler, n.pending_buf, n.pending - i, i))
            }
            n.status = 103
        }
        if (103 === n.status) {
            if (n.gzhead.hcrc) {
                if (n.pending + 2 > n.pending_buf_size && (Re(e), 0 !== n.pending)) return n.last_flush = -1, le;
                Oe(n, 255 & e.adler), Oe(n, e.adler >> 8 & 255), e.adler = 0
            }
            if (n.status = Ne, Re(e), 0 !== n.pending) return n.last_flush = -1, le
        }
        if (0 !== e.avail_in || 0 !== n.lookahead || t !== ie && n.status !== Be) {
            let i = 0 === n.level ? je(n, t) : n.strategy === me ? ((e, t) => {
                let n;
                for (; ;) {
                    if (0 === e.lookahead && (Fe(e), 0 === e.lookahead)) {
                        if (t === ie) return 1;
                        break
                    }
                    if (e.match_length = 0, n = te(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (De(e, !1), 0 === e.strm.avail_out)) return 1
                }
                return e.insert = 0, t === se ? (De(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.sym_next && (De(e, !1), 0 === e.strm.avail_out) ? 1 : 2
            })(n, t) : n.strategy === ge ? ((e, t) => {
                let n, i, r, a;
                const s = e.window;
                for (; ;) {
                    if (e.lookahead <= ke) {
                        if (Fe(e), e.lookahead <= ke && t === ie) return 1;
                        if (0 === e.lookahead) break
                    }
                    if (e.match_length = 0, e.lookahead >= 3 && e.strstart > 0 && (r = e.strstart - 1, i = s[r], i === s[++r] && i === s[++r] && i === s[++r])) {
                        a = e.strstart + ke;
                        do {
                        } while (i === s[++r] && i === s[++r] && i === s[++r] && i === s[++r] && i === s[++r] && i === s[++r] && i === s[++r] && i === s[++r] && r < a);
                        e.match_length = ke - (a - r), e.match_length > e.lookahead && (e.match_length = e.lookahead)
                    }
                    if (e.match_length >= 3 ? (n = te(e, 1, e.match_length - 3), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = te(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (De(e, !1), 0 === e.strm.avail_out)) return 1
                }
                return e.insert = 0, t === se ? (De(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.sym_next && (De(e, !1), 0 === e.strm.avail_out) ? 1 : 2
            })(n, t) : Ve[n.level].func(n, t);
            if (3 !== i && 4 !== i || (n.status = Be), 1 === i || 3 === i) return 0 === e.avail_out && (n.last_flush = -1), le;
            if (2 === i && (t === re ? ne(n) : t !== oe && (Q(n, 0, 0, !1), t === ae && (Ee(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), Re(e), 0 === e.avail_out)) return n.last_flush = -1, le
        }
        return t !== se ? le : n.wrap <= 0 ? ce : (2 === n.wrap ? (Oe(n, 255 & e.adler), Oe(n, e.adler >> 8 & 255), Oe(n, e.adler >> 16 & 255), Oe(n, e.adler >> 24 & 255), Oe(n, 255 & e.total_in), Oe(n, e.total_in >> 8 & 255), Oe(n, e.total_in >> 16 & 255), Oe(n, e.total_in >> 24 & 255)) : ($e(n, e.adler >>> 16), $e(n, 65535 & e.adler)), Re(e), n.wrap > 0 && (n.wrap = -n.wrap), 0 !== n.pending ? le : ce)
    },
    deflateEnd: e => {
        if (Ze(e)) return de;
        const t = e.state.status;
        return e.state = null, t === Ne ? xe(e, he) : le
    },
    deflateSetDictionary: (e, t) => {
        let n = t.length;
        if (Ze(e)) return de;
        const i = e.state, r = i.wrap;
        if (2 === r || 1 === r && i.status !== Te || i.lookahead) return de;
        if (1 === r && (e.adler = X(e.adler, t, n, 0)), i.wrap = 0, n >= i.w_size) {
            0 === r && (Ee(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
            let e = new Uint8Array(i.w_size);
            e.set(t.subarray(n - i.w_size, n), 0), t = e, n = i.w_size
        }
        const a = e.avail_in, s = e.next_in, o = e.input;
        for (e.avail_in = n, e.next_in = 0, e.input = t, Fe(i); i.lookahead >= 3;) {
            let e = i.strstart, t = i.lookahead - 2;
            do {
                i.ins_h = Ie(i, i.ins_h, i.window[e + 3 - 1]), i.prev[e & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = e, e++
            } while (--t);
            i.strstart = e, i.lookahead = 2, Fe(i)
        }
        return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = 2, i.match_available = 0, e.next_in = s, e.input = o, e.avail_in = a, i.wrap = r, le
    },
    deflateInfo: "pako deflate (from Nodeca project)"
};
const Ge = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
var He = {
    assign: function (e) {
        const t = Array.prototype.slice.call(arguments, 1);
        for (; t.length;) {
            const n = t.shift();
            if (n) {
                if ("object" != typeof n) throw new TypeError(n + "must be non-object");
                for (const t in n) Ge(n, t) && (e[t] = n[t])
            }
        }
        return e
    }, flattenChunks: e => {
        let t = 0;
        for (let n = 0, i = e.length; n < i; n++) t += e[n].length;
        const n = new Uint8Array(t);
        for (let t = 0, i = 0, r = e.length; t < r; t++) {
            let r = e[t];
            n.set(r, i), i += r.length
        }
        return n
    }
};
let Ye = !0;
try {
    String.fromCharCode.apply(null, new Uint8Array(1))
} catch (e) {
    Ye = !1
}
const qe = new Uint8Array(256);
for (let e = 0; e < 256; e++) qe[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
qe[254] = qe[254] = 1;
var Qe = {
    string2buf: e => {
        if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return (new TextEncoder).encode(e);
        let t, n, i, r, a, s = e.length, o = 0;
        for (r = 0; r < s; r++) n = e.charCodeAt(r), 55296 == (64512 & n) && r + 1 < s && (i = e.charCodeAt(r + 1), 56320 == (64512 & i) && (n = 65536 + (n - 55296 << 10) + (i - 56320), r++)), o += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
        for (t = new Uint8Array(o), a = 0, r = 0; a < o; r++) n = e.charCodeAt(r), 55296 == (64512 & n) && r + 1 < s && (i = e.charCodeAt(r + 1), 56320 == (64512 & i) && (n = 65536 + (n - 55296 << 10) + (i - 56320), r++)), n < 128 ? t[a++] = n : n < 2048 ? (t[a++] = 192 | n >>> 6, t[a++] = 128 | 63 & n) : n < 65536 ? (t[a++] = 224 | n >>> 12, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | 63 & n) : (t[a++] = 240 | n >>> 18, t[a++] = 128 | n >>> 12 & 63, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | 63 & n);
        return t
    }, buf2string: (e, t) => {
        const n = t || e.length;
        if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return (new TextDecoder).decode(e.subarray(0, t));
        let i, r;
        const a = new Array(2 * n);
        for (r = 0, i = 0; i < n;) {
            let t = e[i++];
            if (t < 128) {
                a[r++] = t;
                continue
            }
            let s = qe[t];
            if (s > 4) a[r++] = 65533, i += s - 1; else {
                for (t &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && i < n;) t = t << 6 | 63 & e[i++], s--;
                s > 1 ? a[r++] = 65533 : t < 65536 ? a[r++] = t : (t -= 65536, a[r++] = 55296 | t >> 10 & 1023, a[r++] = 56320 | 1023 & t)
            }
        }
        return ((e, t) => {
            if (t < 65534 && e.subarray && Ye) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
            let n = "";
            for (let i = 0; i < t; i++) n += String.fromCharCode(e[i]);
            return n
        })(a, r)
    }, utf8border: (e, t) => {
        (t = t || e.length) > e.length && (t = e.length);
        let n = t - 1;
        for (; n >= 0 && 128 == (192 & e[n]);) n--;
        return n < 0 || 0 === n ? t : n + qe[e[n]] > t ? n : t
    }
};
var et = function () {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
};
const tt = Object.prototype.toString, {
    Z_NO_FLUSH: nt,
    Z_SYNC_FLUSH: it,
    Z_FULL_FLUSH: rt,
    Z_FINISH: at,
    Z_OK: st,
    Z_STREAM_END: ot,
    Z_DEFAULT_COMPRESSION: lt,
    Z_DEFAULT_STRATEGY: ct,
    Z_DEFLATED: dt
} = Y;

function ht(e) {
    this.options = He.assign({
        level: lt,
        method: dt,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: ct
    }, e || {});
    let t = this.options;
    t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new et, this.strm.avail_out = 0;
    let n = Je.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
    if (n !== st) throw new Error(H[n]);
    if (t.header && Je.deflateSetHeader(this.strm, t.header), t.dictionary) {
        let e;
        if (e = "string" == typeof t.dictionary ? Qe.string2buf(t.dictionary) : "[object ArrayBuffer]" === tt.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, n = Je.deflateSetDictionary(this.strm, e), n !== st) throw new Error(H[n]);
        this._dict_set = !0
    }
}

function ut(e, t) {
    const n = new ht(t);
    if (n.push(e, !0), n.err) throw n.msg || H[n.err];
    return n.result
}

ht.prototype.push = function (e, t) {
    const n = this.strm, i = this.options.chunkSize;
    let r, a;
    if (this.ended) return !1;
    for (a = t === ~~t ? t : !0 === t ? at : nt, "string" == typeof e ? n.input = Qe.string2buf(e) : "[object ArrayBuffer]" === tt.call(e) ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length; ;) if (0 === n.avail_out && (n.output = new Uint8Array(i), n.next_out = 0, n.avail_out = i), (a === it || a === rt) && n.avail_out <= 6) this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0; else {
        if (r = Je.deflate(n, a), r === ot) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), r = Je.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === st;
        if (0 !== n.avail_out) {
            if (a > 0 && n.next_out > 0) this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0; else if (0 === n.avail_in) break
        } else this.onData(n.output)
    }
    return !0
}, ht.prototype.onData = function (e) {
    this.chunks.push(e)
}, ht.prototype.onEnd = function (e) {
    e === st && (this.result = He.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
};
var ft = {
    Deflate: ht, deflate: ut, deflateRaw: function (e, t) {
        return (t = t || {}).raw = !0, ut(e, t)
    }, gzip: function (e, t) {
        return (t = t || {}).gzip = !0, ut(e, t)
    }, constants: Y
};
const pt = 16209;
var mt = function (e, t) {
    let n, i, r, a, s, o, l, c, d, h, u, f, p, m, g, w, b, y, _, k, v, T, N, B;
    const x = e.state;
    n = e.next_in, N = e.input, i = n + (e.avail_in - 5), r = e.next_out, B = e.output, a = r - (t - e.avail_out), s = r + (e.avail_out - 257), o = x.dmax, l = x.wsize, c = x.whave, d = x.wnext, h = x.window, u = x.hold, f = x.bits, p = x.lencode, m = x.distcode, g = (1 << x.lenbits) - 1, w = (1 << x.distbits) - 1;
    e:do {
        f < 15 && (u += N[n++] << f, f += 8, u += N[n++] << f, f += 8), b = p[u & g];
        t:for (; ;) {
            if (y = b >>> 24, u >>>= y, f -= y, y = b >>> 16 & 255, 0 === y) B[r++] = 65535 & b; else {
                if (!(16 & y)) {
                    if (64 & y) {
                        if (32 & y) {
                            x.mode = 16191;
                            break e
                        }
                        e.msg = "invalid literal/length code", x.mode = pt;
                        break e
                    }
                    b = p[(65535 & b) + (u & (1 << y) - 1)];
                    continue t
                }
                for (_ = 65535 & b, y &= 15, y && (f < y && (u += N[n++] << f, f += 8), _ += u & (1 << y) - 1, u >>>= y, f -= y), f < 15 && (u += N[n++] << f, f += 8, u += N[n++] << f, f += 8), b = m[u & w]; ;) {
                    if (y = b >>> 24, u >>>= y, f -= y, y = b >>> 16 & 255, 16 & y) {
                        if (k = 65535 & b, y &= 15, f < y && (u += N[n++] << f, f += 8, f < y && (u += N[n++] << f, f += 8)), k += u & (1 << y) - 1, k > o) {
                            e.msg = "invalid distance too far back", x.mode = pt;
                            break e
                        }
                        if (u >>>= y, f -= y, y = r - a, k > y) {
                            if (y = k - y, y > c && x.sane) {
                                e.msg = "invalid distance too far back", x.mode = pt;
                                break e
                            }
                            if (v = 0, T = h, 0 === d) {
                                if (v += l - y, y < _) {
                                    _ -= y;
                                    do {
                                        B[r++] = h[v++]
                                    } while (--y);
                                    v = r - k, T = B
                                }
                            } else if (d < y) {
                                if (v += l + d - y, y -= d, y < _) {
                                    _ -= y;
                                    do {
                                        B[r++] = h[v++]
                                    } while (--y);
                                    if (v = 0, d < _) {
                                        y = d, _ -= y;
                                        do {
                                            B[r++] = h[v++]
                                        } while (--y);
                                        v = r - k, T = B
                                    }
                                }
                            } else if (v += d - y, y < _) {
                                _ -= y;
                                do {
                                    B[r++] = h[v++]
                                } while (--y);
                                v = r - k, T = B
                            }
                            for (; _ > 2;) B[r++] = T[v++], B[r++] = T[v++], B[r++] = T[v++], _ -= 3;
                            _ && (B[r++] = T[v++], _ > 1 && (B[r++] = T[v++]))
                        } else {
                            v = r - k;
                            do {
                                B[r++] = B[v++], B[r++] = B[v++], B[r++] = B[v++], _ -= 3
                            } while (_ > 2);
                            _ && (B[r++] = B[v++], _ > 1 && (B[r++] = B[v++]))
                        }
                        break
                    }
                    if (64 & y) {
                        e.msg = "invalid distance code", x.mode = pt;
                        break e
                    }
                    b = m[(65535 & b) + (u & (1 << y) - 1)]
                }
            }
            break
        }
    } while (n < i && r < s);
    _ = f >> 3, n -= _, f -= _ << 3, u &= (1 << f) - 1, e.next_in = n, e.next_out = r, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = r < s ? s - r + 257 : 257 - (r - s), x.hold = u, x.bits = f
};
const gt = 15,
    wt = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
    bt = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]),
    yt = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]),
    _t = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
var kt = (e, t, n, i, r, a, s, o) => {
    const l = o.bits;
    let c, d, h, u, f, p, m = 0, g = 0, w = 0, b = 0, y = 0, _ = 0, k = 0, v = 0, T = 0, N = 0, B = null;
    const x = new Uint16Array(16), U = new Uint16Array(16);
    let E, S, I, R = null;
    for (m = 0; m <= gt; m++) x[m] = 0;
    for (g = 0; g < i; g++) x[t[n + g]]++;
    for (y = l, b = gt; b >= 1 && 0 === x[b]; b--) ;
    if (y > b && (y = b), 0 === b) return r[a++] = 20971520, r[a++] = 20971520, o.bits = 1, 0;
    for (w = 1; w < b && 0 === x[w]; w++) ;
    for (y < w && (y = w), v = 1, m = 1; m <= gt; m++) if (v <<= 1, v -= x[m], v < 0) return -1;
    if (v > 0 && (0 === e || 1 !== b)) return -1;
    for (U[1] = 0, m = 1; m < gt; m++) U[m + 1] = U[m] + x[m];
    for (g = 0; g < i; g++) 0 !== t[n + g] && (s[U[t[n + g]]++] = g);
    if (0 === e ? (B = R = s, p = 20) : 1 === e ? (B = wt, R = bt, p = 257) : (B = yt, R = _t, p = 0), N = 0, g = 0, m = w, f = a, _ = y, k = 0, h = -1, T = 1 << y, u = T - 1, 1 === e && T > 852 || 2 === e && T > 592) return 1;
    for (; ;) {
        E = m - k, s[g] + 1 < p ? (S = 0, I = s[g]) : s[g] >= p ? (S = R[s[g] - p], I = B[s[g] - p]) : (S = 96, I = 0), c = 1 << m - k, d = 1 << _, w = d;
        do {
            d -= c, r[f + (N >> k) + d] = E << 24 | S << 16 | I
        } while (0 !== d);
        for (c = 1 << m - 1; N & c;) c >>= 1;
        if (0 !== c ? (N &= c - 1, N += c) : N = 0, g++, 0 == --x[m]) {
            if (m === b) break;
            m = t[n + s[g]]
        }
        if (m > y && (N & u) !== h) {
            for (0 === k && (k = y), f += w, _ = m - k, v = 1 << _; _ + k < b && (v -= x[_ + k], !(v <= 0));) _++, v <<= 1;
            if (T += 1 << _, 1 === e && T > 852 || 2 === e && T > 592) return 1;
            h = N & u, r[h] = y << 24 | _ << 16 | f - a
        }
    }
    return 0 !== N && (r[f + N] = m - k << 24 | 64 << 16), o.bits = y, 0
};
const {
        Z_FINISH: vt,
        Z_BLOCK: Tt,
        Z_TREES: Nt,
        Z_OK: Bt,
        Z_STREAM_END: xt,
        Z_NEED_DICT: Ut,
        Z_STREAM_ERROR: Et,
        Z_DATA_ERROR: St,
        Z_MEM_ERROR: It,
        Z_BUF_ERROR: Rt,
        Z_DEFLATED: Dt
    } = Y, Ot = 16180, $t = 16190, At = 16191, Lt = 16192, Ft = 16194, jt = 16199, zt = 16200, Ct = 16206, Wt = 16209,
    Vt = e => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);

function Pt() {
    this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
}

const Zt = e => {
    if (!e) return 1;
    const t = e.state;
    return !t || t.strm !== e || t.mode < Ot || t.mode > 16211 ? 1 : 0
}, Mt = e => {
    if (Zt(e)) return Et;
    const t = e.state;
    return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = Ot, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(852), t.distcode = t.distdyn = new Int32Array(592), t.sane = 1, t.back = -1, Bt
}, Kt = e => {
    if (Zt(e)) return Et;
    const t = e.state;
    return t.wsize = 0, t.whave = 0, t.wnext = 0, Mt(e)
}, Xt = (e, t) => {
    let n;
    if (Zt(e)) return Et;
    const i = e.state;
    return t < 0 ? (n = 0, t = -t) : (n = 5 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? Et : (null !== i.window && i.wbits !== t && (i.window = null), i.wrap = n, i.wbits = t, Kt(e))
}, Jt = (e, t) => {
    if (!e) return Et;
    const n = new Pt;
    e.state = n, n.strm = e, n.window = null, n.mode = Ot;
    const i = Xt(e, t);
    return i !== Bt && (e.state = null), i
};
let Gt, Ht, Yt = !0;
const qt = e => {
    if (Yt) {
        Gt = new Int32Array(512), Ht = new Int32Array(32);
        let t = 0;
        for (; t < 144;) e.lens[t++] = 8;
        for (; t < 256;) e.lens[t++] = 9;
        for (; t < 280;) e.lens[t++] = 7;
        for (; t < 288;) e.lens[t++] = 8;
        for (kt(1, e.lens, 0, 288, Gt, 0, e.work, {bits: 9}), t = 0; t < 32;) e.lens[t++] = 5;
        kt(2, e.lens, 0, 32, Ht, 0, e.work, {bits: 5}), Yt = !1
    }
    e.lencode = Gt, e.lenbits = 9, e.distcode = Ht, e.distbits = 5
}, Qt = (e, t, n, i) => {
    let r;
    const a = e.state;
    return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), i >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (r = a.wsize - a.wnext, r > i && (r = i), a.window.set(t.subarray(n - i, n - i + r), a.wnext), (i -= r) ? (a.window.set(t.subarray(n - i, n), 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += r, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += r))), 0
};
var en = {
    inflateReset: Kt,
    inflateReset2: Xt,
    inflateResetKeep: Mt,
    inflateInit: e => Jt(e, 15),
    inflateInit2: Jt,
    inflate: (e, t) => {
        let n, i, r, a, s, o, l, c, d, h, u, f, p, m, g, w, b, y, _, k, v, T, N = 0;
        const B = new Uint8Array(4);
        let x, U;
        const E = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
        if (Zt(e) || !e.output || !e.input && 0 !== e.avail_in) return Et;
        n = e.state, n.mode === At && (n.mode = Lt), s = e.next_out, r = e.output, l = e.avail_out, a = e.next_in, i = e.input, o = e.avail_in, c = n.hold, d = n.bits, h = o, u = l, T = Bt;
        e:for (; ;) switch (n.mode) {
            case Ot:
                if (0 === n.wrap) {
                    n.mode = Lt;
                    break
                }
                for (; d < 16;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if (2 & n.wrap && 35615 === c) {
                    0 === n.wbits && (n.wbits = 15), n.check = 0, B[0] = 255 & c, B[1] = c >>> 8 & 255, n.check = G(n.check, B, 2, 0), c = 0, d = 0, n.mode = 16181;
                    break
                }
                if (n.head && (n.head.done = !1), !(1 & n.wrap) || (((255 & c) << 8) + (c >> 8)) % 31) {
                    e.msg = "incorrect header check", n.mode = Wt;
                    break
                }
                if ((15 & c) !== Dt) {
                    e.msg = "unknown compression method", n.mode = Wt;
                    break
                }
                if (c >>>= 4, d -= 4, v = 8 + (15 & c), 0 === n.wbits && (n.wbits = v), v > 15 || v > n.wbits) {
                    e.msg = "invalid window size", n.mode = Wt;
                    break
                }
                n.dmax = 1 << n.wbits, n.flags = 0, e.adler = n.check = 1, n.mode = 512 & c ? 16189 : At, c = 0, d = 0;
                break;
            case 16181:
                for (; d < 16;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if (n.flags = c, (255 & n.flags) !== Dt) {
                    e.msg = "unknown compression method", n.mode = Wt;
                    break
                }
                if (57344 & n.flags) {
                    e.msg = "unknown header flags set", n.mode = Wt;
                    break
                }
                n.head && (n.head.text = c >> 8 & 1), 512 & n.flags && 4 & n.wrap && (B[0] = 255 & c, B[1] = c >>> 8 & 255, n.check = G(n.check, B, 2, 0)), c = 0, d = 0, n.mode = 16182;
            case 16182:
                for (; d < 32;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                n.head && (n.head.time = c), 512 & n.flags && 4 & n.wrap && (B[0] = 255 & c, B[1] = c >>> 8 & 255, B[2] = c >>> 16 & 255, B[3] = c >>> 24 & 255, n.check = G(n.check, B, 4, 0)), c = 0, d = 0, n.mode = 16183;
            case 16183:
                for (; d < 16;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                n.head && (n.head.xflags = 255 & c, n.head.os = c >> 8), 512 & n.flags && 4 & n.wrap && (B[0] = 255 & c, B[1] = c >>> 8 & 255, n.check = G(n.check, B, 2, 0)), c = 0, d = 0, n.mode = 16184;
            case 16184:
                if (1024 & n.flags) {
                    for (; d < 16;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    n.length = c, n.head && (n.head.extra_len = c), 512 & n.flags && 4 & n.wrap && (B[0] = 255 & c, B[1] = c >>> 8 & 255, n.check = G(n.check, B, 2, 0)), c = 0, d = 0
                } else n.head && (n.head.extra = null);
                n.mode = 16185;
            case 16185:
                if (1024 & n.flags && (f = n.length, f > o && (f = o), f && (n.head && (v = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(i.subarray(a, a + f), v)), 512 & n.flags && 4 & n.wrap && (n.check = G(n.check, i, f, a)), o -= f, a += f, n.length -= f), n.length)) break e;
                n.length = 0, n.mode = 16186;
            case 16186:
                if (2048 & n.flags) {
                    if (0 === o) break e;
                    f = 0;
                    do {
                        v = i[a + f++], n.head && v && n.length < 65536 && (n.head.name += String.fromCharCode(v))
                    } while (v && f < o);
                    if (512 & n.flags && 4 & n.wrap && (n.check = G(n.check, i, f, a)), o -= f, a += f, v) break e
                } else n.head && (n.head.name = null);
                n.length = 0, n.mode = 16187;
            case 16187:
                if (4096 & n.flags) {
                    if (0 === o) break e;
                    f = 0;
                    do {
                        v = i[a + f++], n.head && v && n.length < 65536 && (n.head.comment += String.fromCharCode(v))
                    } while (v && f < o);
                    if (512 & n.flags && 4 & n.wrap && (n.check = G(n.check, i, f, a)), o -= f, a += f, v) break e
                } else n.head && (n.head.comment = null);
                n.mode = 16188;
            case 16188:
                if (512 & n.flags) {
                    for (; d < 16;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    if (4 & n.wrap && c !== (65535 & n.check)) {
                        e.msg = "header crc mismatch", n.mode = Wt;
                        break
                    }
                    c = 0, d = 0
                }
                n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = At;
                break;
            case 16189:
                for (; d < 32;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                e.adler = n.check = Vt(c), c = 0, d = 0, n.mode = $t;
            case $t:
                if (0 === n.havedict) return e.next_out = s, e.avail_out = l, e.next_in = a, e.avail_in = o, n.hold = c, n.bits = d, Ut;
                e.adler = n.check = 1, n.mode = At;
            case At:
                if (t === Tt || t === Nt) break e;
            case Lt:
                if (n.last) {
                    c >>>= 7 & d, d -= 7 & d, n.mode = Ct;
                    break
                }
                for (; d < 3;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                switch (n.last = 1 & c, c >>>= 1, d -= 1, 3 & c) {
                    case 0:
                        n.mode = 16193;
                        break;
                    case 1:
                        if (qt(n), n.mode = jt, t === Nt) {
                            c >>>= 2, d -= 2;
                            break e
                        }
                        break;
                    case 2:
                        n.mode = 16196;
                        break;
                    case 3:
                        e.msg = "invalid block type", n.mode = Wt
                }
                c >>>= 2, d -= 2;
                break;
            case 16193:
                for (c >>>= 7 & d, d -= 7 & d; d < 32;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if ((65535 & c) != (c >>> 16 ^ 65535)) {
                    e.msg = "invalid stored block lengths", n.mode = Wt;
                    break
                }
                if (n.length = 65535 & c, c = 0, d = 0, n.mode = Ft, t === Nt) break e;
            case Ft:
                n.mode = 16195;
            case 16195:
                if (f = n.length, f) {
                    if (f > o && (f = o), f > l && (f = l), 0 === f) break e;
                    r.set(i.subarray(a, a + f), s), o -= f, a += f, l -= f, s += f, n.length -= f;
                    break
                }
                n.mode = At;
                break;
            case 16196:
                for (; d < 14;) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if (n.nlen = 257 + (31 & c), c >>>= 5, d -= 5, n.ndist = 1 + (31 & c), c >>>= 5, d -= 5, n.ncode = 4 + (15 & c), c >>>= 4, d -= 4, n.nlen > 286 || n.ndist > 30) {
                    e.msg = "too many length or distance symbols", n.mode = Wt;
                    break
                }
                n.have = 0, n.mode = 16197;
            case 16197:
                for (; n.have < n.ncode;) {
                    for (; d < 3;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    n.lens[E[n.have++]] = 7 & c, c >>>= 3, d -= 3
                }
                for (; n.have < 19;) n.lens[E[n.have++]] = 0;
                if (n.lencode = n.lendyn, n.lenbits = 7, x = {bits: n.lenbits}, T = kt(0, n.lens, 0, 19, n.lencode, 0, n.work, x), n.lenbits = x.bits, T) {
                    e.msg = "invalid code lengths set", n.mode = Wt;
                    break
                }
                n.have = 0, n.mode = 16198;
            case 16198:
                for (; n.have < n.nlen + n.ndist;) {
                    for (; N = n.lencode[c & (1 << n.lenbits) - 1], g = N >>> 24, w = N >>> 16 & 255, b = 65535 & N, !(g <= d);) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    if (b < 16) c >>>= g, d -= g, n.lens[n.have++] = b; else {
                        if (16 === b) {
                            for (U = g + 2; d < U;) {
                                if (0 === o) break e;
                                o--, c += i[a++] << d, d += 8
                            }
                            if (c >>>= g, d -= g, 0 === n.have) {
                                e.msg = "invalid bit length repeat", n.mode = Wt;
                                break
                            }
                            v = n.lens[n.have - 1], f = 3 + (3 & c), c >>>= 2, d -= 2
                        } else if (17 === b) {
                            for (U = g + 3; d < U;) {
                                if (0 === o) break e;
                                o--, c += i[a++] << d, d += 8
                            }
                            c >>>= g, d -= g, v = 0, f = 3 + (7 & c), c >>>= 3, d -= 3
                        } else {
                            for (U = g + 7; d < U;) {
                                if (0 === o) break e;
                                o--, c += i[a++] << d, d += 8
                            }
                            c >>>= g, d -= g, v = 0, f = 11 + (127 & c), c >>>= 7, d -= 7
                        }
                        if (n.have + f > n.nlen + n.ndist) {
                            e.msg = "invalid bit length repeat", n.mode = Wt;
                            break
                        }
                        for (; f--;) n.lens[n.have++] = v
                    }
                }
                if (n.mode === Wt) break;
                if (0 === n.lens[256]) {
                    e.msg = "invalid code -- missing end-of-block", n.mode = Wt;
                    break
                }
                if (n.lenbits = 9, x = {bits: n.lenbits}, T = kt(1, n.lens, 0, n.nlen, n.lencode, 0, n.work, x), n.lenbits = x.bits, T) {
                    e.msg = "invalid literal/lengths set", n.mode = Wt;
                    break
                }
                if (n.distbits = 6, n.distcode = n.distdyn, x = {bits: n.distbits}, T = kt(2, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, x), n.distbits = x.bits, T) {
                    e.msg = "invalid distances set", n.mode = Wt;
                    break
                }
                if (n.mode = jt, t === Nt) break e;
            case jt:
                n.mode = zt;
            case zt:
                if (o >= 6 && l >= 258) {
                    e.next_out = s, e.avail_out = l, e.next_in = a, e.avail_in = o, n.hold = c, n.bits = d, mt(e, u), s = e.next_out, r = e.output, l = e.avail_out, a = e.next_in, i = e.input, o = e.avail_in, c = n.hold, d = n.bits, n.mode === At && (n.back = -1);
                    break
                }
                for (n.back = 0; N = n.lencode[c & (1 << n.lenbits) - 1], g = N >>> 24, w = N >>> 16 & 255, b = 65535 & N, !(g <= d);) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if (w && !(240 & w)) {
                    for (y = g, _ = w, k = b; N = n.lencode[k + ((c & (1 << y + _) - 1) >> y)], g = N >>> 24, w = N >>> 16 & 255, b = 65535 & N, !(y + g <= d);) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    c >>>= y, d -= y, n.back += y
                }
                if (c >>>= g, d -= g, n.back += g, n.length = b, 0 === w) {
                    n.mode = 16205;
                    break
                }
                if (32 & w) {
                    n.back = -1, n.mode = At;
                    break
                }
                if (64 & w) {
                    e.msg = "invalid literal/length code", n.mode = Wt;
                    break
                }
                n.extra = 15 & w, n.mode = 16201;
            case 16201:
                if (n.extra) {
                    for (U = n.extra; d < U;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    n.length += c & (1 << n.extra) - 1, c >>>= n.extra, d -= n.extra, n.back += n.extra
                }
                n.was = n.length, n.mode = 16202;
            case 16202:
                for (; N = n.distcode[c & (1 << n.distbits) - 1], g = N >>> 24, w = N >>> 16 & 255, b = 65535 & N, !(g <= d);) {
                    if (0 === o) break e;
                    o--, c += i[a++] << d, d += 8
                }
                if (!(240 & w)) {
                    for (y = g, _ = w, k = b; N = n.distcode[k + ((c & (1 << y + _) - 1) >> y)], g = N >>> 24, w = N >>> 16 & 255, b = 65535 & N, !(y + g <= d);) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    c >>>= y, d -= y, n.back += y
                }
                if (c >>>= g, d -= g, n.back += g, 64 & w) {
                    e.msg = "invalid distance code", n.mode = Wt;
                    break
                }
                n.offset = b, n.extra = 15 & w, n.mode = 16203;
            case 16203:
                if (n.extra) {
                    for (U = n.extra; d < U;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    n.offset += c & (1 << n.extra) - 1, c >>>= n.extra, d -= n.extra, n.back += n.extra
                }
                if (n.offset > n.dmax) {
                    e.msg = "invalid distance too far back", n.mode = Wt;
                    break
                }
                n.mode = 16204;
            case 16204:
                if (0 === l) break e;
                if (f = u - l, n.offset > f) {
                    if (f = n.offset - f, f > n.whave && n.sane) {
                        e.msg = "invalid distance too far back", n.mode = Wt;
                        break
                    }
                    f > n.wnext ? (f -= n.wnext, p = n.wsize - f) : p = n.wnext - f, f > n.length && (f = n.length), m = n.window
                } else m = r, p = s - n.offset, f = n.length;
                f > l && (f = l), l -= f, n.length -= f;
                do {
                    r[s++] = m[p++]
                } while (--f);
                0 === n.length && (n.mode = zt);
                break;
            case 16205:
                if (0 === l) break e;
                r[s++] = n.length, l--, n.mode = zt;
                break;
            case Ct:
                if (n.wrap) {
                    for (; d < 32;) {
                        if (0 === o) break e;
                        o--, c |= i[a++] << d, d += 8
                    }
                    if (u -= l, e.total_out += u, n.total += u, 4 & n.wrap && u && (e.adler = n.check = n.flags ? G(n.check, r, u, s - u) : X(n.check, r, u, s - u)), u = l, 4 & n.wrap && (n.flags ? c : Vt(c)) !== n.check) {
                        e.msg = "incorrect data check", n.mode = Wt;
                        break
                    }
                    c = 0, d = 0
                }
                n.mode = 16207;
            case 16207:
                if (n.wrap && n.flags) {
                    for (; d < 32;) {
                        if (0 === o) break e;
                        o--, c += i[a++] << d, d += 8
                    }
                    if (4 & n.wrap && c !== (4294967295 & n.total)) {
                        e.msg = "incorrect length check", n.mode = Wt;
                        break
                    }
                    c = 0, d = 0
                }
                n.mode = 16208;
            case 16208:
                T = xt;
                break e;
            case Wt:
                T = St;
                break e;
            case 16210:
                return It;
            default:
                return Et
        }
        return e.next_out = s, e.avail_out = l, e.next_in = a, e.avail_in = o, n.hold = c, n.bits = d, (n.wsize || u !== e.avail_out && n.mode < Wt && (n.mode < Ct || t !== vt)) && Qt(e, e.output, e.next_out, u - e.avail_out), h -= e.avail_in, u -= e.avail_out, e.total_in += h, e.total_out += u, n.total += u, 4 & n.wrap && u && (e.adler = n.check = n.flags ? G(n.check, r, u, e.next_out - u) : X(n.check, r, u, e.next_out - u)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === At ? 128 : 0) + (n.mode === jt || n.mode === Ft ? 256 : 0), (0 === h && 0 === u || t === vt) && T === Bt && (T = Rt), T
    },
    inflateEnd: e => {
        if (Zt(e)) return Et;
        let t = e.state;
        return t.window && (t.window = null), e.state = null, Bt
    },
    inflateGetHeader: (e, t) => {
        if (Zt(e)) return Et;
        const n = e.state;
        return 2 & n.wrap ? (n.head = t, t.done = !1, Bt) : Et
    },
    inflateSetDictionary: (e, t) => {
        const n = t.length;
        let i, r, a;
        return Zt(e) ? Et : (i = e.state, 0 !== i.wrap && i.mode !== $t ? Et : i.mode === $t && (r = 1, r = X(r, t, n, 0), r !== i.check) ? St : (a = Qt(e, t, n, n), a ? (i.mode = 16210, It) : (i.havedict = 1, Bt)))
    },
    inflateInfo: "pako inflate (from Nodeca project)"
};
var tn = function () {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
};
const nn = Object.prototype.toString, {
    Z_NO_FLUSH: rn,
    Z_FINISH: an,
    Z_OK: sn,
    Z_STREAM_END: on,
    Z_NEED_DICT: ln,
    Z_STREAM_ERROR: cn,
    Z_DATA_ERROR: dn,
    Z_MEM_ERROR: hn
} = Y;

function un(e) {
    this.options = He.assign({chunkSize: 65536, windowBits: 15, to: ""}, e || {});
    const t = this.options;
    t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (15 & t.windowBits || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new et, this.strm.avail_out = 0;
    let n = en.inflateInit2(this.strm, t.windowBits);
    if (n !== sn) throw new Error(H[n]);
    if (this.header = new tn, en.inflateGetHeader(this.strm, this.header), t.dictionary && ("string" == typeof t.dictionary ? t.dictionary = Qe.string2buf(t.dictionary) : "[object ArrayBuffer]" === nn.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = en.inflateSetDictionary(this.strm, t.dictionary), n !== sn))) throw new Error(H[n])
}

function fn(e, t) {
    const n = new un(t);
    if (n.push(e), n.err) throw n.msg || H[n.err];
    return n.result
}

un.prototype.push = function (e, t) {
    const n = this.strm, i = this.options.chunkSize, r = this.options.dictionary;
    let a, s, o;
    if (this.ended) return !1;
    for (s = t === ~~t ? t : !0 === t ? an : rn, "[object ArrayBuffer]" === nn.call(e) ? n.input = new Uint8Array(e) : n.input = e, n.next_in = 0, n.avail_in = n.input.length; ;) {
        for (0 === n.avail_out && (n.output = new Uint8Array(i), n.next_out = 0, n.avail_out = i), a = en.inflate(n, s), a === ln && r && (a = en.inflateSetDictionary(n, r), a === sn ? a = en.inflate(n, s) : a === dn && (a = ln)); n.avail_in > 0 && a === on && n.state.wrap > 0 && 0 !== e[n.next_in];) en.inflateReset(n), a = en.inflate(n, s);
        switch (a) {
            case cn:
            case dn:
            case ln:
            case hn:
                return this.onEnd(a), this.ended = !0, !1
        }
        if (o = n.avail_out, n.next_out && (0 === n.avail_out || a === on)) if ("string" === this.options.to) {
            let e = Qe.utf8border(n.output, n.next_out), t = n.next_out - e, r = Qe.buf2string(n.output, e);
            n.next_out = t, n.avail_out = i - t, t && n.output.set(n.output.subarray(e, e + t), 0), this.onData(r)
        } else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out));
        if (a !== sn || 0 !== o) {
            if (a === on) return a = en.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
            if (0 === n.avail_in) break
        }
    }
    return !0
}, un.prototype.onData = function (e) {
    this.chunks.push(e)
}, un.prototype.onEnd = function (e) {
    e === sn && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = He.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
};
var pn = {
    Inflate: un, inflate: fn, inflateRaw: function (e, t) {
        return (t = t || {}).raw = !0, fn(e, t)
    }, ungzip: fn, constants: Y
};
const {Deflate: mn, deflate: gn, deflateRaw: wn, gzip: bn} = ft, {
    Inflate: yn,
    inflate: _n,
    inflateRaw: kn,
    ungzip: vn
} = pn;
var Tn = {
    Deflate: mn,
    deflate: gn,
    deflateRaw: wn,
    gzip: bn,
    Inflate: yn,
    inflate: _n,
    inflateRaw: kn,
    ungzip: vn,
    constants: Y
};

function Nn(e) {
    let t = typeof e;
    if ("object" == t) {
        if (Array.isArray(e)) return "array";
        if (null === e) return "null"
    }
    return t
}

function Bn(e) {
    return null !== e && "object" == typeof e && !Array.isArray(e)
}

let xn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), Un = [];
for (let e = 0; e < xn.length; e++) Un[xn[e].charCodeAt(0)] = e;
var En, Sn;

function In() {
    let e = 0, t = 0;
    for (let n = 0; n < 28; n += 7) {
        let i = this.buf[this.pos++];
        if (e |= (127 & i) << n, !(128 & i)) return this.assertBounds(), [e, t]
    }
    let n = this.buf[this.pos++];
    if (e |= (15 & n) << 28, t = (112 & n) >> 4, !(128 & n)) return this.assertBounds(), [e, t];
    for (let n = 3; n <= 31; n += 7) {
        let i = this.buf[this.pos++];
        if (t |= (127 & i) << n, !(128 & i)) return this.assertBounds(), [e, t]
    }
    throw new Error("invalid varint")
}

function Rn(e, t, n) {
    for (let i = 0; i < 28; i += 7) {
        const r = e >>> i, a = !(r >>> 7 == 0 && 0 == t), s = 255 & (a ? 128 | r : r);
        if (n.push(s), !a) return
    }
    const i = e >>> 28 & 15 | (7 & t) << 4, r = !!(t >> 3);
    if (n.push(255 & (r ? 128 | i : i)), r) {
        for (let e = 3; e < 31; e += 7) {
            const i = t >>> e, r = !(i >>> 7 == 0), a = 255 & (r ? 128 | i : i);
            if (n.push(a), !r) return
        }
        n.push(t >>> 31 & 1)
    }
}

Un["-".charCodeAt(0)] = xn.indexOf("+"), Un["_".charCodeAt(0)] = xn.indexOf("/"), function (e) {
    e.symbol = Symbol.for("protobuf-ts/unknown"), e.onRead = (n, i, r, a, s) => {
        (t(i) ? i[e.symbol] : i[e.symbol] = []).push({no: r, wireType: a, data: s})
    }, e.onWrite = (t, n, i) => {
        for (let {no: t, wireType: r, data: a} of e.list(n)) i.tag(t, r).raw(a)
    }, e.list = (n, i) => {
        if (t(n)) {
            let t = n[e.symbol];
            return i ? t.filter((e => e.no == i)) : t
        }
        return []
    }, e.last = (t, n) => e.list(t, n).slice(-1)[0];
    const t = t => t && Array.isArray(t[e.symbol])
}(En || (En = {})), function (e) {
    e[e.Varint = 0] = "Varint", e[e.Bit64 = 1] = "Bit64", e[e.LengthDelimited = 2] = "LengthDelimited", e[e.StartGroup = 3] = "StartGroup", e[e.EndGroup = 4] = "EndGroup", e[e.Bit32 = 5] = "Bit32"
}(Sn || (Sn = {}));
const Dn = 4294967296;

function On(e) {
    let t = "-" == e[0];
    t && (e = e.slice(1));
    const n = 1e6;
    let i = 0, r = 0;

    function a(t, a) {
        const s = Number(e.slice(t, a));
        r *= n, i = i * n + s, i >= Dn && (r += i / Dn | 0, i %= Dn)
    }

    return a(-24, -18), a(-18, -12), a(-12, -6), a(-6), [t, i, r]
}

function $n(e, t) {
    if (t >>> 0 <= 2097151) return "" + (Dn * t + (e >>> 0));
    let n = (e >>> 24 | t << 8) >>> 0 & 16777215, i = t >> 16 & 65535, r = (16777215 & e) + 6777216 * n + 6710656 * i,
        a = n + 8147497 * i, s = 2 * i, o = 1e7;

    function l(e, t) {
        let n = e ? String(e) : "";
        return t ? "0000000".slice(n.length) + n : n
    }

    return r >= o && (a += Math.floor(r / o), r %= o), a >= o && (s += Math.floor(a / o), a %= o), l(s, 0) + l(a, s) + l(r, 1)
}

function An(e, t) {
    if (e >= 0) {
        for (; e > 127;) t.push(127 & e | 128), e >>>= 7;
        t.push(e)
    } else {
        for (let n = 0; n < 9; n++) t.push(127 & e | 128), e >>= 7;
        t.push(1)
    }
}

function Ln() {
    let e = this.buf[this.pos++], t = 127 & e;
    if (!(128 & e)) return this.assertBounds(), t;
    if (e = this.buf[this.pos++], t |= (127 & e) << 7, !(128 & e)) return this.assertBounds(), t;
    if (e = this.buf[this.pos++], t |= (127 & e) << 14, !(128 & e)) return this.assertBounds(), t;
    if (e = this.buf[this.pos++], t |= (127 & e) << 21, !(128 & e)) return this.assertBounds(), t;
    e = this.buf[this.pos++], t |= (15 & e) << 28;
    for (let t = 5; 128 & e && t < 10; t++) e = this.buf[this.pos++];
    if (128 & e) throw new Error("invalid varint");
    return this.assertBounds(), t >>> 0
}

let Fn;

function jn(e) {
    if (!e) throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")
}

!function () {
    const e = new DataView(new ArrayBuffer(8)),
        t = void 0 !== globalThis.BigInt && "function" == typeof e.getBigInt64 && "function" == typeof e.getBigUint64 && "function" == typeof e.setBigInt64 && "function" == typeof e.setBigUint64;
    Fn = t ? {
        MIN: BigInt("-9223372036854775808"),
        MAX: BigInt("9223372036854775807"),
        UMIN: BigInt("0"),
        UMAX: BigInt("18446744073709551615"),
        C: BigInt,
        V: e
    } : void 0
}();
const zn = /^-?[0-9]+$/, Cn = 4294967296, Wn = 2147483648;

class Vn {
    constructor(e, t) {
        this.lo = 0 | e, this.hi = 0 | t
    }

    isZero() {
        return 0 == this.lo && 0 == this.hi
    }

    toNumber() {
        let e = this.hi * Cn + (this.lo >>> 0);
        if (!Number.isSafeInteger(e)) throw new Error("cannot convert to safe number");
        return e
    }
}

class Pn extends Vn {
    static from(e) {
        if (Fn) switch (typeof e) {
            case"string":
                if ("0" == e) return this.ZERO;
                if ("" == e) throw new Error("string is no integer");
                e = Fn.C(e);
            case"number":
                if (0 === e) return this.ZERO;
                e = Fn.C(e);
            case"bigint":
                if (!e) return this.ZERO;
                if (e < Fn.UMIN) throw new Error("signed value for ulong");
                if (e > Fn.UMAX) throw new Error("ulong too large");
                return Fn.V.setBigUint64(0, e, !0), new Pn(Fn.V.getInt32(0, !0), Fn.V.getInt32(4, !0))
        } else switch (typeof e) {
            case"string":
                if ("0" == e) return this.ZERO;
                if (e = e.trim(), !zn.test(e)) throw new Error("string is no integer");
                let [t, n, i] = On(e);
                if (t) throw new Error("signed value for ulong");
                return new Pn(n, i);
            case"number":
                if (0 == e) return this.ZERO;
                if (!Number.isSafeInteger(e)) throw new Error("number is no integer");
                if (e < 0) throw new Error("signed value for ulong");
                return new Pn(e, e / Cn)
        }
        throw new Error("unknown value " + typeof e)
    }

    toString() {
        return Fn ? this.toBigInt().toString() : $n(this.lo, this.hi)
    }

    toBigInt() {
        return jn(Fn), Fn.V.setInt32(0, this.lo, !0), Fn.V.setInt32(4, this.hi, !0), Fn.V.getBigUint64(0, !0)
    }
}

Pn.ZERO = new Pn(0, 0);

class Zn extends Vn {
    static from(e) {
        if (Fn) switch (typeof e) {
            case"string":
                if ("0" == e) return this.ZERO;
                if ("" == e) throw new Error("string is no integer");
                e = Fn.C(e);
            case"number":
                if (0 === e) return this.ZERO;
                e = Fn.C(e);
            case"bigint":
                if (!e) return this.ZERO;
                if (e < Fn.MIN) throw new Error("signed long too small");
                if (e > Fn.MAX) throw new Error("signed long too large");
                return Fn.V.setBigInt64(0, e, !0), new Zn(Fn.V.getInt32(0, !0), Fn.V.getInt32(4, !0))
        } else switch (typeof e) {
            case"string":
                if ("0" == e) return this.ZERO;
                if (e = e.trim(), !zn.test(e)) throw new Error("string is no integer");
                let [t, n, i] = On(e);
                if (t) {
                    if (i > Wn || i == Wn && 0 != n) throw new Error("signed long too small")
                } else if (i >= Wn) throw new Error("signed long too large");
                let r = new Zn(n, i);
                return t ? r.negate() : r;
            case"number":
                if (0 == e) return this.ZERO;
                if (!Number.isSafeInteger(e)) throw new Error("number is no integer");
                return e > 0 ? new Zn(e, e / Cn) : new Zn(-e, -e / Cn).negate()
        }
        throw new Error("unknown value " + typeof e)
    }

    isNegative() {
        return !!(this.hi & Wn)
    }

    negate() {
        let e = ~this.hi, t = this.lo;
        return t ? t = 1 + ~t : e += 1, new Zn(t, e)
    }

    toString() {
        if (Fn) return this.toBigInt().toString();
        if (this.isNegative()) {
            let e = this.negate();
            return "-" + $n(e.lo, e.hi)
        }
        return $n(this.lo, this.hi)
    }

    toBigInt() {
        return jn(Fn), Fn.V.setInt32(0, this.lo, !0), Fn.V.setInt32(4, this.hi, !0), Fn.V.getBigInt64(0, !0)
    }
}

Zn.ZERO = new Zn(0, 0);
const Mn = {readUnknownField: !0, readerFactory: e => new Kn(e)};

class Kn {
    constructor(e, t) {
        this.varint64 = In, this.uint32 = Ln, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = null != t ? t : new TextDecoder("utf-8", {
            fatal: !0,
            ignoreBOM: !0
        })
    }

    tag() {
        let e = this.uint32(), t = e >>> 3, n = 7 & e;
        if (t <= 0 || n < 0 || n > 5) throw new Error("illegal tag: field no " + t + " wire type " + n);
        return [t, n]
    }

    skip(e) {
        let t = this.pos;
        switch (e) {
            case Sn.Varint:
                for (; 128 & this.buf[this.pos++];) ;
                break;
            case Sn.Bit64:
                this.pos += 4;
            case Sn.Bit32:
                this.pos += 4;
                break;
            case Sn.LengthDelimited:
                let t = this.uint32();
                this.pos += t;
                break;
            case Sn.StartGroup:
                let n;
                for (; (n = this.tag()[1]) !== Sn.EndGroup;) this.skip(n);
                break;
            default:
                throw new Error("cant skip wire type " + e)
        }
        return this.assertBounds(), this.buf.subarray(t, this.pos)
    }

    assertBounds() {
        if (this.pos > this.len) throw new RangeError("premature EOF")
    }

    int32() {
        return 0 | this.uint32()
    }

    sint32() {
        let e = this.uint32();
        return e >>> 1 ^ -(1 & e)
    }

    int64() {
        return new Zn(...this.varint64())
    }

    uint64() {
        return new Pn(...this.varint64())
    }

    sint64() {
        let [e, t] = this.varint64(), n = -(1 & e);
        return e = (e >>> 1 | (1 & t) << 31) ^ n, t = t >>> 1 ^ n, new Zn(e, t)
    }

    bool() {
        let [e, t] = this.varint64();
        return 0 !== e || 0 !== t
    }

    fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, !0)
    }

    sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, !0)
    }

    fixed64() {
        return new Pn(this.sfixed32(), this.sfixed32())
    }

    sfixed64() {
        return new Zn(this.sfixed32(), this.sfixed32())
    }

    float() {
        return this.view.getFloat32((this.pos += 4) - 4, !0)
    }

    double() {
        return this.view.getFloat64((this.pos += 8) - 8, !0)
    }

    bytes() {
        let e = this.uint32(), t = this.pos;
        return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e)
    }

    string() {
        return this.textDecoder.decode(this.bytes())
    }
}

function Xn(e, t) {
    if (!e) throw new Error(t)
}

function Jn(e) {
    if ("number" != typeof e) throw new Error("invalid int 32: " + typeof e);
    if (!Number.isInteger(e) || e > 2147483647 || e < -2147483648) throw new Error("invalid int 32: " + e)
}

function Gn(e) {
    if ("number" != typeof e) throw new Error("invalid uint 32: " + typeof e);
    if (!Number.isInteger(e) || e > 4294967295 || e < 0) throw new Error("invalid uint 32: " + e)
}

function Hn(e) {
    if ("number" != typeof e) throw new Error("invalid float 32: " + typeof e);
    if (Number.isFinite(e) && (e > 34028234663852886e22 || e < -34028234663852886e22)) throw new Error("invalid float 32: " + e)
}

const Yn = {writeUnknownFields: !0, writerFactory: () => new qn};

class qn {
    constructor(e) {
        this.stack = [], this.textEncoder = null != e ? e : new TextEncoder, this.chunks = [], this.buf = []
    }

    finish() {
        this.chunks.push(new Uint8Array(this.buf));
        let e = 0;
        for (let t = 0; t < this.chunks.length; t++) e += this.chunks[t].length;
        let t = new Uint8Array(e), n = 0;
        for (let e = 0; e < this.chunks.length; e++) t.set(this.chunks[e], n), n += this.chunks[e].length;
        return this.chunks = [], t
    }

    fork() {
        return this.stack.push({chunks: this.chunks, buf: this.buf}), this.chunks = [], this.buf = [], this
    }

    join() {
        let e = this.finish(), t = this.stack.pop();
        if (!t) throw new Error("invalid state, fork stack empty");
        return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e)
    }

    tag(e, t) {
        return this.uint32((e << 3 | t) >>> 0)
    }

    raw(e) {
        return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this
    }

    uint32(e) {
        for (Gn(e); e > 127;) this.buf.push(127 & e | 128), e >>>= 7;
        return this.buf.push(e), this
    }

    int32(e) {
        return Jn(e), An(e, this.buf), this
    }

    bool(e) {
        return this.buf.push(e ? 1 : 0), this
    }

    bytes(e) {
        return this.uint32(e.byteLength), this.raw(e)
    }

    string(e) {
        let t = this.textEncoder.encode(e);
        return this.uint32(t.byteLength), this.raw(t)
    }

    float(e) {
        Hn(e);
        let t = new Uint8Array(4);
        return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t)
    }

    double(e) {
        let t = new Uint8Array(8);
        return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t)
    }

    fixed32(e) {
        Gn(e);
        let t = new Uint8Array(4);
        return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t)
    }

    sfixed32(e) {
        Jn(e);
        let t = new Uint8Array(4);
        return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t)
    }

    sint32(e) {
        return Jn(e), An(e = (e << 1 ^ e >> 31) >>> 0, this.buf), this
    }

    sfixed64(e) {
        let t = new Uint8Array(8), n = new DataView(t.buffer), i = Zn.from(e);
        return n.setInt32(0, i.lo, !0), n.setInt32(4, i.hi, !0), this.raw(t)
    }

    fixed64(e) {
        let t = new Uint8Array(8), n = new DataView(t.buffer), i = Pn.from(e);
        return n.setInt32(0, i.lo, !0), n.setInt32(4, i.hi, !0), this.raw(t)
    }

    int64(e) {
        let t = Zn.from(e);
        return Rn(t.lo, t.hi, this.buf), this
    }

    sint64(e) {
        let t = Zn.from(e), n = t.hi >> 31;
        return Rn(t.lo << 1 ^ n, (t.hi << 1 | t.lo >>> 31) ^ n, this.buf), this
    }

    uint64(e) {
        let t = Pn.from(e);
        return Rn(t.lo, t.hi, this.buf), this
    }
}

const Qn = {emitDefaultValues: !1, enumAsInteger: !1, useProtoFieldName: !1, prettySpaces: 0},
    ei = {ignoreUnknownFields: !1};

function ti(e) {
    return e ? Object.assign(Object.assign({}, Qn), e) : Qn
}

const ni = Symbol.for("protobuf-ts/message-type");

function ii(e) {
    let t = !1;
    const n = [];
    for (let i = 0; i < e.length; i++) {
        let r = e.charAt(i);
        "_" == r ? t = !0 : /\d/.test(r) ? (n.push(r), t = !0) : t ? (n.push(r.toUpperCase()), t = !1) : 0 == i ? n.push(r.toLowerCase()) : n.push(r)
    }
    return n.join("")
}

var ri, ai, si;

function oi(e) {
    var t, n, i, r;
    return e.localName = null !== (t = e.localName) && void 0 !== t ? t : ii(e.name), e.jsonName = null !== (n = e.jsonName) && void 0 !== n ? n : ii(e.name), e.repeat = null !== (i = e.repeat) && void 0 !== i ? i : si.NO, e.opt = null !== (r = e.opt) && void 0 !== r ? r : !e.repeat && (!e.oneof && "message" == e.kind), e
}

function li(e) {
    if ("object" != typeof e || null === e || !e.hasOwnProperty("oneofKind")) return !1;
    switch (typeof e.oneofKind) {
        case"string":
            return void 0 !== e[e.oneofKind] && 2 == Object.keys(e).length;
        case"undefined":
            return 1 == Object.keys(e).length;
        default:
            return !1
    }
}

!function (e) {
    e[e.DOUBLE = 1] = "DOUBLE", e[e.FLOAT = 2] = "FLOAT", e[e.INT64 = 3] = "INT64", e[e.UINT64 = 4] = "UINT64", e[e.INT32 = 5] = "INT32", e[e.FIXED64 = 6] = "FIXED64", e[e.FIXED32 = 7] = "FIXED32", e[e.BOOL = 8] = "BOOL", e[e.STRING = 9] = "STRING", e[e.BYTES = 12] = "BYTES", e[e.UINT32 = 13] = "UINT32", e[e.SFIXED32 = 15] = "SFIXED32", e[e.SFIXED64 = 16] = "SFIXED64", e[e.SINT32 = 17] = "SINT32", e[e.SINT64 = 18] = "SINT64"
}(ri || (ri = {})), function (e) {
    e[e.BIGINT = 0] = "BIGINT", e[e.STRING = 1] = "STRING", e[e.NUMBER = 2] = "NUMBER"
}(ai || (ai = {})), function (e) {
    e[e.NO = 0] = "NO", e[e.PACKED = 1] = "PACKED", e[e.UNPACKED = 2] = "UNPACKED"
}(si || (si = {}));

class ci {
    constructor(e) {
        var t;
        this.fields = null !== (t = e.fields) && void 0 !== t ? t : []
    }

    prepare() {
        if (this.data) return;
        const e = [], t = [], n = [];
        for (let i of this.fields) if (i.oneof) n.includes(i.oneof) || (n.push(i.oneof), e.push(i.oneof), t.push(i.oneof)); else switch (t.push(i.localName), i.kind) {
            case"scalar":
            case"enum":
                i.opt && !i.repeat || e.push(i.localName);
                break;
            case"message":
                i.repeat && e.push(i.localName);
                break;
            case"map":
                e.push(i.localName)
        }
        this.data = {req: e, known: t, oneofs: Object.values(n)}
    }

    is(e, t, n = !1) {
        if (t < 0) return !0;
        if (null == e || "object" != typeof e) return !1;
        this.prepare();
        let i = Object.keys(e), r = this.data;
        if (i.length < r.req.length || r.req.some((e => !i.includes(e)))) return !1;
        if (!n && i.some((e => !r.known.includes(e)))) return !1;
        if (t < 1) return !0;
        for (const i of r.oneofs) {
            const r = e[i];
            if (!li(r)) return !1;
            if (void 0 === r.oneofKind) continue;
            const a = this.fields.find((e => e.localName === r.oneofKind));
            if (!a) return !1;
            if (!this.field(r[r.oneofKind], a, n, t)) return !1
        }
        for (const i of this.fields) if (void 0 === i.oneof && !this.field(e[i.localName], i, n, t)) return !1;
        return !0
    }

    field(e, t, n, i) {
        let r = t.repeat;
        switch (t.kind) {
            case"scalar":
                return void 0 === e ? t.opt : r ? this.scalars(e, t.T, i, t.L) : this.scalar(e, t.T, t.L);
            case"enum":
                return void 0 === e ? t.opt : r ? this.scalars(e, ri.INT32, i) : this.scalar(e, ri.INT32);
            case"message":
                return void 0 === e || (r ? this.messages(e, t.T(), n, i) : this.message(e, t.T(), n, i));
            case"map":
                if ("object" != typeof e || null === e) return !1;
                if (i < 2) return !0;
                if (!this.mapKeys(e, t.K, i)) return !1;
                switch (t.V.kind) {
                    case"scalar":
                        return this.scalars(Object.values(e), t.V.T, i, t.V.L);
                    case"enum":
                        return this.scalars(Object.values(e), ri.INT32, i);
                    case"message":
                        return this.messages(Object.values(e), t.V.T(), n, i)
                }
        }
        return !0
    }

    message(e, t, n, i) {
        return n ? t.isAssignable(e, i) : t.is(e, i)
    }

    messages(e, t, n, i) {
        if (!Array.isArray(e)) return !1;
        if (i < 2) return !0;
        if (n) {
            for (let n = 0; n < e.length && n < i; n++) if (!t.isAssignable(e[n], i - 1)) return !1
        } else for (let n = 0; n < e.length && n < i; n++) if (!t.is(e[n], i - 1)) return !1;
        return !0
    }

    scalar(e, t, n) {
        let i = typeof e;
        switch (t) {
            case ri.UINT64:
            case ri.FIXED64:
            case ri.INT64:
            case ri.SFIXED64:
            case ri.SINT64:
                switch (n) {
                    case ai.BIGINT:
                        return "bigint" == i;
                    case ai.NUMBER:
                        return "number" == i && !isNaN(e);
                    default:
                        return "string" == i
                }
            case ri.BOOL:
                return "boolean" == i;
            case ri.STRING:
                return "string" == i;
            case ri.BYTES:
                return e instanceof Uint8Array;
            case ri.DOUBLE:
            case ri.FLOAT:
                return "number" == i && !isNaN(e);
            default:
                return "number" == i && Number.isInteger(e)
        }
    }

    scalars(e, t, n, i) {
        if (!Array.isArray(e)) return !1;
        if (n < 2) return !0;
        if (Array.isArray(e)) for (let r = 0; r < e.length && r < n; r++) if (!this.scalar(e[r], t, i)) return !1;
        return !0
    }

    mapKeys(e, t, n) {
        let i = Object.keys(e);
        switch (t) {
            case ri.INT32:
            case ri.FIXED32:
            case ri.SFIXED32:
            case ri.SINT32:
            case ri.UINT32:
                return this.scalars(i.slice(0, n).map((e => parseInt(e))), t, n);
            case ri.BOOL:
                return this.scalars(i.slice(0, n).map((e => "true" == e || "false" != e && e)), t, n);
            default:
                return this.scalars(i, t, n, ai.STRING)
        }
    }
}

function di(e, t) {
    switch (t) {
        case ai.BIGINT:
            return e.toBigInt();
        case ai.NUMBER:
            return e.toNumber();
        default:
            return e.toString()
    }
}

class hi {
    constructor(e) {
        this.info = e
    }

    prepare() {
        var e;
        if (void 0 === this.fMap) {
            this.fMap = {};
            const t = null !== (e = this.info.fields) && void 0 !== e ? e : [];
            for (const e of t) this.fMap[e.name] = e, this.fMap[e.jsonName] = e, this.fMap[e.localName] = e
        }
    }

    assert(e, t, n) {
        if (!e) {
            let e = Nn(n);
            throw "number" != e && "boolean" != e || (e = n.toString()), new Error(`Cannot parse JSON ${e} for ${this.info.typeName}#${t}`)
        }
    }

    read(e, t, n) {
        this.prepare();
        const i = [];
        for (const [r, a] of Object.entries(e)) {
            const e = this.fMap[r];
            if (!e) {
                if (!n.ignoreUnknownFields) throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${r}`);
                continue
            }
            const s = e.localName;
            let o;
            if (e.oneof) {
                if (null === a && ("enum" !== e.kind || "google.protobuf.NullValue" !== e.T()[0])) continue;
                if (i.includes(e.oneof)) throw new Error(`Multiple members of the oneof group "${e.oneof}" of ${this.info.typeName} are present in JSON.`);
                i.push(e.oneof), o = t[e.oneof] = {oneofKind: s}
            } else o = t;
            if ("map" == e.kind) {
                if (null === a) continue;
                this.assert(Bn(a), e.name, a);
                const t = o[s];
                for (const [i, r] of Object.entries(a)) {
                    let a;
                    switch (this.assert(null !== r, e.name + " map value", null), e.V.kind) {
                        case"message":
                            a = e.V.T().internalJsonRead(r, n);
                            break;
                        case"enum":
                            if (a = this.enum(e.V.T(), r, e.name, n.ignoreUnknownFields), !1 === a) continue;
                            break;
                        case"scalar":
                            a = this.scalar(r, e.V.T, e.V.L, e.name)
                    }
                    this.assert(void 0 !== a, e.name + " map value", r);
                    let s = i;
                    e.K == ri.BOOL && (s = "true" == s || "false" != s && s), s = this.scalar(s, e.K, ai.STRING, e.name).toString(), t[s] = a
                }
            } else if (e.repeat) {
                if (null === a) continue;
                this.assert(Array.isArray(a), e.name, a);
                const t = o[s];
                for (const i of a) {
                    let r;
                    switch (this.assert(null !== i, e.name, null), e.kind) {
                        case"message":
                            r = e.T().internalJsonRead(i, n);
                            break;
                        case"enum":
                            if (r = this.enum(e.T(), i, e.name, n.ignoreUnknownFields), !1 === r) continue;
                            break;
                        case"scalar":
                            r = this.scalar(i, e.T, e.L, e.name)
                    }
                    this.assert(void 0 !== r, e.name, a), t.push(r)
                }
            } else switch (e.kind) {
                case"message":
                    if (null === a && "google.protobuf.Value" != e.T().typeName) {
                        this.assert(void 0 === e.oneof, e.name + " (oneof member)", null);
                        continue
                    }
                    o[s] = e.T().internalJsonRead(a, n, o[s]);
                    break;
                case"enum":
                    let t = this.enum(e.T(), a, e.name, n.ignoreUnknownFields);
                    if (!1 === t) continue;
                    o[s] = t;
                    break;
                case"scalar":
                    o[s] = this.scalar(a, e.T, e.L, e.name)
            }
        }
    }

    enum(e, t, n, i) {
        if ("google.protobuf.NullValue" == e[0] && Xn(null === t || "NULL_VALUE" === t, `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`), null === t) return 0;
        switch (typeof t) {
            case"number":
                return Xn(Number.isInteger(t), `Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`), t;
            case"string":
                let r = t;
                e[2] && t.substring(0, e[2].length) === e[2] && (r = t.substring(e[2].length));
                let a = e[1][r];
                return (void 0 !== a || !i) && (Xn("number" == typeof a, `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`), a)
        }
        Xn(!1, `Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`)
    }

    scalar(e, t, n, i) {
        let r;
        try {
            switch (t) {
                case ri.DOUBLE:
                case ri.FLOAT:
                    if (null === e) return 0;
                    if ("NaN" === e) return Number.NaN;
                    if ("Infinity" === e) return Number.POSITIVE_INFINITY;
                    if ("-Infinity" === e) return Number.NEGATIVE_INFINITY;
                    if ("" === e) {
                        r = "empty string";
                        break
                    }
                    if ("string" == typeof e && e.trim().length !== e.length) {
                        r = "extra whitespace";
                        break
                    }
                    if ("string" != typeof e && "number" != typeof e) break;
                    let i = Number(e);
                    if (Number.isNaN(i)) {
                        r = "not a number";
                        break
                    }
                    if (!Number.isFinite(i)) {
                        r = "too large or small";
                        break
                    }
                    return t == ri.FLOAT && Hn(i), i;
                case ri.INT32:
                case ri.FIXED32:
                case ri.SFIXED32:
                case ri.SINT32:
                case ri.UINT32:
                    if (null === e) return 0;
                    let a;
                    if ("number" == typeof e ? a = e : "" === e ? r = "empty string" : "string" == typeof e && (e.trim().length !== e.length ? r = "extra whitespace" : a = Number(e)), void 0 === a) break;
                    return t == ri.UINT32 ? Gn(a) : Jn(a), a;
                case ri.INT64:
                case ri.SFIXED64:
                case ri.SINT64:
                    if (null === e) return di(Zn.ZERO, n);
                    if ("number" != typeof e && "string" != typeof e) break;
                    return di(Zn.from(e), n);
                case ri.FIXED64:
                case ri.UINT64:
                    if (null === e) return di(Pn.ZERO, n);
                    if ("number" != typeof e && "string" != typeof e) break;
                    return di(Pn.from(e), n);
                case ri.BOOL:
                    if (null === e) return !1;
                    if ("boolean" != typeof e) break;
                    return e;
                case ri.STRING:
                    if (null === e) return "";
                    if ("string" != typeof e) {
                        r = "extra whitespace";
                        break
                    }
                    try {
                        encodeURIComponent(e)
                    } catch (r) {
                        r = "invalid UTF8";
                        break
                    }
                    return e;
                case ri.BYTES:
                    if (null === e || "" === e) return new Uint8Array(0);
                    if ("string" != typeof e) break;
                    return function (e) {
                        let t = 3 * e.length / 4;
                        "=" == e[e.length - 2] ? t -= 2 : "=" == e[e.length - 1] && (t -= 1);
                        let n, i = new Uint8Array(t), r = 0, a = 0, s = 0;
                        for (let t = 0; t < e.length; t++) {
                            if (n = Un[e.charCodeAt(t)], void 0 === n) switch (e[t]) {
                                case"=":
                                    a = 0;
                                case"\n":
                                case"\r":
                                case"\t":
                                case" ":
                                    continue;
                                default:
                                    throw Error("invalid base64 string.")
                            }
                            switch (a) {
                                case 0:
                                    s = n, a = 1;
                                    break;
                                case 1:
                                    i[r++] = s << 2 | (48 & n) >> 4, s = n, a = 2;
                                    break;
                                case 2:
                                    i[r++] = (15 & s) << 4 | (60 & n) >> 2, s = n, a = 3;
                                    break;
                                case 3:
                                    i[r++] = (3 & s) << 6 | n, a = 0
                            }
                        }
                        if (1 == a) throw Error("invalid base64 string.");
                        return i.subarray(0, r)
                    }(e)
            }
        } catch (e) {
            r = e.message
        }
        this.assert(!1, i + (r ? " - " + r : ""), e)
    }
}

class ui {
    constructor(e) {
        var t;
        this.fields = null !== (t = e.fields) && void 0 !== t ? t : []
    }

    write(e, t) {
        const n = {}, i = e;
        for (const e of this.fields) {
            if (!e.oneof) {
                let r = this.field(e, i[e.localName], t);
                void 0 !== r && (n[t.useProtoFieldName ? e.name : e.jsonName] = r);
                continue
            }
            const r = i[e.oneof];
            if (r.oneofKind !== e.localName) continue;
            const a = "scalar" == e.kind || "enum" == e.kind ? Object.assign(Object.assign({}, t), {emitDefaultValues: !0}) : t;
            let s = this.field(e, r[e.localName], a);
            Xn(void 0 !== s), n[t.useProtoFieldName ? e.name : e.jsonName] = s
        }
        return n
    }

    field(e, t, n) {
        let i;
        if ("map" == e.kind) {
            Xn("object" == typeof t && null !== t);
            const r = {};
            switch (e.V.kind) {
                case"scalar":
                    for (const [n, i] of Object.entries(t)) {
                        const t = this.scalar(e.V.T, i, e.name, !1, !0);
                        Xn(void 0 !== t), r[n.toString()] = t
                    }
                    break;
                case"message":
                    const i = e.V.T();
                    for (const [a, s] of Object.entries(t)) {
                        const t = this.message(i, s, e.name, n);
                        Xn(void 0 !== t), r[a.toString()] = t
                    }
                    break;
                case"enum":
                    const a = e.V.T();
                    for (const [i, s] of Object.entries(t)) {
                        Xn(void 0 === s || "number" == typeof s);
                        const t = this.enum(a, s, e.name, !1, !0, n.enumAsInteger);
                        Xn(void 0 !== t), r[i.toString()] = t
                    }
            }
            (n.emitDefaultValues || Object.keys(r).length > 0) && (i = r)
        } else if (e.repeat) {
            Xn(Array.isArray(t));
            const r = [];
            switch (e.kind) {
                case"scalar":
                    for (let n = 0; n < t.length; n++) {
                        const i = this.scalar(e.T, t[n], e.name, e.opt, !0);
                        Xn(void 0 !== i), r.push(i)
                    }
                    break;
                case"enum":
                    const i = e.T();
                    for (let a = 0; a < t.length; a++) {
                        Xn(void 0 === t[a] || "number" == typeof t[a]);
                        const s = this.enum(i, t[a], e.name, e.opt, !0, n.enumAsInteger);
                        Xn(void 0 !== s), r.push(s)
                    }
                    break;
                case"message":
                    const a = e.T();
                    for (let i = 0; i < t.length; i++) {
                        const s = this.message(a, t[i], e.name, n);
                        Xn(void 0 !== s), r.push(s)
                    }
            }
            (n.emitDefaultValues || r.length > 0 || n.emitDefaultValues) && (i = r)
        } else switch (e.kind) {
            case"scalar":
                i = this.scalar(e.T, t, e.name, e.opt, n.emitDefaultValues);
                break;
            case"enum":
                i = this.enum(e.T(), t, e.name, e.opt, n.emitDefaultValues, n.enumAsInteger);
                break;
            case"message":
                i = this.message(e.T(), t, e.name, n)
        }
        return i
    }

    enum(e, t, n, i, r, a) {
        if ("google.protobuf.NullValue" == e[0]) return r || i ? null : void 0;
        if (void 0 !== t) {
            if (0 !== t || r || i) return Xn("number" == typeof t), Xn(Number.isInteger(t)), a || !e[1].hasOwnProperty(t) ? t : e[2] ? e[2] + e[1][t] : e[1][t]
        } else Xn(i)
    }

    message(e, t, n, i) {
        return void 0 === t ? i.emitDefaultValues ? null : void 0 : e.internalJsonWrite(t, i)
    }

    scalar(e, t, n, i, r) {
        if (void 0 === t) return void Xn(i);
        const a = r || i;
        switch (e) {
            case ri.INT32:
            case ri.SFIXED32:
            case ri.SINT32:
                return 0 === t ? a ? 0 : void 0 : (Jn(t), t);
            case ri.FIXED32:
            case ri.UINT32:
                return 0 === t ? a ? 0 : void 0 : (Gn(t), t);
            case ri.FLOAT:
                Hn(t);
            case ri.DOUBLE:
                return 0 === t ? a ? 0 : void 0 : (Xn("number" == typeof t), Number.isNaN(t) ? "NaN" : t === Number.POSITIVE_INFINITY ? "Infinity" : t === Number.NEGATIVE_INFINITY ? "-Infinity" : t);
            case ri.STRING:
                return "" === t ? a ? "" : void 0 : (Xn("string" == typeof t), t);
            case ri.BOOL:
                return !1 === t ? !a && void 0 : (Xn("boolean" == typeof t), t);
            case ri.UINT64:
            case ri.FIXED64:
                Xn("number" == typeof t || "string" == typeof t || "bigint" == typeof t);
                let e = Pn.from(t);
                if (e.isZero() && !a) return;
                return e.toString();
            case ri.INT64:
            case ri.SFIXED64:
            case ri.SINT64:
                Xn("number" == typeof t || "string" == typeof t || "bigint" == typeof t);
                let n = Zn.from(t);
                if (n.isZero() && !a) return;
                return n.toString();
            case ri.BYTES:
                return Xn(t instanceof Uint8Array), t.byteLength ? function (e) {
                    let t, n = "", i = 0, r = 0;
                    for (let a = 0; a < e.length; a++) switch (t = e[a], i) {
                        case 0:
                            n += xn[t >> 2], r = (3 & t) << 4, i = 1;
                            break;
                        case 1:
                            n += xn[r | t >> 4], r = (15 & t) << 2, i = 2;
                            break;
                        case 2:
                            n += xn[r | t >> 6], n += xn[63 & t], i = 0
                    }
                    return i && (n += xn[r], n += "=", 1 == i && (n += "=")), n
                }(t) : a ? "" : void 0
        }
    }
}

function fi(e, t = ai.STRING) {
    switch (e) {
        case ri.BOOL:
            return !1;
        case ri.UINT64:
        case ri.FIXED64:
            return di(Pn.ZERO, t);
        case ri.INT64:
        case ri.SFIXED64:
        case ri.SINT64:
            return di(Zn.ZERO, t);
        case ri.DOUBLE:
        case ri.FLOAT:
            return 0;
        case ri.BYTES:
            return new Uint8Array(0);
        case ri.STRING:
            return "";
        default:
            return 0
    }
}

class pi {
    constructor(e) {
        this.info = e
    }

    prepare() {
        var e;
        if (!this.fieldNoToField) {
            const t = null !== (e = this.info.fields) && void 0 !== e ? e : [];
            this.fieldNoToField = new Map(t.map((e => [e.no, e])))
        }
    }

    read(e, t, n, i) {
        this.prepare();
        const r = void 0 === i ? e.len : e.pos + i;
        for (; e.pos < r;) {
            const [i, r] = e.tag(), a = this.fieldNoToField.get(i);
            if (!a) {
                let a = n.readUnknownField;
                if ("throw" == a) throw new Error(`Unknown field ${i} (wire type ${r}) for ${this.info.typeName}`);
                let s = e.skip(r);
                !1 !== a && (!0 === a ? En.onRead : a)(this.info.typeName, t, i, r, s);
                continue
            }
            let s = t, o = a.repeat, l = a.localName;
            switch (a.oneof && (s = s[a.oneof], s.oneofKind !== l && (s = t[a.oneof] = {oneofKind: l})), a.kind) {
                case"scalar":
                case"enum":
                    let t = "enum" == a.kind ? ri.INT32 : a.T, i = "scalar" == a.kind ? a.L : void 0;
                    if (o) {
                        let n = s[l];
                        if (r == Sn.LengthDelimited && t != ri.STRING && t != ri.BYTES) {
                            let r = e.uint32() + e.pos;
                            for (; e.pos < r;) n.push(this.scalar(e, t, i))
                        } else n.push(this.scalar(e, t, i))
                    } else s[l] = this.scalar(e, t, i);
                    break;
                case"message":
                    if (o) {
                        let t = s[l], i = a.T().internalBinaryRead(e, e.uint32(), n);
                        t.push(i)
                    } else s[l] = a.T().internalBinaryRead(e, e.uint32(), n, s[l]);
                    break;
                case"map":
                    let [c, d] = this.mapEntry(a, e, n);
                    s[l][c] = d
            }
        }
    }

    mapEntry(e, t, n) {
        let i, r, a = t.uint32(), s = t.pos + a;
        for (; t.pos < s;) {
            let [a, s] = t.tag();
            switch (a) {
                case 1:
                    i = e.K == ri.BOOL ? t.bool().toString() : this.scalar(t, e.K, ai.STRING);
                    break;
                case 2:
                    switch (e.V.kind) {
                        case"scalar":
                            r = this.scalar(t, e.V.T, e.V.L);
                            break;
                        case"enum":
                            r = t.int32();
                            break;
                        case"message":
                            r = e.V.T().internalBinaryRead(t, t.uint32(), n)
                    }
                    break;
                default:
                    throw new Error(`Unknown field ${a} (wire type ${s}) in map entry for ${this.info.typeName}#${e.name}`)
            }
        }
        if (void 0 === i) {
            let t = fi(e.K);
            i = e.K == ri.BOOL ? t.toString() : t
        }
        if (void 0 === r) switch (e.V.kind) {
            case"scalar":
                r = fi(e.V.T, e.V.L);
                break;
            case"enum":
                r = 0;
                break;
            case"message":
                r = e.V.T().create()
        }
        return [i, r]
    }

    scalar(e, t, n) {
        switch (t) {
            case ri.INT32:
                return e.int32();
            case ri.STRING:
                return e.string();
            case ri.BOOL:
                return e.bool();
            case ri.DOUBLE:
                return e.double();
            case ri.FLOAT:
                return e.float();
            case ri.INT64:
                return di(e.int64(), n);
            case ri.UINT64:
                return di(e.uint64(), n);
            case ri.FIXED64:
                return di(e.fixed64(), n);
            case ri.FIXED32:
                return e.fixed32();
            case ri.BYTES:
                return e.bytes();
            case ri.UINT32:
                return e.uint32();
            case ri.SFIXED32:
                return e.sfixed32();
            case ri.SFIXED64:
                return di(e.sfixed64(), n);
            case ri.SINT32:
                return e.sint32();
            case ri.SINT64:
                return di(e.sint64(), n)
        }
    }
}

class mi {
    constructor(e) {
        this.info = e
    }

    prepare() {
        if (!this.fields) {
            const e = this.info.fields ? this.info.fields.concat() : [];
            this.fields = e.sort(((e, t) => e.no - t.no))
        }
    }

    write(e, t, n) {
        this.prepare();
        for (const i of this.fields) {
            let r, a, s = i.repeat, o = i.localName;
            if (i.oneof) {
                const t = e[i.oneof];
                if (t.oneofKind !== o) continue;
                r = t[o], a = !0
            } else r = e[o], a = !1;
            switch (i.kind) {
                case"scalar":
                case"enum":
                    let e = "enum" == i.kind ? ri.INT32 : i.T;
                    if (s) if (Xn(Array.isArray(r)), s == si.PACKED) this.packed(t, e, i.no, r); else for (const n of r) this.scalar(t, e, i.no, n, !0); else void 0 === r ? Xn(i.opt) : this.scalar(t, e, i.no, r, a || i.opt);
                    break;
                case"message":
                    if (s) {
                        Xn(Array.isArray(r));
                        for (const e of r) this.message(t, n, i.T(), i.no, e)
                    } else this.message(t, n, i.T(), i.no, r);
                    break;
                case"map":
                    Xn("object" == typeof r && null !== r);
                    for (const [e, a] of Object.entries(r)) this.mapEntry(t, n, i, e, a)
            }
        }
        let i = n.writeUnknownFields;
        !1 !== i && (!0 === i ? En.onWrite : i)(this.info.typeName, e, t)
    }

    mapEntry(e, t, n, i, r) {
        e.tag(n.no, Sn.LengthDelimited), e.fork();
        let a = i;
        switch (n.K) {
            case ri.INT32:
            case ri.FIXED32:
            case ri.UINT32:
            case ri.SFIXED32:
            case ri.SINT32:
                a = Number.parseInt(i);
                break;
            case ri.BOOL:
                Xn("true" == i || "false" == i), a = "true" == i
        }
        switch (this.scalar(e, n.K, 1, a, !0), n.V.kind) {
            case"scalar":
                this.scalar(e, n.V.T, 2, r, !0);
                break;
            case"enum":
                this.scalar(e, ri.INT32, 2, r, !0);
                break;
            case"message":
                this.message(e, t, n.V.T(), 2, r)
        }
        e.join()
    }

    message(e, t, n, i, r) {
        void 0 !== r && (n.internalBinaryWrite(r, e.tag(i, Sn.LengthDelimited).fork(), t), e.join())
    }

    scalar(e, t, n, i, r) {
        let [a, s, o] = this.scalarInfo(t, i);
        o && !r || (e.tag(n, a), e[s](i))
    }

    packed(e, t, n, i) {
        if (!i.length) return;
        Xn(t !== ri.BYTES && t !== ri.STRING), e.tag(n, Sn.LengthDelimited), e.fork();
        let [, r] = this.scalarInfo(t);
        for (let t = 0; t < i.length; t++) e[r](i[t]);
        e.join()
    }

    scalarInfo(e, t) {
        let n, i = Sn.Varint, r = void 0 === t, a = 0 === t;
        switch (e) {
            case ri.INT32:
                n = "int32";
                break;
            case ri.STRING:
                a = r || !t.length, i = Sn.LengthDelimited, n = "string";
                break;
            case ri.BOOL:
                a = !1 === t, n = "bool";
                break;
            case ri.UINT32:
                n = "uint32";
                break;
            case ri.DOUBLE:
                i = Sn.Bit64, n = "double";
                break;
            case ri.FLOAT:
                i = Sn.Bit32, n = "float";
                break;
            case ri.INT64:
                a = r || Zn.from(t).isZero(), n = "int64";
                break;
            case ri.UINT64:
                a = r || Pn.from(t).isZero(), n = "uint64";
                break;
            case ri.FIXED64:
                a = r || Pn.from(t).isZero(), i = Sn.Bit64, n = "fixed64";
                break;
            case ri.BYTES:
                a = r || !t.byteLength, i = Sn.LengthDelimited, n = "bytes";
                break;
            case ri.FIXED32:
                i = Sn.Bit32, n = "fixed32";
                break;
            case ri.SFIXED32:
                i = Sn.Bit32, n = "sfixed32";
                break;
            case ri.SFIXED64:
                a = r || Zn.from(t).isZero(), i = Sn.Bit64, n = "sfixed64";
                break;
            case ri.SINT32:
                n = "sint32";
                break;
            case ri.SINT64:
                a = r || Zn.from(t).isZero(), n = "sint64"
        }
        return [i, n, r || a]
    }
}

function gi(e, t, n) {
    let i, r, a = n;
    for (let n of e.fields) {
        let e = n.localName;
        if (n.oneof) {
            const s = a[n.oneof];
            if (null == (null == s ? void 0 : s.oneofKind)) continue;
            if (i = s[e], r = t[n.oneof], r.oneofKind = s.oneofKind, null == i) {
                delete r[e];
                continue
            }
        } else if (i = a[e], r = t, null == i) continue;
        switch (n.repeat && (r[e].length = i.length), n.kind) {
            case"scalar":
            case"enum":
                if (n.repeat) for (let t = 0; t < i.length; t++) r[e][t] = i[t]; else r[e] = i;
                break;
            case"message":
                let t = n.T();
                if (n.repeat) for (let n = 0; n < i.length; n++) r[e][n] = t.create(i[n]); else void 0 === r[e] ? r[e] = t.create(i) : t.mergePartial(r[e], i);
                break;
            case"map":
                switch (n.V.kind) {
                    case"scalar":
                    case"enum":
                        Object.assign(r[e], i);
                        break;
                    case"message":
                        let t = n.V.T();
                        for (let n of Object.keys(i)) r[e][n] = t.create(i[n])
                }
        }
    }
}

const wi = Object.values;

function bi(e, t, n) {
    if (t === n) return !0;
    if (e !== ri.BYTES) return !1;
    let i = t, r = n;
    if (i.length !== r.length) return !1;
    for (let e = 0; e < i.length; e++) if (i[e] != r[e]) return !1;
    return !0
}

function yi(e, t, n) {
    if (t.length !== n.length) return !1;
    for (let i = 0; i < t.length; i++) if (!bi(e, t[i], n[i])) return !1;
    return !0
}

function _i(e, t, n) {
    if (t.length !== n.length) return !1;
    for (let i = 0; i < t.length; i++) if (!e.equals(t[i], n[i])) return !1;
    return !0
}

const ki = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));

class vi {
    constructor(e, t, n) {
        this.defaultCheckDepth = 16, this.typeName = e, this.fields = t.map(oi), this.options = null != n ? n : {}, this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, ki), {[ni]: {value: this}})), this.refTypeCheck = new ci(this), this.refJsonReader = new hi(this), this.refJsonWriter = new ui(this), this.refBinReader = new pi(this), this.refBinWriter = new mi(this)
    }

    create(e) {
        let t = function (e) {
            const t = e.messagePrototype ? Object.create(e.messagePrototype) : Object.defineProperty({}, ni, {value: e});
            for (let n of e.fields) {
                let e = n.localName;
                if (!n.opt) if (n.oneof) t[n.oneof] = {oneofKind: void 0}; else if (n.repeat) t[e] = []; else switch (n.kind) {
                    case"scalar":
                        t[e] = fi(n.T, n.L);
                        break;
                    case"enum":
                        t[e] = 0;
                        break;
                    case"map":
                        t[e] = {}
                }
            }
            return t
        }(this);
        return void 0 !== e && gi(this, t, e), t
    }

    clone(e) {
        let t = this.create();
        return gi(this, t, e), t
    }

    equals(e, t) {
        return function (e, t, n) {
            if (t === n) return !0;
            if (!t || !n) return !1;
            for (let i of e.fields) {
                let e = i.localName, r = i.oneof ? t[i.oneof][e] : t[e], a = i.oneof ? n[i.oneof][e] : n[e];
                switch (i.kind) {
                    case"enum":
                    case"scalar":
                        let e = "enum" == i.kind ? ri.INT32 : i.T;
                        if (!(i.repeat ? yi(e, r, a) : bi(e, r, a))) return !1;
                        break;
                    case"map":
                        if (!("message" == i.V.kind ? _i(i.V.T(), wi(r), wi(a)) : yi("enum" == i.V.kind ? ri.INT32 : i.V.T, wi(r), wi(a)))) return !1;
                        break;
                    case"message":
                        let t = i.T();
                        if (!(i.repeat ? _i(t, r, a) : t.equals(r, a))) return !1
                }
            }
            return !0
        }(this, e, t)
    }

    is(e, t = this.defaultCheckDepth) {
        return this.refTypeCheck.is(e, t, !1)
    }

    isAssignable(e, t = this.defaultCheckDepth) {
        return this.refTypeCheck.is(e, t, !0)
    }

    mergePartial(e, t) {
        gi(this, e, t)
    }

    fromBinary(e, t) {
        let n = function (e) {
            return e ? Object.assign(Object.assign({}, Mn), e) : Mn
        }(t);
        return this.internalBinaryRead(n.readerFactory(e), e.byteLength, n)
    }

    fromJson(e, t) {
        return this.internalJsonRead(e, function (e) {
            return e ? Object.assign(Object.assign({}, ei), e) : ei
        }(t))
    }

    fromJsonString(e, t) {
        let n = JSON.parse(e);
        return this.fromJson(n, t)
    }

    toJson(e, t) {
        return this.internalJsonWrite(e, ti(t))
    }

    toJsonString(e, t) {
        var n;
        let i = this.toJson(e, t);
        return JSON.stringify(i, null, null !== (n = null == t ? void 0 : t.prettySpaces) && void 0 !== n ? n : 0)
    }

    toBinary(e, t) {
        let n = function (e) {
            return e ? Object.assign(Object.assign({}, Yn), e) : Yn
        }(t);
        return this.internalBinaryWrite(e, n.writerFactory(), n).finish()
    }

    internalJsonRead(e, t, n) {
        if (null !== e && "object" == typeof e && !Array.isArray(e)) {
            let i = null != n ? n : this.create();
            return this.refJsonReader.read(e, i, t), i
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${Nn(e)}.`)
    }

    internalJsonWrite(e, t) {
        return this.refJsonWriter.write(e, t)
    }

    internalBinaryWrite(e, t, n) {
        return this.refBinWriter.write(e, t, n), t
    }

    internalBinaryRead(e, t, n, i) {
        let r = null != i ? i : this.create();
        return this.refBinReader.read(e, r, n, t), r
    }
}

const Ti = new n("📺 BiliBili: 🛡️ ADBlock v0.6.3(1007) response"), Ni = new URL($request.url);
Ti.log(`⚠ url: ${Ni.toJSON()}`, "");
const Bi = $request.method, xi = Ni.hostname, Ui = Ni.pathname, Ei = Ni.pathname.split("/").filter(Boolean);
Ti.log(`⚠ METHOD: ${Bi}, HOST: ${xi}, PATH: ${Ui}`, "");
const Si = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
Ti.log(`⚠ FORMAT: ${Si}`, ""), (async () => {
    const {Settings: e, Caches: n, Configs: i} = l("BiliBili", "ADBlock", o);
    switch (Ti.log(`⚠ Settings.Switch: ${e?.Switch}`, ""), e.Switch) {
        case!0:
        default:
            let a = {code: 0, message: "0", data: {}};
            switch (Si) {
                case void 0:
                case"application/x-www-form-urlencoded":
                case"text/plain":
                default:
                case"application/x-mpegURL":
                case"application/x-mpegurl":
                case"application/vnd.apple.mpegurl":
                case"audio/mpegurl":
                case"text/xml":
                case"text/html":
                case"text/plist":
                case"application/xml":
                case"application/plist":
                case"application/x-plist":
                case"text/vtt":
                case"application/vtt":
                    break;
                case"text/json":
                case"application/json":
                    switch (a = JSON.parse($response.body ?? "{}"), xi) {
                        case"www.bilibili.com":
                            break;
                        case"app.bilibili.com":
                        case"app.biliapi.net":
                            switch (Ui) {
                                case"/x/v2/splash/show":
                                case"/x/v2/splash/list":
                                case"/x/v2/splash/brand/list":
                                case"/x/v2/splash/event/list2":
                                    switch (e?.Detail?.splash) {
                                        case!0:
                                        default:
                                            Ti.log("🎉 开屏页广告去除");
                                            const c = ["account", "event_list", "preload", "show"];
                                            a.data && c.forEach((e => {
                                                delete a.data[e]
                                            }));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置开屏页广告不去除")
                                    }
                                    break;
                                case"/x/v2/feed/index":
                                    switch (e?.Detail?.feed) {
                                        case!0:
                                        default:

                                        async function d() {
                                            let e = t.getItem("@BiliBili.Index.Caches", ""), n = {};
                                            if (e && e.length > 0) n = e.pop(), Ti.log("🎉 推荐页空缺位填充成功"); else {
                                                const i = {url: $request.url, headers: $request.heders};
                                                await Ti.fetch(i).then((e => {
                                                    try {
                                                        const n = JSON.parse(e.body || "{}");
                                                        0 === n?.code && "0" === n?.message ? (n.data.items = n.data.items.map((e => {
                                                            const {card_type: t, card_goto: n, goto: i} = e;
                                                            if (t && n) {
                                                                if ("banner_v8" === t && "banner" === n) return;
                                                                if ("cm_v2" === t && ["ad_web_s", "ad_av", "ad_web_gif", "ad_player", "ad_inline_3d", "ad_inline_eggs", "ad_inline_live"].includes(n)) return;
                                                                if ("small_cover_v10" === t && "game" === n) return;
                                                                if ("cm_double_v9" === t && "ad_inline_av" === n) return;
                                                                if ("large_cover_v9" === t && "inline_av_v2" === n) return;
                                                                if ("vertical_av" === i) return
                                                            }
                                                            return e
                                                        })).filter((e => void 0 !== e)), t.setItem("@BiliBili.Index.Caches", n.data.items), Ti.log("🎉 推荐页缓存数组补充成功")) : Ti.log("🚧 访问推荐页尝试填补失败")
                                                    } catch (t) {
                                                        Ti.logErr(t, e)
                                                    }
                                                })), e = t.getItem("@BiliBili.Index.Caches", ""), e.length > 0 && (n = e.pop(), Ti.log("🎉 推荐页空缺位填充成功"))
                                            }
                                            return t.setItem("@BiliBili.Index.Caches", e), n
                                        }

                                            a.data.items?.length && (a.data.items = await Promise.all(a.data.items.map((async i => {
                                                const {card_type: r, card_goto: a, goto: s} = i;
                                                if (r && a) if (["banner_v8", "banner_ipad_v8"].includes(r) && "banner" === a) switch (e?.Detail?.activity) {
                                                    case!0:
                                                    default:
                                                        return n.banner_hash = i.hash, t.setItem("@BiliBili.ADBlock.Caches", n), void Ti.log("🎉 推荐页活动大图去除");
                                                    case!1:
                                                        i.banner_item && (i.banner_item = i.banner_item.filter((e => "ad" !== e.type || (Ti.log("🎉 推荐页大图广告去除"), !1))))
                                                } else if (["cm_v2", "cm_v1"].includes(r) && ["ad_web_s", "ad_av", "ad_web_gif"].includes(a)) {
                                                    if (Ti.log(`🎉 ${a}广告去除`), "phone" !== Ni.searchParams.get("device")) return;
                                                    await d().then((e => i = e))
                                                } else if ("live" === a && "small_cover_v9" === r) {
                                                    let t = e?.Detail?.blockUpLiveList;
                                                    "number" == typeof t && (t = t.toString()), t && t.includes(i?.args?.up_id?.toString()) && (Ti.log(`🎉 屏蔽Up主<${i?.args?.up_name}>直播推广`), await d().then((e => i = e)))
                                                } else {
                                                    if ("cm_v2" === r && ["ad_player", "ad_inline_3d", "ad_inline_eggs", "ad_inline_live"].includes(a)) return void Ti.log(`🎉 ${a}广告去除`);
                                                    if ("small_cover_v10" === r && "game" === a) {
                                                        if (Ti.log("🎉 游戏广告去除"), "phone" !== Ni.searchParams.get("device")) return;
                                                        await d().then((e => i = e))
                                                    } else {
                                                        if ("cm_double_v9" === r && "ad_inline_av" === a) return void Ti.log("🎉 大视频广告去除");
                                                        if ("vertical_av" === s) switch (e?.Detail?.vertical) {
                                                            case!0:
                                                            default:
                                                                Ti.log("🎉 竖屏视频去除"), await d().then((e => i = e));
                                                                break;
                                                            case!1:
                                                                Ti.log("🚧 用户设置推荐页竖屏视频不去除")
                                                        }
                                                    }
                                                }
                                                return i
                                            }))), a.data.items = a.data.items.filter((e => void 0 !== e)));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置推荐页广告不去除")
                                    }
                                    break;
                                case"/x/v2/feed/index/story":
                                    switch (e?.Detail?.story) {
                                        case!0:
                                        default:
                                            a.data?.items && (Ti.log("🎉 首页短视频流广告去除"), a.data.items = a.data.items.filter((e => !(e.hasOwnProperty("ad_info") || ["vertical_ad_av", "vertical_pgc"].includes(e.card_goto)))));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置首页短视频流广告不去除")
                                    }
                                    break;
                                case"/x/v2/search/square":
                                    switch (e?.Detail?.Hot_search) {
                                        case!0:
                                        default:
                                            Ti.log("🎉 搜索页热搜内容去除"), a.data = a.data.filter((e => !("trending" === e.type)));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置搜索页热搜内容不去除")
                                    }
                            }
                            break;
                        case"api.bilibili.com":
                        case"api.biliapi.net":
                            switch (Ui) {
                                case"/pgc/page/bangumi":
                                case"/pgc/page/cinema/tab":
                                    switch (e?.Detail?.cinema) {
                                        case!0:
                                        default:
                                            a.result?.modules && (Ti.log("🎉 观影页广告去除"), a.result.modules.forEach((e => {
                                                e.style.startsWith("banner") ? e.items = e.items.filter((e => e.link.includes("play"))) : e.style.startsWith("function") ? e.items = e.items.filter((e => e.blink.startsWith("bilibili"))) : ([241, 1283, 1284, 1441].includes(e.module_id) || e.style.startsWith("tip")) && (e.items = [])
                                            })));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置观影页广告不去除")
                                    }
                                    break;
                                case"/x/player/wbi/playurl":
                                    break;
                                case"/x/web-interface/wbi/index/top/feed/rcmd":
                                    switch (e?.Detail?.feed) {
                                        case!0:
                                        default:
                                            Ti.log("🎉 首页广告内容去除"), a.data.item = a.data.item.filter((e => !("ad" === e.goto)));
                                            break;
                                        case!1:
                                            Ti.log("🚧 用户设置首页广告不去除")
                                    }
                            }
                            break;
                        case"api.live.bilibili.com":
                            if ("/xlive/app-room/v1/index/getInfoByRoom" === Ui) switch (e?.Detail?.xlive) {
                                case!0:
                                default:
                                    Ti.log("🎉 直播banner广告去除"), delete a.data?.activity_banner_info, a.data?.shopping_info && (a.data.shopping_info = {is_show: 0}, Ti.log("🎉 直播购物广告去除")), a.data?.new_tab_info?.outer_list?.length > 0 && (a.data.new_tab_info.outer_list = a.data.new_tab_info.outer_list.filter((e => 33 !== e.biz_id)));
                                    break;
                                case!1:
                                    Ti.log("🚧 用户设置直播页广告不去除")
                            }
                    }
                    $response.body = JSON.stringify(a);
                    break;
                case"application/protobuf":
                case"application/x-protobuf":
                case"application/vnd.google.protobuf":
                case"application/grpc":
                case"application/grpc+proto":
                case"applecation/octet-stream":
                    let s = Ti.isQuanX() ? new Uint8Array($response.bodyBytes ?? []) : $response.body ?? new Uint8Array;
                    switch (Si) {
                        case"application/protobuf":
                        case"application/x-protobuf":
                        case"application/vnd.google.protobuf":
                            break;
                        case"application/grpc":
                        case"application/grpc+proto":
                            let h = s.slice(0, 5);
                            switch (a = s.slice(5), h?.[0]) {
                                case 0:
                                    break;
                                case 1:
                                    a = Tn.ungzip(a), h[0] = 0
                            }
                            switch (xi) {
                                case"grpc.biliapi.net":
                                case"app.bilibili.com":

                                class u extends vi {
                                    constructor() {
                                        super("google.protobuf.Any", [{
                                            no: 1,
                                            name: "type_url",
                                            kind: "scalar",
                                            T: 9
                                        }, {no: 2, name: "value", kind: "scalar", T: 12}])
                                    }

                                    pack(e, t) {
                                        return {typeUrl: this.typeNameToUrl(t.typeName), value: t.toBinary(e)}
                                    }

                                    unpack(e, t, n) {
                                        if (!this.contains(e, t)) throw new Error("Cannot unpack google.protobuf.Any with typeUrl '" + e.typeUrl + "' as " + t.typeName + ".");
                                        return t.fromBinary(e.value, n)
                                    }

                                    contains(e, t) {
                                        if (!e.typeUrl.length) return !1;
                                        return ("string" == typeof t ? t : t.typeName) === this.typeUrlToName(e.typeUrl)
                                    }

                                    internalJsonWrite(e, t) {
                                        if ("" === e.typeUrl) return {};
                                        let n = this.typeUrlToName(e.typeUrl), i = ti(t),
                                            r = i.typeRegistry?.find((e => e.typeName === n));
                                        if (!r) throw new globalThis.Error("Unable to convert google.protobuf.Any with typeUrl '" + e.typeUrl + "' to JSON. The specified type " + n + " is not available in the type registry.");
                                        let a = r.fromBinary(e.value, {readUnknownField: !1}),
                                            s = r.internalJsonWrite(a, i);
                                        return !n.startsWith("google.protobuf.") && Bn(s) || (s = {value: s}), s["@type"] = e.typeUrl, s
                                    }

                                    internalJsonRead(e, t, n) {
                                        if (!Bn(e)) throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON " + Nn(e) + ".");
                                        if ("string" != typeof e["@type"] || "" == e["@type"]) return this.create();
                                        let i, r = this.typeUrlToName(e["@type"]),
                                            a = t?.typeRegistry?.find((e => e.typeName == r));
                                        if (!a) throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON. The specified type " + r + " is not available in the type registry.");
                                        if (r.startsWith("google.protobuf.") && e.hasOwnProperty("value")) i = a.fromJson(e.value, t); else {
                                            let n = Object.assign({}, e);
                                            delete n["@type"], i = a.fromJson(n, t)
                                        }
                                        return void 0 === n && (n = this.create()), n.typeUrl = e["@type"], n.value = a.toBinary(i), n
                                    }

                                    typeNameToUrl(e) {
                                        if (!e.length) throw new Error("invalid type name: " + e);
                                        return "type.googleapis.com/" + e
                                    }

                                    typeUrlToName(e) {
                                        if (!e.length) throw new Error("invalid type url: " + e);
                                        let t = e.lastIndexOf("/"), n = t > 0 ? e.substring(t + 1) : e;
                                        if (!n.length) throw new Error("invalid type url: " + e);
                                        return n
                                    }

                                    create(e) {
                                        const t = {typeUrl: "", value: new Uint8Array(0)};
                                        return globalThis.Object.defineProperty(t, ni, {
                                            enumerable: !1,
                                            value: this
                                        }), void 0 !== e && gi(this, t, e), t
                                    }

                                    internalBinaryRead(e, t, n, i) {
                                        let r = i ?? this.create(), a = e.pos + t;
                                        for (; e.pos < a;) {
                                            let [t, i] = e.tag();
                                            switch (t) {
                                                case 1:
                                                    r.typeUrl = e.string();
                                                    break;
                                                case 2:
                                                    r.value = e.bytes();
                                                    break;
                                                default:
                                                    let a = n.readUnknownField;
                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                    let s = e.skip(i);
                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                            }
                                        }
                                        return r
                                    }

                                    internalBinaryWrite(e, t, n) {
                                        "" !== e.typeUrl && t.tag(1, Sn.LengthDelimited).string(e.typeUrl), e.value.length && t.tag(2, Sn.LengthDelimited).bytes(e.value);
                                        let i = n.writeUnknownFields;
                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                    }
                                }

                                    const f = new u;

                                class p extends vi {
                                    constructor() {
                                        super("CM", [{no: 1, name: "source_content", kind: "message", T: () => f}])
                                    }

                                    create(e) {
                                        const t = {};
                                        return globalThis.Object.defineProperty(t, ni, {
                                            enumerable: !1,
                                            value: this
                                        }), void 0 !== e && gi(this, t, e), t
                                    }

                                    internalBinaryRead(e, t, n, i) {
                                        let r = i ?? this.create(), a = e.pos + t;
                                        for (; e.pos < a;) {
                                            let [t, i] = e.tag();
                                            if (1 === t) r.sourceContent = f.internalBinaryRead(e, e.uint32(), n, r.sourceContent); else {
                                                let a = n.readUnknownField;
                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                let s = e.skip(i);
                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                            }
                                        }
                                        return r
                                    }

                                    internalBinaryWrite(e, t, n) {
                                        e.sourceContent && f.internalBinaryWrite(e.sourceContent, t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                        let i = n.writeUnknownFields;
                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                    }
                                }

                                    const m = new p;
                                    switch (Ei?.[0]) {
                                        case"bilibili.app.playurl.v1.PlayURL":
                                            if ("PlayView" === Ei?.[1]) {
                                                class j extends vi {
                                                    constructor() {
                                                        super("PlayViewReply", [{
                                                            no: 5,
                                                            name: "play_arc",
                                                            kind: "message",
                                                            T: () => W
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (5 === t) r.playArc = W.internalBinaryRead(e, e.uint32(), n, r.playArc); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.playArc && W.internalBinaryWrite(e.playArc, t.tag(5, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const z = new j;

                                                class C extends vi {
                                                    constructor() {
                                                        super("PlayArcConf", [{
                                                            no: 1,
                                                            name: "background_play_conf",
                                                            kind: "message",
                                                            T: () => P
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.backgroundPlayConf = P.internalBinaryRead(e, e.uint32(), n, r.backgroundPlayConf); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.backgroundPlayConf && P.internalBinaryWrite(e.backgroundPlayConf, t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const W = new C;

                                                class V extends vi {
                                                    constructor() {
                                                        super("ArcConf", [{
                                                            no: 1,
                                                            name: "is_support",
                                                            kind: "scalar",
                                                            T: 8
                                                        }, {no: 2, name: "disabled", kind: "scalar", T: 8}, {
                                                            no: 3,
                                                            name: "extra_content",
                                                            kind: "message",
                                                            T: () => M
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {isSupport: !1, disabled: !1};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 1:
                                                                    r.isSupport = e.bool();
                                                                    break;
                                                                case 2:
                                                                    r.disabled = e.bool();
                                                                    break;
                                                                case 3:
                                                                    r.extraContent = M.internalBinaryRead(e, e.uint32(), n, r.extraContent);
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        !1 !== e.isSupport && t.tag(1, Sn.Varint).bool(e.isSupport), !1 !== e.disabled && t.tag(2, Sn.Varint).bool(e.disabled), e.extraContent && M.internalBinaryWrite(e.extraContent, t.tag(3, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const P = new V;

                                                class Z extends vi {
                                                    constructor() {
                                                        super("ExtraContent", [{
                                                            no: 1,
                                                            name: "disabled_reason",
                                                            kind: "scalar",
                                                            T: 9
                                                        }, {no: 2, name: "disabled_code", kind: "scalar", T: 3, L: 0}])
                                                    }

                                                    create(e) {
                                                        const t = {disabledReason: "", disabledCode: 0n};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 1:
                                                                    r.disabledReason = e.string();
                                                                    break;
                                                                case 2:
                                                                    r.disabledCode = e.int64().toBigInt();
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "" !== e.disabledReason && t.tag(1, Sn.LengthDelimited).string(e.disabledReason), 0n !== e.disabledCode && t.tag(2, Sn.Varint).int64(e.disabledCode);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const M = new Z;
                                                let K = z.fromBinary(a);
                                                const X = K.playArc?.backgroundPlayConf;
                                                !X || X.isSupport && !X.disabled ? Ti.log("🚧 无后台播放限制") : (Ti.log("🎉 后台播放限制去除"), K.playArc.backgroundPlayConf.isSupport = !0, K.playArc.backgroundPlayConf.disabled = !1, K.playArc.backgroundPlayConf.extraContent = null), a = z.toBinary(K)
                                            }
                                            break;
                                        case"bilibili.app.dynamic.v2.Dynamic":
                                            var r;
                                            !function (e) {
                                                e[e.dyn_none = 0] = "dyn_none", e[e.ad = 15] = "ad"
                                            }(r || (r = {}));

                                        class g extends vi {
                                            constructor() {
                                                super("DynAllReply", [{
                                                    no: 1,
                                                    name: "dynamic_list",
                                                    kind: "message",
                                                    T: () => k
                                                }, {no: 2, name: "up_list", kind: "message", T: () => T}, {
                                                    no: 3,
                                                    name: "topic_list",
                                                    kind: "message",
                                                    T: () => B
                                                }])
                                            }

                                            create(e) {
                                                const t = {};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    switch (t) {
                                                        case 1:
                                                            r.dynamicList = k.internalBinaryRead(e, e.uint32(), n, r.dynamicList);
                                                            break;
                                                        case 2:
                                                            r.upList = T.internalBinaryRead(e, e.uint32(), n, r.upList);
                                                            break;
                                                        case 3:
                                                            r.topicList = B.internalBinaryRead(e, e.uint32(), n, r.topicList);
                                                            break;
                                                        default:
                                                            let a = n.readUnknownField;
                                                            if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                            let s = e.skip(i);
                                                            !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                e.dynamicList && k.internalBinaryWrite(e.dynamicList, t.tag(1, Sn.LengthDelimited).fork(), n).join(), e.upList && T.internalBinaryWrite(e.upList, t.tag(2, Sn.LengthDelimited).fork(), n).join(), e.topicList && B.internalBinaryWrite(e.topicList, t.tag(3, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const w = new g;

                                        class b extends vi {
                                            constructor() {
                                                super("DynVideoReply", [{
                                                    no: 2,
                                                    name: "video_up_list",
                                                    kind: "message",
                                                    T: () => T
                                                }])
                                            }

                                            create(e) {
                                                const t = {};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (2 === t) r.videoUpList = T.internalBinaryRead(e, e.uint32(), n, r.videoUpList); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                e.videoUpList && T.internalBinaryWrite(e.videoUpList, t.tag(2, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const y = new b;

                                        class _ extends vi {
                                            constructor() {
                                                super("DynamicList", [{
                                                    no: 1,
                                                    name: "list",
                                                    kind: "message",
                                                    repeat: 1,
                                                    T: () => U
                                                }])
                                            }

                                            create(e) {
                                                const t = {list: []};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.list.push(U.internalBinaryRead(e, e.uint32(), n)); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                for (let i = 0; i < e.list.length; i++) U.internalBinaryWrite(e.list[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const k = new _;

                                        class v extends vi {
                                            constructor() {
                                                super("CardVideoUpList", [{no: 1, name: "title", kind: "scalar", T: 9}])
                                            }

                                            create(e) {
                                                const t = {title: ""};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.title = e.string(); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                "" !== e.title && t.tag(1, Sn.LengthDelimited).string(e.title);
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const T = new v;

                                        class N extends vi {
                                            constructor() {
                                                super("TopicList", [{no: 1, name: "title", kind: "scalar", T: 9}])
                                            }

                                            create(e) {
                                                const t = {title: ""};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.title = e.string(); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                "" !== e.title && t.tag(1, Sn.LengthDelimited).string(e.title);
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const B = new N;

                                        class x extends vi {
                                            constructor() {
                                                super("DynamicItem", [{
                                                    no: 1,
                                                    name: "card_type",
                                                    kind: "enum",
                                                    T: () => ["DynamicType", r]
                                                }])
                                            }

                                            create(e) {
                                                const t = {cardType: 0};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.cardType = e.int32(); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                0 !== e.cardType && t.tag(1, Sn.Varint).int32(e.cardType);
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const U = new x;
                                            switch (Ei?.[1]) {
                                                case"DynAll":
                                                    switch (data = w.fromBinary(a), e?.Detail?.Hot_topics) {
                                                        case!0:
                                                        default:
                                                            Ti.log("🎉 动态综合页热门话题去除"), delete data.topicList;
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置动态综合页热门话题不去除")
                                                    }
                                                    switch (e?.Detail?.Most_visited) {
                                                        case!0:
                                                        default:
                                                            Ti.log("🎉 动态综合页最常访问去除"), delete data.upList;
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置动态综合页最常访问不去除")
                                                    }
                                                    switch (e?.Detail?.Dynamic_adcard) {
                                                        case!0:
                                                        default:
                                                            data.dynamicList?.list?.length && (data.dynamicList.list = data.dynamicList.list.filter((e => 15 !== e.cardType || (Ti.log("🎉 动态综合页广告动态去除"), !1))));
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置动态综合页广告动态不去除")
                                                    }
                                                    a = w.toBinary(data);
                                                    break;
                                                case"DynVideo":
                                                    switch (data = y.fromBinary(a), e?.Detail?.Most_visited) {
                                                        case!0:
                                                        default:
                                                            Ti.log("🎉 动态视频页最常访问去除"), delete data.videoUpList;
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置动态视频页最常访问不去除")
                                                    }
                                                    a = y.toBinary(data)
                                            }
                                            break;
                                        case"bilibili.app.view.v1.View":
                                            switch (Ei?.[1]) {
                                                case"View":

                                                class J extends vi {
                                                    constructor() {
                                                        super("ViewReply", [{
                                                            no: 6,
                                                            name: "t_icon",
                                                            kind: "map",
                                                            K: 9,
                                                            V: {kind: "message", T: () => te}
                                                        }, {
                                                            no: 10,
                                                            name: "relates",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => ie
                                                        }, {
                                                            no: 30,
                                                            name: "cms",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => m
                                                        }, {
                                                            no: 31,
                                                            name: "cm_config",
                                                            kind: "message",
                                                            T: () => Y
                                                        }, {no: 41, name: "cm_ipad", kind: "message", T: () => Q}])
                                                    }

                                                    create(e) {
                                                        const t = {tIcon: {}, relates: [], cms: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 6:
                                                                    this.binaryReadMap6(r.tIcon, e, n);
                                                                    break;
                                                                case 10:
                                                                    r.relates.push(ie.internalBinaryRead(e, e.uint32(), n));
                                                                    break;
                                                                case 30:
                                                                    r.cms.push(m.internalBinaryRead(e, e.uint32(), n));
                                                                    break;
                                                                case 31:
                                                                    r.cmConfig = Y.internalBinaryRead(e, e.uint32(), n, r.cmConfig);
                                                                    break;
                                                                case 41:
                                                                    r.cmIpad = Q.internalBinaryRead(e, e.uint32(), n, r.cmIpad);
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    binaryReadMap6(e, t, n) {
                                                        let i, r, a = t.uint32(), s = t.pos + a;
                                                        for (; t.pos < s;) {
                                                            let [e, a] = t.tag();
                                                            switch (e) {
                                                                case 1:
                                                                    i = t.string();
                                                                    break;
                                                                case 2:
                                                                    r = te.internalBinaryRead(t, t.uint32(), n);
                                                                    break;
                                                                default:
                                                                    throw new globalThis.Error("unknown map entry field for field ViewReply.t_icon")
                                                            }
                                                        }
                                                        e[i ?? ""] = r ?? te.create()
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i of Object.keys(e.tIcon)) t.tag(6, Sn.LengthDelimited).fork().tag(1, Sn.LengthDelimited).string(i), t.tag(2, Sn.LengthDelimited).fork(), te.internalBinaryWrite(e.tIcon[i], t, n), t.join().join();
                                                        for (let i = 0; i < e.relates.length; i++) ie.internalBinaryWrite(e.relates[i], t.tag(10, Sn.LengthDelimited).fork(), n).join();
                                                        for (let i = 0; i < e.cms.length; i++) m.internalBinaryWrite(e.cms[i], t.tag(30, Sn.LengthDelimited).fork(), n).join();
                                                        e.cmConfig && Y.internalBinaryWrite(e.cmConfig, t.tag(31, Sn.LengthDelimited).fork(), n).join(), e.cmIpad && Q.internalBinaryWrite(e.cmIpad, t.tag(41, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const G = new J;

                                                class H extends vi {
                                                    constructor() {
                                                        super("CMConfig", [{
                                                            no: 1,
                                                            name: "ads_control",
                                                            kind: "message",
                                                            T: () => f
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.adsControl = f.internalBinaryRead(e, e.uint32(), n, r.adsControl); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.adsControl && f.internalBinaryWrite(e.adsControl, t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const Y = new H;

                                                class q extends vi {
                                                    constructor() {
                                                        super("CmIpad", [{
                                                            no: 5,
                                                            name: "aid",
                                                            kind: "scalar",
                                                            T: 3,
                                                            L: 0
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {aid: 0n};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (5 === t) r.aid = e.int64().toBigInt(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        0n !== e.aid && t.tag(5, Sn.Varint).int64(e.aid);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const Q = new q;

                                                class ee extends vi {
                                                    constructor() {
                                                        super("TIcon", [{no: 1, name: "icon", kind: "scalar", T: 9}])
                                                    }

                                                    create(e) {
                                                        const t = {icon: ""};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.icon = e.string(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "" !== e.icon && t.tag(1, Sn.LengthDelimited).string(e.icon);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const te = new ee;

                                                class ne extends vi {
                                                    constructor() {
                                                        super("Relate", [{
                                                            no: 28,
                                                            name: "cm",
                                                            kind: "message",
                                                            T: () => m
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (28 === t) r.cm = m.internalBinaryRead(e, e.uint32(), n, r.cm); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.cm && m.internalBinaryWrite(e.cm, t.tag(28, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const ie = new ne;
                                                    switch (e?.Detail?.view) {
                                                        case!0:
                                                        default:
                                                            let he = G.fromBinary(a);
                                                            he.cms?.length && (Ti.log("🎉 播放页广告卡片去除"), he.cms = []), he.relates?.length && (he.relates = he.relates.filter((e => !e.cm || (Ti.log("🎉 播放页关联推荐广告去除"), !1)))), (he.cmConfig || he.cmIpad) && (Ti.log("🎉 播放页定制tab去除"), delete he.cmConfig, delete he.cmIpad);
                                                            for (const ue in he.tIcon) null === he.tIcon[ue] && delete he.tIcon[ue];
                                                            a = G.toBinary(he);
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置播放页广告不去除")
                                                    }
                                                    break;
                                                case"TFInfo":

                                                class re extends vi {
                                                    constructor() {
                                                        super("TFInfoReply", [{
                                                            no: 1,
                                                            name: "tipsId",
                                                            kind: "scalar",
                                                            T: 3,
                                                            L: 0
                                                        }, {
                                                            no: 2,
                                                            name: "tfToast",
                                                            kind: "message",
                                                            T: () => oe
                                                        }, {
                                                            no: 3,
                                                            name: "tfPanelCustomized",
                                                            kind: "message",
                                                            T: () => ce
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {tipsId: 0n};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 1:
                                                                    r.tipsId = e.int64().toBigInt();
                                                                    break;
                                                                case 2:
                                                                    r.tfToast = oe.internalBinaryRead(e, e.uint32(), n, r.tfToast);
                                                                    break;
                                                                case 3:
                                                                    r.tfPanelCustomized = ce.internalBinaryRead(e, e.uint32(), n, r.tfPanelCustomized);
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        0n !== e.tipsId && t.tag(1, Sn.Varint).int64(e.tipsId), e.tfToast && oe.internalBinaryWrite(e.tfToast, t.tag(2, Sn.LengthDelimited).fork(), n).join(), e.tfPanelCustomized && ce.internalBinaryWrite(e.tfPanelCustomized, t.tag(3, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const ae = new re;

                                                class se extends vi {
                                                    constructor() {
                                                        super("TFToast", [{
                                                            no: 1,
                                                            name: "btnText",
                                                            kind: "scalar",
                                                            T: 9
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {btnText: ""};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.btnText = e.string(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "" !== e.btnText && t.tag(1, Sn.LengthDelimited).string(e.btnText);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const oe = new se;

                                                class le extends vi {
                                                    constructor() {
                                                        super("TFPanelCustomized", [{
                                                            no: 2,
                                                            name: "rightBtnText",
                                                            kind: "scalar",
                                                            T: 9
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {rightBtnText: ""};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (2 === t) r.rightBtnText = e.string(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "" !== e.rightBtnText && t.tag(2, Sn.LengthDelimited).string(e.rightBtnText);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                    const ce = new le;
                                                    let de = ae.fromBinary(a);
                                                    Ti.log(de.tipsId), de?.tipsId && (Ti.log("🎉 播放页办卡免流广告去除"), delete de.tfToast, delete de.tfPanelCustomized), a = ae.toBinary(de)
                                            }
                                            break;
                                        case"bilibili.app.viewunite.v1.View":
                                            if ("View" === Ei?.[1]) {
                                                class fe extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.ViewReply", [{
                                                            no: 5,
                                                            name: "tab",
                                                            kind: "message",
                                                            T: () => ge
                                                        }, {no: 7, name: "cm", kind: "message", T: () => Ee}])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 5:
                                                                    r.tab = ge.internalBinaryRead(e, e.uint32(), n, r.tab);
                                                                    break;
                                                                case 7:
                                                                    r.cm = Ee.internalBinaryRead(e, e.uint32(), n, r.cm);
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.tab && ge.internalBinaryWrite(e.tab, t.tag(5, Sn.LengthDelimited).fork(), n).join(), e.cm && Ee.internalBinaryWrite(e.cm, t.tag(7, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const pe = new fe;

                                                class me extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.Tab", [{
                                                            no: 1,
                                                            name: "tab_module",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => be
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {tabModule: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.tabModule.push(be.internalBinaryRead(e, e.uint32(), n)); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i = 0; i < e.tabModule.length; i++) be.internalBinaryWrite(e.tabModule[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const ge = new me;

                                                class we extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.TabModule", [{
                                                            no: 2,
                                                            name: "introduction",
                                                            kind: "message",
                                                            oneof: "tab",
                                                            T: () => _e
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {tab: {oneofKind: void 0}};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (2 === t) r.tab = {
                                                                oneofKind: "introduction",
                                                                introduction: _e.internalBinaryRead(e, e.uint32(), n, r.tab.introduction)
                                                            }; else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "introduction" === e.tab.oneofKind && _e.internalBinaryWrite(e.tab.introduction, t.tag(2, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const be = new we;

                                                class ye extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.IntroductionTab", [{
                                                            no: 2,
                                                            name: "modules",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => ve
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {modules: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (2 === t) r.modules.push(ve.internalBinaryRead(e, e.uint32(), n)); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i = 0; i < e.modules.length; i++) ve.internalBinaryWrite(e.modules[i], t.tag(2, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const _e = new ye;

                                                class ke extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.Module", [{
                                                            no: 1,
                                                            name: "type",
                                                            kind: "scalar",
                                                            T: 5
                                                        }, {
                                                            no: 22,
                                                            name: "relates",
                                                            kind: "message",
                                                            oneof: "data",
                                                            T: () => Ne
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {type: 0, data: {oneofKind: void 0}};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 1:
                                                                    r.type = e.int32();
                                                                    break;
                                                                case 22:
                                                                    r.data = {
                                                                        oneofKind: "relates",
                                                                        relates: Ne.internalBinaryRead(e, e.uint32(), n, r.data.relates)
                                                                    };
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        0 !== e.type && t.tag(1, Sn.Varint).int32(e.type), "relates" === e.data.oneofKind && Ne.internalBinaryWrite(e.data.relates, t.tag(22, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const ve = new ke;

                                                class Te extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.Relates", [{
                                                            no: 1,
                                                            name: "cards",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => xe
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {cards: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.cards.push(xe.internalBinaryRead(e, e.uint32(), n)); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i = 0; i < e.cards.length; i++) xe.internalBinaryWrite(e.cards[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const Ne = new Te;

                                                class Be extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.RelateCard", [{
                                                            no: 1,
                                                            name: "relate_card_type",
                                                            kind: "scalar",
                                                            T: 5
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {relateCardType: 0};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.relateCardType = e.int32(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        0 !== e.relateCardType && t.tag(1, Sn.Varint).int32(e.relateCardType);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const xe = new Be;

                                                class Ue extends vi {
                                                    constructor() {
                                                        super("bilibili.app.viewunite.v1.CM", [{
                                                            no: 3,
                                                            name: "source_content",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => f
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {sourceContent: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (3 === t) r.sourceContent.push(f.internalBinaryRead(e, e.uint32(), n)); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i = 0; i < e.sourceContent.length; i++) f.internalBinaryWrite(e.sourceContent[i], t.tag(3, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const Ee = new Ue;
                                                switch (e?.Detail?.view) {
                                                    case!0:
                                                    default:
                                                        let Se = pe.fromBinary(a);
                                                        Se.cm?.sourceContent?.length && (Ti.log("🎉 up主推荐广告去除"), Se.cm.sourceContent = []), Se.tab.tabModule[0].tab.introduction.modules = Se.tab.tabModule[0].tab.introduction.modules.map((e => (28 === e.type && (Ti.log("🎉 视频详情下方推荐卡广告去除"), e.data.relates.cards = e.data.relates.cards.filter((e => 5 !== e.relateCardType && 4 !== e.relateCardType))), e))), a = pe.toBinary(Se);
                                                        break;
                                                    case!1:
                                                        Ti.log("🚧 用户设置up主推荐广告不去除")
                                                }
                                            }
                                            break;
                                        case"bilibili.app.interface.v1.Teenagers":
                                            if ("ModeStatus" === Ei?.[1]) {
                                                class Ie extends vi {
                                                    constructor() {
                                                        super("ModeStatus", [{
                                                            no: 1,
                                                            name: "modes",
                                                            kind: "message",
                                                            repeat: 1,
                                                            T: () => Oe
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {modes: []};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.modes.push(Oe.internalBinaryRead(e, e.uint32(), n)); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        for (let i = 0; i < e.modes.length; i++) Oe.internalBinaryWrite(e.modes[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const Re = new Ie;

                                                class De extends vi {
                                                    constructor() {
                                                        super("Mode", [{
                                                            no: 2,
                                                            name: "name",
                                                            kind: "scalar",
                                                            T: 9
                                                        }, {no: 5, name: "f5", kind: "message", T: () => Ae}])
                                                    }

                                                    create(e) {
                                                        const t = {name: ""};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            switch (t) {
                                                                case 2:
                                                                    r.name = e.string();
                                                                    break;
                                                                case 5:
                                                                    r.f5 = Ae.internalBinaryRead(e, e.uint32(), n, r.f5);
                                                                    break;
                                                                default:
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        "" !== e.name && t.tag(2, Sn.LengthDelimited).string(e.name), e.f5 && Ae.internalBinaryWrite(e.f5, t.tag(5, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const Oe = new De;

                                                class $e extends vi {
                                                    constructor() {
                                                        super("F5", [{no: 1, name: "f1", kind: "scalar", T: 5}])
                                                    }

                                                    create(e) {
                                                        const t = {f1: 0};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (1 === t) r.f1 = e.int32(); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        0 !== e.f1 && t.tag(1, Sn.Varint).int32(e.f1);
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const Ae = new $e;
                                                data = Re.fromBinary(a), data.modes = data.modes.map((e => ("teenagers" === e?.name && e?.f5?.f1 && (e.f5.f1 = 0, Ti.log("🎉 青少年模式弹窗去除")), e))), a = Re.toBinary(data)
                                            }
                                            break;
                                        case"bilibili.community.service.dm.v1.DM":

                                        class E extends vi {
                                            constructor() {
                                                super("CommandDm", [{no: 1, name: "id", kind: "scalar", T: 3, L: 0}])
                                            }

                                            create(e) {
                                                const t = {id: 0n};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.id = e.int64().toBigInt(); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                0n !== e.id && t.tag(1, Sn.Varint).int64(e.id);
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const S = new E;

                                        class I extends vi {
                                            constructor() {
                                                super("DmView", [{
                                                    no: 1,
                                                    name: "commandDms",
                                                    kind: "message",
                                                    repeat: 1,
                                                    T: () => S
                                                }])
                                            }

                                            create(e) {
                                                const t = {commandDms: []};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.commandDms.push(S.internalBinaryRead(e, e.uint32(), n)); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                for (let i = 0; i < e.commandDms.length; i++) S.internalBinaryWrite(e.commandDms[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const R = new I;

                                        class D extends vi {
                                            constructor() {
                                                super("DmViewReply", [{
                                                    no: 22,
                                                    name: "dmView",
                                                    kind: "message",
                                                    T: () => R
                                                }])
                                            }

                                            create(e) {
                                                const t = {};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (22 === t) r.dmView = R.internalBinaryRead(e, e.uint32(), n, r.dmView); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                e.dmView && R.internalBinaryWrite(e.dmView, t.tag(22, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const O = new D;

                                        class $ extends vi {
                                            constructor() {
                                                super("DmSegMobileReply", [{
                                                    no: 1,
                                                    name: "elems",
                                                    kind: "message",
                                                    repeat: 1,
                                                    T: () => F
                                                }])
                                            }

                                            create(e) {
                                                const t = {elems: []};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (1 === t) r.elems.push(F.internalBinaryRead(e, e.uint32(), n)); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                for (let i = 0; i < e.elems.length; i++) F.internalBinaryWrite(e.elems[i], t.tag(1, Sn.LengthDelimited).fork(), n).join();
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const A = new $;

                                        class L extends vi {
                                            constructor() {
                                                super("DanmakuElem", [{no: 24, name: "colorful", kind: "scalar", T: 5}])
                                            }

                                            create(e) {
                                                const t = {colorful: 0};
                                                return globalThis.Object.defineProperty(t, ni, {
                                                    enumerable: !1,
                                                    value: this
                                                }), void 0 !== e && gi(this, t, e), t
                                            }

                                            internalBinaryRead(e, t, n, i) {
                                                let r = i ?? this.create(), a = e.pos + t;
                                                for (; e.pos < a;) {
                                                    let [t, i] = e.tag();
                                                    if (24 === t) r.colorful = e.int32(); else {
                                                        let a = n.readUnknownField;
                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                        let s = e.skip(i);
                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                    }
                                                }
                                                return r
                                            }

                                            internalBinaryWrite(e, t, n) {
                                                0 !== e.colorful && t.tag(24, Sn.Varint).int32(e.colorful);
                                                let i = n.writeUnknownFields;
                                                return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                            }
                                        }

                                            const F = new L;
                                            switch (Ei?.[1]) {
                                                case"DmView":
                                                    if (!0 === e?.Detail?.commandDms) {
                                                        let Le = O.fromBinary(a);
                                                        Le.dmView?.commandDms?.length && (Ti.log("🎉 交互式弹幕去除"), Le.dmView.commandDms.length = 0), a = O.toBinary(Le)
                                                    } else Ti.log("🎉 用户设置交互式弹幕不去除");
                                                    break;
                                                case"DmSegMobile":
                                                    if (!0 === e?.Detail?.colorfulDms) {
                                                        let Fe = A.fromBinary(a);
                                                        Fe.elems = Fe.elems.map((e => (60001 === e?.colorful && (e.colorful = 0), e))), Ti.log("🎉 会员弹幕已替换为普通弹幕"), a = A.toBinary(Fe)
                                                    } else Ti.log("🎉 用户设置会员弹幕不修改")
                                            }
                                            break;
                                        case"bilibili.main.community.reply.v1.Reply":
                                            if ("MainList" === Ei?.[1]) {
                                                class je extends vi {
                                                    constructor() {
                                                        super("MainListReply", [{
                                                            no: 11,
                                                            name: "cm",
                                                            kind: "message",
                                                            T: () => m
                                                        }])
                                                    }

                                                    create(e) {
                                                        const t = {};
                                                        return globalThis.Object.defineProperty(t, ni, {
                                                            enumerable: !1,
                                                            value: this
                                                        }), void 0 !== e && gi(this, t, e), t
                                                    }

                                                    internalBinaryRead(e, t, n, i) {
                                                        let r = i ?? this.create(), a = e.pos + t;
                                                        for (; e.pos < a;) {
                                                            let [t, i] = e.tag();
                                                            if (11 === t) r.cm = m.internalBinaryRead(e, e.uint32(), n, r.cm); else {
                                                                let a = n.readUnknownField;
                                                                if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                let s = e.skip(i);
                                                                !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                            }
                                                        }
                                                        return r
                                                    }

                                                    internalBinaryWrite(e, t, n) {
                                                        e.cm && m.internalBinaryWrite(e.cm, t.tag(11, Sn.LengthDelimited).fork(), n).join();
                                                        let i = n.writeUnknownFields;
                                                        return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                    }
                                                }

                                                const ze = new je;
                                                switch (e?.Detail?.MainList) {
                                                    case!0:
                                                    default:
                                                        let Ce = ze.fromBinary(a);
                                                        Ti.log("🎉 评论列表广告去除"), delete Ce.cm, a = ze.toBinary(Ce);
                                                        break;
                                                    case!1:
                                                        Ti.log("🎉 用户设置评论列表广告不去除")
                                                }
                                            }
                                            break;
                                        case"bilibili.pgc.gateway.player.v2.PlayURL":
                                        case"bilibili.app.nativeact.v1.NativeAct":
                                        case"bilibili.app.interface.v1.Search":
                                            Ei?.[1];
                                            break;
                                        case"bilibili.polymer.app.search.v1.Search":
                                            switch (Ei?.[1]) {
                                                case"SearchAll": {
                                                    class We extends vi {
                                                        constructor() {
                                                            super("bilibili.polymer.app.search.v1.Item", [{
                                                                no: 11,
                                                                name: "game",
                                                                kind: "message",
                                                                oneof: "cardItem",
                                                                T: () => Ke
                                                            }, {
                                                                no: 25,
                                                                name: "cm",
                                                                kind: "message",
                                                                oneof: "cardItem",
                                                                T: () => Ze
                                                            }])
                                                        }

                                                        create(e) {
                                                            const t = {cardItem: {oneofKind: void 0}};
                                                            return globalThis.Object.defineProperty(t, ni, {
                                                                enumerable: !1,
                                                                value: this
                                                            }), void 0 !== e && gi(this, t, e), t
                                                        }

                                                        internalBinaryRead(e, t, n, i) {
                                                            let r = i ?? this.create(), a = e.pos + t;
                                                            for (; e.pos < a;) {
                                                                let [t, i] = e.tag();
                                                                switch (t) {
                                                                    case 11:
                                                                        r.cardItem = {
                                                                            oneofKind: "game",
                                                                            game: Ke.internalBinaryRead(e, e.uint32(), n, r.cardItem.game)
                                                                        };
                                                                        break;
                                                                    case 25:
                                                                        r.cardItem = {
                                                                            oneofKind: "cm",
                                                                            cm: Ze.internalBinaryRead(e, e.uint32(), n, r.cardItem.cm)
                                                                        };
                                                                        break;
                                                                    default:
                                                                        let a = n.readUnknownField;
                                                                        if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                        let s = e.skip(i);
                                                                        !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                                }
                                                            }
                                                            return r
                                                        }

                                                        internalBinaryWrite(e, t, n) {
                                                            "game" === e.cardItem.oneofKind && Ke.internalBinaryWrite(e.cardItem.game, t.tag(11, Sn.LengthDelimited).fork(), n).join(), "cm" === e.cardItem.oneofKind && Ze.internalBinaryWrite(e.cardItem.cm, t.tag(25, Sn.LengthDelimited).fork(), n).join();
                                                            let i = n.writeUnknownFields;
                                                            return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                        }
                                                    }

                                                    const Ve = new We;

                                                    class Pe extends vi {
                                                        constructor() {
                                                            super("bilibili.polymer.app.search.v1.SearchAdCard", [{
                                                                no: 1,
                                                                name: "json_str",
                                                                kind: "scalar",
                                                                T: 9
                                                            }])
                                                        }

                                                        create(e) {
                                                            const t = {jsonStr: ""};
                                                            return globalThis.Object.defineProperty(t, ni, {
                                                                enumerable: !1,
                                                                value: this
                                                            }), void 0 !== e && gi(this, t, e), t
                                                        }

                                                        internalBinaryRead(e, t, n, i) {
                                                            let r = i ?? this.create(), a = e.pos + t;
                                                            for (; e.pos < a;) {
                                                                let [t, i] = e.tag();
                                                                if (1 === t) r.jsonStr = e.string(); else {
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                                }
                                                            }
                                                            return r
                                                        }

                                                        internalBinaryWrite(e, t, n) {
                                                            "" !== e.jsonStr && t.tag(1, Sn.LengthDelimited).string(e.jsonStr);
                                                            let i = n.writeUnknownFields;
                                                            return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                        }
                                                    }

                                                    const Ze = new Pe;

                                                    class Me extends vi {
                                                        constructor() {
                                                            super("bilibili.polymer.app.search.v1.SearchGameCard", [{
                                                                no: 1,
                                                                name: "title",
                                                                kind: "scalar",
                                                                T: 9
                                                            }])
                                                        }

                                                        create(e) {
                                                            const t = {title: ""};
                                                            return globalThis.Object.defineProperty(t, ni, {
                                                                enumerable: !1,
                                                                value: this
                                                            }), void 0 !== e && gi(this, t, e), t
                                                        }

                                                        internalBinaryRead(e, t, n, i) {
                                                            let r = i ?? this.create(), a = e.pos + t;
                                                            for (; e.pos < a;) {
                                                                let [t, i] = e.tag();
                                                                if (1 === t) r.title = e.string(); else {
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                                }
                                                            }
                                                            return r
                                                        }

                                                        internalBinaryWrite(e, t, n) {
                                                            "" !== e.title && t.tag(1, Sn.LengthDelimited).string(e.title);
                                                            let i = n.writeUnknownFields;
                                                            return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                        }
                                                    }

                                                    const Ke = new Me;

                                                    class Xe extends vi {
                                                        constructor() {
                                                            super("bilibili.polymer.app.search.v1.SearchAllResponse", [{
                                                                no: 4,
                                                                name: "item",
                                                                kind: "message",
                                                                repeat: 1,
                                                                T: () => Ve
                                                            }])
                                                        }

                                                        create(e) {
                                                            const t = {item: []};
                                                            return globalThis.Object.defineProperty(t, ni, {
                                                                enumerable: !1,
                                                                value: this
                                                            }), void 0 !== e && gi(this, t, e), t
                                                        }

                                                        internalBinaryRead(e, t, n, i) {
                                                            let r = i ?? this.create(), a = e.pos + t;
                                                            for (; e.pos < a;) {
                                                                let [t, i] = e.tag();
                                                                if (4 === t) r.item.push(Ve.internalBinaryRead(e, e.uint32(), n)); else {
                                                                    let a = n.readUnknownField;
                                                                    if ("throw" === a) throw new globalThis.Error(`Unknown field ${t}(wire type ${i})for ${this.typeName}`);
                                                                    let s = e.skip(i);
                                                                    !1 !== a && (!0 === a ? En.onRead : a)(this.typeName, r, t, i, s)
                                                                }
                                                            }
                                                            return r
                                                        }

                                                        internalBinaryWrite(e, t, n) {
                                                            for (let i = 0; i < e.item.length; i++) Ve.internalBinaryWrite(e.item[i], t.tag(4, Sn.LengthDelimited).fork(), n).join();
                                                            let i = n.writeUnknownFields;
                                                            return !1 !== i && (1 == i ? En.onWrite : i)(this.typeName, e, t), t
                                                        }
                                                    }

                                                    const Je = new Xe;
                                                    switch (e?.Detail?.search) {
                                                        case!0:
                                                        default:
                                                            let Ge = Je.fromBinary(a);
                                                            Ti.log("🎉 搜索页广告去除"), Ge.item = Ge.item.filter((e => !("cm" === e.cardItem?.oneofKind || "game" === e.cardItem?.oneofKind))), a = Je.toBinary(Ge);
                                                            break;
                                                        case!1:
                                                            Ti.log("🚧 用户设置搜索页广告不去除")
                                                    }
                                                    break
                                                }
                                            }
                                    }
                            }
                            s = function ({header: e, body: t}, n) {
                                console.log("☑️ Add gRPC Header", "");
                                const i = "gzip" == n ? 1 : "identity" == n || null == n ? 0 : e?.[0] ?? 0,
                                    r = function (e) {
                                        let t = new ArrayBuffer(4);
                                        return new DataView(t).setUint32(0, e, !1), new Uint8Array(t)
                                    }(t.length);
                                "gzip" == n && (t = pako.gzip(t));
                                let a = new Uint8Array(e.length + t.length);
                                return a.set([i], 0), a.set(r, 1), a.set(t, 5), console.log("✅ Add gRPC Header", ""), a
                            }({header: h, body: a})
                    }
                    $response.body = s
            }
        case!1:
    }
})().catch((e => Ti.logErr(e))).finally((() => Ti.done($response)));