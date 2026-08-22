/* ============================================================================
   JNU STUDENT DAILY — DATA LAYER
   ----------------------------------------------------------------------------
   This file holds ALL sample content and the data model for the site.
   Everything the UI renders is read from the objects below.

   >>> HOW TO ADD CONTENT:
       - Add an article  -> push an object into DATA.articles (see shape below)
       - Add a notice     -> push into DATA.notices
       - Add an event     -> push into DATA.events
       - Add opportunity  -> push into DATA.opportunities
       - Add an issue      -> push into DATA.issues

   >>> HOW TO CONNECT A REAL BACKEND LATER:
       Every screen calls the async functions at the bottom of this file
       (getArticles, getEvents, getNotices, getOpportunities, getIssues).
       Right now they just return the local arrays. To go live, replace the
       body of each function with a fetch() to Google Sheets / Supabase /
       Firebase. The rest of the site does NOT need to change. See README.md.

   >>> EDITORIAL TIERS (IMPORTANT):
       Every item carries a `tier` field. The UI uses it to label trust:
         "official"   -> Official Notice   (verified, from an authority)
         "reported"   -> Reported News     (editorially checked)
         "submission" -> Student Submission (unverified, user-sent)
         "opinion"    -> Opinion           (a viewpoint, not fact)
       NEVER change a student submission to "reported" without verifying it.

   >>> ALL CONTENT BELOW IS DEMO / SAMPLE CONTENT.
       It is fictional placeholder text for design purposes and is marked
       `demo: true`. Replace it with real, sourced content before launch.
============================================================================ */

