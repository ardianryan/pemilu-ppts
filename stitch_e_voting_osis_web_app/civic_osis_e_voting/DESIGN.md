---
name: Civic OSIS E-Voting
colors:
  surface: '#ecfeee'
  surface-dim: '#cddfcf'
  surface-bright: '#ecfeee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e6f8e8'
  surface-container: '#e1f2e2'
  surface-container-high: '#dbeddd'
  surface-container-highest: '#d5e7d7'
  on-surface: '#101f15'
  on-surface-variant: '#414941'
  inverse-surface: '#253429'
  inverse-on-surface: '#e4f5e5'
  outline: '#727970'
  outline-variant: '#c1c9be'
  surface-tint: '#3a6843'
  primary: '#204e2b'
  on-primary: '#ffffff'
  primary-container: '#386641'
  on-primary-container: '#afe2b3'
  inverse-primary: '#a0d3a5'
  secondary: '#3d6924'
  on-secondary: '#ffffff'
  secondary-container: '#baee99'
  on-secondary-container: '#416d28'
  tertiary: '#384c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b6500'
  on-tertiary-container: '#bfe36d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcefc0'
  primary-fixed-dim: '#a0d3a5'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#22502d'
  secondary-fixed: '#bdf19c'
  secondary-fixed-dim: '#a2d582'
  on-secondary-fixed: '#082100'
  on-secondary-fixed-variant: '#26500d'
  tertiary-fixed: '#ccf078'
  tertiary-fixed-dim: '#b0d360'
  on-tertiary-fixed: '#151f00'
  on-tertiary-fixed-variant: '#394d00'
  background: '#ecfeee'
  on-background: '#101f15'
  surface-variant: '#d5e7d7'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  ballot-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes an institutional yet approachable digital voting environment tailored for secondary school student council elections (Pemilihan Ketua OSIS / PILKETOS). Balancing civic gravitas with youth accessibility, the visual language avoids both juvenile gamification and sterile bureaucratic coldness.

### Aesthetic Foundation
The aesthetic blends **Modern Institutionalism** with **Soft Organic Warmth**. Architectural precision, generous breathing room, and soft sage geometry produce an environment where students feel agency, privacy, and trust. 

### Core Attributes
- **Civic Trust & Confidentiality:** Clear security signifiers, uncluttered ballots, and definitive validation states instill confidence in the integrity of the ballot.
- **Approachable Formality:** Respects the seriousness of democratic participation while remaining welcoming to first-time teenage voters.
- **Deliberate Restraint:** High legibility, restrained accents, soft borders, and zero aggressive contrast ensure students focus entirely on candidate visions and platforms.

## Colors

The palette draws from botanical sage, muted forest moss, and warm parchment neutrals. This completely replaces harsh bureaucratic blues or artificial neon tones with a calming, trustworthy civic harmony.

### Color Roles
- **Primary (`#386641` - Deep Muted Sage):** Used for official institutional marks, primary call-to-actions, candidate confirmation headers, and active state indicators.
- **Secondary (`#6A994E` - Soft Forest Moss):** Accompanies secondary interactive badges, progress steppers, and subtle graphic accents.
- **Tertiary (`#A7C957` - Pale Mint Leaf):** Utilized for selection fills, verified candidate tags, and subtle pill highlights.
- **Neutral Foreground (`#2B3A2F` - Deep Olive Slate):** Serves as high-contrast body and heading text, providing deep contrast against cream backgrounds without the harshness of pure `#000000`.

### Background & Canvas Tiers
- **Canvas Base (`#F9F9F6`):** Warm milk/cream tinted background that softens eye strain during reading.
- **Surface Level 1 (`#FFFFFF`):** High-priority card containers, candidate ballot cards, modal dialogs.
- **Surface Level 2 (`#F2F4EF`):** Input field fills, inactive tabs, nested platform quotes, and metadata chips.
- **Surface Level 3 (`#E4E8DF`):** Border lines, passive dividers, and disabled interactive targets.

### Status Tiers
- **Success / Validated (`#2D6A4F` / background `#EAF4EE`):** Cast ballot verification, encrypted fingerprint match.
- **Warning / Pending (`#B58428` / background `#FDF7EA`):** Voting window closing soon, review ballot notice.
- **Critical / Danger (`#9E2A2B` / background `#FAECEC`):** Spoiled session, unauthorized voter ID, irreversible action alerts.

## Typography

Typography establishes an authoritative editorial rhythm. **Plus Jakarta Sans** provides open, friendly, and structured headlines, while **Inter** delivers maximum mechanical precision and legibility for manifestos, candidate bios, ballot instructions, and voter verification codes.

### Hierarchy & Usage
- **Candidate Numbers (`ballot-number`):** Specially tracked display numerals for pair/candidate sequencing (`01`, `02`, `03`) to ensure instant visual identification at distance or quick glance.
- **Headlines (`Plus Jakarta Sans`):** Clean, optimistic geometry used for candidate pairing titles, election milestones, and confirmation sheets. Always set with tight tracking (`-0.01em` to `-0.02em`).
- **Body & Manifestos (`Inter`):** Balanced proportional spacing with comfortable line heights (`line-height: 1.6`) to sustain focused reading across candidate missions, visions, and student council charters.
- **Labels & Tags:** Uppercase or title-case, medium-to-bold weights with subtle positive letter spacing (`0.02em` to `0.04em`) to ensure instant legibility across small chips and verification seals.

## Layout & Spacing

The layout is architected around a mobile-first, single-column focal grid engineered to avoid cognitive overload during the voting process. 

