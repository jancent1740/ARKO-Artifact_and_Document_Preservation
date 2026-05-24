Restructure the Add Artifact form and View/Edit Artifact detail page in the Manage Items section of the ARKO Curator Dashboard to use the following exact field schema. Do not change any other page, section, or component outside of these two views.

FIELD SCHEMA
Apply these fields exactly, in this order, with these field types:
FieldTypeNotesitemIDAuto-generated textRead-only, system-generated. Display as a disabled field with a lock icon. Label: "Item ID"collectionNoDropdown / searchable selectLinks to existing collections. Label: "Collection No."photoMedia uploaderAccepts image files. Supports multiple uploads. Label: "Photo(s)"heightNumber input + unitSuffix: "cm". Label: "Height"widthNumber input + unitSuffix: "cm". Label: "Width"lengthNumber input + unitSuffix: "cm". Label: "Length"colorText inputFree text. Label: "Color"textureText inputFree text. Label: "Texture"acquisitionDateDate pickerLabel: "Acquisition Date"acquisitionSourceText inputMaps to the current "Collection/Sources" column. Label: "Acquisition Source"provenanceLong textareaMulti-line. Label: "Provenance"notesLong textareaMulti-line. Label: "Notes"
Remove any fields that currently exist on the form but are not in this schema. Do not add any fields beyond what is listed above.

ADD ARTIFACT FORM — layout & structure
Page header:

Title: "Add Artifact", 18px, font-weight: 700, color: rgba(255,255,255,0.9)
Subtitle: "Fill in the artifact details below. Item ID will be assigned automatically.", 13px, color: rgba(255,255,255,0.4)
Top-right: Cancel (ghost button) + Save Draft (secondary button) + Submit for Review (primary green button) — all border-radius: 8px

Form layout:
Two-column layout on desktop — left column wider (60%) for main fields, right column (40%) for media and dimensions.
Left column — top to bottom:
Section: Identification

Section label: 11px, font-weight: 700, letter-spacing: 0.12em, uppercase, color: rgba(255,255,255,0.35), with a 20px horizontal line before it
itemID — full width, disabled input, lock icon left inside field, placeholder "Auto-assigned on submission", background rgba(255,255,255,0.03), border 1px solid rgba(255,255,255,0.06), text rgba(255,255,255,0.3)
collectionNo — full width, searchable dropdown, shows existing collection names and numbers, placeholder "Select a collection..."

Section: Physical Description

color — full width text input
texture — full width text input
Dimensions row — three inputs side by side, equal width, each with a cm suffix label inside the input right side: height · width · length

Section: Acquisition

acquisitionDate — full width date picker
acquisitionSource — full width text input, placeholder "e.g. Archaeological excavation, donation, purchase..."
provenance — full width textarea, min-height: 100px, placeholder "Describe the artifact's origin and ownership history..."

Section: Additional Notes

notes — full width textarea, min-height: 80px, placeholder "Any additional observations or internal notes..."

Right column — top to bottom:
Section: Photo(s)

Large media upload zone: border: 2px dashed rgba(255,255,255,0.1), border-radius: 12px, background: rgba(255,255,255,0.03), min-height: 220px
Centered content when empty: upload icon rgba(255,255,255,0.2), label "Drag & drop photos here" rgba(255,255,255,0.4) 13px, subtext "or click to browse · JPG, PNG, WEBP · Max 10MB each" rgba(255,255,255,0.25) 11px
When photos are uploaded: show thumbnail grid 3 columns, border-radius: 8px, with a remove × button top-right of each thumbnail
Below uploader: "Add More Photos" ghost button, full width, border-radius: 8px

Section: Dimensions Summary

After dimensions are entered in the left column, show a read-only summary card on the right: background: rgba(255,255,255,0.03), border: 1px solid rgba(255,255,255,0.08), border-radius: 8px, padding: 16px
Three rows: Height · Width · Length — label rgba(255,255,255,0.35) left, value rgba(255,255,255,0.75) right
If no values entered yet, show "—" as placeholder value

Bottom action bar:

border-top: 1px solid rgba(255,255,255,0.07), padding: 16px 24px, right-aligned
Left: Cancel (ghost) → Save Draft (secondary) → Submit for Review (primary green)
gap: 8px, all border-radius: 8px, height: 36px


VIEW / EDIT ARTIFACT PAGE — layout & structure
Page header:

Left: Item ID in 12px muted breadcrumb style → artifact name in 18px font-weight: 700
Right: Edit (secondary button) + Delete (destructive outlined button) — border-radius: 8px
Below header: status badge (Approved / Pending / Rejected / Draft / Members Only) using the existing badge system — border-radius: 6px, muted tinted colors

Body layout:
Same two-column split as the Add form (60% left, 40% right), but in read-only display mode by default. Clicking Edit switches all fields to editable inputs in place.
Left column — collapsible panels, same section grouping as Add form:
Identification panel:

itemID — read-only row, lock icon, value in rgba(255,255,255,0.8)
collectionNo — read-only row, shows collection name + number

Physical Description panel:

color — read-only row
texture — read-only row
Dimensions — three rows: Height / Width / Length, each showing value + "cm"

Acquisition panel:

acquisitionDate — read-only row, formatted as "Month DD, YYYY"
acquisitionSource — read-only row
provenance — read-only row, full text, multi-line

Notes panel:

notes — read-only row, full text, multi-line

Each panel follows the existing collapsible panel design system:

Header: background: rgba(255,255,255,0.04), border: 1px solid rgba(255,255,255,0.08), border-radius: 8px collapsed / 8px 8px 0 0 expanded
Body: background: rgba(255,255,255,0.02), border: 1px solid rgba(255,255,255,0.08), border-top: none, border-radius: 0 0 8px 8px
Data rows: label rgba(255,255,255,0.35) left 12px, value rgba(255,255,255,0.8) right 13px, padding: 11px 16px, alternating row tint, border-bottom: 1px solid rgba(255,255,255,0.05)

Right column:
Photo panel:

Display uploaded photos in a thumbnail grid, 3 columns, border-radius: 8px, clicking a thumbnail opens a lightbox/fullscreen preview
Below grid: "Manage Photos" secondary button (edit mode only)

Dimensions summary card:

Same read-only summary card as Add form — background: rgba(255,255,255,0.03), border: 1px solid rgba(255,255,255,0.08), border-radius: 8px

Bottom action bar (curator review actions):

Ghost "See Preview" → Destructive "Reject" → Primary green "Approve"
border-top: 1px solid rgba(255,255,255,0.07), padding: 16px 24px, right-aligned, gap: 8px
All border-radius: 8px, height: 36px


RULES

Use exactly and only the 12 fields in the schema — no more, no less
Field order must match the schema exactly as listed
All inputs, textareas, dropdowns, and date pickers must use the existing dark input design system: background: rgba(255,255,255,0.05), border: 1px solid rgba(255,255,255,0.1), border-radius: 8px, focus ring box-shadow: 0 0 0 3px rgba(255,255,255,0.06)
All buttons must use the existing button design system: border-radius: 8px, no pill shapes, correct type per action
Section labels use the same style as the rest of the dashboard — 11px, uppercase, letter-spacing: 0.12em, rgba(255,255,255,0.35), leading horizontal line
Do not change any other page, section, sidebar item, or component outside the Add Artifact form and View/Edit Artifact page