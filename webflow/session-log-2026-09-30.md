# SmashBurger private alpha session — 30 September 2026

## Work and evidence

- Used the existing Chrome Designer tab for `another disposable site` at `/sb-test`; no new workspace or site was created.
- Added one marked 220vh native scroll-test section below the alpha menu with visible start and end markers. The extension reported success, and Canvas and Preview showed the section.
- At 820px in Designer Preview with custom code enabled, verified the Dropdown and Full-width backdrops over the tall page. With either menu open, scrolling reached the end marker and the menu remained open: automatic scroll locking was not applied. Full-width backdrop click closed the menu and returned focus to the trigger. With `Show backdrop` off, Full width opened without dimming the page.
- Restored the instance to its previous Dropdown layout and backdrop-off setting. Left the test section in place for inspection. No publication or released-component change occurred.
- The prototype branch was clean at the end of the browser check. The scoped alpha Embed change and scroll fixture action were already committed as `d080d51` and `12b3a40`; this note records their Designer Preview evidence.

## Cost observation

The account-wide Codex usage meter showed **15%** of the five-hour window and **2%** of the weekly window used at **14:02:58 UTC**. At **14:09:10 UTC**, it showed **25%** and **4%** respectively. The observed differences were **10 and 2 percentage points** over about **6 minutes 12 seconds** of this browser-heavy interval. These are account-wide rolling-window readings, not a per-task charge; other activity and window behavior can affect them. The tool exposes no per-action token, monetary or credit cost. The separate credits balance showed zero at the later snapshot and is not a measure of this task's cost. One free reset remained available and was not used.

The main work in that interval was roughly two dozen Chrome UI operations plus local repo reads. This is a rough activity count, not billing telemetry. Future sessions should compare meter snapshots around a bounded task and note browser UI operations separately from local code work.

## Still open

- Automated regression coverage, more breakpoints and published runtime checks for the alpha backdrop candidate.
- Native installer schema parity, complete destination setup and release/distribution decisions.
- Removal of the scroll-test section when the disposable fixture is no longer useful.
