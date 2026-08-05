/**
 * Federal Bridge Formula B Calculation Engine
 * Formula: W = 500 * [ (L * N) / (N - 1) + 12N + 36 ]
 * 
 * W = Maximum weight in pounds that can be carried on two or more consecutive axles
 * L = Distance in feet between outer axles of the group
 * N = Number of axles in the group
 * 
 * Rounding Rule: Federal law mandates rounding DOWN to the nearest 500 lbs increment.
 */

export const FEDERAL_LIMITS = {
  SINGLE_AXLE_MAX: 20000,
  TANDEM_AXLE_MAX: 34000,
  INTERSTATE_GVW_MAX: 80000,
  MIN_TANDEM_SPACING_INCHES: 40,
  MAX_TANDEM_SPACING_INCHES: 96,
};

/**
 * Calculates the Federal Bridge Formula max weight for N axles over distance L.
 * Applies statutory 500 lbs rounding down rule.
 */
export function calculateBridgeWeight(L: number, N: number): number {
  if (N < 2) {
    return FEDERAL_LIMITS.SINGLE_AXLE_MAX;
  }

  // Ensure minimum distance is physically reasonable (prevent div by zero or negative)
  const distanceFeet = Math.max(L, 3.33); // 40 inches min

  const rawWeight = 500 * ((distanceFeet * N) / (N - 1) + 12 * N + 36);

  // Federal law mandates rounding down to nearest 500 lbs
  let roundedWeight = Math.floor(rawWeight / 500) * 500;

  // Special statutory exception in Federal Bridge Law:
  // Two consecutive sets of tandem axles (4 axles) may carry 34,000 lbs each (total 68,000 lbs)
  // if the overall distance between the first and last axles of such consecutive sets of tandem axles is 36 feet or more.
  if (N === 4 && distanceFeet >= 36.0 && roundedWeight < 68000) {
    roundedWeight = 68000;
  }

  // Cap at 80,000 lbs federal interstate limit (individual state permits may exceed on state highways)
  return Math.min(roundedWeight, FEDERAL_LIMITS.INTERSTATE_GVW_MAX);
}

/**
 * Evaluates whether a tandem axle group (2 axles spaced between 40" and 96") passes the statutory 34,000 lb limit
 * and the bridge formula.
 */
export function getTandemLimit(spacingFeet: number): number {
  const spacingInches = spacingFeet * 12;
  if (spacingInches < FEDERAL_LIMITS.MIN_TANDEM_SPACING_INCHES) {
    // Spaced under 40 inches: Treated as single axle limit (20,000 lbs total or 10,000 lbs each)
    return FEDERAL_LIMITS.SINGLE_AXLE_MAX;
  }
  
  if (spacingInches <= FEDERAL_LIMITS.MAX_TANDEM_SPACING_INCHES) {
    // Standard tandem spacing (40" to 96"): Statutory maximum 34,000 lbs
    return FEDERAL_LIMITS.TANDEM_AXLE_MAX;
  }

  // Spread tandem / Wide spacing (> 8 ft / 96 inches): Bridge formula or two single axles (20k + 20k = 40k max)
  return calculateBridgeWeight(spacingFeet, 2);
}
