# TelemetryOS Developer Feedback

## Instructions

**When to fill this out:**
- **Stage 1 (MVP):** Start this feedback during initial development. Complete sections as you go.
- **Stage 2 (Production):** Finalize all sections when submitting your production version.

**How to use:**
1. Copy this template to `applications/[app-name]/feedback.md`
2. Fill in sections progressively during Stage 1 development
3. Finalize and review all sections before Stage 2 submission
4. Estimated time: 5-10 minutes total

**Privacy:** Your feedback is used internally to improve TelemetryOS. Specific examples may be anonymized and shared with the product team.

---

## Application Overview

**Application Name:** Countdown Timer  
**Developer:** Ikram Bagban  
**Stage 1 Completion:** 2025-12-25  
**Time Spent by end of Stage 1:** 10–12 hours (including development, testing, and QA debugging)    
**Stage 2 Completion:** [YYYY-MM-DD]  
**Time Spent by end of Stage 2:** [hh]  
**Complexity Level:** moderate  

**Brief Description:**
A configurable countdown timer application supporting multiple display styles, timezone-aware target times, customizable labels, and theme/background settings for digital signage.

---

## Overall Ratings

**TelemetryOS Platform** (1 = Poor, 5 = Excellent)
- [ ] 1  [ ] 2  [ ] 3  [x] 4  [ ] 5

**TelemetryOS SDK Build Process** (1 = Poor, 5 = Excellent)
- [ ] 1  [ ] 2  [ ] 3  [x] 4  [ ] 5

---

## Issue Priority

Flag any **blocking issues** that prevented progress or required workarounds:
- [ ] None
- [x] SDK/API issues: Intermittent WebSocket disconnects and store write timeouts in QA
- [ ] Documentation gaps: [describe]
- [ ] Platform limitations: [describe]
- [ ] Hardware/device issues: [describe]
- [ ] Other: [describe]

---

## SDK & API Design

**What worked well?**
- The createUseInstanceStoreState pattern is intuitive and clean.
- The mounting system (render + settings) was easy to structure.

**What didn't work or was frustrating?**
- In QA, store updates didn’t always trigger live update events in the render view.
- WebSocket instability occasionally caused store write timeouts.

**What was missing?**
- Manual dimension/aspect-ratio input for the preview panel.
Dragging works, but manual entry (e.g., 16:9, 4:3, 9:16, or width/height) would allow faster and more precise layout testing.

---

## Documentation

**What was helpful?**
- The quick-start guide and the design guidelines were clear.
- The SDK examples helped with structuring the application.
- Easy to understand documentation. 


**What was missing or unclear?**
- More documentation around store behavior. 

---

## Platform & Hardware

**What platform features enabled your application?**
- The store system for persistence
- Mount points with isolated UI for settings vs render

**What limitations or compatibility issues did you encounter?**
- Full breakdown documented here:
    https://typhoon-healer-931.notion.site/What-limitations-or-compatibility-issues-did-you-encounter-2d30df4e6e1480718c09c2302749eaff?pvs=73

    Summary:  
        - Windows: `tos init` failed to run `npm install` (spawn npm ENOENT).  
        - Windows: tos serve couldn’t detect `Vite` binary despite it existing in `node_modules/.bin`.  
        - Tested on another Windows laptop, same results.
        - Everything worked normally on Ubuntu.

**What features would you add?**
- Manual dimension/aspect-ratio input for the preview panel:   
    Right now the preview can be resized only by dragging the corner. It would be very helpful to also allow manual entry of a width/height or aspect-ratio value (e.g., 16:9, 4:3, 9:16).
    This would let developers quickly test layouts at precise dimensions without relying on drag resizing.

---

## Security & Permissions

**Any issues with the security model or permissions?**
- [x] No issues
- [ ] Yes: [describe challenges with permissions, authentication, or security constraints]

---

## Performance

**Any performance or optimization challenges?**
- [x] No issues
- [ ] Yes: [describe performance bottlenecks or optimization needs]

---

## External Integrations

**Any issues integrating with external services or APIs?**
- [x] Not applicable
- [ ] No issues
- [ ] Yes: [describe integration challenges]

---

## AI Tools & Workflow

**Which AI tools did you use?** (check all that apply)
- [ ] Claude Code
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] ChatGPT / GPT-4
- [x] Other: [Antigravity AI]

**How did AI tools help?**
- [Specific tasks where AI was most valuable, e.g., boilerplate generation, debugging, SDK usage]

**Any prompts or patterns that worked particularly well?**
- Asking AI to follow the PRD and guidelines strictly produced consistent results.

**Estimated time savings from AI assistance:**
- [ ] Minimal (< 10%)
- [ ] Moderate (10-30%)
- [x] Significant (30-50%)
- [ ] Substantial (> 50%)

**Any challenges where AI hindered rather than helped?**
- [x] None
- [ ] Yes: [describe situations where AI suggestions were incorrect or unhelpful]

---

## Top 3 Improvements

What are the top 3 things that would improve TelemetryOS development?

1. Manual preview size/aspect-ratio input
2. More examples for store sync patterns
3. A clearer indication of store connection status (e.g., “connected / syncing / timeout”), helpful during debugging
---

## Additional Comments (Optional):
- The overall development experience was smooth after understanding the SDK flow. QA environment issues slowed things down a bit, but they seem expected since QA is still evolving. The guidelines were too helpful.
---

**Thank you for your feedback!**