# Infrastructure & Math Engine Verification — Double-Loop Design Iteration

## Loop 1: Audit of Potential Edge Cases & Calculation Failures
1. **Floating-Point Precision Vulnerability**: Bridge Formula B calculation `W = 500 * (L*N / (N-1) + 12*N + 36)` can suffer from JavaScript IEEE 754 precision issues (e.g., `51.99999999999` rounding down to `51.5` ft instead of `52` ft or outputting unrounded `34000.000000000007`).
2. **Subgroup Combinatorial Explosion ($N(N-1)/2$)**: For 9–11 heavy-haul axles, there are up to 55 subgroup distance combinations. If any single subgroup exceeds the Federal Bridge B limit or state tandem/tridem cap, the whole vehicle must flag a violation.
3. **CAT Scale Out-of-Bounds Validation**: Entering impossible weights (e.g., negative values, 0 lbs total, or 100,000 lbs steer) must show a clean warning card instead of NaNs or broken UI states.
4. **Admin Security & Passcode Hashing**: Ensuring administrative endpoints and control panels reject brute-force or header manipulation.

---

## Loop 2: Technical Test Architecture & Implementation Plan

### 1. Enhanced Test Suite Engine (`/src/lib/math/bridgeFormula.test.ts` & `/src/lib/tests/infrastructureTestSuite.ts`)
We will expand the automated test suite to run 25+ automated checks spanning:
- **Math Engine Edge Cases**: Fractional rounding, 500-lb Bridge B quantization, 9-axle Michigan heavy-haul permutations.
- **State Overrides**: APU +500 lb allowance verification across states (e.g., Texas, Ohio, California).
- **CAT Scale Validator**: Extreme/Impossible input bounds checking & BBCode output sanitization.
- **Offline & Cache Resilience**: Verification of local storage fallback data structures.
- **Admin Security Gate**: Cryptographic passcode verification and route guard tests.

### 2. Live Interactive Audit Runner UI (`/src/components/views/TestRunnerView.tsx`)
- Display real-time execution status for all 5 test categories.
- Provide a "Run Full Infrastructure Stress Test" button with visual pass/fail metrics, execution time in milliseconds, and detailed logs.
