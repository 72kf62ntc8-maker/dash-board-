# Chaston's Dashboard

A self-contained personal command center — one `index.html`, no build step,
no dependencies. Open it in a browser or deploy it as a static site (Vercel
serves `index.html` at `/`). All data is stored locally in the browser under
`cd_*` keys; nothing leaves the device.

## Sections
- **Command** — orbital-core hero, quick actions grouped into All / Personal /
  Planning / Business tabs, coach signals, daily vitals.
- **Fitness** — four screens behind one command bar: **Today**, **Program**,
  **Progress** and **History**.
  - *Today* lists the routines your program puts on this weekday, each exercise
    showing what you lifted for it last time, and logs the whole routine in one
    pass. A routine you have already trained is marked done.
  - *Program* is the week itself. Assign any number of routines to each day —
    lifting, mat work, plyos, conditioning — and leave a day empty for rest.
    The routine library underneath is editable: build one from a plain
    `Bench Press 4x8` list, rename it, delete it.
  - *Progress* is the progressive-overload view. Per exercise: last session's
    sets, best set, estimated 1RM (Epley), total volume with the change since
    the session before, and a sparkline. When you log, each exercise carries a
    hint drawn from your own last session — hold the weight and chase a rep, or
    add weight once you hit the top of the range.
  - *History* holds the weight trend, recent sessions and lifts, and the
    Obsidian importer.

  The program feeds the rest of the app: today's training shows in the coach and
  in Command's **Up next**, and the week ahead appears on the Calendar.
- **Food** — a full food log. Meals (Breakfast/Lunch/Dinner/Snacks), a macro
  ring by calorie share, percent-of-goal bars, and the whole nutrition panel
  (20 nutrients, indented sub-rows, derived Net Carbs). Sources: History, My
  Meals, My Recipes, My Foods, a Brands set (~175 flagship items across 19 US
  chains plus common packaged products) and a Basics set (~127 whole foods by
  food group), all searchable at once. Search matches terms independently and
  ignores punctuation, so "chipotle chicken", "chicken chipotle" and
  "chickfila nuggets" all land. Enter a label once with **Create a food** and logging it
  again is a tap plus a serving count. Also quick add, a voice log that uses
  the browser's own speech recognition, and water with quick-add presets and a
  unit switch. **Carb cycling** is optional: turn it on and a day runs High /
  Mid / Low targets (2800 / 2500 / 2100 by default, all editable) from a
  repeating weekly rotation, with a one-off override when a training day moves
  and a "Match my training plan" button that builds the rotation from the week
  you actually train.
- **Steps** — daily goal ring, 7-day chart, and an Apple Shortcut recipe that
  pushes Health's step count in via `?steps=NNNN`.
- **Sleep** — one number a morning, keyed to the day you woke. Logged from the
  control wall or sent by a Shortcut with `?sleep=7.5` (add `&date=` to
  backfill). Fitness → History holds the last fortnight as bars; Command's
  strip shows last night; the coach pairs a short night with a hard day on the
  program and names a short week.

Food is split into three screens behind one command bar — **Today**, **Carb
cycle** and **Nutrition** — so the rotation is one tap rather than a scroll,
and the bar keeps the day, the day's type and Add food in reach on all three.

Food and Steps carry a day strip: step back through the log to review or fix a
day you missed, and everything you log there — food, water, steps — lands on
the day you are looking at. Command and the coach always speak about today.
- **Planner** — tasks with an optional due date and priority, grouped Overdue /
  Today / Tomorrow / This week / Later / No date, filtered Open / Done / All.
- **Calendar** — three screens behind one command bar: **Month**, **Agenda** and
  **Sources**. Month is a real grid — a coloured dot per item, click a day to
  read it beside the grid, page through with the arrows. Agenda is the list
  ahead, grouped Today / Tomorrow / This week / Later. Three things feed both:
  events you add here, **your Google Calendar**, and the week ahead of training
  from your Fitness program (ticked off once the session is logged). A colour
  bar on every row says which. Only your own events are editable here — Google's
  live in Google, and training is derived from Fitness → Program.
- **Journal / Reselling / Money** — quick capture lists.

Command's **Up next** merges open tasks, scheduled events and today's and
tomorrow's training into one ordered list, soonest first, and the coach counts
anything overdue.

## What the numbers work out
**Maintenance calories** (Food → Carb cycle, and under the weight trend) come
from your own data rather than a formula: over the last 28 days, the trend
weight at each end, the average intake on the days you logged food, and the
fact that a pound is about 3,500 kcal. Losing on 2,200 means maintenance is
above 2,200, and the trend says by how much. It needs two weeks of weigh-ins
and ten logged days before it will say a number, and says what it still needs
until then. Against the rotation's average it then states your actual deficit.

**Planned vs eaten** (Food → Carb cycle) judges each of the last seven days
against the type it was given: on target within 10% on calories and 20% on
carbs, off by how much otherwise, and unlogged days marked as unknowns rather
than misses. The coach reports the week's adherence and calls out yesterday
when it missed.

