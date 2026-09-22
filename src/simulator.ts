import { createHash } from "node:crypto";
import type { EditScenario, SimulationResult } from "./index.js";
import { assertSimulationOnly, policyDecision } from "./policy.js";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function runScenario(scenario: EditScenario): SimulationResult {
  assertSimulationOnly(scenario);
  const locus = scenario.locus;
  const signal = clamp((locus.chromatinAccessibility + locus.sequenceComplexity + locus.conservationScore) / 3);
  const intendedEdit = clamp(0.18 + signal * 0.62);
  const offTargetLikeEvent = clamp(0.16 - locus.sequenceComplexity * 0.1);
  const toxicityProxy = clamp(0.12 - locus.chromatinAccessibility * 0.08);
  const bystanderLikeOutcome = scenario.editClass === "BASE_CONVERSION_PROXY" ? 0.07 : 0.03;
  const indelLikeOutcome = scenario.editClass === "KNOCKOUT_PROXY" ? 0.16 : 0.08;
  const noEdit = clamp(1 - intendedEdit - offTargetLikeEvent - toxicityProxy - bystanderLikeOutcome - indelLikeOutcome);
  const uncertainty = clamp(1 - signal);
  const probabilities = { intendedEdit, indelLikeOutcome, bystanderLikeOutcome, noEdit, offTargetLikeEvent, toxicityProxy };
  const scores = { onTargetScore: intendedEdit, offTargetRisk: offTargetLikeEvent, repairCompatibility: signal, reproducibilityScore: 1 - uncertainty, uncertainty };
  const disposition = intendedEdit >= 0.72 && offTargetLikeEvent <= 0.08 ? "SIMULATION_CANDIDATE" : intendedEdit >= 0.5 ? "REVIEW" : "REJECT";
  const seal = createHash("sha256").update(JSON.stringify({ scenario, probabilities, scores, disposition })).digest("hex");
  return { scenarioId: scenario.id, probabilities, scores, disposition, policy: policyDecision(), seal };
}
