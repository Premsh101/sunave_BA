# Stitch Design Prompt — Sunave

Paste the prompt below into Google Stitch (stitch.withgoogle.com) to generate a
refreshed UI/UX for the app. Generate screens one at a time — Stitch works best
when you start with the master prompt, then request each screen.

---

## Master prompt

Design a modern SaaS web app called **Sunave** — an AI meeting assistant for
Business Analysts. It transcribes meetings live in the browser (no bots join the
call), reads transcripts aloud, and turns them into professional documents
(BRDs, FRDs, user stories, meeting minutes) using AI.

**Brand personality:** professional, trustworthy, fast. Aimed at enterprise
Business Analysts, Scrum Masters, and Product Owners in India and globally.

**Visual direction:** clean dashboard aesthetic with a dark and a light theme,
one strong brand accent color used sparingly (CTAs, live-recording states,
active nav), generous whitespace, 8px spacing grid, rounded-lg cards with subtle
borders, distinctive typography (avoid generic system fonts), subtle
micro-interactions. A pulsing red "recording live" indicator is a core motif.
Desktop-first (1440px), but every screen must have a mobile layout.

The app has two shells:
- **Marketing shell:** top navbar (logo, Features, Pricing, Enterprise,
  Security, Blog, Login, "Start Free" CTA) + footer.
- **App shell:** left sidebar navigation (Dashboard, Meetings, Live Meeting,
  Documents, Prompt Studio, Template Studio, Billing, Settings) + top bar with
  user avatar and theme toggle.

---

## Screens

### Marketing (public)

1. **Home `/`** — Hero: "Your AI Business Analyst for every meeting" with a
   live product mockup showing a real-time transcript streaming in; logos strip;
   feature grid (Live browser transcription, No bots required, AI documents,
   Read-aloud); an interactive "audio pipeline" demo widget (mic → transcript →
   document); stats section; pricing preview cards; final CTA band.
2. **Features `/features`** — Feature detail sections alternating text/visual:
   browser speech-to-text (capture meeting tab audio + your mic together),
   text-to-speech read-aloud, AI document generation with provider fallback
   (OpenRouter, local LLM, OpenAI, Gemini, Claude), multi-language support
   (English US/UK, Hindi/Hinglish, Spanish).
3. **Pricing `/pricing`** — 3 tiers (Free, Pro, Enterprise) with monthly/annual
   toggle in INR/USD, feature comparison table, FAQ accordion.
4. **Enterprise `/enterprise`** — Enterprise pitch: SSO, data residency,
   dedicated support; case-study cards; "Talk to sales" form.
5. **Security `/security`** — Trust page: security practices, "audio never
   leaves your browser" privacy story, compliance badges.
6. **Integrations `/integrations`** — Grid of integration cards (Google Meet,
   Teams, Zoom, Jira, Slack, Notion) each with status badge (Available/Soon).
7. **Blog `/blog`** — Article index: featured post hero + card grid with
   category filters.
8. **Login `/login`** — Centered auth card: email/password + "Continue with
   Google", forgot-password link. Matching **Signup `/signup`** (name, email,
   password, terms checkbox) and **Forgot password `/forgot-password`** (single
   email field + confirmation state).

### App (authenticated)

9. **Dashboard `/dashboard`** — Welcome header with user name; stat tiles
   (meetings this week, minutes transcribed, documents generated); "Start Live
   Meeting" primary CTA card; recent meetings list; recent documents list.
10. **Live Meeting `/meetings/live`** — THE hero screen. Header: meeting title,
    "Transcribing Live" pulsing badge, mode toggle (Bot-Free / AI Assistant),
    language selector, "Read Aloud" button, "Save & Generate" primary button.
    Main area: real-time transcript feed with speaker rows (avatar, name,
    timestamp) and a distinct low-opacity style for the interim "still being
    recognized" line; auto-scrolls. Empty state: big microphone illustration +
    two capture choices — "Capture Everything (Meeting + My Mic)" (primary) and
    "Microphone Only" (secondary) — plus a hint to share the meeting tab with
    audio on speakers. Bottom bar: audio-level indicator and Stop button.
    Error banners for mic-permission and unsupported-browser states.
11. **Meetings `/meetings`** — Table/list of past meetings: title, date,
    duration, language, transcript preview, actions (view, generate document,
    delete); search + date filter; empty state.
12. **Documents `/documents`** — Grid of AI-generated documents with type badge
    (BRD, FRD, MOM, User Stories…), title, date, word count; filters by type;
    document viewer/editor drawer or page with markdown rendering, copy and
    export actions; "Generate Document" button opening a modal: document type
    select with description, meeting selector, transcript textarea, custom
    instructions, generate button with loading state showing which AI provider
    is being used.
13. **Prompt Studio `/prompt-studio`** — Power-user screen to create and edit
    custom generation prompts: list of saved prompts + editor pane (name,
    system prompt, test area with sample transcript, run/test button).
14. **Template Studio `/template-studio`** — Manage document templates: card
    grid of templates with sections preview; editor with reorderable section
    list.
15. **Billing `/billing`** — Current plan card, usage meters (transcription
    minutes, documents generated), payment method (Razorpay), invoice history
    table, upgrade CTA.
16. **Settings `/settings`** — Tabbed: Profile (name, avatar, email), Audio &
    Speech (default language, default capture mode, TTS voice + speed),
    AI Providers (ordered provider list showing the fallback chain), Appearance
    (dark/light), Notifications, Danger zone.

---

## Key states to design

- Live recording (pulsing red), idle/ready, unsupported browser, mic denied.
- AI generation in-progress (skeleton + provider name), success, all-providers-failed error.
- Empty states for meetings, documents, and first-run dashboard.
- Dark theme is the default; every screen needs a light variant.
