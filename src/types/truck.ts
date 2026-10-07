export interface Axle {
  id: string;
  name: string; // e.g. "Steer", "Drive 1", "Drive 2", "Pusher 1", "Trailer 1", "Trailer 2"
  groupName: 'steer' | 'drive' | 'pusher' | 'trailer'; // group category
  positionInFeet: number; // distance from front bumper or front-most axle (Axle 1)
  weightLbs: number; // weight on this individual axle or axle group member
  isSteer?: boolean;
  isLiftAxle?: boolean;
}

export interface AxleGroup {
  id: string;
  name: string;
  axleIds: string[];
  axleIndices: number[]; // 1-indexed axle numbers (e.g. [1], [2, 3], [4, 5])
  totalWeight: number; // sum of weights
  spacingFeet: number; // distance from first to last axle in this group
  maxAllowedWeight: number; // bridge formula or statutory limit
  limitType: 'SINGLE' | 'TANDEM' | 'TRIDEM' | 'QUAD' | 'BRIDGE_FORMULA' | 'GVW';
  isCompliant: boolean;
  overWeightLbs: number;
  description: string;
}

export interface SubgroupEvaluation {
  axleRangeText: string; // e.g. "Axles 1 to 3"
  axleCount: number; // N
  outerDistanceFeet: number; // L (rounded to 1 decimal)
  actualWeightLbs: number; // Actual sum of weights
  maxAllowedBridgeLbs: number; // Federal Bridge Formula result rounded down to 500 lbs
  isCompliant: boolean;
  excessLbs: number;
  reason?: string;
}

export interface ComplianceViolation {
  code: 'GVW_EXCEEDED' | 'SINGLE_AXLE_EXCEEDED' | 'TANDEM_AXLE_EXCEEDED' | 'BRIDGE_FORMULA_FAILED' | 'STATE_SPECIFIC_VIOLATION' | 'NEAR_GVW';
  title: string;
  message: string;
  severity: 'error' | 'warning';
  axleGroupText?: string;
  excessLbs: number;
}

export interface ComplianceResult {
  overallStatus: 'COMPLIANT' | 'WARNING' | 'OVERWEIGHT';
  totalGVWLbs: number;
  maxGVWLbs: number;
  isGVWCompliant: boolean;
  subgroups: SubgroupEvaluation[];
  violations: ComplianceViolation[];
  stateNotes: string[];
}

export interface VehiclePreset {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  typicalUse: string;
  axles: Axle[];
  recommendedGVW: number;
  svgType: 'semi_53' | 'dump_3axle' | 'dump_4axle' | 'hotshot' | 'straight_class8' | 'heavy_haul_6axle';
}

export interface StateRegulation {
  state: string;
  slug: string;
  abbreviation: string;
  maxGVWStandardLbs: number;
  singleAxleLimitLbs: number;
  tandemAxleLimitLbs: number;
  tridemAxleLimitLbs: number;
  steerAxleLimitLbs: number;
  bridgeFormulaApplies: boolean;
  kpraLimitFeet?: number; // Kingpin to rear axle distance limit
  specialPermitThresholdLbs: number;
  dotPhone: string;
  permitWebsite: string;
  keyRuleSummary: string;
  tolerancesAndExceptions: string[];
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  content: string;
  keyTakeaways: string[];
}
