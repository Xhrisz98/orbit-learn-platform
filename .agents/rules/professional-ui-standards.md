# Professional UI & Iconography Standards (Strict Rule)

## 1. Zero-Emoji Policy
- **NO emojis are permitted anywhere** in this application (code, UI components, labels, badges, alert dialogs, console messages, comments, or documentation).
- Emojis such as 👨, 👩, ⏳, ✓, ✕, ⚡, 💡, ✅, etc. are strictly prohibited.
- All visual metaphors must use **vector icons** from `lucide-react` (or clean semantic SVGs) or text labels.

## 2. Professional Candidate & Gender Representation
- Candidate cards and profiles must **NEVER use photos/images** or cartoon emojis.
- Represent candidate gender using clean corporate iconography:
  - Vector icon: `<User className="..." />` or styled initials avatar with distinct corporate color themes (e.g. Royal Blue for Male, Indigo/Purple for Female).
  - Explicit professional labels: "Hombre" / "Mujer" (ES) or "Male" / "Female" (EN).
  - Badges must be understated, accessible, and high-contrast.

## 3. Standardized Statuses and Audit Representation
- Status badges (e.g. Approved, Rejected, Stand By, Not Completed) must use:
  - Clean text labels and Lucide icons (e.g. `<CheckCircle2 />`, `<XCircle />`, `<Clock />`).
  - Dropdown options in HTML `<select>` elements must use standard typography without emojis.
