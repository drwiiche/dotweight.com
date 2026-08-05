import { calculateBridgeWeight, getTandemLimit } from '../lib/math/bridgeFormula';
import { evaluateTruckCompliance } from '../lib/math/evaluateTruck';
import { Axle } from '../types/truck';

/**
 * Mathematical Engine Verification Suite
 */

export function runMathTests() {
  const results: { name: string; passed: boolean; message: string }[] = [];

  // Test 1: 5-Axle 51' Outer Bridge
  const bridge51 = calculateBridgeWeight(51, 5);
  const test1Passed = bridge51 === 80000;
  results.push({
    name: "5-Axle configuration with 51' outer distance allows 80,000 lbs",
    passed: test1Passed,
    message: `Expected 80,000 lbs, got ${bridge51} lbs`,
  });

  // Test 2: Tandem axle spaced at 38" (under 40" min tandem requirement)
  const tandem38Inches = getTandemLimit(38 / 12);
  const test2Passed = tandem38Inches === 20000; // Treated as single axle 20k max
  results.push({
    name: 'Tandem axle spaced at 38" triggers single-axle limit rule (20,000 lbs)',
    passed: test2Passed,
    message: `Expected 20,000 lbs, got ${tandem38Inches} lbs`,
  });

  // Test 3: Short-wheelbase dump truck bridge formula failure
  const dumpTruckAxles: Axle[] = [
    { id: '1', name: 'Steer', groupName: 'steer', positionInFeet: 0, weightLbs: 14000, isSteer: true },
    { id: '2', name: 'Pusher', groupName: 'pusher', positionInFeet: 8.0, weightLbs: 12000, isLiftAxle: true },
    { id: '3', name: 'Drive 1', groupName: 'drive', positionInFeet: 12.0, weightLbs: 17000 },
    { id: '4', name: 'Drive 2', groupName: 'drive', positionInFeet: 16.3, weightLbs: 17000 },
  ]; // Total GVW 60,000 lbs, outer bridge only 16.3 ft
  const dumpEval = evaluateTruckCompliance(dumpTruckAxles, 60000);
  const test3Passed = dumpEval.overallStatus === 'OVERWEIGHT';
  results.push({
    name: 'Short wheelbase dump truck flags bridge formula violation even if GVW is under 80k',
    passed: test3Passed,
    message: `Expected OVERWEIGHT status due to short 16.3 ft bridge, got ${dumpEval.overallStatus}`,
  });

  return results;
}
