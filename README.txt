VI2 — NEXT.JS WARNING CLEANUP

COPY TO:
C:\Users\hp\vi2\

REPLACE:
next.config.ts

THIS FIXES:
1. Next/Image warning for quality={100}
2. Turbopack root warning

AFTER REPLACING:

Stop the dev server:
Ctrl + C

Then run:
npm run dev

Then hard refresh:
Ctrl + Shift + R

HYDRATION WARNING:
Do not change React code yet.

The terminal message explicitly says a browser extension can modify
the HTML before React hydrates. Because your Chrome has multiple
extensions enabled, first test localhost in an Incognito window with
extensions disabled.

If the hydration warning still appears in Incognito, send the new
terminal screenshot and we will trace the exact component causing it.
