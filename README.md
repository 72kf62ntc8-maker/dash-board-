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

Food is split into three screens behind one command bar — **Today**, **Carb
cycle** and **Nutrition** — so the rotation is one tap rather than a scroll,
and the bar keeps the day, the day's type and Add food in reach on all three.

Food and Steps carry a day strip: step back through the log to review or fix a
day you missed, and everything you log there — food, water, steps — lands on
the day you are looking at. Command and the coach always speak about today.
- **Planner** — tasks with an optional due date and priority, grouped Overdue /
  Today / Tomorrow / This week / Later / No date, filtered Open / Done / All.
- **Calendar** — events with a real date and time, grouped chronologically and
  filtered Upcoming / Past / All. The week ahead of training from your Fitness
  program shows alongside them, ticked off once the session is logged. Those
  rows are derived from the program, so they are read-only here — change them on
  Fitness → Program.
- **Journal / Reselling / Money** — quick capture lists.

Command's **Up next** merges open tasks, scheduled events and today's and
tomorrow's training into one ordered list, soonest first, and the coach counts
anything overdue.

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
JARVIS command center, violet build. Four colours do the whole job — near-black
`#07050D` for the ground, dark violet `#120D20` for panels, electric purple
`#9B5CFF` as the single accent, lavender `#E8DFFF` for text and hot highlights.
Depth comes from layering translucent surfaces over that ground with hairline
violet rims rather than heavy shadows, lit by two soft ambient violet pools.

The only motion is the slow orbital core on Command. It is decorative — not a
reading of anything — so it follows the OS reduced-motion setting by default,
and the `PAUSE` / `PLAY` control in the header overrides that either way. The
choice is remembered.
