(function () {
  var scriptTag =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var TOKEN = scriptTag.getAttribute("data-token");
 var API_URL = "https://swismax.infinityfree.me/api/chat.php";
  var SESSION_ID = "sess_" + Math.random().toString(36).substr(2, 12);

  if (!TOKEN) {
    console.error("Swismax Widget: data-token is missing.");
    return;
  }

  var isDark = false;

  var style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  #sw-wrap * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
#sw-chips { padding: 12px 18px 14px !important; }

    #sw-wrap[data-theme="light"] {
      --bg:         #ffffff;
      --bg-glass:   rgba(255,255,255,0.95);
      --surface:    #f4f4f9;
      --surface2:   #ebebf5;
      --border:     rgba(100,100,180,0.13);
      --border2:    rgba(100,100,180,0.22);
      --text:       #1a1a2e;
      --text2:      #6b6b8a;
      --text3:      #a8a8c0;
      --bot-bg:     #f0f0f8;
      --bot-text:   #1a1a2e;
      --user-bg:    linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
      --chip-bg:    #ffffff;
      --chip-border:rgba(99,102,241,0.22);
      --chip-hover: rgba(99,102,241,0.09);
      --input-bg:   #f7f7fc;
      --shadow-box: 0 8px 40px rgba(80,80,180,0.18), 0 2px 12px rgba(80,80,180,0.08);
      --orb-op:     0.06;
      --ring-op:    0.18;
      --input-placeholder: #c0c0d8;
    }

    #sw-wrap[data-theme="dark"] {
      --bg:         #0d0e1c;
      --bg-glass:   rgba(13,14,28,0.95);
      --surface:    rgba(255,255,255,0.05);
      --surface2:   rgba(255,255,255,0.09);
      --border:     rgba(255,255,255,0.08);
      --border2:    rgba(255,255,255,0.14);
      --text:       #ffffff;
      --text2:      rgba(255,255,255,0.65);
      --text3:      rgba(255,255,255,0.40);
      --bot-bg:     rgba(255,255,255,0.07);
      --bot-text:   rgba(255,255,255,0.92);
      --user-bg:    linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
      --chip-bg:    rgba(255,255,255,0.05);
      --chip-border:rgba(255,255,255,0.12);
      --chip-hover: rgba(99,102,241,0.20);
      --input-bg:   #0d0e1c;
      --shadow-box: 0 32px 90px rgba(0,0,0,0.75), 0 8px 32px rgba(0,0,0,0.45);
      --orb-op:     0.18;
      --ring-op:    0.13;
      --input-placeholder: rgba(255,255,255,0.55);
    }

    /* ════ FAB ════ */
    #sw-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 58px; height: 58px; border-radius: 20px;
      background: linear-gradient(145deg, #6366f1, #8b5cf6, #a78bfa);
      border: none; cursor: pointer; z-index: 999999;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 30px rgba(99,102,241,0.55), 0 2px 8px rgba(0,0,0,0.15);
      transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s, border-radius 0.3s;
    }
    #sw-btn:hover { transform: scale(1.1) translateY(-3px); box-shadow: 0 18px 48px rgba(99,102,241,0.65); }
    #sw-btn:active { transform: scale(0.95); }
    #sw-btn.open { border-radius: 16px; background: linear-gradient(145deg, #4f46e5, #7c3aed); }
    #sw-btn svg {
      width: 22px; height: 22px; stroke: #fff; stroke-width: 2; fill: none;
      stroke-linecap: round; stroke-linejoin: round;
      position: absolute;
      transition: opacity 0.25s, transform 0.3s cubic-bezier(.34,1.56,.64,1);
    }
    #sw-btn .ic-chat  { opacity: 1;  transform: scale(1)   rotate(0deg); }
    #sw-btn .ic-close { opacity: 0;  transform: scale(0.5) rotate(-90deg); }
    #sw-btn.open .ic-chat  { opacity: 0; transform: scale(0.5) rotate(90deg); }
    #sw-btn.open .ic-close { opacity: 1; transform: scale(1)   rotate(0deg); }
    #sw-btn::before {
      content:''; position:absolute; inset:-6px; border-radius:26px;
      border:1.5px solid rgba(99,102,241,0.45);
      animation: fab-ring 3s ease-out infinite;
    }
    #sw-btn.open::before { animation:none; opacity:0; }
    #sw-btn::after {
      content:''; position:absolute; inset:-11px; border-radius:31px;
      border:1px solid rgba(99,102,241,0.20);
      animation: fab-ring 3s ease-out infinite 0.9s;
    }
    #sw-btn.open::after { animation:none; opacity:0; }
    @keyframes fab-ring {
      0%   { transform:scale(1);    opacity:.8; }
      65%  { transform:scale(1.55); opacity:0;  }
      100% { opacity:0; }
    }

    #sw-notif {
      position:absolute; top:-3px; right:-3px;
      width:13px; height:13px; border-radius:50%;
      background:linear-gradient(135deg,#f43f5e,#fb7185);
      border:2px solid #fff;
      animation: notif-pop .5s cubic-bezier(.34,1.56,.64,1) forwards;
    }
    @keyframes notif-pop { from{transform:scale(0)} to{transform:scale(1)} }

    /* ════ CARD ════ */
    #sw-box {
      display: none;
      flex-direction: column;
      position: fixed;
      bottom: 96px; right: 24px;
      width: 380px; height: 580px;
      border-radius: 20px;
      z-index: 999998;
      overflow: hidden;
      box-shadow: var(--shadow-box);
      transform: translateY(22px) scale(0.93);
      opacity: 0;
      transition: transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease;
      will-change: transform, opacity;
      background: var(--bg);
      border: 1.5px solid var(--border);
    }
    #sw-box.open { display:flex; transform:translateY(0) scale(1); opacity:1; }
    #sw-box.animating { display:flex; }

    #sw-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      overflow: hidden;
      position: relative;
    }

    /* ════ ORBS ════ */
    #sw-orbs {
      position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;
    }
    .orb { position:absolute; border-radius:50%; filter:blur(60px); opacity:var(--orb-op); }
    .orb1 { width:260px;height:260px;top:-100px;left:-80px; background:radial-gradient(circle,#6366f1,#8b5cf6 60%,transparent); animation:ob1 10s ease-in-out infinite; }
    .orb2 { width:180px;height:180px;bottom:60px;right:-60px; background:radial-gradient(circle,#06b6d4,#3b82f6 60%,transparent); animation:ob2 13s ease-in-out infinite; }
    @keyframes ob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,15px)} }
    @keyframes ob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,-10px)} }

    /* ════ HEADER ════ */
    #sw-header {
      position:relative; z-index:2;
      padding: 16px 18px;
      display:flex; align-items:center; gap:12px;
      flex-shrink:0;
      background: var(--bg-glass);
      border-bottom: 1px solid var(--border);
    }
    #sw-header::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
      background: linear-gradient(90deg, transparent, #6366f1 30%, #8b5cf6 50%, #06b6d4 70%, transparent);
      background-size: 200% 100%;
      animation: header-shimmer 4s linear infinite;
    }
    @keyframes header-shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

    .h-avatar {
      width:40px; height:40px; border-radius:12px; flex-shrink:0;
      background:linear-gradient(145deg,#6366f1,#8b5cf6);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 14px rgba(99,102,241,0.45);
    }
    .h-avatar svg { width:18px; height:18px; stroke:#fff; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; }

    .h-text { flex:1; min-width:0; }
    .h-name { font-size:14px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
    .h-status { font-size:11px; color:var(--text2); display:flex; align-items:center; gap:5px; margin-top:2px; }
    .h-dot {
      width:7px; height:7px; border-radius:50%; background:#34d399; flex-shrink:0;
      animation: status-pulse 2.5s ease-in-out infinite;
    }
    @keyframes status-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.5)} 50%{box-shadow:0 0 0 5px rgba(52,211,153,0)} }

    .h-btns { display:flex; gap:6px; flex-shrink:0; }
    .h-btn {
      width:34px; height:34px; border-radius:10px;
      border:1px solid var(--border2); background:var(--surface);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      color:var(--text2);
      transition: background .18s, transform .15s, color .18s;
    }
    .h-btn:hover { background:var(--surface2); color:#6366f1; transform:scale(1.08); }
    .h-btn svg { width:14px; height:14px; stroke:currentColor; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; }
    .ic-sun  { display:none; }
    .ic-moon { display:block; }
    #sw-wrap[data-theme="light"] .ic-sun  { display:block; }
    #sw-wrap[data-theme="light"] .ic-moon { display:none; }

    /* ════ MESSAGES ════ */
    #sw-msgs {
      flex:1; overflow-y:auto;
      padding: 20px 18px 12px 18px;
      display:flex; flex-direction:column; gap:16px;
      position:relative; z-index:1;
      scrollbar-width:thin; scrollbar-color:var(--border2) transparent;
    }
    #sw-msgs::-webkit-scrollbar { width:4px; }
    #sw-msgs::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

    .date-sep {
      display:flex; align-items:center; gap:10px;
    }
    .date-sep span { font-size:10px; font-weight:600; color:var(--text3); letter-spacing:.07em; text-transform:uppercase; white-space:nowrap; }
    .date-sep::before,.date-sep::after { content:''; flex:1; height:1px; background:var(--border); }

    /* Message group */
    .sw-msg {
      display:flex;
      align-items:flex-start;
      gap:10px;
      width: 100%;
      animation: msg-in .28s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    @keyframes msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

    .sw-msg.bot  { flex-direction: row; justify-content: flex-start;  padding-right: 24px;}
    .sw-msg.user { flex-direction: row-reverse; justify-content: flex-start; }

    .m-av {
      width:32px; height:32px; border-radius:50%;
      flex-shrink:0;
      background:linear-gradient(145deg,#6366f1,#8b5cf6);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 8px rgba(99,102,241,.35);
      margin-top: 2px;
    }
    .m-av svg { width:14px; height:14px; stroke:#fff; stroke-width:2.2; fill:none; stroke-linecap:round; stroke-linejoin:round; }

    .user .m-av { display:none; }

    .m-col {
      display:flex; flex-direction:column; gap:6px;
      max-width: calc(100% - 54px);
      min-width: 0;
    }
    .user .m-col { align-items: flex-end; }
    .bot  .m-col { align-items: flex-start; }

    .bubble {
      padding: 14px 18px !important;
      font-size: 13.5px;
      line-height: 1.6;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .bot .bubble {
      background: var(--bot-bg);
      color: var(--bot-text);
      border-radius: 4px 18px 18px 18px;
    }
    .user .bubble {
      background: var(--user-bg);
      color: #fff;
      border-radius: 18px 4px 18px 18px;
      box-shadow: 0 4px 18px rgba(99,102,241,.35);
    }

    .m-time {
      font-size: 10px; color: var(--text3); font-weight:500;
      padding: 0 4px;
    }

    .m-reactions {
      display:flex; align-items:center; gap:8px;
      padding: 0 2px;
    }
    .react-btn {
      background: none; border: none; cursor: pointer;
      color: var(--text3); padding: 2px 4px; border-radius: 6px;
      display:flex; align-items:center; gap:4px;
      font-size: 11px;
      transition: color .15s, background .15s;
    }
    .react-btn:hover { color: #6366f1; background: rgba(99,102,241,0.08); }
    .react-btn.active { color: #6366f1; }
    .react-btn svg { width:13px; height:13px; stroke:currentColor; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; }

    .typing-bubble {
      padding: 14px 18px;
      background: var(--bot-bg);
      border-radius: 4px 18px 18px 18px;
      display:flex; gap:5px; align-items:center;
    }
    .typing-bubble span {
      width:7px; height:7px; border-radius:50%;
      background: #6366f1;
      display:inline-block;
      animation: tdot 1.4s ease-in-out infinite;
    }
    .typing-bubble span:nth-child(2) { animation-delay:.2s; }
    .typing-bubble span:nth-child(3) { animation-delay:.4s; }
    @keyframes tdot {
      0%,80%,100% { transform:translateY(0) scale(1);   opacity:.3; }
      40%         { transform:translateY(-7px) scale(1.15); opacity:1; }
    }

    /* ════ CHIPS ════ */
   #sw-chips {
  display:flex; flex-wrap:wrap; gap:8px;
  padding: 12px 18px 14px !important;
  position:relative; z-index:1;
}
  #sw-chips .chip {
  margin: 0 !important;
}
    .chip {
      padding: 7px 14px; ;
      border-radius: 999px;
      border: 1px solid var(--chip-border);
      background: var(--chip-bg);
      font-size: 12px; font-weight:500;
      color: #6366f1;
      cursor: pointer;
      transition: all .2s ease;
      box-shadow:0 1px 4px rgba(0,0,0,.05);
    }
    .chip:hover {
      background: rgba(99,102,241,0.08);
      border-color: #6366f1;
      transform: translateY(-1px);
    }
    .chip:active { transform:scale(.97); }

    /* ════ INPUT AREA ════ */
    #sw-input-row {
     padding: 12px 28px 14px;
      border-top: 1px solid var(--border);
      position:relative; z-index:2;
      background: var(--bg-glass);
    }

    #sw-input-shell {
      position:relative;
      border-radius: 14px;
      padding: 1.5px;
      background: conic-gradient(
        from var(--input-angle, 0deg),
        #6366f1, #8b5cf6, #06b6d4, #10b981, #a78bfa, #6366f1
      );
      animation: input-border-spin 4s linear infinite;
    }
    @property --input-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
    @keyframes input-border-spin { to { --input-angle: 360deg; } }
    @supports not (background: conic-gradient(from 0deg, red, blue)) {
      #sw-input-shell { background: linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4); }
    }

    #sw-input-wrap {
      display:flex; align-items:center; gap:10px;
      background: var(--input-bg);
      border-radius: 13px;
      padding: 10px 10px 10px 16px;
    }

    .orbit-track {
      position:absolute; inset:-9px; border-radius:21px;
      border:1px dashed rgba(99,102,241,var(--ring-op));
      pointer-events:none;
      animation: orbit-spin 18s linear infinite;
      z-index:0;
    }
    @keyframes orbit-spin { to { transform:rotate(360deg); } }
    .orbit-dot {
      position:absolute; top:-3.5px; left:50%; margin-left:-3.5px;
      width:7px; height:7px; border-radius:50%;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      box-shadow:0 0 8px 2px rgba(99,102,241,.6);
    }
    .orbit-track-2 {
      position:absolute; inset:-9px; border-radius:21px;
      pointer-events:none;
      animation: orbit-spin-r 22s linear infinite;
      z-index:0;
    }
    @keyframes orbit-spin-r { to { transform:rotate(-360deg); } }
    .orbit-dot-2 {
      position:absolute; bottom:-3px; right:22%;
      width:5px; height:5px; border-radius:50%;
      background:linear-gradient(135deg,#8b5cf6,#06b6d4);
      box-shadow:0 0 6px 2px rgba(139,92,246,.5);
    }

    #sw-input {
      flex:1; background:transparent; border:none; outline:none;
      font-size:13.5px; font-family:'Inter',sans-serif;
      color: var(--text);
      min-width:0;
    }
    #sw-input::placeholder {
      color: var(--input-placeholder);
      opacity: 1;
    }

    #sw-send {
      width:36px; height:36px; flex-shrink:0;
      background:linear-gradient(145deg,#6366f1,#7c3aed);
      border:none; border-radius:10px; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 3px 14px rgba(99,102,241,.45);
      transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, opacity .15s;
    }
    #sw-send:hover { transform:scale(1.08); box-shadow:0 6px 22px rgba(99,102,241,.55); }
    #sw-send:active { transform:scale(.94); }
    #sw-send:disabled { opacity:.4; cursor:default; transform:none; }
    #sw-send svg { width:15px; height:15px; stroke:#fff; stroke-width:2.2; fill:none; stroke-linecap:round; stroke-linejoin:round; }

    /* ════ FOOTER ════ */
    #sw-footer {
      text-align:center; padding:4px 0 8px;
      font-size:10px; color:var(--text3);
      position:relative; z-index:1;
      letter-spacing:.03em;
    }
    #sw-footer a { color:var(--text3); text-decoration:none; transition:color .18s; }
    #sw-footer a:hover { color:#6366f1; }
    #sw-footer .sw-star { color:rgba(99,102,241,.6); }

    /* ════ RESPONSIVE ════ */
    @media (max-width:480px) {
      #sw-box { width:calc(100vw - 16px); right:8px; bottom:84px; height:calc(100vh - 104px); max-height:600px; }
      #sw-btn { bottom:16px; right:16px; }
    }

    @media (prefers-reduced-motion:reduce) {
      .orb,#sw-btn::before,#sw-btn::after,.h-dot,#sw-header::after { animation:none; }
      #sw-input-shell { animation:none; }
      .orbit-track,.orbit-track-2 { animation:none; }
    }
  `;
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.id = "sw-wrap";
  wrap.setAttribute("data-theme", "light");

  wrap.innerHTML = `
    <button id="sw-btn" aria-label="Open chat">
      <div id="sw-notif" aria-hidden="true"></div>
      <svg class="ic-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <svg class="ic-close" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="sw-box" role="dialog" aria-label="Chat assistant" aria-modal="true">
      <div id="sw-inner">
        <div id="sw-orbs" aria-hidden="true">
          <div class="orb orb1"></div>
          <div class="orb orb2"></div>
        </div>

        <div id="sw-header">
          <div class="h-avatar">
            <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div class="h-text">
            <div class="h-name">AI Assistant</div>
            <div class="h-status"><span class="h-dot"></span>Online · replies instantly</div>
          </div>
          <div class="h-btns">
            <button class="h-btn" id="sw-theme-btn" aria-label="Toggle theme">
              <svg class="ic-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              <svg class="ic-sun" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button class="h-btn" id="sw-close-btn" aria-label="Close chat">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div id="sw-msgs" role="log" aria-live="polite">
          <div class="date-sep"><span>Today</span></div>
        </div>

        <div id="sw-chips"  >
          <button class="chip" style="padding: 5px 7px;" data-msg="What do you offer?">✦ What do you offer?</button>
          <button class="chip" style="padding: 5px 7px;" data-msg="How can I contact you?">✉ Contact info</button>
          <button class="chip" style="padding: 5px 7px;" data-msg="Tell me about pricing">💳 Pricing</button>
          <button class="chip" style="padding: 5px 7px;" data-msg="How do I get started?">🚀 Get started</button>
        </div>

        <div id="sw-input-row">
          <div id="sw-input-shell">
            <div class="orbit-track" aria-hidden="true"><div class="orbit-dot"></div></div>
            <div class="orbit-track-2" aria-hidden="true"><div class="orbit-dot-2"></div></div>
            <div id="sw-input-wrap">
              <input id="sw-input" placeholder="Ask me anything…" autocomplete="off" aria-label="Message" maxlength="500"/>
              <button id="sw-send" aria-label="Send">
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div id="sw-footer">Powered by <span class="sw-star">✦</span> <a href="https://swismax.com" target="_blank" rel="noopener">Swismax</a></div>
      </div>
    </div>
  `;

  document.body.appendChild(wrap);
  document.body.appendChild(wrap);
  document.getElementById("sw-chips").style.cssText =
    "display:flex; flex-wrap:wrap; gap:8px; padding:12px 18px 14px; position:relative; z-index:1;";
  var btn = document.getElementById("sw-btn");
  var box = document.getElementById("sw-box");
  var inp = document.getElementById("sw-input");
  var sendBtn = document.getElementById("sw-send");
  var msgs = document.getElementById("sw-msgs");
  var chips = document.getElementById("sw-chips");
  var themeBtn = document.getElementById("sw-theme-btn");
  var closeBtn = document.getElementById("sw-close-btn");
  var notif = document.getElementById("sw-notif");
  var isOpen = false;

  function ts() {
    var d = new Date(),
      h = d.getHours(),
      m = d.getMinutes();
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" + m : m) + " " + ap;
  }

  setTimeout(function () {
    addMsg("Hi there! 👋 How can I help you today?", "bot");
  }, 300);

  function openChat() {
    isOpen = true;
    btn.classList.add("open");
    if (notif) {
      notif.remove();
      notif = null;
    }
    box.style.display = "flex";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        box.classList.add("open");
        setTimeout(function () {
          inp.focus();
        }, 80);
      });
    });
  }
  function closeChat() {
    isOpen = false;
    btn.classList.remove("open");
    box.classList.remove("open");
    setTimeout(function () {
      box.style.display = "none";
    }, 400);
  }

  btn.addEventListener("click", function () {
    isOpen ? closeChat() : openChat();
  });
  closeBtn.addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeChat();
  });
  document.addEventListener("click", function (e) {
    if (isOpen && !wrap.contains(e.target)) closeChat();
  });

  themeBtn.addEventListener("click", function () {
    isDark = !isDark;
    wrap.setAttribute("data-theme", isDark ? "dark" : "light");
  });

  chips.addEventListener("click", function (e) {
    var c = e.target.closest(".chip");
    if (!c) return;
    var msg = c.getAttribute("data-msg") || c.textContent.trim();
    chips.style.display = "none";
    addMsg(msg, "user");
    showTyping();
    callAPI(msg);
  });

  function addMsg(text, who, id) {
    var row = document.createElement("div");
    row.className = "sw-msg " + who;
    if (id) row.id = id;

    if (who === "bot") {
      var av = document.createElement("div");
      av.className = "m-av";
      av.setAttribute("aria-hidden", "true");
      av.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
      row.appendChild(av);
    }

    var col = document.createElement("div");
    col.className = "m-col";

    if (id === "sw-typing") {
      var tb = document.createElement("div");
      tb.className = "typing-bubble";
      tb.innerHTML = "<span></span><span></span><span></span>";
      col.appendChild(tb);
    } else {
      var bub = document.createElement("div");
      bub.className = "bubble";
      bub.textContent = text;
      col.appendChild(bub);

      var t = document.createElement("div");
      t.className = "m-time";
      t.textContent = ts();
      col.appendChild(t);

      if (who === "bot") {
        var reactions = document.createElement("div");
        reactions.className = "m-reactions";
        reactions.innerHTML = `
          <button class="react-btn" aria-label="Helpful" title="Helpful">
            <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
          </button>
          <button class="react-btn" aria-label="Not helpful" title="Not helpful">
            <svg viewBox="0 0 24 24"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
          </button>
        `;
        reactions.querySelectorAll(".react-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            reactions.querySelectorAll(".react-btn").forEach(function (b) {
              b.classList.remove("active");
            });
            this.classList.add("active");
          });
        });
        col.appendChild(reactions);
      }
    }

    row.appendChild(col);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    addMsg("", "bot", "sw-typing");
  }
  function removeTyping() {
    var t = document.getElementById("sw-typing");
    if (t) t.remove();
  }

  function sendMsg() {
    var msg = inp.value.trim();
    if (!msg) return;
    chips.style.display = "none";
    addMsg(msg, "user");
    inp.value = "";
    sendBtn.disabled = true;
    showTyping();
    callAPI(msg);
  }

  function callAPI(message) {
  fetch('https://job-hunt-frontend-green.vercel.app/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      max_tokens: 512,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
  })
  .then(r => r.json())
  .then(d => {
    removeTyping();
    sendBtn.disabled = false;
    addMsg(d.choices[0].message.content || 'Sorry, try again.', 'bot');
  })
  .catch(() => {
    removeTyping();
    sendBtn.disabled = false;
    addMsg('Network error — please try again.', 'bot');
  });
}
  sendBtn.addEventListener("click", sendMsg);
  inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  });
})();
