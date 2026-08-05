import { GuideArticle } from '../../types/truck';

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-bridge-formula-math',
    slug: 'federal-bridge-formula-b-math-guide',
    title: 'Understanding Federal Bridge Formula B: Math, Spacing & Subgroups Explained',
    subtitle: 'Learn how DOT officers calculate bridge compliance for every subgroup of axles on your truck.',
    readTime: '6 min read',
    category: 'DOT Mechanics & Math',
    keyTakeaways: [
      'Bridge Formula B protects bridge structures by requiring weight to be spread out over greater distance.',
      'Federal law mandates rounding calculation results DOWN to the nearest 500 lbs increment.',
      'DOT weigh station computers evaluate EVERY consecutive combination of axles (subgroups N=2, 3, 4, 5).',
      'Having a legal Gross Vehicle Weight under 80,000 lbs does NOT guarantee bridge compliance if inner axle spacing is too short.'
    ],
    content: `
### Why Does the Federal Bridge Formula Exist?
Bridges are designed to support weight spread over structural spans. When heavy commercial trucks concentrate thousands of pounds onto short wheelbases, structural beam stress increases exponentially. 

To prevent catastrophic bridge deck fatigue and pavement rutting, Congress enacted the **Federal Bridge Formula B** under the Federal-Aid Highway Act. This mathematical equation determines the maximum legal gross weight allowed on any group of two or more consecutive axles.

---

### The Mathematical Formula
$$W = 500 \\times \\left( \\frac{L \\times N}{N - 1} + 12N + 36 \\right)$$

Where:
- **W** = Maximum allowable weight in pounds carried on two or more consecutive axles.
- **L** = Distance in feet between the outer axles of the group being evaluated (measured center-to-center from Axle 1 to Axle N).
- **N** = Number of axles in the group under evaluation.

---

### Mandatory Statutory Rounding Rule
Federal law explicitly mandates that after performing the Bridge Formula computation, the result MUST be **rounded down to the nearest 500-pound increment**. 

For example, if the formula yields 33,842 lbs, the legal maximum weight allowed is **33,500 lbs**. Weigh station scale systems and DOT enforcement handheld devices automatically apply this downward truncation.

---

### The Subgroup Traversal Rule: Why Single-Group Weighing Fails
The most common misunderstanding among truck drivers is assuming that if the **Steer Axle is 12,000 lbs**, **Drives are 34,000 lbs**, and **Trailers are 34,000 lbs** (Total: 80,000 lbs), the truck is 100% compliant.

**This is a dangerous assumption.**

DOT weigh station enforcement software iterates through **every possible consecutive combination of axles** on the vehicle:
1. **Subgroups of 2 Axles (N=2):** Axles 1-2, 2-3, 3-4, 4-5.
2. **Subgroups of 3 Axles (N=3):** Axles 1-3, 2-4, 3-5.
3. **Subgroups of 4 Axles (N=4):** Axles 1-4, 2-5.
4. **Subgroups of 5 Axles (N=5):** Axles 1-5 (Overall outer bridge).

If **ANY SINGLE SUBGROUP** fails the calculated limit for its spacing ($L$), the entire vehicle receives an **OVERWEIGHT / BRIDGE FORMULA VIOLATION** ticket, even if the total GVW is well below 80,000 lbs!

---

### How Slide Tandems Fix Bridge Formula Violations
When a trailer tandem is slid forward to make turning corners easier, the distance ($L$) between the drive group and trailer group decreases. If slid too far forward, the inner subgroup distance (Axles 2-5 or 2-4) collapses, triggering a Bridge Formula violation. 

By sliding trailer tandems back toward the rear bumper, you increase $L$, raising the allowable bridge formula threshold and distributing the load legally.
    `
  },
  {
    id: 'guide-cat-scale-tickets',
    slug: 'how-to-read-cat-scale-ticket-avoid-fines',
    title: 'How to Read a CAT Scale Ticket & Avoid Weigh Station Fines',
    subtitle: 'Step-by-step breakdown of platform scale tickets, tandem sliding, and axle shift math.',
    readTime: '5 min read',
    category: 'Scale Operations',
    keyTakeaways: [
      'CAT Scale platforms measure Steer, Drive, and Trailer axle weights separately.',
      'Moving trailer tandem pins 1 hole shifts approximately 250 to 400 lbs between Drive and Trailer groups.',
      'Always verify scale ticket weights BEFORE pulling onto interstate scales.',
      'CAT Scale offers a Weigh-My-Truck mobile app that displays live weights on your smartphone.'
    ],
    content: `
### Decoding the CAT Scale Ticket
A standard CAT (Certified Automated Truck) Scale platform consists of three separate platform weigh pads:
1. **Platform 1:** Steer Axle (Front Axle).
2. **Platform 2:** Drive Axle Group (Tandem Drives).
3. **Platform 3:** Trailer Axle Group (Rear Tandem).

When you receive your physical ticket or app notification, you will see three distinct numbers plus a **Gross Weight** total.

---

### Legal Target Weight Breakdown (Standard 53' Semi)
- **Steer Axle Limit:** 12,000 lbs (rated by front tire load limits and steer axle rating).
- **Drive Axles Limit:** 34,000 lbs max.
- **Trailer Axles Limit:** 34,000 lbs max.
- **Max Gross Vehicle Weight:** 80,000 lbs.

---

### The Tandem Pin Shift Math (Rule of Thumb)
If your CAT scale ticket shows **Drive Axles: 35,200 lbs** (Overweight by 1,200 lbs) and **Trailer Axles: 31,000 lbs** (Under weight by 3,000 lbs), you must shift weight from your drives to your trailer tandems.

**How many holes do you slide?**
- On standard 4-inch hole spacing trailer sliders, **each hole shift transfers approximately 250 to 400 lbs** of weight between drive axles and trailer axles.
- **To shift 1,200 lbs off the Drives onto the Trailer:** Slide your trailer tandems **BACK** by 3 to 4 holes (toward the rear bumper). Moving tandems back pulls weight off the tractor drive axles onto the trailer group.

---

### Kingpin-to-Rear-Axle Warning
While sliding trailer tandems back solves Drive axle weight issues, beware of state-specific **KPRA (Kingpin to Rear Axle)** distance rules! In states like California, sliding tandems beyond 40 feet triggers severe non-compliance penalties regardless of axle weight.
    `
  },
  {
    id: 'guide-kpra-laws',
    slug: 'kingpin-to-rear-axle-kpra-rules-guide',
    title: 'Kingpin-to-Rear-Axle (KPRA) Rules: California, Florida & Interstate Standards',
    subtitle: 'Navigating trailer kingpin laws and maximum allowable tandem pin settings state by state.',
    readTime: '7 min read',
    category: 'State Laws & KPRA',
    keyTakeaways: [
      'California strictly enforces a 40-foot KPRA limit from kingpin center to center of rear axle or rear tandem midpoint.',
      'Florida enforces a 41-foot KPRA limit; Illinois enforces 42.5 feet.',
      'Fines for KPRA violations in California can exceed $1,000 at CHP scale houses.',
      'Use AxleGuard state rule database to verify KPRA regulations before entering restricted state routes.'
    ],
    content: `
### What is KPRA (Kingpin to Rear Axle)?
**KPRA** stands for Kingpin-to-Rear-Axle distance. It measures the span between the center of the trailer kingpin (which engages the fifth wheel) and either:
1. The center of the rear axle group (for tandem trailers).
2. The center of the rearmost axle (in specific state definitions like California).

---

### Why States Enforce KPRA Rules
When a 53-foot trailer makes a right-hand turn, the trailer tires track significantly inside the arc of the tractor steer tires (off-tracking). The longer the distance between the kingpin and trailer axles, the wider the off-tracking path. 

To prevent trailer rear-swing from crashing into urban curbs, traffic lights, and neighboring highway lanes, states impose maximum KPRA caps.

---

### Key State KPRA Limits Summary
- **California:** **40 Feet 0 Inches (40.0\')** measured from Kingpin to center of rear axle (or midpoint of tandem group depending on route). *Strictly Enforced by CHP!*
- **Florida:** **41 Feet 0 Inches (41.0\')** measured from Kingpin to center of tandem group.
- **Illinois:** **42 Feet 6 Inches (42.5\')** on Class I & II designated routes.
- **Tennessee & North Carolina:** **41 Feet** on non-interstate state routes.
- **Michigan & Wisconsin:** **40.5 to 41 Feet** depending on trailer length.

---

### The Dilemma: Weight Compliance vs. KPRA Compliance
Truckers often face a catch-22:
- Heavy freight loaded in the front of a 53\' trailer puts the Drive Axles over 34,000 lbs.
- To reduce drive weight, the driver slides trailer tandems back.
- Sliding tandems back increases KPRA distance beyond 40 feet.
- Upon entering California at the I-80 or I-10 weigh station, CHP officers measure KPRA with a tape measure and issue an expensive ticket.

**Solution:** Always insist that shippers load freight evenly along the trailer floor, keeping heavy pallets centered between kingpin and tandem position.
    `
  },
  {
    id: 'guide-pusher-tag-lift-axles',
    slug: 'pusher-tag-lift-axles-bridge-compliance',
    title: 'Pusher & Tag Lift Axles: Bridge Formula Compliance & Axle Spacing Rules',
    subtitle: 'How auxiliary lift axles impact legal weight ratings for dump trucks, mixers, and heavy haulers.',
    readTime: '5 min read',
    category: 'Heavy Haul & Vocational',
    keyTakeaways: [
      'Pusher axles sit in FRONT of the drive tandem; Tag axles sit BEHIND the drive tandem.',
      'Lift axles must feature independent air pressure regulators and steerable capability in many jurisdictions.',
      'Deploying a lift axle increases axle count (N), raising allowable Bridge Formula weight limits.',
      'Some states prohibit deploying lift axles if air pressure controls are accessible from inside the cab while driving.'
    ],
    content: `
### What Are Auxiliary Lift Axles?
Vocational heavy-duty vehicles—such as dump trucks, concrete mixers, refuse haulers, and heavy equipment lowboys—frequently haul dense loads that exceed standard single or tandem axle limits. 

To remain legal without building excessively long truck chassis, fleets install pneumatically or hydraulically lowered **Auxiliary Lift Axles**:
- **Pusher Axles:** Lift axles mounted **ahead** of the primary drive axles.
- **Tag Axles:** Lift axles mounted **behind** the primary drive axles.

---

### How Lift Axles Alter Bridge Formula B Math
Adding a lift axle changes the variables in Federal Bridge Formula B:
1. **Increases Axle Count ($N$):** Moving from $N=3$ (Steer + Drive Tandem) to $N=4$ (Steer + Pusher + Drive Tandem) raises calculated Bridge weight.
2. **Shortens Axle Spacing ($L$):** Adding an inner axle decreases spacing between consecutive pairs, which must be carefully balanced to prevent inner subgroup violations.

---

### Regulatory Pitfalls & Lift Axle Laws
- **Cab-Controlled Pressure Restrictions:** In several states (e.g., Minnesota, Oregon), state law prohibits drivers from adjusting lift axle regulator valves from inside the cab while moving. Controls must be located outside near the axle to prevent drivers from dumping weight right before weigh station scales.
- **Steerable Requirement:** Lift axles that carry over 8,000 lbs are frequently required to be self-steering to prevent pavement scrubbing during tight turns.
    `
  },
  {
    id: 'guide-hotshot-trucking-limits',
    slug: 'hotshot-trucking-axle-limits-cdl-guide',
    title: 'Hotshot Trucking Axle Limits: Dually Pickups, Goosenecks & CDL Weight Rules',
    subtitle: 'Understanding GVWR, GCWR, axle ratings, and bridge math for Class 3-5 hotshot rigs.',
    readTime: '6 min read',
    category: 'Hotshot & Medium Duty',
    keyTakeaways: [
      'Hotshot rigs (Dually + Gooseneck) are subject to DOT weigh stations and Federal Bridge Formula laws.',
      'Gross Combination Weight Rating (GCWR) exceeding 26,000 lbs requires a Class A CDL if trailer GVWR is over 10,000 lbs.',
      'Dually pickup rear axles typically carry a manufacturer GAWR of 9,750 to 12,000 lbs.',
      'Tandem 10,000 lb dual-wheel trailer axles provide 20,000 lbs total trailer axle capacity.'
    ],
    content: `
### Hotshot Trucking Weight Mechanics
Hotshot transportation utilizes Class 3, 4, or 5 pickup trucks (e.g., Ford F-350/F-450, RAM 3500/4500) paired with 40-foot gooseneck flatbed trailers. 

While hotshots look smaller than Class 8 semi-trucks, **they are fully subject to DOT interstate scale inspections and Federal Bridge Formula regulations.**

---

### Key Rating Definitions
1. **GVWR (Gross Vehicle Weight Rating):** The maximum legal operating weight specified by the vehicle manufacturer.
2. **GAWR (Gross Axle Weight Rating):** The individual weight capacity limit for front steer, rear drive dually, or trailer axles.
3. **GCWR (Gross Combination Weight Rating):** Total combined rating of truck and trailer.

---

### Common Hotshot Axle Weight Distribution
- **Front Steer Axle:** ~4,500 to 5,500 lbs (Limited by front GAWR).
- **Rear Dually Drive Axle:** ~8,000 to 10,000 lbs (Limited by dually rear GAWR and tire load index).
- **Trailer Tandem Axles (2x 10k or 2x 12k axles):** ~16,000 to 24,000 lbs.
- **Typical Legal Gross Weight:** 26,000 to 35,000 lbs total.

---

### The 26,000 LB CDL Rule Threshold
If the combined Gross Vehicle Weight Rating (**GCWR**) of the pickup truck and trailer exceeds **26,000 lbs**, AND the trailer's individual GVWR is over **10,000 lbs**, the driver **MUST possess a valid Commercial Driver\'s License (Class A CDL)** and maintain DOT medical certification and logging devices.
    `
  }
];
