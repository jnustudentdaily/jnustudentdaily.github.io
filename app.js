/* ============================================================================
   JNU STUDENT DAILY — APP LOGIC
   Vanilla JS. No frameworks, no build step. Reads everything from data.js
   via the window.JSD.* async functions, so swapping in a real backend never
   touches this file.

   Contents:
     1. Small helpers (escape, dates, tier labels, icons)
     2. Shared chrome (theme toggle, mobile drawer, search overlay, active nav)
     3. Component renderers (cards, hero, notices, events, issues, etc.)
     4. Page bootstrappers (home, events, issues, search, article)
============================================================================ */
(function () {
  "use strict";
  const { getArticles, getNotices, getEvents, getOpportunities, getIssues,
          getTicker, getQuickLinks, getSite, getArticleById } = window.JSD;

  /* ---- 1. HELPERS -------------------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const TIER_LABEL = {
    official:   "Official Notice",
    reported:   "Reported News",
    submission: "Student Submission",
    opinion:    "Opinion"
  };
  const tierTag = (tier) =>
    `<span class="tier tier--${esc(tier)}">${esc(TIER_LABEL[tier] || tier)}</span>`;

  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return `${d.getDate()} ${MONTHS[d.getMonth()][0] + MONTHS[d.getMonth()].slice(1).toLowerCase()} ${d.getFullYear()}`;
  }
  function relTime(iso) {
    const d = new Date(iso), now = new Date();
    const mins = Math.round((now - d) / 60000);
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return fmtDate(iso);
  }

  // Tiny inline icon set (stroke-based, inherit currentColor).
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    sun:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
    news:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v14H5a1 1 0 0 1-1-1z"/><path d="M17 8h3v9a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7M7 17h4"/></svg>',
    events: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>',
    alert:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10.5 20a1.8 1.8 0 0 0 3 0"/></svg>',
    clock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    user:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    arrow:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    cal:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4M12 13v4M10 15h4"/></svg>',
    link:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
    share:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg>',
    verify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/></svg>'
  };

  /* ---- 2. SHARED CHROME -------------------------------------------------- */

  // Theme: respects saved choice, else system preference.
  function initTheme() {
    const saved = localStorage.getItem("jsd-theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (sysDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcon(theme);
  }
  function updateThemeIcon(theme) {
    const btn = $("#themeToggle");
    if (btn) btn.innerHTML = theme === "dark" ? ICON.sun : ICON.moon;
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("jsd-theme", next);
    updateThemeIcon(next);
  }

  // Mobile drawer
  function toggleDrawer(force) {
    const d = $("#drawer");
    if (!d) return;
    const open = force != null ? force : !d.classList.contains("open");
    d.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  // Search overlay + live client-side search across ALL content types.
  async function buildSearchIndex() {
    const [arts, evts, notes, opps, iss] = await Promise.all([
      getArticles(), getEvents(), getNotices(), getOpportunities(), getIssues()
    ]);
    const idx = [];
    arts.forEach(a => idx.push({ kind: "Article", title: a.title, meta: a.category,
      text: [a.title, a.summary, a.category, (a.tags || []).join(" ")].join(" ").toLowerCase(),
      href: `article.html?id=${a.id}` }));
    evts.forEach(e => idx.push({ kind: "Event", title: e.title, meta: fmtDate(e.date),
      text: [e.title, e.description, e.venue, e.organizer, e.category].join(" ").toLowerCase(),
      href: `events.html#${e.id}` }));
    notes.forEach(n => idx.push({ kind: "Notice", title: n.title, meta: n.type,
      text: [n.title, n.type].join(" ").toLowerCase(), href: `index.html#today` }));
    opps.forEach(o => idx.push({ kind: "Opportunity", title: o.title, meta: o.type,
      text: [o.title, o.type].join(" ").toLowerCase(), href: `index.html#opportunities` }));
    iss.forEach(i => idx.push({ kind: "Issue", title: i.title, meta: i.category,
      text: [i.title, i.category, i.status, i.ref].join(" ").toLowerCase(),
      href: `issues.html#${i.id}` }));
    return idx;
  }
  let SEARCH_INDEX = null;
  async function openSearch() {
    $("#searchOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
    const input = $("#searchInput");
    input.value = ""; input.focus();
    if (!SEARCH_INDEX) SEARCH_INDEX = await buildSearchIndex();
    renderSearchResults("");
  }
  function closeSearch() {
    $("#searchOverlay").classList.remove("open");
    document.body.style.overflow = "";
  }
  function renderSearchResults(q) {
    const box = $("#searchResults");
    q = q.trim().toLowerCase();
    if (!q) { box.innerHTML = `<p class="search-hint">Search articles, events, notices, opportunities and campus issues.</p>`; return; }
    const hits = (SEARCH_INDEX || []).filter(r => r.text.includes(q)).slice(0, 12);
    if (!hits.length) { box.innerHTML = `<p class="search-hint">No results for “${esc(q)}”. Try a broader term.</p>`; return; }
    box.innerHTML = hits.map(r => `
      <a class="search-row" href="${esc(r.href)}">
        <span class="k">${esc(r.kind)}</span>
        <span class="t">${esc(r.title)}</span>
        <span class="m">${esc(r.meta || "")}</span>
      </a>`).join("");
  }

  // Inject shared header + footer + overlays into every page.
  async function mountChrome(active) {
    const site = await getSite();
    const NAV = [
      ["Home","index.html"],["Breaking","index.html#breaking"],["Academics","index.html#academics"],
      ["Admissions","index.html#admissions"],["Hostel","index.html#hostel"],
      ["Campus Life","index.html#campus"],["Events","events.html"],
      ["Opportunities","index.html#opportunities"],["Student Issues","issues.html"],
      ["Explainers","index.html#explainers"]
    ];
    const navHtml = NAV.map(([label, href]) =>
      `<a href="${href}"${isActive(href, active) ? ' aria-current="page"' : ''}>${label}</a>`).join("");

    // Header
    const header = $("#site-header");
    if (header) header.innerHTML = `
      ${site.demoBanner ? `<div class="demo-ribbon">Demo content — sample data for design preview, not real news</div>` : ""}
      <div id="tickerMount"></div>
      <div class="masthead">
        <div class="wrap masthead__bar">
          <a class="brand" href="index.html" aria-label="${esc(site.name)} home">
            <span class="brand__name">JNU <span class="accent">Student</span> Daily</span>
            <span class="brand__tag">${esc(site.tagline)}</span>
          </a>
          <nav class="nav" aria-label="Primary">${navHtml}</nav>
          <div class="tools">
            <button class="icon-btn" id="searchBtn" aria-label="Search" title="Search">${ICON.search}</button>
            <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode" title="Dark / light"></button>
            <button class="icon-btn hamburger" id="menuBtn" aria-label="Open menu" aria-expanded="false">${ICON.menu}</button>
          </div>
        </div>
      </div>`;

    // Footer
    const footer = $("#site-footer");
    if (footer) footer.innerHTML = renderFooter(site);

    // Overlays + drawer + tab bar appended once
    document.body.insertAdjacentHTML("beforeend", `
      <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-panel">
          <input id="searchInput" type="search" placeholder="Search JNU Student Daily…" autocomplete="off" aria-label="Search query"/>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>
      <div class="drawer" id="drawer">
        <div class="drawer__scrim" data-close-drawer></div>
        <nav class="drawer__panel" aria-label="Mobile">
          <div class="drawer__head">
            <span class="brand__name">Menu</span>
            <button class="icon-btn" data-close-drawer aria-label="Close menu">${ICON.close}</button>
          </div>
          ${NAV.map(([l,h]) => `<a href="${h}">${l}</a>`).join("")}
          <a href="issues.html#report">Report a Campus Issue</a>
          <a href="about.html">About</a>
        </nav>
      </div>
      <nav class="tabbar" aria-label="Mobile quick nav">
        <a href="index.html"${active==="home"?' aria-current="page"':''}>${ICON.home}<span>Home</span></a>
        <a href="index.html#breaking"${active==="news"?' aria-current="page"':''}>${ICON.news}<span>News</span></a>
        <a href="events.html"${active==="events"?' aria-current="page"':''}>${ICON.events}<span>Events</span></a>
        <a href="index.html#alerts"${active==="alerts"?' aria-current="page"':''}>${ICON.alert}<span>Alerts</span></a>
        <a href="#" id="tabMenu">${ICON.menu}<span>Menu</span></a>
      </nav>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    `);

    // Ticker
    const ticker = await getTicker();
    const tickerItems = ticker.map(t =>
      `<span class="ticker__item"><b>${esc(t.text)}</b><time>${esc(t.time)}</time></span>`).join("");
    $("#tickerMount").innerHTML = `
      <div class="ticker" aria-label="Breaking updates">
        <span class="ticker__tag">Breaking</span>
        <div class="ticker__track">${tickerItems}${tickerItems}</div>
      </div>`;

    wireChrome();
    initTheme();
  }

  function isActive(href, active) {
    const file = href.split("#")[0];
    if (active === "home" && file === "index.html") return true;
    if (active === "events" && file === "events.html") return true;
    if (active === "issues" && file === "issues.html") return true;
    return false;
  }

  function renderFooter(site) {
    // >>> ADD / EDIT FOOTER LINKS AND SOCIAL URLS HERE (social from data.js).
    const soc = site.social || {};
    const s = (name, url) => `<a href="${esc(url || "#")}" aria-label="${name}" rel="noopener" target="_blank">${name[0]}</a>`;
    return `
      <div class="wrap">
        <div class="footer__grid">
          <div class="footer__brand">
            <span class="brand__name">JNU <span class="accent" style="color:var(--red)">Student</span> Daily</span>
            <p>${esc(site.tagline)} An independent student-run information platform. Demo build.</p>
            <div class="footer__social">
              ${s("Instagram", soc.instagram)}${s("Twitter", soc.twitter)}${s("Telegram", soc.telegram)}${s("YouTube", soc.youtube)}
            </div>
          </div>
          <div>
            <h5>Sections</h5>
            <ul>
              <li><a href="index.html#academics">Academics</a></li>
              <li><a href="index.html#admissions">Admissions</a></li>
              <li><a href="index.html#hostel">Hostel &amp; Campus</a></li>
              <li><a href="events.html">Events</a></li>
              <li><a href="index.html#opportunities">Opportunities</a></li>
            </ul>
          </div>
          <div>
            <h5>Participate</h5>
            <ul>
              <li><a href="issues.html#report">Report an Issue</a></li>
              <li><a href="about.html#submit">Submit News</a></li>
              <li><a href="index.html#alerts">Get Alerts</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="about.html#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li><a href="about.html#advertise">Advertise</a></li>
              <li><a href="about.html#privacy">Privacy Policy</a></li>
              <li><a href="about.html#terms">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bar">
          <span>© ${new Date().getFullYear()} JNU Student Daily · Demo. Not affiliated with Jawaharlal Nehru University.</span>
          <span>Built with HTML, CSS &amp; vanilla JS.</span>
        </div>
      </div>`;
  }

  function wireChrome() {
    $("#themeToggle")?.addEventListener("click", toggleTheme);
    $("#searchBtn")?.addEventListener("click", openSearch);
    $("#menuBtn")?.addEventListener("click", () => {
      const b = $("#menuBtn"); const open = !$("#drawer").classList.contains("open");
      b.setAttribute("aria-expanded", String(open)); toggleDrawer(open);
    });
    $("#tabMenu")?.addEventListener("click", (e) => { e.preventDefault(); toggleDrawer(true); });
    $$("[data-close-drawer]").forEach(el => el.addEventListener("click", () => toggleDrawer(false)));
    $("#searchOverlay")?.addEventListener("click", (e) => { if (e.target.id === "searchOverlay") closeSearch(); });
    $("#searchInput")?.addEventListener("input", (e) => renderSearchResults(e.target.value));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); toggleDrawer(false); }
      if ((e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) &&
          !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault(); openSearch();
      }
    });
  }

  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---- 3. COMPONENT RENDERERS ------------------------------------------- */
  function articleCard(a) {
    return `
      <article class="card" data-tier="${esc(a.tier)}">
        <a class="card__media" href="article.html?id=${esc(a.id)}" tabindex="-1" aria-hidden="true">
          <img src="${esc(a.image)}" alt="" loading="lazy" width="800" height="450"/>
        </a>
        <div class="card__body">
          <div class="card__row">
            <span class="eyebrow">${esc(a.category)}</span>${tierTag(a.tier)}
          </div>
          <h3 class="card__title"><a href="article.html?id=${esc(a.id)}">${esc(a.title)}</a></h3>
          <p class="card__summary">${esc(a.summary)}</p>
          <div class="card__foot meta">
            <time datetime="${esc(a.published)}">${relTime(a.published)}</time> · ${esc(a.readingTimeMin)} min read
          </div>
        </div>
      </article>`;
  }

  function miniCard(a) {
    return `
      <article class="mini" data-tier="${esc(a.tier)}">
        <a class="mini__media" href="article.html?id=${esc(a.id)}" aria-hidden="true" tabindex="-1">
          <img src="${esc(a.image)}" alt="" loading="lazy" width="200" height="200"/>
        </a>
        <div class="mini__body">
          <span class="eyebrow">${esc(a.category)}</span>
          <h3 class="mini__title"><a href="article.html?id=${esc(a.id)}">${esc(a.title)}</a></h3>
          <span class="meta"><time datetime="${esc(a.published)}">${relTime(a.published)}</time></span>
        </div>
      </article>`;
  }

  function flashCard(a) {
    return `
      <article class="flash">
        <div class="card__row"><span class="eyebrow">${esc(a.category)}</span>${tierTag(a.tier)}</div>
        <h3 class="flash__title"><a href="article.html?id=${esc(a.id)}">${esc(a.title)}</a></h3>
        <span class="meta"><time datetime="${esc(a.published)}">${relTime(a.published)}</time></span>
      </article>`;
  }

  function eventCard(e) {
    const d = new Date(e.date);
    return `
      <article class="event" id="${esc(e.id)}" data-tier="${esc(e.tier)}">
        <div class="event__date">
          <span class="event__day">${isNaN(d) ? "–" : d.getDate()}</span>
          <span class="event__mon">${isNaN(d) ? "" : MONTHS[d.getMonth()]}</span>
        </div>
        <div>
          <div class="card__row" style="margin-bottom:4px">
            <span class="eyebrow">${esc(e.category)}</span>${tierTag(e.tier)}
          </div>
          <h3 class="event__title">${esc(e.title)}</h3>
          <div class="event__meta">
            <span>${ICON.clock}${esc(e.time)}</span>
            <span>${ICON.pin}${esc(e.venue)}</span>
            <span>${ICON.user}${esc(e.organizer)}</span>
          </div>
          <p class="event__desc">${esc(e.description)}</p>
          <button class="btn-cal" data-ics="${esc(e.id)}">${ICON.cal} Add to calendar</button>
        </div>
      </article>`;
  }

  const PIPELINE = ["Reported","Under Review","Authority Contacted","Action Taken","Resolved"];
  function issueCard(i) {
    const curIdx = PIPELINE.indexOf(i.status);
    const pips = PIPELINE.map((label, idx) => {
      const cls = idx < curIdx ? "done" : idx === curIdx ? "current" : "";
      const line = idx < PIPELINE.length - 1
        ? `<span class="pip__line ${idx < curIdx ? "done" : ""}" style="${idx < curIdx ? "background:var(--green)" : ""}"></span>` : "";
      return `<span class="pip ${cls}"><span class="pip__dot"></span><span class="pip__label">${label}</span></span>${line}`;
    }).join("");
    return `
      <article class="issue" id="${esc(i.id)}">
        <div class="issue__top">
          <span class="issue__ref">${esc(i.ref)}</span>
          <span class="issue__cat">${esc(i.category)}</span>
          ${tierTag(i.tier)}
          ${i.anonymous ? `<span class="meta">· Anonymous</span>` : ""}
          <span class="meta" style="margin-left:auto">Reported ${fmtDate(i.reported)}</span>
        </div>
        <h3 class="issue__title">${esc(i.title)}</h3>
        <div class="pipeline">${pips}</div>
      </article>`;
  }

  // Build a downloadable .ics so "Add to calendar" actually works offline.
  function downloadICS(ev) {
    const dt = ev.date.replace(/-/g, "");
    const [hh, mm] = (ev.time || "09:00").split(":");
    const start = `${dt}T${(hh||"09").padStart(2,"0")}${(mm||"00").padStart(2,"0")}00`;
    const endH = String((parseInt(hh || "9", 10) + 1)).padStart(2, "0");
    const end = `${dt}T${endH}${(mm||"00").padStart(2,"0")}00`;
    const ics = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//JNU Student Daily//EN","BEGIN:VEVENT",
      `UID:${ev.id}@jnustudentdaily`, `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${ev.title}`, `LOCATION:${ev.venue}`, `DESCRIPTION:${ev.description} (${ev.organizer})`,
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${ev.id}.ics`; a.click();
    URL.revokeObjectURL(url);
    toast("Calendar file downloaded");
  }

  /* ---- 4. PAGE BOOTSTRAPPERS -------------------------------------------- */

  async function initHome() {
    await mountChrome("home");
    const arts = await getArticles();
    const featured = arts.find(a => a.featured) || arts[0];
    const side = arts.filter(a => a.id !== featured.id).slice(0, 4);

    // Hero
    $("#hero").innerHTML = `
      <div class="wrap hero__grid">
        <article class="lede" data-tier="${esc(featured.tier)}">
          <a class="lede__media" href="article.html?id=${esc(featured.id)}" aria-hidden="true" tabindex="-1">
            <img src="${esc(featured.image)}" alt="" width="800" height="450" fetchpriority="high"/>
          </a>
          <div class="lede__body">
            <div class="card__row"><span class="eyebrow">${esc(featured.category)}</span>${tierTag(featured.tier)}</div>
            <h1 class="lede__title"><a href="article.html?id=${esc(featured.id)}">${esc(featured.title)}</a></h1>
            <p class="lede__summary">${esc(featured.summary)}</p>
            <div class="meta"><span class="byline__who" style="font-size:.82rem">${esc(featured.author)}</span> ·
              <time datetime="${esc(featured.published)}">${relTime(featured.published)}</time> · ${esc(featured.readingTimeMin)} min read</div>
          </div>
        </article>
        <div class="hero__side">${side.map(miniCard).join("")}</div>
      </div>`;

    // JNU Today (notices)
    const notices = await getNotices();
    $("#today").innerHTML = `
      <div class="wrap">
        <div class="today">
          <div class="today__head">
            <span class="today__badge">JNU Today</span>
            <span class="today__sub">Deadlines, exams, registration &amp; campus updates you can't miss</span>
          </div>
          <div class="today__list">
            ${notices.map(n => `
              <div class="today__item">
                <span class="today__type">${esc(n.type)}</span>
                <span class="today__text">${esc(n.title)}<span class="today__due">Due ${fmtDate(n.due)}</span></span>
              </div>`).join("")}
          </div>
        </div>
      </div>`;

    // Breaking
    fillSection("#breaking-grid", arts.slice(0, 4).map(flashCard).join(""));
    // Academics / Admissions / Hostel / Campus by category
    fillSection("#academics-grid",  byCat(arts, ["Academics","Explainers"]).slice(0,3).map(articleCard).join(""));
    fillSection("#admissions-grid", byCat(arts, ["Admissions","Opportunities"]).slice(0,3).map(articleCard).join(""));
    fillSection("#hostel-grid",     byCat(arts, ["Hostel","Campus Life"]).slice(0,3).map(articleCard).join(""));
    fillSection("#explainers-grid", byCat(arts, ["Explainers"]).concat(byCat(arts, ["Academics"])).slice(0,3).map(articleCard).join(""));
    fillSection("#voices-grid",     byCat(arts, ["Student Voices"]).concat(byCat(arts,["Opinion"])).slice(0,2).map(articleCard).join(""));

    // Opportunities list
    const opps = await getOpportunities();
    $("#opportunities-grid").innerHTML = opps.map(o => `
      <article class="flash">
        <div class="card__row"><span class="eyebrow">${esc(o.type)}</span>${tierTag(o.tier)}</div>
        <h3 class="flash__title">${esc(o.title)}</h3>
        <span class="meta">Deadline ${fmtDate(o.deadline)}</span>
      </article>`).join("");

    // Events preview
    const evts = await getEvents();
    $("#events-grid").innerHTML = evts.slice(0, 4).map(eventCard).join("");

    // Issues preview
    const iss = await getIssues();
    $("#issues-grid").innerHTML = iss.slice(0, 3).map(issueCard).join("");

    // Quick links
    const ql = await getQuickLinks();
    $("#quicklinks").innerHTML = ql.map(l => `
      <a class="qlink" href="${esc(l.url)}" ${l.url === "#" ? "" : 'target="_blank" rel="noopener"'}>
        ${esc(l.label)} <span class="arrow">${ICON.arrow}</span>
      </a>`).join("");

    wireEvents();
    wireAlerts();
  }

  function byCat(arts, cats) { return arts.filter(a => cats.includes(a.category)); }
  function fillSection(sel, html) { const el = $(sel); if (el) el.innerHTML = html || `<p class="meta">No items yet.</p>`; }

  function wireEvents() {
    $$("[data-ics]").forEach(btn => btn.addEventListener("click", async () => {
      const evts = await getEvents();
      const ev = evts.find(e => e.id === btn.getAttribute("data-ics"));
      if (ev) downloadICS(ev);
    }));
  }

  function wireAlerts() {
    $$(".chip").forEach(c => c.addEventListener("click", () => {
      c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
    }));
    const form = $("#alertForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const picks = $$(".chip[aria-pressed='true']").map(c => c.textContent.trim());
      // >>> CONNECT BACKEND: POST { email, picks } to your list provider here.
      toast(picks.length ? `Subscribed to ${picks.length} alert type(s) (demo)` : "Subscribed (demo)");
      form.reset();
    });
  }

  async function initEvents() {
    await mountChrome("events");
    const evts = await getEvents();
    const today = new Date().toISOString().slice(0, 10);
    const todays = evts.filter(e => e.date === today);
    const upcoming = evts.filter(e => e.date >= today);
    $("#events-today").innerHTML = todays.length ? todays.map(eventCard).join("")
      : `<p class="meta">No events scheduled for today. See upcoming events below.</p>`;
    $("#events-upcoming").innerHTML = (upcoming.length ? upcoming : evts).map(eventCard).join("");
    wireEvents();

    // Category filters
    $$("#event-filters .filter").forEach(f => f.addEventListener("click", () => {
      $$("#event-filters .filter").forEach(x => x.setAttribute("aria-pressed", "false"));
      f.setAttribute("aria-pressed", "true");
      const cat = f.dataset.cat;
      const list = cat === "all" ? evts : evts.filter(e => e.category === cat);
      $("#events-upcoming").innerHTML = list.length ? list.map(eventCard).join("")
        : `<p class="meta">No ${cat} events right now.</p>`;
      wireEvents();
    }));
  }

  async function initIssues() {
    await mountChrome("issues");
    const iss = await getIssues();
    renderIssueList(iss);

    // Status filter
    $$("#issue-filters .filter").forEach(f => f.addEventListener("click", () => {
      $$("#issue-filters .filter").forEach(x => x.setAttribute("aria-pressed", "false"));
      f.setAttribute("aria-pressed", "true");
      const st = f.dataset.status;
      renderIssueList(st === "all" ? iss : iss.filter(i => i.status === st));
    }));

    // Report form
    const form = $("#reportForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const cat = $("#issueCat").value;
      const title = $("#issueTitle").value.trim();
      if (!title) { toast("Please describe the issue"); return; }
      const anon = $("#issueAnon").checked;
      const ref = "JSD-" + Math.floor(1000 + Math.random() * 9000);
      // >>> CONNECT BACKEND: POST the submission to Google Sheets / Supabase here.
      // New submissions ALWAYS enter as tier:"submission", status:"Reported".
      const newIssue = {
        id: "local-" + Date.now(), ref, category: cat, title,
        status: "Reported", tier: "submission",
        reported: new Date().toISOString().slice(0,10), anonymous: anon, demo: true
      };
      iss.unshift(newIssue);
      renderIssueList(iss);
      form.reset();
      $("#report").scrollIntoView({ behavior: "smooth" });
      toast(`Issue submitted · Reference ${ref}`);
    });
  }
  function renderIssueList(list) {
    $("#issue-list").innerHTML = list.length ? list.map(issueCard).join("")
      : `<p class="meta">No issues match this filter.</p>`;
  }

  async function initSearchPage() {
    await mountChrome("");
    if (!SEARCH_INDEX) SEARCH_INDEX = await buildSearchIndex();
    const params = new URLSearchParams(location.search);
    const q0 = params.get("q") || "";
    const input = $("#pageSearchInput");
    input.value = q0;
    const run = (q) => {
      q = q.trim().toLowerCase();
      const box = $("#pageSearchResults");
      if (!q) { box.innerHTML = `<p class="search-hint">Type to search across everything on the site.</p>`; return; }
      const hits = SEARCH_INDEX.filter(r => r.text.includes(q));
      $("#searchCount").textContent = `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”`;
      box.innerHTML = hits.length ? hits.map(r => `
        <a class="search-row" href="${esc(r.href)}">
          <span class="k">${esc(r.kind)}</span><span class="t">${esc(r.title)}</span>
          <span class="m">${esc(r.meta || "")}</span></a>`).join("")
        : `<p class="search-hint">No results. Try a broader term.</p>`;
    };
    input.addEventListener("input", (e) => run(e.target.value));
    run(q0);

    // Type filters
    $$("#search-filters .filter").forEach(f => f.addEventListener("click", () => {
      $$("#search-filters .filter").forEach(x => x.setAttribute("aria-pressed","false"));
      f.setAttribute("aria-pressed","true");
      const kind = f.dataset.kind;
      const q = input.value.trim().toLowerCase();
      const base = q ? SEARCH_INDEX.filter(r => r.text.includes(q)) : SEARCH_INDEX;
      const hits = kind === "all" ? base : base.filter(r => r.kind === kind);
      $("#pageSearchResults").innerHTML = hits.length ? hits.map(r => `
        <a class="search-row" href="${esc(r.href)}">
          <span class="k">${esc(r.kind)}</span><span class="t">${esc(r.title)}</span>
          <span class="m">${esc(r.meta || "")}</span></a>`).join("")
        : `<p class="search-hint">No results.</p>`;
    }));
  }

  async function initArticle() {
    await mountChrome("");
    const id = new URLSearchParams(location.search).get("id");
    const a = await getArticleById(id);
    const root = $("#article-root");
    if (!a) {
      root.innerHTML = `<div class="wrap article"><h1 class="article__title">Article not found</h1>
        <p class="article__dek">This story may have been moved. <a href="index.html" style="color:var(--red)">Return home</a>.</p></div>`;
      return;
    }
    // SEO: fill meta + structured data at runtime.
    document.title = `${a.title} · JNU Student Daily`;
    setMeta("description", a.summary);
    setMeta("og:title", a.title, "property");
    setMeta("og:description", a.summary, "property");
    setMeta("og:type", "article", "property");
    setMeta("og:image", a.image, "property");
    setMeta("twitter:card", "summary_large_image");
    setCanonical(location.href);
    injectArticleSchema(a);

    const arts = await getArticles();
    const related = arts.filter(x => x.id !== a.id && (x.category === a.category ||
      (x.tags || []).some(t => (a.tags || []).includes(t)))).slice(0, 3);

    root.innerHTML = `
      <article class="wrap article">
        <div class="article__cat">
          <span class="eyebrow" style="font-size:.8rem">${esc(a.category)}</span>
          ${tierTag(a.tier)}
        </div>
        <h1 class="article__title">${esc(a.title)}</h1>
        <p class="article__dek">${esc(a.summary)}</p>

        <div class="byline">
          <span class="byline__who">${esc(a.author)}</span>
          <span class="byline__meta">
            <span>Published ${fmtDate(a.published)}</span>
            <span>Updated ${fmtDate(a.updated)}</span>
            <span>${esc(a.readingTimeMin)} min read</span>
          </span>
          <span class="byline__actions">
            <button class="share-btn" id="shareBtn" aria-label="Share" title="Share">${ICON.share}</button>
            <button class="share-btn" id="copyBtn" aria-label="Copy link" title="Copy link">${ICON.link}</button>
          </span>
        </div>

        <figure class="article__hero">
          <img src="${esc(a.image)}" alt="${esc(a.category)} — demo illustration" width="800" height="450"/>
        </figure>
        <p class="article__caption">Demo illustration · Replace with a real, credited image before publishing.</p>

        <div class="article__body">
          ${a.body.map(p => `<p>${esc(p)}</p>`).join("")}
        </div>

        <div class="sources">
          <h4>Sources &amp; Verification</h4>
          <p><strong>Source:</strong> ${esc(a.source)}</p>
          <p><strong>Editorial tier:</strong> ${esc(TIER_LABEL[a.tier])} —
            ${a.tier === "official" ? "reproduced from an authority notice."
             : a.tier === "reported" ? "checked by the editorial desk."
             : a.tier === "opinion" ? "a personal viewpoint, not a news report."
             : "an unverified reader submission; treat with caution."}</p>
          <span class="verify">${ICON.verify} Always confirm against the original notice before acting.</span>
        </div>

        <section class="related">
          <div class="section__head"><h2 class="section__title">Related<span class="spine-dot">.</span></h2></div>
          <div class="grid grid--3">${related.map(articleCard).join("") || '<p class="meta">No related stories yet.</p>'}</div>
        </section>
      </article>`;

    // Share + copy
    $("#copyBtn")?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(location.href); toast("Link copied"); }
      catch { toast("Copy failed — long-press the address bar"); }
    });
    $("#shareBtn")?.addEventListener("click", async () => {
      if (navigator.share) { try { await navigator.share({ title: a.title, text: a.summary, url: location.href }); } catch {} }
      else { try { await navigator.clipboard.writeText(location.href); toast("Link copied"); } catch {} }
    });
  }

  // SEO helpers
  function setMeta(name, content, attr = "name") {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute("content", content);
  }
  function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
    el.href = href;
  }
  function injectArticleSchema(a) {
    const data = {
      "@context": "https://schema.org", "@type": "NewsArticle",
      headline: a.title, description: a.summary, image: [a.image],
      datePublished: a.published, dateModified: a.updated,
      author: { "@type": "Person", name: a.author },
      publisher: { "@type": "Organization", name: "JNU Student Daily" },
      articleSection: a.category
    };
    const s = document.createElement("script");
    s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---- ROUTER: run the right init based on <body data-page> -------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");
    ({ home: initHome, events: initEvents, issues: initIssues,
       search: initSearchPage, article: initArticle,
       about: () => mountChrome("") }[page] || (() => mountChrome("")))();
  });

})();
