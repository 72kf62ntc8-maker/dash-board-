// ============================================================================
// THE GATE
//
// This dashboard is a static page on a public URL. Anything that asks for a
// password inside index.html is theatre: the browser has already downloaded
// the page, and View Source defeats it. So the check happens here instead —
// Vercel Edge Middleware runs before a single byte of the dashboard is sent,
// so an unauthenticated visitor never receives it at all.
//
// One shared password, held in the DASH_PASSWORD environment variable on
// Vercel (no VITE_ prefix, never in the bundle). No accounts, no sessions
// table — the cookie is an HMAC of the password itself, so changing the
// password signs everyone out on its own.
// ============================================================================
// Everything is gated except what the app shell needs before anyone has
// signed in: the service worker, the manifest and the icons. They are what
// make it installable and offline-capable, and gating them would break both
// while protecting nothing — none of them holds any data.
export const config = { matcher: ["/((?!_vercel/|sw\\.js$|manifest\\.webmanifest$|icons/).*)"] };

const COOKIE  = "cd_gate";
const MAX_AGE = 60 * 60 * 24 * 30;      // 30 days, so a phone stays signed in
const PURPOSE = "dashboard-gate-v1";    // bump to invalidate every cookie

export default async function middleware(req){
  const secret = process.env.DASH_PASSWORD;
  const url = new URL(req.url);

  // No password set: refuse to serve rather than quietly hand the dashboard
  // to the world. A gate that fails open is worse than no gate at all,
  // because you believe it is there.
  if(!secret) return html(setupPage(), 503);

  if(url.pathname === "/__gate"){
    if(req.method !== "POST") return redirect("/", url.origin);
    const form = await req.formData().catch(()=>null);
    const given = String(form?.get("password") ?? "");
    if(await sameSecret(given, secret)){
      return new Response(null, {status:303, headers:{
        "Location": new URL(safeNext(form?.get("next")), url.origin).toString(),
        "Set-Cookie": `${COOKIE}=${await stamp(secret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
        "Cache-Control": "no-store",
      }});
    }
    return html(loginPage(safeNext(form?.get("next")), true), 401);
  }

  const cookie = readCookie(req.headers.get("cookie"), COOKIE);
  if(cookie && timingSafeEqual(cookie, await stamp(secret))) return;   // let it through

  return html(loginPage(url.pathname + url.search, false), 401);
}

// ---- crypto ---------------------------------------------------------------
const enc = s => new TextEncoder().encode(s);

/** The cookie value: HMAC(password, a fixed purpose string). Deriving it from
 *  the password is what lets a password change revoke every cookie without
 *  anything having to remember who was let in. */
async function stamp(secret){
  const key = await crypto.subtle.importKey("raw", enc(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc(PURPOSE));
  return [...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

/** Compare through the HMAC rather than the raw strings, so neither the
 *  length nor the first differing character of the password leaks in the
 *  time this takes. */
async function sameSecret(given, secret){
  if(!given) return false;
  return timingSafeEqual(await stamp(given), await stamp(secret));
}

function timingSafeEqual(a, b){
  if(a.length !== b.length) return false;
  let diff = 0;
  for(let i=0;i<a.length;i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---- request bits ---------------------------------------------------------
function readCookie(header, name){
  if(!header) return null;
  for(const part of header.split(";")){
    const i = part.indexOf("=");
    if(i < 0) continue;
    if(part.slice(0,i).trim() === name) return part.slice(i+1).trim();
  }
  return null;
}

/** Only ever redirect back into this site. A "next" of //evil.com or
 *  https://evil.com would otherwise turn the sign-in into an open redirect. */
function safeNext(v){
  const s = String(v ?? "");
  return (s.startsWith("/") && !s.startsWith("//")) ? s : "/";
}

const redirect = (to, origin) => new Response(null,
  {status:302, headers:{Location:new URL(to,origin).toString(), "Cache-Control":"no-store"}});

const html = (body, status) => new Response(body, {status, headers:{
  "Content-Type":"text/html; charset=utf-8",
  "Cache-Control":"no-store, must-revalidate",
  "X-Robots-Tag":"noindex, nofollow",       // and never turn up in a search
  "Referrer-Policy":"no-referrer",
}});

// ---- the two pages --------------------------------------------------------
const escape = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const SHELL = (title, inner) => `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex,nofollow"/>
<title>${title}</title><style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    background:radial-gradient(900px 600px at 50% -10%,rgba(155,92,255,.16),transparent 60%),#07050D;
    color:#e8dfff;font:15px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  .card{width:100%;max-width:370px;background:rgba(18,13,32,.72);border:1px solid rgba(155,92,255,.18);
    border-radius:14px;padding:28px;backdrop-filter:blur(12px)}
  .mark{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;margin-bottom:18px;
    border:1px solid rgba(155,92,255,.34);color:#9b5cff}
  h1{margin:0;font-size:20px;font-weight:600;letter-spacing:-.3px}
  p{margin:8px 0 0;color:#a294c6;font-size:13.5px}
  label{display:block;margin:20px 0 7px;font:10px ui-monospace,"Courier New",monospace;
    letter-spacing:1.4px;color:#6d5f93}
  input{width:100%;padding:11px 13px;border-radius:9px;color:#e8dfff;font-size:15px;
    border:1px solid rgba(155,92,255,.18);background:rgba(30,21,54,.7)}
  input:focus{outline:none;border-color:rgba(155,92,255,.5);box-shadow:0 0 0 3px rgba(155,92,255,.14)}
  button{width:100%;margin-top:14px;padding:11px;border:0;border-radius:9px;cursor:pointer;
    font-size:15px;font-weight:600;color:#fff;background:linear-gradient(180deg,#a96cff,#8b45f5)}
  button:hover{filter:brightness(1.08)}
  .bad{margin-top:14px;padding:9px 12px;border-radius:9px;font-size:13px;color:#ffb3c4;
    background:rgba(255,107,138,.12);border:1px solid rgba(255,107,138,.34)}
  code{font:12px ui-monospace,"Courier New",monospace;background:rgba(30,21,54,.8);
    border:1px solid rgba(155,92,255,.18);border-radius:5px;padding:1px 6px;color:#e8dfff}
  ol{margin:14px 0 0;padding-left:20px;color:#a294c6;font-size:13.5px;line-height:1.9}
</style></head><body><div class="card">
<div class="mark"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/>
  <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg></div>
${inner}</div></body></html>`;

const loginPage = (next, wrong) => SHELL("Locked", `
  <h1>Chaston's dashboard</h1>
  <p>Private. Enter the password to carry on.</p>
  <form method="POST" action="/__gate">
    <input type="hidden" name="next" value="${escape(next)}"/>
    <label for="p">Password</label>
    <input id="p" name="password" type="password" autofocus autocomplete="current-password"
      enterkeyhint="go" aria-describedby="${wrong?"err":""}"/>
    <button type="submit">Unlock</button>
    ${wrong?`<p class="bad" id="err" role="alert">That password is not right.</p>`:""}
  </form>`);

const setupPage = () => SHELL("Set a password", `
  <h1>No password set</h1>
  <p>The dashboard is not being served, because serving it would mean serving it
     to everyone. Set the password and it comes straight back.</p>
  <ol>
    <li>Vercel → this project → <b>Settings</b> → <b>Environment&nbsp;Variables</b></li>
    <li>Add <code>DASH_PASSWORD</code> with the password you want, for all environments</li>
    <li><b>Deployments</b> → the newest one → <b>Redeploy</b></li>
  </ol>`);
