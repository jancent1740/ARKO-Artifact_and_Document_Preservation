Apply the light page and form design system defined below to every form, detail view, list view, and sub-page within these six sections across both the Staff and Curator sides of the ARKO Dashboard:

Manage Items (Artifacts) — Curator side
Manage Items (Artifacts) — Staff side
Condition Reports — Curator side
Condition Reports — Staff side
Manage Collections — Curator side
Manage Collections — Staff side

This includes every screen within these sections: list views, detail/view pages, add forms, edit forms, modals, drawers, confirmation dialogs, and any sub-view that opens within these sections.
Do not change the sidebar, top navbar, Dashboard Home, Access Management, Museum Operations, Visitor Scheduling, Digital Archives, or any public-facing pages. Do not change any page outside the six sections listed above.

LIGHT DESIGN SYSTEM — apply everywhere in scope
Page background

Main content area: #F5F5F7
Do not change the sidebar background — it stays dark

Cards and panels

Background: #FFFFFF
Border: 1px solid rgba(0,0,0,0.08)
Border-radius: 12px
Box-shadow: 0 1px 4px rgba(0,0,0,0.06)
Gap between stacked cards/panels: 8px

Collapsible panel headers

Background: #FFFFFF
Border-bottom when expanded: 1px solid rgba(0,0,0,0.07)
Border-radius: 10px collapsed, 10px 10px 0 0 expanded
Padding: 13px 16px
Icon: 16px, color: #888888
Title: 13px, font-weight: 600, color: #222222
Chevron: color: #BBBBBB, rotates 180deg on expand, transition: transform 0.2s ease
Hover: background: #FAFAFA

Collapsible panel body

Background: #FFFFFF
Border-radius: 0 0 10px 10px
Data row: padding: 11px 16px, display: flex, justify-content: space-between, align-items: flex-start
Row divider: border-bottom: 1px solid rgba(0,0,0,0.05), no border on last row
Alternating row tint: every even row background: #FAFAFA
Label: font-size: 12px, font-weight: 500, color: #AAAAAA, min-width: 130px, flex-shrink: 0
Value: font-size: 13px, font-weight: 400, color: #222222, text-align: right, line-height: 1.5

Section labels (above form groups and panel groups)

font-size: 11px, font-weight: 700, letter-spacing: 0.12em, text-transform: uppercase
color: #AAAAAA
Leading 20px × 1.5px horizontal line in #AAAAAA before the text
margin-bottom: 14px

Form inputs — all fields across all forms

Background: #FFFFFF
Border: 1px solid rgba(0,0,0,0.12)
Border-radius: 8px
Height: 36px single-line, auto for textareas
Font-size: 13px, color: #222222
Placeholder: color: #BBBBBB
Focus: border rgba(0,0,0,0.3), box-shadow: 0 0 0 3px rgba(0,0,0,0.06)
Disabled/read-only: background #F5F5F7, border rgba(0,0,0,0.06), color #AAAAAA, cursor not-allowed
Labels above inputs: 12px, font-weight: 600, color: #888888, text-transform: uppercase, letter-spacing: 0.06em, margin-bottom: 6px
Select dropdowns: same styling, custom #BBBBBB chevron icon
Date pickers: same styling as text input
Textareas: same border/background, min-height: 90px, padding: 10px 14px, line-height: 1.6

Dimension inputs (Height, Width, Length)

Three equal-width inputs side by side in one row, gap: 12px
Each input has a cm suffix — displayed as a right-aligned label inside the input field, color: #AAAAAA, font-size: 12px
Fix any duplicate unit bug (e.g. "45.5 cm cm") — show only one "cm"

Media uploader (Photo field)

Upload zone: border: 2px dashed rgba(0,0,0,0.12), border-radius: 12px, background: #FAFAFA, min-height: 200px
Empty state: centered upload icon #CCCCCC, label "Drag & drop photos here" #888888 13px, subtext "JPG, PNG, WEBP · Max 10MB each" #BBBBBB 11px
Uploaded thumbnails: 3-column grid, border-radius: 8px, remove × button top-right of each
"Add More Photos" button below: secondary style, full width

Status badges — light versions, apply everywhere in scope
Shape: border-radius: 6px, 10px, font-weight: 700, letter-spacing: 0.08em, uppercase, padding: 3px 8px

Approved / Public: background: rgba(34,197,94,0.1), color: #15803D, border: 1px solid rgba(34,197,94,0.25)
Pending / Submitted / Under Review: background: rgba(234,179,8,0.1), color: #B45309, border: 1px solid rgba(234,179,8,0.25)
Rejected: background: rgba(239,68,68,0.1), color: #DC2626, border: 1px solid rgba(239,68,68,0.25)
Members Only / Restricted: background: rgba(196,151,58,0.1), color: #92650A, border: 1px solid rgba(196,151,58,0.25)
Draft: background: rgba(0,0,0,0.05), color: #888888, border: 1px solid rgba(0,0,0,0.1)
Archived: background: rgba(100,116,139,0.1), color: #475569, border: 1px solid rgba(100,116,139,0.2)


