

> Perform a **clean-up and file organization pass** on the entire project. The goal is to remove redundant, unused, and duplicate files without changing any functionality, UI, logic, or behavior anywhere in the project.
>
> ---
>
> ## STEP 1 — AUDIT BEFORE DELETING ANYTHING
>
> Before deleting any file, component, or asset, run a full audit and produce a list of everything flagged for removal. For each item flagged, state:
> - File/component name
> - Why it is flagged (unused, duplicate, orphaned, overridden, etc.)
> - Whether it is referenced anywhere in the project
>
> Do not delete anything until the audit list is complete. Confirm the audit list before proceeding.
>
> ---
>
> ## STEP 2 — FILES TO DELETE
>
> Delete files that fall into these categories, **only if they pass all safety checks in Step 3:**
>
> **Duplicate files:**
> - Any file that is an exact or near-exact copy of another file with a different name (e.g. "Button.jsx" and "Button_copy.jsx", "CollectionForm.jsx" and "CollectionForm_old.jsx")
> - Any file with suffixes like `_copy`, `_old`, `_backup`, `_v1`, `_v2`, `_final`, `_FINAL`, `_new`, `_temp`, `_test`, `_unused` in its filename
> - Keep only the most recent, actively used version. If unclear which is active, keep both and flag for manual review instead of deleting.
>
> **Unused component files:**
> - Any component file that is not imported or referenced anywhere in the project
> - Any component that has been fully replaced by a newer version and the old version has zero remaining references
>
> **Dead CSS/style files:**
> - Any `.css`, `.scss`, or style file that is not imported by any component or page
> - Any style file where 100% of its rules are overridden by a more specific rule elsewhere and the file itself is never directly imported
>
> **Orphaned asset files:**
> - Any image, icon, or font file in the assets folder that is not referenced in any component, page, or style file
> - Any placeholder image used only during development that has been replaced by real content
>
> **Empty files:**
> - Any file that contains zero code, zero exports, and zero content
> - Any file that contains only commented-out code and nothing else
>
> **Redundant utility files:**
> - Any utility or helper function file where every function inside it is already available in another active utility file or a library already installed in the project
>
> **Stale mock/seed data files:**
> - Any mock data, dummy data, or seed file that is not used by any active component, test, or page
> - Do not delete mock data files if they are still referenced by any active component for placeholder display purposes
>
> ---
>
> ## STEP 3 — SAFETY CHECKS (must pass ALL before any deletion)
>
> For every file flagged for deletion, confirm all of the following before removing it:
>
> **Reference check:**
> - [ ] The file has zero imports in any other file in the project
> - [ ] The file is not referenced in any route, page, layout, or index file
> - [ ] The file is not referenced in any config file (webpack, vite, tailwind, etc.)
> - [ ] The file name does not appear in any import statement anywhere in the codebase
>
> **Functionality check:**
> - [ ] Removing this file will not cause any page to break, error, or show a blank state
> - [ ] Removing this file will not remove any button, form, field, panel, or interactive element from any page
> - [ ] Removing this file will not change any visual output on any page
> - [ ] Removing this file will not affect any navigation, routing, or state management
>
> **Dependency check:**
> - [ ] The file is not a dependency of any file that is actively used
> - [ ] The file does not export any type, interface, constant, or utility that is imported elsewhere
> - [ ] The file is not part of a barrel export (index.js / index.ts) that other files rely on
>
> **If any single check fails — do not delete. Flag it for manual review instead.**
>
> ---
>
> ## STEP 4 — CODE CLEANUP (no deletions — in-file cleanup only)
>
> After removing flagged files, perform these in-file cleanup tasks on all remaining active files:
>
> **Remove unused imports:**
> - In every active file, remove any `import` statement where the imported value, component, or module is never used within that file
> - Do not remove imports that are used indirectly via spread, dynamic access, or re-export
>
> **Remove dead code blocks:**
> - Remove any block of code that is wrapped in `if (false)`, `if (0)`, or any condition that can never be true
> - Remove any function, variable, or constant that is declared but never called or referenced within its scope or exported
> - Do not remove code inside feature flags or environment conditionals — these may be intentionally inactive
>
> **Remove console logs:**
> - Remove any `console.log`, `console.warn`, `console.error`, `console.debug` statements that were left in from development
> - Do not remove logging that is part of a structured error handling or monitoring system
>
> **Remove commented-out code:**
> - Remove any block of commented-out code that is more than 3 lines long and has no accompanying explanation comment
> - Keep comments that explain why something is done, document a workaround, or describe a known limitation
> - Keep all TODO and FIXME comments — do not remove these
>
> **Remove duplicate CSS rules:**
> - In any style file, remove duplicate property declarations within the same selector where the same property is defined more than once
> - Keep the last (most specific/recent) declaration, remove earlier duplicates
> - Do not merge rules across different selectors
>
> ---
>
> ## STEP 5 — FOLDER STRUCTURE CLEANUP
>
> After file deletions and in-file cleanup, organize remaining files:
>
> - Do not rename any file that is actively imported anywhere — renaming breaks imports
> - Do not move any file that is actively imported using a relative path — moving breaks imports
> - If any empty folder remains after deletions, remove the empty folder
> - Do not create new folders
> - Do not reorganize the existing folder structure — only remove empty folders left behind by deleted files
>
> ---
>
> ## STEP 6 — VERIFICATION AFTER CLEANUP
>
> After all deletions and cleanup are complete, verify:
>
> - [ ] Every page in the dashboard renders without errors
> - [ ] Every page in the dashboard renders without any visual difference from before the cleanup
> - [ ] All navigation between pages works correctly
> - [ ] All forms (Add/Edit Artifact, Add/Edit Collection, Add/Edit Condition Report) open, fill, and submit correctly
> - [ ] All buttons on all pages function correctly
> - [ ] All collapsible panels open and close correctly
> - [ ] All filters, search bars, tabs, and view toggles work correctly
> - [ ] No browser console errors appear on any page after cleanup
> - [ ] No missing module or import errors appear anywhere
>
> If any verification check fails, restore the deleted file immediately and flag it for manual review.
>
> ---
>
> ## ABSOLUTE DO NOT DELETE LIST
>
> Never delete any of the following regardless of whether they appear unused:
> - Any file that defines a route or page component
> - Any file that defines a layout or template used by multiple pages
> - Any file that contains authentication, authorization, or access control logic
> - Any file that defines the sidebar, navbar, or global navigation
> - Any file that defines the design system, theme tokens, or global CSS variables
> - Any configuration file (vite.config, tailwind.config, package.json, tsconfig, etc.)
> - Any file inside a `types/` or `interfaces/` folder
> - Any file that handles API calls, data fetching, or state management
> - Any file that is part of the Curator or Staff dashboard functionality for Artifacts, Collections, or Condition Reports
> - Any index.js or index.ts barrel export file
>
> ---
>
> ## RULES
> - Do not change any functionality, behavior, logic, routing, or visual output anywhere in the project
> - Do not rename any active file
> - Do not move any active file
> - Do not refactor any code — cleanup only, no rewrites
> - Do not update any dependencies or packages
> - If uncertain about any file — do not delete it, flag it for manual review
> - Produce a final report listing every file deleted, every file flagged for manual review, and every in-file cleanup action taken