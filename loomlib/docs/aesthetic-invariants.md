# Loomlib Aesthetic Invariants & Variants

> Design specification for the "planetarium control room" aesthetic.
> Based on research into [glassmorphism affordances](https://www.nngroup.com/articles/glassmorphism/),
> [spatial UI principles](https://www.goldenflitch.com/blog/guidelines-of-spatial-ui-design),
> [dark mode SaaS best practices](https://www.saasframe.io/blog/make-dark-mode-work-for-your-saas),
> and [microinteractions for productivity apps](https://inapp.com/blog/micro-interactions-the-secret-sauce-to-exceptional-user-experiences-in-2025/).

---

## Global Invariants

These never change across any screen or state.

### Color System
| Token | Value | Rationale |
|-------|-------|-----------|
| Canvas | `oklch(8-12%)` | Dark gray, not pure black—reduces eye strain |
| Text primary | `oklch(90%)` | Soft white for comfortable reading |
| Text muted | `oklch(65%)` | Clear hierarchy without harshness |
| Accent | `oklch(65% 0.15 230)` | Steel blue—trustworthy, focused |
| Type colors | 5 distinct OKLCH values | Perceptually uniform, muted pastels |

### Typography
| Element | Spec | Rationale |
|---------|------|-----------|
| Font family | `JetBrains Mono`, fallbacks | Monospace signals precision, developer credibility |
| Line height | 1.6 | Comfortable for long-form reading |
| Ligatures | Enabled | Visual continuity for code-adjacent content |

### Glassmorphism
| Property | Value | Rationale |
|----------|-------|-----------|
| Blur radius | 10px | Higher blur for dark mode (8-12px range) |
| Background | Gradient 6%→2% white | Specular highlight effect |
| Border | 8% white base, 15% highlight | Top-left light source simulation |
| Fallback | 92% opacity solid | Non-backdrop-filter browsers |

### Spatial Depth (3 Layers)
| Layer | Blur | Opacity | Scale | z-index |
|-------|------|---------|-------|---------|
| Focus | 0 | 1.0 | 1.06 | 30 |
| Context | 0.5px | 0.8 | 1.0 | 20 |
| Distant | 1.5px | 0.5 | 0.94 | 10 |

### Timing
| Token | Value | Use |
|-------|-------|-----|
| `--transition-fast` | 120ms ease | Hover states |
| `--transition-normal` | 200ms ease | State changes |
| `--transition-slow` | 300ms ease-out | Layout shifts |
| `--transition-tether` | 280ms ease-out | Tether draw-in |

### The Only Animation
**Incubating pulse** is the only repeating animation in the system. Warm amber (`oklch(72% 0.14 70)`) glow that breathes at 3s intervals. This is the "sign of unfinished work"—the only warmth in an otherwise cool, precise interface.

---

## Screen: List View

### Purpose
Document library with search—the "filing cabinet" of knowledge.

### Invariants (Never Change)
- Single-column vertical list
- Search input always visible at top
- New document button always visible at bottom
- Cards show: icon, title, lineage hint, timestamp
- Keyboard navigation (↑↓ + Enter)

### Variants (Change Based on State)

| State | Visual Treatment |
|-------|------------------|
| Card default | Glass background, subtle border |
| Card hover | Elevated background (`oklch(22%)`), `shadow-sm` |
| Card selected | Accent border, `shadow-focus` |
| Card incubating | Amber pulse animation |
| Search focused | Accent border on input |
| Empty state | Centered muted text, reduced opacity |

### Affordances Present
- **Clickable cards**: Hover elevation signals interactivity
- **Search input**: Standard input affordance (border, placeholder)
- **New button**: Dashed border signals "add" action

### Affordances Missing (Recommendations)

1. **Skeleton loading state**
   - Currently: No loading feedback
   - Add: Shimmer skeleton cards during `refresh()`
   - Rationale: [Skeleton loaders improve perceived performance](https://bricxlabs.com/blogs/micro-interactions-2025-examples)

2. **Empty search feedback**
   - Currently: Static "No documents found" text
   - Add: Subtle fade-in animation, suggestion to create new doc
   - Rationale: Reduces frustration, guides next action

3. **Card reorder animation**
   - Currently: Instant DOM replacement
   - Add: FLIP animation when list order changes
   - Rationale: Maintains spatial memory of document positions

4. **Type color strip**
   - Currently: Icon color only
   - Add: 3px left border in type color on hover
   - Rationale: Reinforces document type at a glance

5. **Scroll position indicator**
   - Currently: None
   - Add: Fade gradient at top/bottom when scrollable
   - Rationale: Signals more content exists

---

## Screen: Constellation View

### Purpose
Spatial knowledge graph—the "planetarium" where documents exist as stars in relation to each other.

### Invariants (Never Change)
- Dark void background with radial gradient
- Focused node always centered
- Parents above, children below (vertical hierarchy)
- Tethers only show for focused node's connections
- Noise texture overlay (2.5% opacity)
- Keyboard navigation (←→↑↓)

### Variants (Change Based on State)

| State | Visual Treatment |
|-------|------------------|
| Node focus | Scale 1.06, accent border, `shadow-focus`, full opacity |
| Node context | Scale 1.0, 80% opacity, 0.5px blur |
| Node distant | Scale 0.94, 50% opacity, 1.5px blur |
| Node incubating | Amber pulse (timing varies by layer) |
| Tether default | Hidden via `stroke-dasharray: 0 9999` |
| Tether focused | Draw-in animation, glow filter |
| View empty | Centered empty state message |

### Affordances Present
- **Depth perception**: Blur/opacity/scale signals hierarchy
- **Clickable nodes**: Hover state, cursor pointer
- **Focus glow**: Clear indication of current selection

### Affordances Missing (Recommendations)

1. **Tether draw-in animation**
   - Currently: CSS transition on `stroke-dasharray`
   - Improve: Set actual path length via JS (`getTotalLength()`)
   - Rationale: More accurate draw effect, smoother animation

2. **Node enter/exit animation**
   - Currently: Instant appear/disappear
   - Add: Fade + scale from 0.8 on enter, reverse on exit
   - Rationale: Maintains spatial continuity during navigation

3. **Tether gradient**
   - Currently: Single color
   - Add: Gradient from source type color to target type color
   - Rationale: Visually encodes relationship directionality

4. **Zoom/pan capability**
   - Currently: Fixed view, no zoom
   - Add: Scroll to zoom, drag to pan (bounded)
   - Rationale: Enables exploration of larger graphs

5. **Minimap**
   - Currently: None
   - Add: Small corner overview showing full graph
   - Rationale: Orientation in large constellations

6. **Hover tooltip**
   - Currently: Title visible on node
   - Add: Expanded tooltip with type, status, tags on hover
   - Rationale: Quick info without changing focus

7. **Connection count badge**
   - Currently: None
   - Add: Small count indicator on distant nodes
   - Rationale: Signals "hub" documents worth exploring

8. **Constellation background particles**
   - Currently: Static noise texture
   - Add: Very subtle drifting particles (1-2 per 10s)
   - Rationale: Ambient life without distraction

---

## Screen: Editor View

### Purpose
Minimalist markdown writing surface—"paper that feels infinite."

### Invariants (Never Change)
- Full-height textarea
- Monospace font with ligatures
- Auto-save with debounce (500ms)
- Header shows derived title
- Back button always accessible
- Tab inserts actual tab character

### Variants (Change Based on State)

| State | Visual Treatment |
|-------|------------------|
| Default | Dark background, soft text |
| Focus mode | Header hidden, centered narrow column |
| Unsaved changes | (Currently no indicator) |
| Empty document | Placeholder text visible |

### Affordances Present
- **Editable textarea**: Standard text input affordance
- **Back button**: Clear navigation escape
- **Triage button**: Access to metadata

### Affordances Missing (Recommendations)

1. **Save indicator**
   - Currently: Silent auto-save
   - Add: Subtle "Saved" toast or status dot in header
   - Rationale: Confidence that work is persisted

2. **Unsaved indicator**
   - Currently: None
   - Add: Small dot next to title when dirty
   - Rationale: [Status indicators improve enterprise UX](https://inapp.com/blog/micro-interactions-the-secret-sauce-to-exceptional-user-experiences-in-2025/)

3. **Word/character count**
   - Currently: None
   - Add: Subtle count in footer or header
   - Rationale: Writing progress awareness

4. **Typewriter scroll**
   - Currently: Standard scroll behavior
   - Add: Keep cursor vertically centered option
   - Rationale: Reduces eye movement during long writing

5. **Line highlight**
   - Currently: None
   - Add: Subtle background on current line
   - Rationale: Reading position awareness

6. **Markdown preview hint**
   - Currently: Raw markdown only
   - Add: Subtle heading size differentiation (h1 slightly larger)
   - Rationale: Visual hierarchy while writing

7. **Exit animation**
   - Currently: Instant view switch
   - Add: Fade/slide transition back to list
   - Rationale: Spatial continuity

8. **Document type indicator**
   - Currently: None visible while editing
   - Add: Type icon/color in header
   - Rationale: Context awareness

---

## Screen: Command Palette

### Purpose
Quick document access—"Spotlight for your knowledge."

### Invariants (Never Change)
- Centered modal with backdrop blur
- Search input auto-focused
- Filter chips for type and status
- Results show icon, title, meta, time
- Keyboard navigation (↑↓ + Enter + Esc)
- "Create new" always available

### Variants (Change Based on State)

| State | Visual Treatment |
|-------|------------------|
| Backdrop | 50% black + 6px blur |
| Modal | Glass background, elevated shadow |
| Filter default | Transparent, muted text |
| Filter active | Accent background, white text |
| Result default | Transparent |
| Result hover/selected | Subtle background, accent outline |
| Empty results | Centered message + new doc option |

### Affordances Present
- **Search input**: Clear text entry affordance
- **Filter chips**: Toggle buttons with active state
- **Result rows**: Hover/select states signal interactivity

### Affordances Missing (Recommendations)

1. **Search highlighting**
   - Currently: Plain text results
   - Add: Highlight matching query substring in results
   - Rationale: Confirms why result matched

2. **Recent documents section**
   - Currently: All docs treated equally
   - Add: "Recent" section above search results
   - Rationale: Quick access to common targets

3. **Keyboard shortcuts in footer**
   - Currently: Text hints
   - Add: Styled `<kbd>` elements
   - Rationale: Clearer affordance for keyboard users

4. **Result preview**
   - Currently: Title + type only
   - Add: First line of content as preview
   - Rationale: Disambiguate similar titles

5. **Loading state**
   - Currently: None visible
   - Add: Subtle spinner in input during search
   - Rationale: Feedback during async operations

6. **Appear animation**
   - Currently: Instant opacity change
   - Add: Slide down + fade in (150ms)
   - Rationale: Less jarring modal appearance

7. **Filter count badges**
   - Currently: None
   - Add: Small count next to each filter showing matches
   - Rationale: Preview filter effect before clicking

---

## Screen: Triage Modal

### Purpose
Document metadata editor—"the classification ritual."

### Invariants (Never Change)
- Centered modal with backdrop blur
- Title input always first
- Type selector as radio group
- Conditional fields based on type
- Status dropdown
- Tags as comma-separated input
- Cancel/Save buttons in footer
- Cmd+Enter to save

### Variants (Change Based on State)

| State | Visual Treatment |
|-------|------------------|
| Radio default | Border, transparent background |
| Radio hover | Subtle background |
| Radio selected | Accent border, accent-tinted background |
| Checkbox selected | Same as radio |
| Input focused | Accent border |
| Framework kind | Shows only when type=framework |
| Perspective field | Shows only when kind=domain |
| Framework picker | Shows only when type=instance |
| Source picker | Shows only when type=note |

### Affordances Present
- **Radio/checkbox groups**: Standard form affordances
- **Input fields**: Border + focus states
- **Save button**: Accent color signals primary action

### Affordances Missing (Recommendations)

1. **Form validation feedback**
   - Currently: Silent save
   - Add: Inline validation (e.g., title required warning)
   - Rationale: Prevent empty/invalid saves

2. **Dirty state indicator**
   - Currently: None
   - Add: Save button becomes more prominent when form is dirty
   - Rationale: Confirms pending changes

3. **Tag autocomplete dropdown**
   - Currently: Datalist (browser-native)
   - Add: Custom dropdown with type-color coding
   - Rationale: Richer tag discovery

4. **Framework color coding**
   - Currently: Icon only
   - Add: Type color border on framework checkboxes
   - Rationale: Visual consistency with constellation

5. **Type icon in radio labels**
   - Currently: Text only
   - Add: Type icon before label
   - Rationale: Faster recognition

6. **Transition between type states**
   - Currently: Instant re-render
   - Add: Smooth height animation when fields appear/disappear
   - Rationale: Less jarring form changes

7. **Success feedback**
   - Currently: Modal just closes
   - Add: Brief "Saved" flash or checkmark before close
   - Rationale: Confirmation of successful action

8. **Keyboard focus ring**
   - Currently: Browser default
   - Add: Custom accent-colored focus ring on all inputs
   - Rationale: Accessibility + brand consistency

---

## Cross-Screen Recommendations

### 1. View Transition Animations
Currently all view switches are instant. Add:
- Fade transition (100ms) between views
- Optional slide direction based on navigation hierarchy
- Rationale: [Spatial continuity improves orientation](https://www.goldenflitch.com/blog/guidelines-of-spatial-ui-design)

### 2. Global Loading State
Add a subtle top progress bar (like YouTube) for:
- Initial data load
- Document save operations
- Search queries
- Rationale: Always-visible async feedback

### 3. Keyboard Shortcut Overlay
Add `Cmd+/` to show keyboard shortcut reference modal:
- All global shortcuts
- Context-specific shortcuts per view
- Rationale: Discoverability for power users

### 4. Sound Design (Optional Variant)
Consider subtle audio feedback for:
- Document save (soft click)
- Incubating pulse (very subtle hum, off by default)
- Navigation (soft whoosh)
- Rationale: Multi-sensory reinforcement

### 5. Reduced Motion Mode
Respect `prefers-reduced-motion`:
- Disable incubating pulse
- Instant transitions instead of animated
- Static tethers instead of draw-in
- Rationale: Accessibility requirement

### 6. Error States
Add consistent error treatment:
- Red-tinted glassmorphism for error modals
- Shake animation for invalid inputs
- Toast notifications for save failures
- Rationale: Clear failure feedback

---

## Implementation Priority

### Phase 1: Microinteractions (High Impact, Low Effort)
1. Save indicator in editor
2. Search highlighting in palette
3. View fade transitions
4. Skeleton loading states

### Phase 2: Spatial Enhancements (Medium Effort)
1. Tether gradient colors
2. Node enter/exit animations
3. Constellation hover tooltips
4. Card reorder animation

### Phase 3: Polish (Higher Effort)
1. Zoom/pan in constellation
2. Minimap
3. Keyboard shortcut overlay
4. Tag autocomplete custom dropdown

### Phase 4: Delight (Optional)
1. Background particles
2. Sound design
3. Custom cursor in constellation
4. Easter eggs

---

## References

- [NN/G: Glassmorphism Best Practices](https://www.nngroup.com/articles/glassmorphism/)
- [Spatial UI Design Guidelines](https://www.goldenflitch.com/blog/guidelines-of-spatial-ui-design)
- [Dark Mode SaaS Best Practices](https://www.saasframe.io/blog/make-dark-mode-work-for-your-saas)
- [Microinteractions in 2025](https://inapp.com/blog/micro-interactions-the-secret-sauce-to-exceptional-user-experiences-in-2025/)
- [Evil Martians: OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [CSS-Tricks: SVG Line Animation](https://css-tricks.com/svg-line-animation-works/)
- [Josh Comeau: Designing Shadows](https://www.joshwcomeau.com/css/designing-shadows/)
