Here's the redesign-specific Figma Make prompt:

PROMPT:

You are redesigning the existing University of Nueva Caceres (UNC) Museum website (unc.edu.ph museum portal). This is a redesign only — do not invent new features or change the site's purpose, content structure, or navigation. Keep all existing page names, labels, artifact titles, descriptions, filter categories, and content exactly as they appear on the current site. Only the visual design, layout, and UI components are being updated.

WHAT EXISTS ON THE CURRENT SITE (do not change these)
Navigation: UNC Museum logo (circular crimson badge + "UNC Museum" text), links — Home, Catalog, Collections, Educational, Exclusive Collections, Login button, Register button.
Pages:

Home — hero with "Preserving Bicol's Rich Cultural Heritage" headline, artifact photo grid, Explore Collections + Educational Resources CTAs
Catalog — search bar, left filter sidebar (Artifact Type, Museum, Period filters), artifact card grid with Public/Members Only badges, sort + view toggle, pagination
Collections — collections listing page
Educational — "Educational Resources" hero, search bar, All Categories dropdown, resource card grid
Exclusive Collections — "Exclusive Collections" hero with "Premium Content" badge, Get Access + Learn More buttons, blurred locked content grid, search bar, All/Artifacts/Documents tabs

Existing brand colors to keep: Deep crimson #8B0000, white #FFFFFF. Do not change fonts.

REDESIGN GOALS
The current site looks unpolished and student-made. The redesign should make it look like a professional, world-class museum digital archive — modern, clean, and prestigious — without changing any content or adding new sections that don't exist.

DESIGN SYSTEM TO APPLY
Color usage rules:

Crimson #8B0000 is used ONLY as an accent — buttons, active states, badges, underlines, focus rings. Never as a full hero or page background.
Hero backgrounds: warm parchment #F0EBE3 — replaces all flat red/white hero blocks
Page body: #FAFAF9, card surfaces: #FFFFFF
Dark sections (stats, exclusive hero, visit section): #111111
Gold #C4973A — accent only inside dark #111111 sections
Text: #111111 headings, #555555 body, #888888 muted/labels
Borders: 1px solid rgba(0,0,0,0.08)

Buttons:

Replace all existing boxy square buttons with border-radius: 100px pill shapes
Primary: crimson fill #8B0000, white text, hover darkens + lifts translateY(-2px)
Secondary: transparent background, 1.5px solid rgba(0,0,0,0.12), dark text, hover turns border + text crimson
Login: ghost pill. Register: solid crimson pill. Both in navbar.
On dark backgrounds only: ghost button uses rgba(255,255,255,0.2) border, white text; gold fill #C4973A for primary CTA

Navbar redesign:

Make it sticky + fixed, height: 68px
Add backdrop-filter: blur(16px) and background: rgba(255,255,255,0.96)
Add box-shadow on scroll only (not static)
Active nav link: replace existing red underline block with a clean 2px crimson line flush to the bottom of the link text only
Login → ghost pill button. Register → solid crimson pill button.
Remove the back arrow ← that currently appears on inner pages

Cards:

Replace all flat/square cards with border-radius: 12px, white background, 1px solid rgba(0,0,0,0.08) border, subtle box-shadow: 0 2px 12px rgba(0,0,0,0.05)
Hover: translateY(-6px) lift + deeper shadow 0 16px 40px rgba(0,0,0,0.09)
All card images: overflow: hidden with scale(1.07) zoom on hover, smooth 0.4s transition
Access badges (Public/Members Only): replace existing green/orange square badges with pill-shaped badges — green #22C55E for Public, gold #C4973A for Members Only — positioned top-right of card image

Section labels:

Above every section heading, add a small label: 11px, font-weight: 700, letter-spacing: 0.14em, uppercase, crimson, with a 20px × 1.5px crimson horizontal line before the text
Example: —— BROWSE above "Artifact Catalog"

Section spacing:

Increase all section padding to minimum 80px vertical, 80px horizontal
Add 24px gaps between cards
Increase whitespace between hero content elements

Animations:

Add fade-up scroll entrance on all major sections: opacity: 0 + translateY(24px) → opacity: 1 + translateY(0), transition: 0.6s ease
Stagger grid children with transition-delay: first child 0s, second 0.1s, third 0.2s, fourth 0.3s


PAGE-BY-PAGE REDESIGN INSTRUCTIONS
HOME PAGE
Hero — replace flat dark block:

Background changes from solid #1A1A1A to warm parchment #F0EBE3 with a very subtle radial crimson glow at 6% opacity
Keep the existing two-column layout (text left, image grid right)
Add a small crimson label "City of Naga · Est. 1948" with a leading line above the existing headline
"Rich Cultural" in the headline becomes italic crimson
Body text color changes from rgba(255,255,255,0.55) to #555555
CTAs become pill-shaped (crimson primary + ghost secondary)
Stats row (500+ Artifacts, 12 Collections, 80+ Edu Resources) below a 1px solid rgba(0,0,0,0.12) border — numbers in large serif, labels in small muted text
Right image grid: replace the UNC seal image (bottom-right cell) with a 4th artifact photo. Keep the 2×2 grid layout with 3px gaps.

Existing sections below hero — redesign each:

Featured Collections grid: replace flat color blocks with photo cards that have dark gradient overlays, white serif titles, crimson category badge, and item count
All artifact/resource cards: apply the new card design system above
Any flat red banner sections: replace with the dark #111111 band using gold accents and proper spacing

CATALOG PAGE
Hero area:

Replace plain white header with warm parchment #F0EBE3 hero section
Add section label "Browse" above "Artifact Catalog" heading
Redesign search bar: pill shape, white background on parchment, 1.5px border, crimson focus ring box-shadow: 0 0 0 3px rgba(139,0,0,0.1), magnifier icon inside left
Add horizontal tab strip below search: All Items / Physical Artifacts / Documents / Photographs / Textiles / Manuscripts — with 2px crimson underline on active tab, border-bottom: 2px solid rgba(0,0,0,0.08) baseline

Filter sidebar (keep all existing filters, redesign only):

Give sidebar white background + 1px right border
Replace existing plain checkboxes with 16px custom checkboxes: unchecked = white + 1.5px rgba(0,0,0,0.12) border + 4px radius; checked = crimson fill + white checkmark
Each filter label: 13px, #555555. Add right-aligned count in #888888
Filter group titles: 12px, 700 weight, uppercase, 0.08em letter-spacing, with a collapse indicator ▲/▼
Add 1px solid rgba(0,0,0,0.08) dividers between filter groups
"Filters" heading with "Clear all" in crimson 13px right-aligned

Artifact grid (keep existing cards, redesign only):

Apply new card system: 12px radius, white, hover lift
Access badge: pill shape, top-right of image. Green for Public, gold for Members Only.
Card footer: type label in 10px muted uppercase, serif artifact title, description, metadata row (museum + period with icons)

Toolbar:

"Showing X of Y artifacts" in 13.5px muted text
Sort dropdown: border-radius: 8px, 1.5px border, clean styling
Grid/List toggle: two icon buttons in a bordered 8px radius container, active state gets crimson fill

Pagination:

Replace existing pagination with numbered page buttons: 36px square, 8px radius, 1.5px border. Active page: crimson fill, white text.

COLLECTIONS PAGE
Hero:

Replace plain white/red header with warm parchment #F0EBE3 two-column hero
Left: section label "Explore" + heading "Our Collections" + description + two pill CTAs
Right: 2×2 image mosaic with 10px gaps, 12px radius — first image spans full height of left column

Collections listing:

Add pill filter chips above the grid: All / Pre-colonial / Colonial Era / Modern Period / Natural History / Art & Culture. Active = crimson fill. Inactive = white + border.
Redesign collection cards: 16px radius, 220px photo header with dark gradient overlay + item count badge (dark blurred pill bottom-left), body with era label in muted uppercase + serif collection name + description + tag chips row + "View →" link

EDUCATIONAL RESOURCES PAGE
Hero:

Replace flat crimson red hero block with warm parchment #F0EBE3 two-column layout
Left: section label "Learn" + heading "Educational Resources" + existing description text + two pill CTAs (Explore Resources + Teacher's Guide) + stats row (80+ Resources / 12 Subject Areas / Free)
Right: the existing 2×2 image grid — replace the UNC seal (bottom-right) with a 4th resource photo. Keep images, 12px radius.

Search + filters:

Replace existing plain search bar + "All Categories" dropdown with: pill search bar (white, bordered, crimson focus) + row of pill filter chips below (All Resources / Study Guides / Videos / Activities / Research Papers / Elementary / High School / College)

Resource cards:

Replace existing empty gray placeholder cards with fully designed cards
Each card: photo or subject illustration, color-coded type badge top-left of image (Study Guide: #EBF5FF blue; Video: #FFF0E6 orange; Activity: #F0FAF0 green; Research: rgba(139,0,0,0.08) crimson)
Card body: grade level label in muted uppercase, serif title, description
Card footer: action link ("Download →" / "Watch →" / "Read →") in crimson

EXCLUSIVE COLLECTIONS PAGE
Hero — replace plain white layout:

Background changes to full dark #111111
Keep two-column layout (text left, locked image grid right)
Remove the existing yellow/cream "Premium Content" badge — replace with gold section label "Members Only" using the section label system
Heading "Exclusive Collections" in white serif
Description text in rgba(255,255,255,0.45)
Add 4 benefit bullet points with gold ✓ checkmarks: "High-resolution artifact photography & 3D scans", "Restricted colonial-era documents & manuscripts", "Unpublished academic research papers", "Complete provenance & acquisition records"
CTA buttons: gold fill "Get Access — It's Free" + ghost white "Learn More" (replacing existing boxy crimson buttons)
Right image grid: keep existing 4 blurred locked images, redesign each as a square card with border-radius: 14px, blurred photo at 35% opacity, centered white lock icon in frosted circular border (rgba(255,255,255,0.1) fill + rgba(255,255,255,0.2) border), "Members Only" label below icon
Add radial crimson glow radial-gradient(circle, rgba(139,0,0,0.2), transparent 65%) top-right of hero

Search bar:

Redesign as pill shape on white background section
Replace All/Artifacts/Documents plain tabs with pill chip tabs — All / Artifacts / Documents / Research. Active = crimson fill.

Locked content grid:

Add a gold-tinted CTA strip above the grid: rgba(196,151,58,0.15) background, 1.5px solid rgba(196,151,58,0.25) border, 14px radius. Text: "You're viewing locked content." bold + description. Right: solid crimson "Register Free →" pill button.
Redesign existing locked cards: 14px radius, photo at blur(4px) + 35% opacity, gold "Members Only" ribbon badge top-left, centered lock icon + "Unlock to View" label, card body with type + serif title + description, footer "🔒 Unlock Access →" in crimson


Global rules across all pages:

Keep all existing text content, labels, and copy exactly as written on the current site
Keep all existing navigation structure and page names
Do not add pages, sections, or features that don't already exist
Apply the card, button, spacing, and animation system consistently on every page
All interactive elements (filters, tabs, chips, checkboxes, toggles) must work
Fully responsive: desktop, tablet, and mobile

You are out of free messages until 4:10 AMGet moreSonnet 4.6Claude is AI and can mak