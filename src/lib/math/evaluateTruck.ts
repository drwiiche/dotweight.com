import { Axle, ComplianceResult, SubgroupEvaluation, ComplianceViolation, StateRegulation } from '../../types/truck';
import { calculateBridgeWeight, FEDERAL_LIMITS, getTandemLimit } from './bridgeFormula';

/**
 * Full Compliance Engine
 * Evaluates all consecutive axle subgroups (1-2, 1-3, 2-3, 2-4, 1-5, etc.)
 * checks against Federal Bridge Formula B, statutory single/tandem limits, GVW limits,
 * and state-specific variance flags.
 */
export function evaluateTruckCompliance(
  axles: Axle[],
  customMaxGVW?: number,
  stateReg?: StateRegulation
): ComplianceResult {
  if (!axles || axles.length === 0) {
    return {
      overallStatus: 'COMPLIANT',
      totalGVWLbs: 0,
      maxGVWLbs: customMaxGVW || FEDERAL_LIMITS.INTERSTATE_GVW_MAX,
      isGVWCompliant: true,
      subgroups: [],
      violations: [],
      stateNotes: [],
    };
  }

  // Sort axles by position along the vehicle
  const sortedAxles = [...axles].sort((a, b) => a.positionInFeet - b.positionInFeet);
  const totalAxleCount = sortedAxles.length;

  // Calculate total Gross Vehicle Weight
  const totalGVWLbs = sortedAxles.reduce((sum, ax) => sum + ax.weightLbs, 0);

  const maxGVWLbs = stateReg ? stateReg.maxGVWStandardLbs : (customMaxGVW || FEDERAL_LIMITS.INTERSTATE_GVW_MAX);
  const singleAxleMax = stateReg ? stateReg.singleAxleLimitLbs : FEDERAL_LIMITS.SINGLE_AXLE_MAX;
  const tandemAxleMax = stateReg ? stateReg.tandemAxleLimitLbs : FEDERAL_LIMITS.TANDEM_AXLE_MAX;

  const violations: ComplianceViolation[] = [];
  const stateNotes: string[] = [];

  // 1. Check GVW limit
  const isGVWCompliant = totalGVWLbs <= maxGVWLbs;
  if (!isGVWCompliant) {
    const excess = totalGVWLbs - maxGVWLbs;
    violations.push({
      code: 'GVW_EXCEEDED',
      title: 'Gross Vehicle Weight Exceeded',
      message: `Total vehicle weight (${totalGVWLbs.toLocaleString()} lbs) exceeds max legal limit of ${maxGVWLbs.toLocaleString()} lbs by ${excess.toLocaleString()} lbs.`,
      severity: 'error',
      excessLbs: excess,
    });
  } else if (totalGVWLbs >= maxGVWLbs - 1000) {
    violations.push({
      code: 'NEAR_GVW',
      title: 'Near Maximum Capacity Advisory',
      message: `Total vehicle weight (${totalGVWLbs.toLocaleString()} lbs) is within 1,000 lbs of max limit (${maxGVWLbs.toLocaleString()} lbs).`,
      severity: 'warning',
      excessLbs: 0,
    });
  }

  // 2. Check individual axle single limits
  sortedAxles.forEach((axle, index) => {
    const limit = axle.isSteer && stateReg?.steerAxleLimitLbs ? stateReg.steerAxleLimitLbs : singleAxleMax;
    if (axle.weightLbs > limit) {
      const excess = axle.weightLbs - limit;
      violations.push({
        code: 'SINGLE_AXLE_EXCEEDED',
        title: `Single Axle #${index + 1} (${axle.name}) Overweight`,
        message: `Axle #${index + 1} weight (${axle.weightLbs.toLocaleString()} lbs) exceeds single axle limit of ${limit.toLocaleString()} lbs by ${excess.toLocaleString()} lbs.`,
        severity: 'error',
        axleGroupText: `Axle ${index + 1}`,
        excessLbs: excess,
      });
    }
  });

  // 3. Iterate through all consecutive axle combinations (Subgroups)
  const subgroups: SubgroupEvaluation[] = [];

  for (let i = 0; i < totalAxleCount; i++) {
    for (let j = i + 1; j < totalAxleCount; j++) {
      const subgroupAxles = sortedAxles.slice(i, j + 1);
      const N = subgroupAxles.length;

      const firstAxle = subgroupAxles[0];
      const lastAxle = subgroupAxles[N - 1];
      const L = Math.max(0, lastAxle.positionInFeet - firstAxle.positionInFeet);

      const actualWeightLbs = subgroupAxles.reduce((s, a) => s + a.weightLbs, 0);

      // Determine max allowed weight for this subgroup
      let maxAllowedBridgeLbs = calculateBridgeWeight(L, N);

      // Specific tandem check for N=2
      let reason: string | undefined = undefined;
      if (N === 2) {
        const spacingInches = L * 12;
        if (spacingInches >= FEDERAL_LIMITS.MIN_TANDEM_SPACING_INCHES && spacingInches <= FEDERAL_LIMITS.MAX_TANDEM_SPACING_INCHES) {
          maxAllowedBridgeLbs = Math.min(maxAllowedBridgeLbs, tandemAxleMax);
          reason = `Statutory Tandem Limit (${tandemAxleMax.toLocaleString()} lbs)`;
        } else if (spacingInches < FEDERAL_LIMITS.MIN_TANDEM_SPACING_INCHES) {
          maxAllowedBridgeLbs = singleAxleMax;
          reason = `Close Spacing (<40") Single Axle Limit (${singleAxleMax.toLocaleString()} lbs)`;
        }
      }

      // Check state-specific tridem limit if applicable and N=3
      if (N === 3 && stateReg && stateReg.tridemAxleLimitLbs) {
        maxAllowedBridgeLbs = Math.min(maxAllowedBridgeLbs, stateReg.tridemAxleLimitLbs);
      }

      const isSubgroupCompliant = actualWeightLbs <= maxAllowedBridgeLbs;
      const excessLbs = Math.max(0, actualWeightLbs - maxAllowedBridgeLbs);

      const axleNumbers = [];
      for (let k = i + 1; k <= j + 1; k++) axleNumbers.push(k);
      const axleRangeText = `Axles ${axleNumbers.join('-')}`;

      subgroups.push({
        axleRangeText,
        axleCount: N,
        outerDistanceFeet: Math.round(L * 10) / 10,
        actualWeightLbs,
        maxAllowedBridgeLbs,
        isCompliant: isSubgroupCompliant,
        excessLbs,
        reason,
      });

      if (!isSubgroupCompliant) {
        // Prevent duplicate bridge violation spam by recording severe or primary ones
        const exists = violations.some(
          v => v.code === 'BRIDGE_FORMULA_FAILED' && v.axleGroupText === axleRangeText
        );
        if (!exists) {
          violations.push({
            code: 'BRIDGE_FORMULA_FAILED',
            title: `Bridge Formula Violation (${axleRangeText})`,
            message: `${axleRangeText} total weight of ${actualWeightLbs.toLocaleString()} lbs exceeds Bridge Formula max of ${maxAllowedBridgeLbs.toLocaleString()} lbs over ${L.toFixed(1)} ft by ${excessLbs.toLocaleString()} lbs.`,
            severity: 'error',
            axleGroupText: axleRangeText,
            excessLbs,
          });
        }
      }
    }
  }

  // 4. Check State-Specific Rules (e.g., KPRA Kingpin to rear axle distance)
  if (stateReg) {
    if (stateReg.kpraLimitFeet) {
      // Find kingpin (Axle 1 to last trailer axle spacing or total wheelbase estimate)
      const outerDistance = sortedAxles[totalAxleCount - 1].positionInFeet - sortedAxles[0].positionInFeet;
      if (outerDistance > stateReg.kpraLimitFeet + 12) { // rough KPRA check if total wheelbase exceeds threshold
        stateNotes.push(`Note for ${stateReg.state}: Check Kingpin-to-Rear-Axle (KPRA) spacing! ${stateReg.state} enforces a max ${stateReg.kpraLimitFeet}' KPRA distance.`);
      }
    }

    if (stateReg.tolerancesAndExceptions && stateReg.tolerancesAndExceptions.length > 0) {
      stateReg.tolerancesAndExceptions.forEach(note => stateNotes.push(note));
    }
  }

  // Overall status evaluation
  const hasError = violations.some(v => v.severity === 'error');
  const hasWarning = violations.some(v => v.severity === 'warning' && v.code !== 'NEAR_GVW');

  let overallStatus: 'COMPLIANT' | 'WARNING' | 'OVERWEIGHT' = 'COMPLIANT';
  if (hasError) {
    overallStatus = 'OVERWEIGHT';
  } else if (hasWarning) {
    overallStatus = 'WARNING';
  }

  return {
    overallStatus,
    totalGVWLbs,
    maxGVWLbs,
    isGVWCompliant,
    subgroups,
    violations,
    stateNotes,
  };
}
