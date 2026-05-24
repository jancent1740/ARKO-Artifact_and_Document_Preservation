Here is the updated full prompt with the color system fully integrated into every relevant section:

---

## Improved Prompt — ARKO Catalog Module + Collections Page Redesign

Create two fully functional, production-ready pages for a web-based digital museum cataloguing system called **ARKO**. This is a React.js application using Tailwind CSS for styling. The system already has the following pages in its navigation: **Home, Collections, Educational, and Exclusive Collections**. You are building the **Catalog page** as a new addition and **redesigning the existing Collections page** to match the specifications below. Both pages must share the same visual language, component patterns, and navigation structure.

---

### Global Context

**What ARKO is:**
ARKO is a web-based cataloguing and metadata documentation system for historical museums in Naga City, Philippines. It serves four user types — Guest Users, Registered Members, Museum Staff, and Curators. The public-facing side — which these pages belong to — serves Guest Users and Members.

**The distinction between Catalog and Collections:**
- **Catalog** = the complete index of every individual artifact and document in the system, browsable and searchable by any user
- **Collections** = curated, thematic groupings of related artifacts assembled by museum curators, each with its own narrative and contextual information

Both pages link to the same **Artifact Detail Page** when a user clicks a specific artifact. The Artifact Detail Page is already implemented in the system — do not recreate it, only link to it correctly and maintain the back-navigation behavior described below.

---

### Technology Stack

- **Frontend:** React.js with functional components and hooks
- **Styling:** Tailwind CSS utility classes only — no custom CSS files
- **State management:** React useState and useReducer for filter, search, and navigation state
- **Icons:** lucide-react
- **Routing:** React Router DOM — use useNavigate, useParams, useLocation, and useSearchParams for all navigation and state preservation
- **Data:** Hardcoded mock dataset with at least 12 diverse artifact records and at least 4 distinct collections — each collection containing between 3 and 6 artifacts from the artifact dataset

---

### Color System

These are the only colors used across both pages and all their components. Apply them consistently using Tailwind's arbitrary value syntax or by extending the Tailwind config. No color outside this system should appear anywhere in the UI.

```
Deep Carmine:       #9B1D20   — primary buttons, active nav links, heading accents, badges, hover states, key CTAs
Dark Carmine:       #7A1518   — hover states on carmine elements
Light Carmine:      #C4373B   — subtle tints, hover backgrounds on light surfaces
Warm Slate Gray:    #4A5568   — body text, metadata labels, secondary buttons, borders, icons
Mid Gray:           #718096   — placeholder text, muted labels, caption text
Light Warm Gray:    #E2E0DB   — card borders, dividers, skeleton loaders, disabled states
Aged Ivory:         #F5F0E8   — all page backgrounds — never use pure white as a background
Deeper Ivory:       #EDE8DF   — card surfaces, sidebar backgrounds, input field backgrounds
Antique Gold:       #C9A84C   — featured badges, active filter indicators, decorative accents — use sparingly
Light Gold:         #E8D5A3   — subtle gold tints on hover for gold elements
Deep Charcoal:      #1C1C1E   — navbar background, footer, primary display text on light backgrounds
Pure White:         #FFFFFF   — text on dark backgrounds only — never as a page background
Muted Sage:         #4A7C59   — Public access badges only
Warm Amber:         #B07D2E   — Members Only badges only
Deep Terracotta:    #8B3A3A   — error states only
```

**Color application rules that must be followed exactly:**
- Aged Ivory `#F5F0E8` is the dominant background across all pages and sections — never use white as a page or section background
- Deep Carmine `#9B1D20` is used only for interactive elements, active states, and key visual anchors — never as a large section background color
- Deep Charcoal `#1C1C1E` is used for the navbar, footer, and primary display text — not as a general background
- Antique Gold `#C9A84C` appears only for featured content indicators, active filter badges, and small decorative micro-elements — never as a dominant color
- All gray tones handle supporting text, borders, and secondary UI — Warm Slate Gray for readable text, Mid Gray for muted text, Light Warm Gray for structural dividers
- Every interactive element must have a visible focus ring in Deep Carmine for accessibility
- Card backgrounds use Deeper Ivory `#EDE8DF` to separate them from the Aged Ivory page background
- Hover states on carmine buttons darken to Dark Carmine `#7A1518`
- Hover states on light surface interactive elements use a Light Carmine `#C4373B` tint at low opacity