### Form Factors & Grids
- **Mobile (`< 640px`):** Single fluid column with `16px` (`1rem`) outer margins. Ballots display sequentially with persistent bottom utility bars containing selection actions.
- **Tablet / Large Mobile (`640px - 1024px`):** Max container width capped at `540px` for ballots to ensure candidate profiles never stretch into illegible wide banners. Section padding scales to `24px` (`1.5rem`).
- **Desktop/Kiosk Display (`> 1024px`):** Centered institutional voting frame bounded to `480px` (single mobile view) or `960px` (dual candidate side-by-side comparison), isolated by subtle sage neutral backdrop borders.

### Rhythmic Rules
- **Component Breathing Room:** Dense metadata inside candidate cards uses `space-sm` (`8px`) to `space-md` (`16px`).
- **Decision Breaks:** Outer vertical spacing between distinct candidate cards or form sections uses `space-lg` (`24px`) to `space-xl` (`32px`) to ensure distinct visual segregation between competing ballot numbers.

## Elevation & Depth

To maintain high trust, this design system rejects heavy, dramatic, or colorful neon drop-shadows. Elevation is achieved through soft, tinted ambient occlusion and crisp 1px structural outlines.

### Elevation Levels
- **Level 0 (Flat Canvas):** `#F9F9F6` base page fill. No shadow, no outline.
- **Level 1 (Card & Ballot Surface):** `#FFFFFF` background with a subtle border (`1px solid #E4E8DF`) and an extra-soft ambient veil: `box-shadow: 0 2px 8px -2px rgba(43, 58, 47, 0.04), 0 1px 3px 0 rgba(43, 58, 47, 0.02)`.
- **Level 2 (Selected Ballot Card / Sticky Navigation):** `box-shadow: 0 8px 24px -6px rgba(56, 102, 65, 0.08), 0 2px 6px -1px rgba(56, 102, 65, 0.04)`, layered with a `1.5px` border in `#386641`.
- **Level 3 (Confirmation Sheets & Modals):** Backdrop overlay tinted with 40% `#2B3A2F` and 4px blur (`backdrop-filter: blur(4px)`). Floating modal surface features `box-shadow: 0 16px 40px -8px rgba(43, 58, 47, 0.12), 0 4px 12px -2px rgba(43, 58, 47, 0.06)`.

## Shapes

The shape profile is defined by **Roundedness Level 2**, delivering approachable, modern visual contours without lapsing into toy-like circles.

### Geometry Architecture
- **Base Components (`8px` / `0.5rem`):** Applied to input fields, candidate portraits, secondary cards, list items, and standard interaction targets.
- **Large Cards & Candidate Tiles (`16px` / `1rem` - `rounded-lg`):** Surrounds candidate ballot profiles, informational accordions, and confirmation dialog boxes.
- **Sheet Containers & Modals (`24px` / `1.5rem` - `rounded-xl`):** Applied to bottom vote-confirmation drawer sheets and kiosk summary frames.
- **Pill Badges & Tabs (`9999px` / Full Rounded):** Reserved exclusively for status indicators (e.g., "Kandidat 01", "Terverifikasi", "NISN Valid"), filter segmented controls, and primary action buttons.

## Components

### 1. Buttons
- **Primary Action ("Pilih / Vote"):** Full-width or inline rounded pill shape. Background `#386641`, text `#FFFFFF`, typography `label-lg`. Micro-elevation on hover; slight scale press down (`transform: scale(0.98)`) on touch.
- **Secondary Action ("Lihat Visi & Misi"):** Rounded pill. Background `#F2F4EF`, border `1px solid #E4E8DF`, text `#2B3A2F`. Hover switches background to `#E4E8DF`.
- **Destructive / Reset ("Batalkan Pilihan"):** Rounded pill. Background `#FAECEC`, border `1px solid #F3C6C6`, text `#9E2A2B`.

### 2. Candidate Ballot Cards
- Multi-tier structured containers with a `16px` border radius and `1px solid #E4E8DF`.
- Top section holds the **Ballot Order Indicator** (e.g., a sage pill containing `01` with `ballot-number` font styling).
- Dual portrait layout displaying Ketua & Wakil Ketua (Chairman & Vice Chairman) framed with an `8px` inner radius and neutral sage hairline border.
- Integrated preview of primary campaign pillars with a tap target to expand the full manifesto.
- **Active Selection State:** Background transitions to `#FFFFFF`, border increases to `2px solid #386641`, and an animated green checkmark seal slides into the top-right corner.

### 3. Verification & Institutional Badges
- Compact pill-shaped chips (`height: 24px`, horizontal padding `10px`).
- Background `#EAF4EE`, text `#2D6A4F`, featuring a subtle lock or seal icon (`12px`). Used to denote official KPU/OSIS validation, voter eligibility verification, and encrypted token status.

### 4. Input Fields (Voter Token & NISN Login)
- Height `48px`, border radius `8px`, background `#FFFFFF`, border `1.5px solid #E4E8DF`.
- Focused state: border transitions to `1.5px solid #386641` with a `3px` soft glow ring (`rgba(56, 102, 65, 0.12)`).
- Input characters are monospaced with wide letter-spacing (`0.15em`) for student identification numbers (NISN) and unique voting security tokens.

### 5. Vote Confirmation Sheet (Drawer Dialog)
- Bottom-anchored sheet featuring an elevated pull indicator.
- Houses a high-contrast candidate summary thumbnail, full name pairing, reminder of ballot finality, and a dual-step confirmation mechanism (slider or deliberate tap-and-hold confirmation) to prevent accidental voting.

### 6. Radio & Selection Toggles
- Custom `24px` circular selector.
- Unselected: `2px solid #C5CCC0` with white fill.
- Selected: `7px solid #386641` with white inner dot, activating with a snappy spring transition.