**PR board** (Fitness → Progress) — every lift's best set by estimated 1RM,
when it was set, and the heaviest single weight if that was a different set.

**Partials.** A set is `185x8`. Write `185x8+2` for eight clean reps and two
partials after form broke — wherever sets are typed, the Obsidian importer
included. Partials are shown but never counted as reps, so the 1RM estimate
and the volume stay honest; and a set that ends in partials was taken to
failure, which is what the overload hint reads from it: hit the target and
grind past it, add weight; fall short, hold the weight and get one more clean.

## Backup
Everything lives in one browser's `localStorage` and nowhere else. Clear site
data, change phones, or have iOS evict it under storage pressure and it is gone
with nothing to recover from. So: **Back Up** on the control wall writes every
`cd_*` store to one dated JSON file, **Restore** reads one back (it says what
it is about to replace, and refuses a file that is not ours). The coach starts
asking once there is something worth losing and no backup for two weeks.

## Offline and the home screen
`manifest.webmanifest` and `sw.js` make it a real installed app: your own icon
on the home screen, standalone with no browser chrome, and it loads with no
signal. The worker is network-first — with a connection you always get the
newest deploy, and the copy it serves is kept for the next time there isn't
one. Only successful responses are kept, so a lock screen or an error page can
never become "the app", and a `?steps=` or `?sleep=` load is never served from
cache, so a Shortcut always runs against a live page.

## Google Calendar
Calendar → Sources → Connect. Google needs an OAuth client ID for this site
before it will hand anything over; the panel walks through making one and shows
the exact origin to paste into Google. Then the calendar is read (never
written) and merged into Month, Agenda, Command's **Up next** and the coach.
Per-calendar switches decide which of your calendars show.

**Why sign-in happens in the browser.** This dashboard is a public URL with no
login. A server-side integration — an `/api` function holding a secret ICS
address or a service-account key — would hand the calendar to anyone who found
the URL. A Google OAuth client ID is public by design and the token it returns
belongs to whoever signed in, so the calendar stays yours. The token is kept in
`sessionStorage` and dies with the tab; the events it fetched are cached in
`localStorage` with everything else, so the month still draws before a token
comes back and after one expires. Disconnect revokes the token with Google and
clears the cache.

Because the Google project stays in Testing, Google shows an "unverified app"
screen the first time. That is expected for something only you use.

## Obsidian
Paste daily notes into the importer (Fitness → Import Obsidian) and it reads
weigh-ins, steps, water, lifts and food. Food filed under `## Breakfast` /
`## Lunch` / `## Dinner` / `## Snacks` headings lands in that meal; a quantity
before the calories (`Chicken breast 8 oz 372 cal`) becomes the serving.
Imported foods are ordinary log entries — they show in History, reopen in the
detail editor and rescale by servings, tagged `Obsidian` so you can see where
they came from. Re-importing a note you have already imported does not
duplicate the day.

Every view is keyboard-navigable: `Ctrl`/`Cmd`-`K` jumps to the action-search
launcher in the header, arrow keys move through the quick-action tabs, and a
skip link leads the tab order.

### A note on the reference foods
Brands and Basics are **reference values, not a live database**: standard
figures for a plain serving, and chain-published figures for the standard menu
item. Chains reformulate, portions vary by store, and anything customised
changes the numbers. Check the ones you eat often against the label or the
chain's own page — logging one turns it into an entry you own and can correct,
and the corrected version is what appears in History next time.

## Design
A control panel, not a website. Four colours do the whole job — near-black
`#08060A` for the ground, red-charcoal `#1A0E13` for surfaces, signal red
`#FF3B4E` as the single accent, warm off-white `#FFE7EA` for text.

**Layout.** Navigation is a 76px icon rail; on a phone it gives way to a bottom
dock. The top bar is the time, the section, the command palette and status —
there is no page heading and no breadcrumb. `main` has no max-width and runs
edge to edge.

Screens are built from a twelve-column **bento** on 92px rows, and modules claim
the space their importance earns: a 2×2 for today's plan, a 1×1 for a utility.
Command is the source of truth — every other screen uses its surfaces, type
scale and primitives rather than inventing another card.

**Surfaces** are told apart by tone, spacing and a two-layer shadow with a
hairline top highlight, not by drawing a red line around everything. The rim
appears on hover. Red is for progress, active states, alerts and the numbers
that matter.

**One shape per question**, so no two metrics read the same way: a radial for
one number chasing a goal, a segmented bar for parts of a whole, a fill for a
vessel, a sparkline for a direction, a timeline for a day, a checklist for
things to tick, square controls for actions.

**On a phone** modules opt in to staying half-width — a number survives half a
screen, an appointment list does not — so nothing simply stacks. Controls
become a horizontal shelf.

Motion is two tokens: `--dur` for hovers, `--dur-slow` for the radial's sweep
and the gauge's fill. Both follow the OS reduced-motion setting by default, and
the `PAUSE` / `PLAY` control in the header overrides that either way. The choice
is remembered.