---

### Shared Design System

**Typography:**
- Display and heading font: Cormorant Garamond or Playfair Display — loaded from Google Fonts — used for all page titles, artifact titles, collection names, and section headings
- Body and metadata font: DM Sans or Outfit — loaded from Google Fonts — used for descriptions, labels, metadata values, buttons, and all UI text
- Heading sizes follow a clear hierarchy: page titles at 2.5–3rem, section headings at 1.5–2rem, card titles at 1–1.25rem, metadata labels at 0.75–0.875rem

**Visual atmosphere:**
- Subtle paper grain or noise texture overlaid on the Aged Ivory background using a CSS pseudo-element with low opacity — this creates the archival document feel
- Card borders use Light Warm Gray `#E2E0DB` at 1px — no heavy drop shadows
- Hover transitions at 200ms ease on all interactive elements
- The overall aesthetic must evoke a premium institutional archive — scholarly, refined, and culturally respectful — not a consumer product or e-commerce marketplace

**Shared components used on both pages:**
- Navbar with active state indicator — background Deep Charcoal, active link in Deep Carmine
- Breadcrumb component — text in Mid Gray, current page in Warm Slate Gray
- Artifact Card component — card background Deeper Ivory, border Light Warm Gray, title in Deep Charcoal using serif font, metadata in Warm Slate Gray, hover border color Deep Carmine
- Access level badge — Public in Muted Sage, Members Only in Warm Amber
- Tag pill component — background Light Warm Gray, text Warm Slate Gray, hover background Light Carmine, hover text Deep Carmine
- Loading skeleton component — animated pulse in Light Warm Gray on Deeper Ivory background
- Empty state component — icon and text in Mid Gray, action button in Deep Carmine
- Error state component — icon in Deep Terracotta, action button in Deep Carmine

---

## PAGE 1 — CATALOG PAGE

### Purpose

The Catalog page is the primary discovery interface for all individual artifacts and documents in the system. It is the complete searchable repository — not grouped, not curated, just everything available.

---

### Catalog Overview Layout

**Structure:**
- Fixed top navbar — background Deep Charcoal, text Pure White, active page link underlined in Deep Carmine
- Breadcrumb directly below navbar on Aged Ivory background: Home > Catalog — separator in Mid Gray, current page in Warm Slate Gray
- Page header section on Aged Ivory: title "Catalog" in serif font in Deep Charcoal, subtitle in Mid Gray
- Two-column layout on desktop: fixed-width left sidebar with Deeper Ivory background for filters, Aged Ivory main content area on the right
- On tablet: sidebar collapses, filters become a horizontal scrollable chip row above results on Aged Ivory background
- On mobile: filters hidden behind a "Filters" button in Deep Carmine that opens a full-screen slide-in drawer from the left with Aged Ivory background

---

### Search Bar

- Prominent search bar with Deeper Ivory background, Light Warm Gray border, Warm Slate Gray placeholder text
- On focus, border changes to Deep Carmine with a subtle carmine glow
- Real-time filtering as user types with 300ms debounce — results update without page reload
- Search queries across title, description, category, tags, museum name, historical period, accession number, and author simultaneously
- Dynamic result count in Mid Gray: "Showing 8 of 24 artifacts"
- Clear (×) button in Mid Gray appears inside the input when it contains text — on hover turns Deep Carmine
- Search term preserved in URL as query parameter

---

### Filter Sidebar

Sidebar background Deeper Ivory `#EDE8DF`, right border Light Warm Gray `#E2E0DB`.

Each filter group is a collapsible accordion section. Accordion header background Deeper Ivory, label text in Warm Slate Gray, chevron icon in Mid Gray. On hover, accordion header background shifts slightly darker. Expanded by default on desktop, collapsed on mobile.

**Filter groups:**