const DATA = {

  /* ---- SITE-WIDE CONFIG -------------------------------------------------
     >>> CHANGE LOGO TEXT, TAGLINE, SOCIAL LINKS, ANALYTICS ID HERE. */
  site: {
    name: "JNU Student Daily",
    tagline: "Everything JNU Students Need to Know.",
    // >>> ADD GOOGLE ANALYTICS: paste your GA4 Measurement ID (e.g. "G-XXXX")
    gaMeasurementId: "",
    // >>> ADD SOCIAL MEDIA LINKS: replace # with your real profile URLs
    social: {
      instagram: "#",
      twitter: "#",
      telegram: "#",
      youtube: "#"
    },
    // >>> CHANGE COLORS in style.css (:root variables), not here.
    demoBanner: true // set false to hide the "DEMO CONTENT" ribbon
  },

  /* ---- BREAKING TICKER --------------------------------------------------
     Short one-line urgent updates shown in the top scrolling bar. */
  ticker: [
    { text: "Winter semester registration window opens Monday, 9:00 AM", time: "2h ago" },
    { text: "Library extends 24×7 reading-hall access during exam month", time: "5h ago" },
    { text: "Mess committee announces revised menu after student feedback", time: "1d ago" },
    { text: "Special CUET-PG counselling notice expected this week", time: "1d ago" }
  ],

  /* ---- ARTICLES ---------------------------------------------------------
     ARTICLE SHAPE:
     {
       id: "unique-slug",           // used in the URL: article.html?id=unique-slug
       title, category, tier,        // tier: official|reported|submission|opinion
       author, source, published,    // ISO date-time strings
       updated, image, summary,
       body: [ "para 1", "para 2" ], // array of paragraphs
       tags: [ ... ],                // used by search + filters
       featured: true|false,          // one featured drives the hero
       readingTimeMin: number,
       demo: true
     } */
  articles: [
    {
      id: "attendance-rule-2026",
      title: "New attendance policy: what actually changes for students",
      category: "Academics",
      tier: "reported",
      author: "Editorial Desk",
      source: "Academic Council circular (demo)",
      published: "2026-08-21T09:15:00",
      updated: "2026-08-21T18:40:00",
      image: "assets/img-academics.svg",
      summary: "The revised rule ties eligibility for end-semester exams to a minimum attendance threshold, with documented exemptions. Here is a plain-language breakdown.",
      body: [
        "The revised attendance framework, circulated this week, sets a minimum attendance requirement for eligibility to sit end-semester examinations. This is a demo article created to show the layout — replace it with a real, sourced report before publishing.",
        "Under the sample policy, students below the threshold may apply for exemption on documented medical or exceptional grounds, reviewed by the respective Centre. Field-work and approved academic travel are treated separately.",
        "Student representatives have asked for clarity on how proxy-prone courses and cross-listed seminars will be counted. The administration is expected to issue an FAQ.",
        "What to do now: track your own attendance per course, keep documentation for any absence, and watch your Centre noticeboard for the detailed FAQ."
      ],
      tags: ["attendance", "exams", "academics", "policy", "rules"],
      featured: true,
      readingTimeMin: 4,
      demo: true
    },
    {
      id: "hostel-allotment-explained",
      title: "How hostel allotment works, step by step",
      category: "Hostel",
      tier: "reported",
      author: "Campus Desk",
      source: "Dean of Students office (demo)",
      published: "2026-08-20T14:00:00",
      updated: "2026-08-20T14:00:00",
      image: "assets/img-hostel.svg",
      summary: "From application to room number: the allotment sequence, waiting lists, and what the priority points actually mean.",
      body: [
        "Hostel allotment at JNU runs on a points-and-priority system. This demo explainer walks through the stages so first-year students know what to expect.",
        "Stage one is the application window on the hostel portal. Stage two is verification. Stage three is provisional allotment based on category and distance criteria, followed by physical reporting.",
        "Waiting-list movement depends on withdrawals, so keep checking your portal status during the first fortnight of the semester."
      ],
      tags: ["hostel", "allotment", "accommodation", "first-year", "campus"],
      featured: false,
      readingTimeMin: 3,
      demo: true
    },
    {
      id: "cuet-pg-counselling-notice",
      title: "CUET-PG counselling: dates, documents, and common mistakes",
      category: "Admissions",
      tier: "official",
      author: "Admissions Desk",
      source: "Admissions Branch notice (demo)",
      published: "2026-08-19T11:30:00",
      updated: "2026-08-21T10:05:00",
      image: "assets/img-admissions.svg",
      summary: "An official-style notice summary covering the counselling schedule, the document checklist, and errors that cost applicants a seat.",
      body: [
        "This is a demo reproduction of an official notice layout. Official Notices are shown with a distinct blue tier label so readers know the source is an authority, not the newsroom.",
        "Applicants should keep category certificates, mark sheets, and a valid ID ready in the specified format. Mismatched names across documents are the most common reason for provisional holds.",
        "Always cross-check the original PDF on the university site before acting. Link it in the Sources area of the live article."
      ],
      tags: ["cuet", "admissions", "counselling", "pg", "documents"],
      featured: false,
      readingTimeMin: 3,
      demo: true
    },
    {
      id: "mess-menu-revision",
      title: "Mess menu revised after student committee feedback",
      category: "Campus Life",
      tier: "reported",
      author: "Campus Desk",
      source: "Inter-Hall Administration (demo)",
      published: "2026-08-18T20:10:00",
      updated: "2026-08-18T20:10:00",
      image: "assets/img-campus.svg",
      summary: "Rotating regional menus and a fixed weekly special are part of the revised plan agreed with mess committees.",
      body: [
        "Following feedback collected by mess committees, a revised menu introduces rotating regional dishes and a fixed weekly special. Demo content for layout purposes.",
        "Committee members say the change responds to long-standing requests for variety and better breakfast options."
      ],
      tags: ["mess", "food", "campus life", "hostel"],
      featured: false,
      readingTimeMin: 2,
      demo: true
    },
    {
      id: "n-plus-one-explained",
      title: "What ‘N+1’ and ‘N+2’ mean for your degree timeline",
      category: "Explainers",
      tier: "reported",
      author: "Explainer Desk",
      source: "Academic ordinances (demo)",
      published: "2026-08-17T09:00:00",
      updated: "2026-08-17T09:00:00",
      image: "assets/img-explainer.svg",
      summary: "The maximum-duration rule, explained without jargon: how the ‘N+’ span is counted and why it matters for registration.",
      body: [
        "‘N’ is the normal duration of your programme. ‘N+1’ and ‘N+2’ describe the additional years the ordinances may allow to complete it. This is a demo explainer.",
        "The practical takeaway: know your programme’s N, keep registration continuous, and consult your Centre before any gap."
      ],
      tags: ["n+1", "n+2", "registration", "phd", "explainer", "rules"],
      featured: false,
      readingTimeMin: 3,
      demo: true
    },
    {
      id: "scholarship-window-open",
      title: "Merit-cum-means and fellowship windows now open",
      category: "Opportunities",
      tier: "official",
      author: "Opportunities Desk",
      source: "Scholarship section notice (demo)",
      published: "2026-08-16T10:00:00",
      updated: "2026-08-16T10:00:00",
      image: "assets/img-opportunity.svg",
      summary: "Application windows for need-based support and research fellowships are open. Note the eligibility bands and deadlines.",
      body: [
        "Multiple support windows are open this month. Demo content: verify each scheme’s eligibility band and deadline against the official circular before applying.",
        "Keep a single folder with scanned documents to avoid last-minute uploads failing."
      ],
      tags: ["scholarship", "fellowship", "funding", "opportunities", "deadline"],
      featured: false,
      readingTimeMin: 2,
      demo: true
    },
    {
      id: "student-voice-first-monsoon",
      title: "‘My first monsoon on campus’: a first-year’s diary",
      category: "Student Voices",
      tier: "opinion",
      author: "Aarav (MA, demo)",
      source: "Student submission (demo)",
      published: "2026-08-15T19:00:00",
      updated: "2026-08-15T19:00:00",
      image: "assets/img-voices.svg",
      summary: "A personal account of settling into hostel life. Marked as Opinion — a viewpoint, not a news report.",
      body: [
        "This is a demo opinion piece. Opinion is clearly labelled so readers never mistake a personal viewpoint for verified news.",
        "The writer describes the first weeks: finding a study spot, the dhaba routine, and learning the shuttle timings."
      ],
      tags: ["student voices", "opinion", "hostel", "campus life"],
      featured: false,
      readingTimeMin: 3,
      demo: true
    }
  ],

  /* ---- NOTICES (the "JNU TODAY" strip) ---------------------------------- */
  notices: [
    { id: "n1", title: "Winter semester registration opens Monday 9:00 AM", type: "Registration", tier: "official", due: "2026-08-25", demo: true },
    { id: "n2", title: "Last date for exam-form correction", type: "Exams", tier: "official", due: "2026-08-27", demo: true },
    { id: "n3", title: "Hostel maintenance survey — respond by Friday", type: "Hostel", tier: "official", due: "2026-08-29", demo: true },
    { id: "n4", title: "Fellowship renewal documents due", type: "Scholarship", tier: "official", due: "2026-08-30", demo: true },
    { id: "n5", title: "Central Library orientation for new students", type: "Library", tier: "official", due: "2026-08-24", demo: true }
  ],

  /* ---- EVENTS ----------------------------------------------------------- */
  events: [
    {
      id: "ev1", title: "Seminar: Language, Meaning and Cognition",
      date: "2026-08-23", time: "15:00", venue: "SSIS Committee Room",
      organizer: "School of Sanskrit & Indic Studies", tier: "official",
      description: "A talk on verbal cognition and philosophy of language, open to all research scholars.",
      category: "Seminar", demo: true
    },
    {
      id: "ev2", title: "Workshop: Getting started with academic LaTeX",
      date: "2026-08-24", time: "11:00", venue: "Central Library Training Room",
      organizer: "Library Services", tier: "official",
      description: "Hands-on session covering document structure, citations, and thesis templates.",
      category: "Workshop", demo: true
    },
    {
      id: "ev3", title: "Cultural evening: Monsoon Mehfil",
      date: "2026-08-26", time: "18:30", venue: "Open-Air Theatre",
      organizer: "Cultural Committee", tier: "reported",
      description: "An evening of music and poetry organised by campus cultural societies.",
      category: "Cultural", demo: true
    },
    {
      id: "ev4", title: "Careers talk: Research funding and fellowships abroad",
      date: "2026-08-28", time: "16:00", venue: "Convention Centre",
      organizer: "Placement & Careers Cell", tier: "reported",
      description: "Panel on applying for international fellowships, with a Q&A.",
      category: "Workshop", demo: true
    }
  ],

  /* ---- OPPORTUNITIES ---------------------------------------------------- */
  opportunities: [
    { id: "op1", title: "Research internship — Digital Humanities lab", type: "Internship", deadline: "2026-09-05", tier: "reported", demo: true },
    { id: "op2", title: "Junior Research Fellowship — call for applications", type: "Fellowship", deadline: "2026-09-10", tier: "official", demo: true },
    { id: "op3", title: "Campus reporter (volunteer) — JNU Student Daily", type: "Volunteer", deadline: "2026-09-01", tier: "reported", demo: true },
    { id: "op4", title: "Travel grant for conference presentation", type: "Grant", deadline: "2026-09-15", tier: "official", demo: true }
  ],

  /* ---- ISSUES (campus issue tracker) -----------------------------------
     STATUS PIPELINE (in order):
     Reported -> Under Review -> Authority Contacted -> Action Taken -> Resolved
     These are DEMO issues to show the tracker UI. Real submissions arrive
     via the "Report a Campus Issue" form on issues.html. */
  issues: [
    { id: "is1", ref: "JSD-1042", category: "Hostel", title: "Water supply irregular in Block C mornings", status: "Authority Contacted", tier: "submission", reported: "2026-08-18", anonymous: true, demo: true },
    { id: "is2", ref: "JSD-1039", category: "Library", title: "Reading-hall AC not working on second floor", status: "Action Taken", tier: "submission", reported: "2026-08-16", anonymous: false, demo: true },
    { id: "is3", ref: "JSD-1035", category: "Transport", title: "Evening shuttle skipping a stop", status: "Under Review", tier: "submission", reported: "2026-08-15", anonymous: true, demo: true },
    { id: "is4", ref: "JSD-1030", category: "Mess", title: "Breakfast timing clash with 9 AM classes", status: "Resolved", tier: "submission", reported: "2026-08-10", anonymous: false, demo: true },
    { id: "is5", ref: "JSD-1028", category: "Infrastructure", title: "Streetlight out on the path to SSS", status: "Reported", tier: "submission", reported: "2026-08-21", anonymous: true, demo: true }
  ],

  /* ---- QUICK LINKS ------------------------------------------------------
     >>> CHANGE THESE to the real official URLs when you go live. */
  quickLinks: [
    { label: "JNU Website", url: "#" },
    { label: "Admissions", url: "#" },
    { label: "Examination", url: "#" },
    { label: "Academic Calendar", url: "#" },
    { label: "Hostel", url: "#" },
    { label: "Scholarship", url: "#" },
    { label: "Central Library", url: "#" },
    { label: "Student Forms", url: "#" },
    { label: "Important Contacts", url: "#" }
  ]
};

