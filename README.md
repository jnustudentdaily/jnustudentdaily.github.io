# JNU Student Daily

**Everything JNU Students Need to Know.** A fast, mobile-first, student-run
campus news and information platform. Built with plain HTML, CSS and vanilla
JavaScript — no framework, no build step, no paid backend. Deploys free on
GitHub Pages, Netlify or Vercel.

> ⚠️ **All bundled content is DEMO / SAMPLE data** and is labelled as such
> across the UI. Replace it with real, sourced content before you launch.

---

## 1. Folder structure

```
jnu-student-daily/
├── index.html          # Homepage: hero, JNU Today, all sections
├── article.html        # Single article (reads ?id= from the URL)
├── events.html         # Events calendar (today + upcoming, filters, .ics export)
├── issues.html         # Report a Campus Issue + status tracker
├── search.html         # Full-page client-side search with type filters
├── about.html          # About, editorial tiers, submit, contact, legal
├── style.css           # The entire design system (edit colours in :root)
├── app.js              # All UI logic: chrome, components, search, routing
├── data.js             # ALL content + the data-access layer (swap for API)
├── sitemap.xml         # For Google Search Console (edit the domain)
├── robots.txt          # Crawler rules
├── 404.html            # Friendly not-found page
├── README.md           # This file
├── assets/             # SVG placeholder images (replace with real photos)
│   └── img-*.svg
└── components/
    └── README.md       # Where each UI component lives in app.js
```

**Mental model:** `data.js` is *what* the site shows. `app.js` is *how* it's
shown. `style.css` is *how it looks*. The HTML files are thin shells that
declare `<body data-page="…">`; `app.js` reads that attribute and boots the
right page. To change content you almost always edit **only `data.js`**.

---

## 2. Run it locally

Because everything renders from local JS (no `fetch()` of partials), you can
just open `index.html` in a browser. But a tiny local server is recommended so
that relative paths and history behave exactly like production:

```bash
# From inside the project folder, pick ONE:

python3 -m http.server 5173        # then visit http://localhost:5173
# or
npx serve .                        # Node users
```

Open <http://localhost:5173>. That's it — no install, no build.

---

## 3. Deploy FREE on GitHub Pages

1. Create a new GitHub repository, e.g. `jnu-student-daily`.
2. Put these files in the repo root and push:
   ```bash
   git init
   git add .
   git commit -m "Launch JNU Student Daily"
   git branch -M main
   git remote add origin https://github.com/<you>/jnu-student-daily.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**. Under *Build and deployment*, set
   **Source = Deploy from a branch**, **Branch = `main`**, **folder = `/ (root)`**. Save.
4. Wait ~1 minute. Your site is live at
   `https://<you>.github.io/jnu-student-daily/`.
5. Edit `sitemap.xml`, `robots.txt`, and the `<link rel="canonical">` and
   `og:*` URLs in each HTML file to your real address.

**Netlify / Vercel** are even simpler: "Add new site → import the repo →
deploy". No build command, publish directory = root.

**Custom domain (optional):** add a `CNAME` file with your domain and set the
DNS record your host tells you to. Search Console: submit `sitemap.xml`.

---

## 4. Connect Google Sheets as a free CMS (later)

The whole site reads content through the async functions at the bottom of
`data.js` (`getArticles()`, `getEvents()`, …). Swap their bodies for a fetch
and nothing else changes.

**Step A — make a Sheet.** One tab per content type (`articles`, `events`,
`notices`, `opportunities`, `issues`). Column headers = the object keys used
in `data.js` (e.g. `id, title, category, tier, author, source, published,
updated, image, summary, body, tags, featured, readingTimeMin`).

**Step B — publish it readable.** Either:
- *File → Share → Publish to web* (simplest), or
- use the **GViz** endpoint (no API key), which returns JSON.

**Step C — replace one function.** Example for articles:

```js
async function getArticles() {
  const SHEET_ID = "PUT_YOUR_SHEET_ID_HERE";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=articles`;
  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2)); // strip GViz wrapper
  return json.table.rows.map(r => {
    const c = r.c.map(x => (x ? x.v : ""));
    return {
      id: c[0], title: c[1], category: c[2], tier: c[3], author: c[4],
      source: c[5], published: c[6], updated: c[7], image: c[8], summary: c[9],
      body: String(c[10] || "").split("\n"),        // paragraphs split on newlines
      tags: String(c[11] || "").split(",").map(s => s.trim()),
      featured: String(c[12]).toLowerCase() === "true",
      readingTimeMin: Number(c[13]) || 3
    };
  });
}
```

Do the same for events/notices/opportunities/issues. Done — you now have a
CMS your whole team can edit in a spreadsheet, still 100% free and static.

> Want writes too (issue reports, alert sign-ups)? Point the forms at a free
> **Google Apps Script Web App** (`doPost`) or **Supabase**/**Firebase**.
> The two `// >>> CONNECT BACKEND` comments in `app.js` mark exactly where.

---

## 5. Add Google AdSense (later)

1. Get the site live on a real domain with genuine content first (AdSense
   rejects thin/placeholder sites — remove all DEMO data before applying).
