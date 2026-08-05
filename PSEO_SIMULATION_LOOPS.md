# Google pSEO Stress-Test Simulation — Double-Loop Design Iteration

## Loop 1: Brutal Honest Assessment of Current pSEO Architecture

### Where We Excel:
1. **Interactive Tool-First Above-the-Fold Viewport**: When a user visits `/trucks/4-axle-dump-truck-pusher/ohio`, they don't get fluff. They get an instant, pre-calculated compliance card displaying max GVW, bridge formula calculations, and exact axle group limits on page load.
2. **Real Statutory Citations**: Pages cite specific state legal codes (e.g. Ohio Revised Code § 5577.04, Texas Transportation Code § 621.101, California Vehicle Code § 35551) rather than generic "check local laws".
3. **Structured JSON-LD Data**: Embedded `@type: "Dataset"` and `@type: "TechArticle"` schema matches page variables dynamically.

### Where We Risk Failing (The "Thin Content" Pitfalls):
1. **Boilerplate Text Clustering**: If state pages share identical introductory text blocks, SpamBrain algorithm flags the pages as Scaled Content Abuse (high boilerplate ratio > 75%).
2. **Contextual Link Mesh Integrity**: Ensuring every truck route page links bidirectionally to its corresponding state legal statutes AND specific bridge table distance configurations.

---

## Loop 2: Solution Architecture for Automated Stress Test Engine

### 1. The Audit Engine (`/src/lib/seo/pseoStressTester.ts`)
We will create a programmatic stress-testing runner that evaluates 4 core metrics for any audited route or batch:
- **Unique Delta Ratio Score**: Measures ratio of dynamic state/truck parameters (statutes, formulas, weight caps, KPRA rules) vs static layout wrapper.
- **Above-The-Fold Utility Score**: Verifies instant answer availability (0 fluff words before compliance verdict card).
- **Schema Dataset Integrity Score**: Verifies matching JSON-LD properties (`variableMeasured`, `description`, `statuteReference`).
- **Crawl Graph Connectivity Score**: Verifies 3+ contextual cross-links (Legal Page ↔ Truck Variant ↔ Bridge Distance Table).

### 2. UI Integration in `/admin/seo-health`
- Live **SpamBrain & Helpful Content System Simulation Panel**.
- Real-time audit triggers across random samples of our 1,050+ generated pSEO matrix routes.
- Brutal "Pass/Fail" verdicts with detailed actionable feedback for every single route audited.