/* ============================================================================
   DATA ACCESS LAYER  —  the ONLY thing the UI calls.
   Swap the bodies of these for real fetch() calls to go live. Signatures and
   return shapes must stay the same so no UI code needs to change.
============================================================================ */

// Simulates async so your components are already written for a real API.
function _resolve(value) {
  return new Promise((res) => setTimeout(() => res(structuredClone(value)), 0));
}

async function getArticles()      { return _liveArticles(); }
async function getNotices()       { return _resolve(DATA.notices); }
async function getEvents()        { return _resolve(DATA.events); }
async function getOpportunities() { return _resolve(DATA.opportunities); }
async function getIssues()        { return _resolve(DATA.issues); }
async function getTicker()        { return _resolve(DATA.ticker); }
async function getQuickLinks()    { return _resolve(DATA.quickLinks); }
async function getSite()          { return _resolve(DATA.site); }
async function getArticleById(id) {
  const list = await getArticles();
  return list.find((a) => a.id === id) || null;
}

/* ============================================================================
   GOOGLE SHEETS PUBLISHING  —  articles come from your live Sheet.
   Publish a new article by adding a row in the Sheet. No code, no re-upload.

   Sheet must be shared "Anyone with the link → Viewer" and have these column
   headers in row 1, in any order:
     id | tier | title | dek | category | image | author | date | body | sources | demo

   To use a different Sheet later, change SHEET_ID / SHEET_TAB below.
============================================================================ */

