# SmashBurger private alpha session — 30 September 2026

## Work and evidence

- Used the existing Chrome Designer tab for `another disposable site` at `/sb-test`; no new workspace or site was created.
- Added one marked 220vh native scroll-test section below the alpha menu with visible start and end markers. The extension reported success, and Canvas and Preview showed the section.
- At 820px in Designer Preview with custom code enabled, verified the Dropdown and Full-width backdrops over the tall page. With either menu open, scrolling reached the end marker and the menu remained open: automatic scroll locking was not applied. Full-width backdrop click closed the menu and returned focus to the trigger. With `Show backdrop` off, Full width opened without dimming the page.
- Restored the instance to its previous Dropdown layout and backdrop-off setting. Left the test section in place for inspection. No publication or released-component change occurred.
- The prototype branch was clean at the end of the browser check. The scoped alpha Embed change and scroll fixture action were already committed as `d080d51` and `12b3a40`; this note records their Designer Preview evidence.
- Added runtime regression tests for Dropdown and Full width: both leave an existing page overflow style alone while the backdrop is open and close on backdrop click. `npm test` passed 23/23. These tests cover runtime state, not browser rendering or stacking.

## Cost observation

The account-wide Codex usage meter showed **15%** of the five-hour window and **2%** of the weekly window used at **14:02:58 UTC**. At **14:09:10 UTC**, after the browser-heavy interval, it showed **25%** and **4%** respectively: differences of **10 and 2 percentage points** over about **6 minutes 12 seconds**. After the local docs and regression-test work, at **14:12:49 UTC**, it showed **28%** and **4%**. The full observed differences were **13 and 2 points** over about **9 minutes 51 seconds**. These are account-wide rolling-window readings, not a per-task charge; other activity and window behavior can affect them. The tool exposes no per-action token, monetary or credit cost. The separate credits balance showed zero at the later snapshots and is not a measure of this task's cost. One free reset remained available and was not used.

The main work in that interval was roughly two dozen Chrome UI operations plus local repo reads. This is a rough activity count, not billing telemetry. Future sessions should compare meter snapshots around a bounded task and note browser UI operations separately from local code work.

## Still open

- Browser presentation and stacking checks at more breakpoints, plus published runtime checks for the alpha backdrop candidate.
- Native installer schema parity, complete destination setup and release/distribution decisions.
- Removal of the scroll-test section when the disposable fixture is no longer useful.

## Continuation, 15:59–16:02 UTC

- Updated source CSS so all five collapsed layouts, including Dropdown and Full width, expose the backdrop while opening or open. This is a source candidate only; pinned v0.2.3 release artifacts and Webflow sites were not changed in this continuation.
- Added a computed-style regression check covering backdrop opacity, visibility, pointer events and stacking against the navigation in closed, opening and open states for every layout. `npm test` passed **24/24**; `npm run check` passed.
- Account-wide meter: five-hour usage **29%** and weekly usage **5%** at **15:59:36 UTC**; **31%** and **5%** at **16:02:01 UTC**. The observed five-hour difference was **2 percentage points** across roughly **2 minutes 25 seconds** of local code, tests and documentation. These rolling-window readings are not per-task billing or a clean comparison with the earlier browser interval.
