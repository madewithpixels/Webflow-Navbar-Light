# Linked SmashBurger width regression fixture

The published [SB Test Four Home page](https://sb-test-four.webflow.io/) contains one fresh linked, self-contained `SmashBurger` instance from MWP Component Library. Its destination-project wrapper is the `sb-test-container` Div. The wrapper has `max-width: 70rem` and auto left/right margins on the base breakpoint. No width class was added to the linked component or its inner navigation element.

This fixture checks both halves of the width contract: a fresh component fills its available space by default, and a destination site can cap and centre that space without changing Library styles. Before adding the wrapper, the same linked instance and inner filled a 1734px Preview canvas.

| Surface | Viewport | Wrapper | Linked root and inner | Result |
| --- | ---: | ---: | ---: | --- |
| Designer Preview | 1822px | 1120px, centred at x=351 | 1120px | Expanded links visible |
| Designer Preview | 820px | 820px | 820px | Expanded Mobile landscape variant; no horizontal overflow |
| Designer Preview | 667px | 667px | 667px | 384px panel opens; Escape closes it; no horizontal overflow |
| Published staging | 1734px | 1120px, centred at x=307 | 1120px; computed `max-width: none` on root and inner | Expanded links visible; no horizontal overflow |
| Published staging | 820px | 820px | 820px | Expanded Mobile landscape variant; no horizontal overflow |
| Published staging | 600px | 600px | 600px | 384px panel opens to the right edge; Escape closes it; no horizontal overflow |

These values were read on 1 October 2026 after publishing the wrapper change to the Webflow staging domain. Recheck the fixture after changing the Library inner class, linked-component update path, responsive classes or panel geometry. Confirm the wrapper remains a destination-site class and the component inner still has no maximum width. This fixture does not cover every layout preset or a wrapper positioned away from the viewport centre.