const SHEET_ID  = "1d04K3-67U8NS-DrO0tmNKFP9hvcXhDy2Qb8ZJqzEc_U";
const SHEET_TAB = "0"; // the gid of the tab that holds articles

// Turns one Sheet row (keyed by header name) into an article object.
function _rowToArticle(cells, cols) {
  const get = (name) => {
    const i = cols.indexOf(name);
    const c = i > -1 ? cells[i] : null;
    return c && c.v != null ? String(c.v).trim() : "";
  };
  const rawSources = get("sources");
  const rawDemo = get("demo").toLowerCase();
  return {
    id:       get("id"),
    tier:     get("tier") || "reported",
    title:    get("title"),
    dek:      get("dek"),
    category: get("category") || "News",
    image:    get("image") || "assets/img-campus.svg",
    author:   get("author") || "JNU Student Daily",
    date:     get("date"),
    body:     get("body"),
    sources:  rawSources ? rawSources.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [],
    demo:     rawDemo === "true" || rawDemo === "yes" || rawDemo === "1"
  };
}

// Fetches live articles from the Sheet; falls back to built-in DATA.articles
// if the Sheet is unreachable or empty, so the site NEVER shows a blank page.
async function _liveArticles() {
  const url = "https://docs.google.com/spreadsheets/d/" + SHEET_ID +
              "/gviz/tq?tqx=out:json&tq&gid=" + SHEET_TAB;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    // Google wraps the JSON in "...(<json>);" — strip that wrapper.
    const json = JSON.parse(text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, ""));
    const cols = json.table.cols.map((c) => (c.label || "").trim().toLowerCase());
    const rows = json.table.rows || [];
    const articles = rows
      .map((r) => _rowToArticle(r.c || [], cols))
      .filter((a) => a.id && a.title); // skip blank rows
    if (!articles.length) throw new Error("Sheet returned no usable rows");
    return articles;
  } catch (err) {
    console.warn("[JSD] Sheet fetch failed, using built-in articles:", err.message);
    return structuredClone(DATA.articles);
  }
}

// Expose to non-module scripts.
window.JSD = {
  DATA, getArticles, getNotices, getEvents, getOpportunities,
  getIssues, getTicker, getQuickLinks, getSite, getArticleById
};