**Artifact Type** — checkbox list: Physical Artifact, Document, Photograph, Textile, Ceramic, Jewelry, Manuscript

**Museum** — checkbox list: populated from mock dataset

**Historical Period** — checkbox list: Pre-Colonial, Spanish Colonial, American Colonial, Japanese Occupation, Post-Independence, Contemporary

**Category** — checkbox list: Fine Arts, Religious, Archaeological, Natural History, Cultural Heritage, Military, Administrative

**Tags** — tag cloud: all unique tags from mock dataset as clickable pills — unselected pills in Light Warm Gray background with Warm Slate Gray text, selected pills in Deep Carmine background with Pure White text

**Availability** — radio buttons: All, Public Access Only, Members Only

**Checkbox styling:** unchecked border in Light Warm Gray, checked background Deep Carmine, checkmark Pure White

**Filter behavior:**
- Multiple selections within the same group use OR logic
- Multiple active groups use AND logic
- Sidebar header shows active filter count badge in Deep Carmine: "Filters (3)"
- "Clear All Filters" button styled as a text link in Deep Carmine at top of sidebar
- All active filter state reflected in URL query parameters

---

### Sorting and View Controls

Control bar background Aged Ivory, bottom border Light Warm Gray.

**Sort dropdown:** background Deeper Ivory, border Light Warm Gray, text Warm Slate Gray, on focus border Deep Carmine. Options: Recently Added (default), A–Z by Title, Z–A by Title, Oldest First, Newest First, Most Viewed.

**View toggle:** two icon buttons — inactive state icon in Mid Gray on Deeper Ivory background, active state icon in Pure White on Deep Carmine background, border radius 4px.

---

### Artifact Cards — Grid View

Layout: 3 columns desktop, 2 tablet, 1 mobile. Gap between cards 1.5rem.

**Card styling:**
- Background Deeper Ivory `#EDE8DF`
- Border 1px Light Warm Gray `#E2E0DB`
- Border radius 6px
- On hover: border color changes to Deep Carmine `#9B1D20`, subtle shadow in carmine at very low opacity, "View Details →" link appears in Deep Carmine

**Card contents:**
- Artifact thumbnail — 16:9 aspect ratio, object-fit cover, on hover zoom to 105% with overflow hidden on card
- Access badge top-right of image: Public in Muted Sage `#4A7C59` background with white text, Members Only in Warm Amber `#B07D2E` background with white text
- Artifact type pill — Light Warm Gray background, Warm Slate Gray text, below image
- Artifact title — serif font Cormorant Garamond, Deep Charcoal `#1C1C1E`, max 2 lines ellipsis
- Short description — DM Sans, Warm Slate Gray `#4A5568`, max 3 lines ellipsis, font size 0.875rem
- Museum name with building icon — Mid Gray `#718096`, font size 0.8rem
- Historical period with calendar icon — Mid Gray, font size 0.8rem
- Up to 3 tag pills — Light Warm Gray background, Warm Slate Gray text — overflow shows "+N more" in Mid Gray
- Accession number — Mid Gray, font size 0.75rem, card bottom border top in Light Warm Gray

---

### Artifact Cards — List View

Same color rules as grid view applied horizontally. Fixed 140×100px thumbnail left-aligned. "View Details →" button — background Deep Carmine, text Pure White, hover background Dark Carmine `#7A1518`, border radius 4px, right-aligned.

---

### Pagination

Pagination controls centered, background Aged Ivory. Inactive page numbers — text Warm Slate Gray, background transparent, border Light Warm Gray. Active page number — background Deep Carmine, text Pure White. Previous and Next buttons — border Light Warm Gray, text Warm Slate Gray, hover border Deep Carmine, hover text Deep Carmine. Disabled state — text Light Warm Gray.

---

### Empty, Loading, and Error States

**Loading:** skeleton placeholders in Light Warm Gray `#E2E0DB` with animated pulse on Deeper Ivory card backgrounds

**Empty state:** icon in Mid Gray, message text in Warm Slate Gray, "Clear all filters" button in Deep Carmine with Pure White text

**Error state:** icon in Deep Terracotta `#8B3A3A`, message in Warm Slate Gray, "Try Again" button in Deep Carmine