BUTTON SYSTEM — light versions, apply everywhere in scope
All buttons across all pages and forms in these six sections use border-radius: 8px, height: 36px, font-size: 13px, font-weight: 600, transition: all 0.15s ease. No pill shapes anywhere.
Primary (Save, Create, Submit, Approve, Confirm):

Background: #16A34A
Color: white
Border: none
Hover: background #15803D, translateY(-1px)

Destructive (Delete, Reject, Remove, Discard):

Background: transparent
Border: 1px solid rgba(239,68,68,0.35)
Color: #DC2626
Hover: background rgba(239,68,68,0.05), border rgba(239,68,68,0.6)

Secondary (Edit, Assign, Export, Duplicate, Add Condition Report, Back):

Background: #F5F5F7
Border: 1px solid rgba(0,0,0,0.1)
Color: #333333
Hover: background #EBEBEB, border rgba(0,0,0,0.2)

Ghost/Low-priority (Cancel, See Preview, Close, View):

Background: transparent
Border: none
Color: #888888
Hover: background #F0F0F0, color #333333, border-radius: 6px

Icon-only inline buttons (table/card row actions):

Size: 28px × 28px
Background: transparent, border: none
Icon: #BBBBBB
Hover: background #F0F0F0, icon #333333, border-radius: 6px
Destructive hover: background rgba(239,68,68,0.06), icon #DC2626
Show on row hover only: opacity: 0 default, opacity: 1 on row hover


BUTTON PLACEMENT RULES
Bottom action bars (detail/view pages):

Remove position: fixed and position: sticky entirely
Make it a normal in-flow element at the very bottom of the page content
Container: background: #FFFFFF, border: 1px solid rgba(0,0,0,0.08), border-radius: 12px, padding: 16px 24px, display: flex, justify-content: flex-end, gap: 8px
margin-top: 32px above the bar
Order left to right: Ghost → Destructive → Primary
Add padding-bottom: 48px to the page content container

Form action rows (add/edit forms):

Cancel (ghost) on the left, Save/Submit (primary) on the right
Right-aligned, gap: 8px
Same in-flow rule — not sticky or fixed

Inline table row actions:

Icon-only buttons, gap: 4px, appear on row hover

Modals and confirmation dialogs:

Cancel (ghost) left, confirm action (primary or destructive) right


LIST VIEW STYLING — all list/table views in scope
Table container:

Background: #FFFFFF
Border: 1px solid rgba(0,0,0,0.08)
Border-radius: 12px
Overflow: hidden

Table header row:

Background: #FAFAFA
Border-bottom: 1px solid rgba(0,0,0,0.07)
Header labels: 11px, font-weight: 700, color: #AAAAAA, text-transform: uppercase, letter-spacing: 0.08em, padding: 12px 16px

Table body rows:

Background: #FFFFFF
Border-bottom: 1px solid rgba(0,0,0,0.05)
Hover: background: #FAFAFA
Cell text: 13px, color: #333333, padding: 13px 16px
Last row: no border-bottom

Search bar above list:

Background: #FFFFFF
Border: 1px solid rgba(0,0,0,0.12)
Border-radius: 8px
Height: 36px
Magnifier icon: #BBBBBB left inside field
Focus: border rgba(0,0,0,0.25), box-shadow: 0 0 0 3px rgba(0,0,0,0.06)

Toolbar (sort, filter, view toggle):

Sort dropdown: secondary button style
Filter chips: background: #F5F5F7, border: 1px solid rgba(0,0,0,0.1), border-radius: 6px, color: #555555, font-size: 12px. Active: background: #222222, color: white, border-color: #222222
Grid/List view toggle: two icon buttons in a border: 1px solid rgba(0,0,0,0.1) container, border-radius: 8px. Active: background: #222222, icon white

Pagination:

Numbered buttons: 36px square, border-radius: 8px, border: 1px solid rgba(0,0,0,0.1), background: white, color: #555555, font-size: 13px
Active page: background: #222222, color: white, border-color: #222222
Hover: background: #F5F5F7


SCROLLING RULE — all detail and form pages in scope

No element anywhere in these six sections may use position: fixed or position: sticky in a way that overlaps or obscures page content
Every page must be fully scrollable from top to bottom
Action bars, toolbars, and form footers are all in-flow — they appear at the bottom of the content, not floating over it
Add padding-bottom: 48px to every page content container in scope so content never feels cut off at the bottom


RULES

Apply to every screen, form, modal, drawer, list, detail view, and sub-view within the six sections listed — both Staff and Curator sides
Every button, badge, input, card, panel, table, and interactive element must use the light design system above — no dark backgrounds, no rgba white tints, no remnants of the previous dark panel styling on any of these pages
Do not change the sidebar, top navbar, or anything outside the six sections
Do not change field schemas, data structures, collapsible behavior, or navigation logic
The result must feel like one unified, clean, light admin interface consistently across all six sections on both Staff and Curator sides