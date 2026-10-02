CSS BUILD NOTES

src/styles.css: public entry stylesheet, arranged in six documented sections, original cascade order retained.
src/admin-styles.css: admin entry stylesheet, first four legacy sections.
Entry imports are src/public-main.jsx and src/admin-main.jsx.
Both stylesheets live directly under src/ so GitHub browser uploading individual files does not silently omit a nested src/styles/ directory.
The former src/styles/ source parts are not needed for build; no runtime imports should depend on them.
When editing, search the relevant section markers and consolidate superseded rules instead of appending versioned overrides.