---

## PAGE 2 — COLLECTIONS PAGE REDESIGN

### Purpose

The Collections page displays all curated thematic collections. Each collection is a named, described grouping of related artifacts. This page has three views the user navigates through sequentially.

---

### View 1 — Collections Landing

**URL:** /collections

**Navbar:** same as Catalog — Deep Charcoal background, Collections link active with Deep Carmine underline

**Breadcrumb:** Home > Collections on Aged Ivory background

**Page header:** title "Collections" in serif Deep Charcoal, subtitle in Mid Gray on Aged Ivory background

**Featured Collection Hero:**
- Full-width banner using collection cover image with a Deep Charcoal overlay at 65% opacity
- Collection name in large serif font in Pure White
- Short description in Pure White at 85% opacity
- Artifact count badge — Antique Gold `#C9A84C` background, Deep Charcoal text
- "Explore Collection →" button — Deep Carmine background, Pure White text, hover Dark Carmine

**Collection Cards grid below hero:**
- Card background Deeper Ivory, border Light Warm Gray, border radius 6px
- On hover: border Deep Carmine, subtle shadow
- Collection name in serif Deep Charcoal
- Description in Warm Slate Gray, max 3 lines
- Artifact count badge — Light Warm Gray background, Warm Slate Gray text
- Museum label in Mid Gray
- Historical period label in Mid Gray
- Curator attribution in Mid Gray italic
- "Explore Collection →" link in Deep Carmine on hover

**Search bar on collections landing:** same styling as Catalog search bar — Deeper Ivory background, Light Warm Gray border, Deep Carmine focus border

**Filter chips:** background Light Warm Gray, text Warm Slate Gray, active chip background Deep Carmine, active text Pure White

**Sort dropdown:** same styling as Catalog sort dropdown

---

### View 2 — Collection Detail Page

**URL:** /collections/:collectionId

**Breadcrumb:** Home > Collections > [Collection Name] — all on Aged Ivory background

**Collection Header Hero:**
- Full-width hero banner with cover image and Deep Charcoal overlay at 65% opacity
- Collection name in large serif font in Pure White over the image
- Thematic category badge — Antique Gold background, Deep Charcoal text
- Curator attribution and date in Pure White at 80% opacity
- Museum name in Pure White at 80% opacity

**Collection Information Panel:**
- Background Deeper Ivory `#EDE8DF`
- Border bottom Light Warm Gray
- Section heading "About This Collection" in serif Deep Charcoal
- Full description text in Warm Slate Gray
- Historical context heading in serif Deep Charcoal
- Historical context text in Warm Slate Gray
- Curatorial statement in Warm Slate Gray italic
- Metadata row showing total artifact count, date range, and associated museums — all labels in Mid Gray, values in Warm Slate Gray
- Left border accent on the curatorial statement block in Deep Carmine at 3px width — this is the primary decorative use of carmine in this section

**Artifacts Within This Collection:**
- Section heading "Artifacts in This Collection" in serif Deep Charcoal on Aged Ivory background
- View toggle and sort dropdown using same styling as Catalog
- Search bar within collection using same styling as Catalog
- Artifact cards using identical styling as Catalog cards — same background, border, hover, badge, and typography rules

**"← Back to Collections" button:**
- Text link style — Deep Carmine text, carmine left arrow icon, hover underline — positioned top-left below breadcrumb

---

### View 3 — Artifact Detail Page

**URL:** /artifacts/:artifactId

Existing page — do not rebuild. Ensure routing from both Catalog and Collection Detail navigates here correctly.

**Back button behavior:**
- From Catalog → shows "← Back to Catalog" in Deep Carmine
- From Collection Detail → shows "← Back to [Collection Name]" in Deep Carmine
- Use React Router useLocation state to track origin and restore previous scroll position, filters, and search state

---

### Mock Data Structure

**Artifact records** — minimum 12 items with realistic Philippine museum data:

```javascript
{
  id: "ART-00001",
  title: "",
  type: "",
  category: "",
  historicalPeriod: "",
  dateCreated: "",
  museum: "",
  description: "",
  shortDescription: "",
  materials: "",
  dimensions: "",
  provenance: "",
  acquisitionSource: "",
  accessionNumber: "",
  conditionStatus: "",
  author: "",
  tags: [],
  images: [],
  accessLevel: "public" or "members-only",
  viewCount: 0,
  dateAdded: "",
  relatedIds: []
}
```

**Collection records** — minimum 4 collections:

```javascript
{
  id: "COL-00001",
  name: "",
  shortDescription: "",
  fullDescription: "",
  historicalContext: "",
  curatorialStatement: "",
  coverImage: "",
  thematicCategory: "",
  historicalPeriod: "",
  museum: "",
  curatorName: "",
  datePublished: "",
  artifactIds: [],
  featured: true or false
}
```

Populate all records with realistic Philippine museum artifact and collection data. Include diversity across artifact types, historical periods, museums, and access levels. At least one collection must be marked featured for the hero banner. At least 2 artifacts must be marked members-only to demonstrate access restriction behavior.

---

### Navigation Flow

```
Navbar
  → /catalog — Catalog Overview
      → search / filter / sort → results update in place
      → click artifact card → /artifacts/:id
          → back button "← Back to Catalog" → /catalog with preserved state

  → /collections — Collections Landing
      → search / filter / sort → results update in place
      → click collection card → /collections/:collectionId
          → Collection Detail Page
              → search / sort within collection → results update in place
              → click artifact card → /artifacts/:id
                  → back button "← Back to [Collection Name]" → /collections/:collectionId with preserved state
              → back button "← Back to Collections" → /collections with preserved state
```

---

### Responsive Behavior

| Breakpoint | Catalog | Collections |
|---|---|---|
| Mobile < 640px | 1 column, filters in Deep Carmine drawer | 1 column, simplified hero, stacked info panel |
| Tablet 640–1024px | 2 column, horizontal filter chips | 2 column, compact hero banner |
| Desktop > 1024px | 3 column, full Deeper Ivory sidebar | 3 column, full-width hero banner |

---

### Component Architecture

```
src/
  pages/
    CatalogPage.jsx
    CollectionsLandingPage.jsx
    CollectionDetailPage.jsx
    ArtifactDetailPage.jsx (existing — do not modify)

  components/
    shared/
      Navbar.jsx
      Breadcrumb.jsx
      ArtifactCard.jsx
      AccessBadge.jsx
      TagPill.jsx
      LoadingSkeleton.jsx
      EmptyState.jsx
      ErrorState.jsx
    catalog/
      SearchBar.jsx
      FilterSidebar.jsx
      FilterAccordion.jsx
      SortDropdown.jsx
      ViewToggle.jsx
      ResultCount.jsx
      Pagination.jsx
    collections/
      CollectionCard.jsx
      FeaturedCollectionHero.jsx
      CollectionHeader.jsx
      CollectionInfo.jsx

  data/
    artifacts.js
    collections.js

  hooks/
    useArtifactFilter.js
    useCollectionFilter.js
    usePersistentView.js
```

---

### Filter and Search Logic

All of the following must work correctly and simultaneously on both pages:

- Search filters in real time across all relevant text fields with 300ms debounce
- Multiple selections within the same filter group use OR logic
- Multiple active filter groups use AND logic
- Sorting updates the order of currently filtered results without resetting filters
- View toggle between grid and list preserves current filtered and sorted state
- Clear all filters resets to full unfiltered dataset and clears the search bar
- Result count updates correctly on every state change
- All filter, search, sort, page, and view state reflected in URL query parameters
- Back navigation from Artifact Detail restores exact previous state including scroll position

---

### Final Quality Standards

The output must be a complete, runnable React application. Every feature described must be fully functional. The visual result must consistently use only the specified color system — Deep Carmine, Warm Slate Gray, Aged Ivory, Deeper Ivory, Antique Gold, Light Warm Gray, Mid Gray, Deep Charcoal, and the status colors — applied exactly as specified throughout every component. The result must be indistinguishable from a professionally designed museum digital archive that feels culturally appropriate for a Filipino heritage institution.