2. Apply at <https://adsense.google.com>. Add the verification snippet inside
   `<head>` of every page (the `>>> ADD GOOGLE ANALYTICS`/ads comment marks a
   good spot — put the AdSense script there too).
3. After approval, drop an ad unit where you want it, e.g. between sections:
   ```html
   <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto" data-full-width-responsive="true"></ins>
   <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
   ```
4. Keep ad density low on article pages — student readers bounce fast on
   cluttered layouts. One in-feed unit on home + one in-article is plenty.

**Google Analytics 4:** paste your `G-XXXX` id into `DATA.site.gaMeasurementId`
in `data.js`, and add the standard gtag snippet in each `<head>` (marked
`>>> ADD GOOGLE ANALYTICS`).

---

## 6. Ten strategies to get your first 1,000 JNU users

1. **Own the deadline calendar.** Be the single place that lists every
   registration/exam/scholarship deadline with reminders. Utility beats news
   for repeat visits — students will bookmark you.
2. **WhatsApp/Telegram broadcast, site as the source of truth.** Post a
   one-line update + link in hostel and Centre groups daily. The groups are
   distribution; your site is the archive.
3. **Seed via hostel committees and Centre reps.** You're already inside this
   network — get one representative per hostel to share the daily digest.
4. **QR posters on real noticeboards.** A poster at each hostel mess, the
   library entrance, and Centre boards: "Every JNU deadline, one link." Physical
   → digital works on this campus.
5. **Explainers ranked for search.** "How does JNU hostel allotment work",
   "What is N+1 in JNU" — evergreen queries new students Google every year.
   These bring recurring organic traffic with zero ongoing effort.
6. **Freshers' onboarding pack.** At admission season, publish a single
   "New to JNU? Start here" hub and share it everywhere. First-years become
   your most loyal daily readers.
7. **Anonymous issue tracker as the hook.** No other campus outlet lets students
   report a mess/hostel problem and watch it move to Resolved. Publicise a few
   real resolved cases — that credibility spreads by word of mouth.
8. **Micro-interviews / Student Voices.** Feature a student a week; they and
   their friends share it. Cheap, human, and highly shareable.
9. **Exam-season sprint.** Traffic peaks around exams and registration. Go
   daily in those windows with results, date-sheets, and form corrections.
10. **Cross-post to Instagram carousels.** Turn each explainer into a 5-slide
    carousel ending "full guide on JNU Student Daily → link in bio." Instagram
    is where the discovery happens; the site is where depth lives.

---

## 7. Twenty content ideas built for repeat JNU traffic

Evergreen guides (rank on Google, useful every year):
1. How hostel allotment works — points, waitlists, reporting.
2. Semester registration, step by step (with the common errors).
3. What "N+1 / N+2" means for your degree timeline.
4. The attendance rule, decoded — exemptions and how it's counted.
5. Every scholarship & fellowship at JNU, with eligibility bands.
6. CUET-PG to admission: the full applicant roadmap.
7. Mess & dhaba guide: timings, menus, best cheap eats on campus.
8. Central Library survival guide: hours, borrowing, e-resources.
9. Getting a bonafide / migration / other certificate without the runaround.
10. Campus transport + shuttle timings map.

Recurring / seasonal (bring people back on a schedule):
11. This week on campus — every seminar, workshop and event (weekly).
12. Deadline watch — what closes in the next 7 days (weekly).
13. Results & date-sheet tracker (exam season).
14. Freshers' week hub — "New to JNU? Start here" (admission season).
15. Fee & hostel charges explainer, updated each cycle.

Engagement / community (shareable, keeps people talking):
16. Student Voices: a weekly first-person campus story.
17. "Issue resolved" case studies from the tracker.
18. Health centre & emergency contacts — the page everyone eventually needs.
19. Best study spots on campus, ranked by students.
20. Opportunity of the week: one internship/fellowship, fully explained.

---

## Editorial principle (please keep this)

The site distinguishes four tiers, colour-coded everywhere:

| Tier | Meaning | Colour |
|------|---------|--------|
| **Official Notice** | reproduced from an authority | blue |
| **Reported News** | checked by your desk | ink |
| **Student Submission** | reader-sent, unverified | amber |
| **Opinion** | a viewpoint, not a report | green |

New issue reports always enter as **Student Submission / Reported**. Never
promote an unverified submission to "Reported News" without checking it. This
trust system is the platform's credibility — it's why students will believe you.

---

## Where to edit what (quick map of code comments)

Search the codebase for these markers:

- **Change logo / tagline** → `data.js` → `DATA.site` and the `.brand` block in `app.js`.
- **Change colours** → `style.css` → `:root` (and `[data-theme="dark"]`).
- **Add articles / events / notices / issues** → `data.js` (top arrays).
- **Connect Google Sheets** → `data.js` → the `getXxx()` functions.
- **Connect a write backend** → `app.js` → `// >>> CONNECT BACKEND` (2 spots).
- **Add Google Analytics** → `data.js` → `gaMeasurementId` + `<head>` snippet.
- **Add social links** → `data.js` → `DATA.site.social`.
- **Add AdSense** → `<head>` of each HTML page (see §5).

Happy shipping. 📰
