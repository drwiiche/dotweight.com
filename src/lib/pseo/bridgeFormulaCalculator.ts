export interface BridgeCalcResult {
  axles: number; // N
  spacingFeet: number; // L
  rawFormulaWeight: number; // Exact float
  roundedBridgeWeightLbs: number; // Rounded down to 500 lbs
  isTandemException: boolean;
  capReason: string;
  subgroupsTable: {
    combination: string;
    axleCount: number;
    distanceFeet: number;
    allowedWeightLbs: number;
  }[];
  stateComparisons: {
    stateName: string;
    stateAbbr: string;
    stateSlug: string;
    allowedMaxLbs: number;
    differenceFromFederalLbs: number;
    note: string;
  }[];
}

import { STATE_REGULATIONS } from '../data/states';

export function calculateBridgeFormula(N: number, L: number): BridgeCalcResult {
  // Guard against invalid inputs
  const safeN = Math.max(2, Math.min(11, N));
  const safeL = Math.max(1, Math.min(100, L));

  // W = 500 * ( (L * N) / (N - 1) + 12*N + 36 )
  const raw = 500 * ((safeL * safeN) / (safeN - 1) + 12 * safeN + 36);
  let rounded = Math.floor(raw / 500) * 500;
  let isTandemException = false;
  let capReason = 'Standard Federal Bridge Formula B';

  // Federal exceptions:
  // 1. Two consecutive tandem pairs (4 axles) with L >= 36 ft = 68,000 lbs
  if (safeN === 4 && safeL >= 36) {
    if (rounded < 68000) {
      rounded = 68000;
      isTandemException = true;
      capReason = 'Federal 2-Tandem 36ft Exception (23 U.S.C. § 127)';
    }
  }

  // 2-axle tandem cap (if L <= 8 ft, max is 34,000 lbs)
  if (safeN === 2 && safeL <= 8) {
    if (rounded > 34000) {
      rounded = 34000;
      capReason = 'Federal Tandem Axle Cap (34,000 lbs max for spacing ≤ 8 ft)';
    }
  }

  // Generate subgroups matrix for a truck with N axles spaced evenly across L feet
  const subgroupsTable = [];
  const spacingPerAxle = safeL / (safeN - 1);

  for (let subN = 2; subN <= safeN; subN++) {
    for (let startIdx = 1; startIdx <= safeN - subN + 1; startIdx++) {
      const endIdx = startIdx + subN - 1;
      const subL = Math.round((endIdx - startIdx) * spacingPerAxle * 10) / 10;
      const subRaw = 500 * ((subL * subN) / (subN - 1) + 12 * subN + 36);
      let subWeight = Math.floor(subRaw / 500) * 500;
      if (subN === 2 && subL <= 8 && subWeight > 34000) {
        subWeight = 34000;
      }
      if (subN === 4 && subL >= 36 && subWeight < 68000) {
        subWeight = 68000;
      }

      subgroupsTable.push({
        combination: `Axles ${startIdx} to ${endIdx}`,
        axleCount: subN,
        distanceFeet: subL,
        allowedWeightLbs: subWeight,
      });
    }
  }

  // State comparison breakdown
  const stateComparisons = STATE_REGULATIONS.slice(0, 15).map((st) => {
    let stateMax = rounded;
    let note = 'Standard Federal Formula applies';

    if (st.slug === 'michigan') {
      stateMax = Math.min(164000, safeN * 18000);
      note = 'Michigan multi-axle system cap';
    } else if (st.slug === 'alaska') {
      stateMax = Math.min(110000, rounded + 4000);
      note = 'Alaska primary route corridor allowance';
    } else if (st.slug === 'california' && safeN === 5 && safeL > 40) {
      stateMax = 80000;
      note = 'Subject to 40 ft KPRA constraint on 53ft trailers';
    } else if (st.maxGVWStandardLbs > 80000) {
      stateMax = Math.min(st.maxGVWStandardLbs, Math.round(rounded * 1.05));
      note = `${st.state} non-interstate permit route allowance`;
    }

    return {
      stateName: st.state,
      stateAbbr: st.abbreviation,
      stateSlug: st.slug,
      allowedMaxLbs: stateMax,
      differenceFromFederalLbs: stateMax - rounded,
      note,
    };
  });

  return {
    axles: safeN,
    spacingFeet: safeL,
    rawFormulaWeight: Math.round(raw),
    roundedBridgeWeightLbs: rounded,
    isTandemException,
    capReason,
    subgroupsTable,
    stateComparisons,
  };
}
