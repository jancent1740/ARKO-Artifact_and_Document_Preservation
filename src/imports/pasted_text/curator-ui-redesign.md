You are redesigning only the action buttons and interactive UI components on the curator-facing pages of the ARKO Museum Curator Dashboard. The pages in scope are:

Manage Items (artifact review/detail view)
Condition Reports
Manage Collections

Do not touch any other pages, the sidebar, the navbar, the top bar, or any visitor-facing or public-facing pages. Do not change layouts, content, data fields, typography, card structures, icons, or any other UI elements outside of the specific components listed below.

CONTEXT
The ARKO Curator Dashboard uses a dark, professional admin aesthetic — dark sidebar #1A1F2E, white card surfaces on a muted background, clean data tables, and collapsible detail panels. It looks and feels like a serious professional tool (similar to Linear or Notion Admin). The current Reject / Approve / See Preview action buttons at the bottom of artifact detail views are visually inconsistent with this aesthetic — they are too colorful, too pill-shaped, and carry equal visual weight when they should have a clear hierarchy.

WHAT TO REDESIGN
1. PRIMARY ACTION BUTTONS (bottom of artifact/item detail view)
Current state: Three equally weighted pill-shaped buttons — red "Reject", green "Approve", blue "See Preview" — all with bright solid fills and equal sizing. Feels consumer-app, not professional curator tool.
Redesign to:

Shape: border-radius: 8px on all buttons — match the existing card and panel border-radius in the dashboard, not pill-shaped
Height: 36px consistently across all three
Font: 13px, font-weight: 600, letter-spacing: 0.02em
Button hierarchy — left to right, weakest to strongest:
See Preview (leftmost, lowest priority):

Background: rgba(255,255,255,0.06)
Border: 1px solid rgba(255,255,255,0.1)
Text: rgba(255,255,255,0.7)
Hover: background becomes rgba(255,255,255,0.1)
Keep existing eye icon, reduce icon size to 14px

Reject (middle, destructive but not alarming):

Background: transparent
Border: 1px solid rgba(239,68,68,0.4)
Text: #EF4444
Hover: background becomes rgba(239,68,68,0.08), border becomes rgba(239,68,68,0.7)
Keep existing warning/circle icon, 14px

Approve (rightmost, primary action):

Background: #16A34A solid fill
Border: none
Text: white
Hover: background becomes #15803D, subtle translateY(-1px) lift
Keep existing checkmark icon, 14px


Button container: right-aligned, gap: 8px, padding: 16px 24px, top border 1px solid rgba(255,255,255,0.07), background matches the card/panel it sits in


2. STATUS BADGES on artifact/item cards (Manage Items page)
Current state: Brightly colored pill badges — green "Public", orange/gold "Members Only", red "Rejected", etc. — visually too loud for a curator admin tool.
Redesign to:

Shape: border-radius: 6px (not pill)
Size: 10px, font-weight: 700, letter-spacing: 0.08em, uppercase
Padding: 3px 8px
Color system — muted, tinted:

Approved / Public: background: rgba(34,197,94,0.12), color: #22C55E, border: 1px solid rgba(34,197,94,0.2)
Pending / Submitted: background: rgba(234,179,8,0.12), color: #EAB308, border: 1px solid rgba(234,179,8,0.2)
Rejected: background: rgba(239,68,68,0.12), color: #EF4444, border: 1px solid rgba(239,68,68,0.2)
Members Only: background: rgba(196,151,58,0.12), color: #C4973A, border: 1px solid rgba(196,151,58,0.2)
Draft: background: rgba(255,255,255,0.06), color: rgba(255,255,255,0.45), border: 1px solid rgba(255,255,255,0.1)




3. SECONDARY ACTION BUTTONS (inline actions on item cards and tables — Edit, Delete, View, Assign, etc.)
Current state: Varies — some are colored fills, some are plain text links, inconsistent styling.
Redesign to:

Default state: icon-only or icon + label, background: transparent, color: rgba(255,255,255,0.45), no border
Hover: color: rgba(255,255,255,0.85), background: rgba(255,255,255,0.06), border-radius: 6px
Destructive actions (Delete, Reject): hover color: #EF4444, background: rgba(239,68,68,0.08)
Size: 28–32px height, padding: 0 10px
Font: 12px, font-weight: 500


4. FORM INPUTS on Condition Reports and Manage Collections pages
Current state: Plain browser-default inputs or inconsistently styled fields.
Redesign to:

Background: rgba(255,255,255,0.05)
Border: 1px solid rgba(255,255,255,0.1)
Border-radius: 8px
Text: rgba(255,255,255,0.85), 13px
Placeholder: rgba(255,255,255,0.3)
Focus state: border becomes rgba(255,255,255,0.3), box-shadow: 0 0 0 3px rgba(255,255,255,0.06)
Height: 36px for single-line inputs, auto for textareas
Select dropdowns: same styling, custom chevron icon in rgba(255,255,255,0.3)


5. COLLAPSIBLE PANEL HEADERS (Specifications, Acquisition, Metadata sections on artifact detail)
Current state: Plain text headers with a basic chevron — functional but unstyled.
Redesign to:

Background: rgba(255,255,255,0.03) on the header row
Hover: rgba(255,255,255,0.05)
Border-radius: 8px when collapsed, 8px 8px 0 0 when expanded
Icon + title: 13px, font-weight: 600, color: rgba(255,255,255,0.75), gap: 8px
Chevron: rgba(255,255,255,0.35), rotates 180deg when expanded, transition: 0.2s
Panel body: background: rgba(255,255,255,0.02), border: 1px solid rgba(255,255,255,0.07), border-top: none, border-radius: 0 0 8px 8px
Data rows inside panel: label rgba(255,255,255,0.35) left, value rgba(255,255,255,0.8) right, padding: 10px 16px, alternating row background rgba(255,255,255,0.02)


RULES

Apply changes only to Manage Items, Condition Reports, and Manage Collections pages
Do not modify the sidebar, top navigation bar, dashboard home, Access Management, Museum Operations, Visitor Scheduling, or any public-facing pages
Do not change any layouts, content structure, data fields, card dimensions, or typography outside the components listed above
All changes must feel native to the existing dark dashboard aesthetic — calm, precise, and professional
No pill-shaped buttons anywhere in these pages
No bright solid-fill colors except for the Approve primary action button