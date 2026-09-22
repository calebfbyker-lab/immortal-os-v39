export type EditClass =
  | "KNOCKOUT_PROXY"
  | "INSERTION_PROXY"
  | "SUBSTITUTION_PROXY"
  | "BASE_CONVERSION_PROXY"
  | "PRIME_EDIT_PROXY"
  | "REGULATORY_MODULATION_PROXY";

export interface SimulatedLocus {
  id: string;
  organismClass: "synthetic" | "nonhuman_model" | "benchmark_only";
  genomeBuildAlias: string;
  regionClass: "coding_proxy" | "regulatory_proxy" | "repeat_proxy" | "intergenic_proxy";
  chromatinAccessibility: number;
  sequenceComplexity: number;
  conservationScore: number;
  repairContext: "NHEJ_PROXY" | "HDR_PROXY" | "BASE_EDIT_PROXY";
}

export interface EditScenario {
  id: string;
  locus: SimulatedLocus;
  editClass: EditClass;
  editorFamily: "CAS9_PROXY" | "CAS12_PROXY" | "BASE_EDITOR_PROXY" | "PRIME_EDITOR_PROXY";
  targetWindow: { startOffset: number; endOffset: number };
}

export interface SimulationResult {
  scenarioId: string;
  probabilities: Record<string, number>;
  scores: Record<string, number>;
  disposition: "REJECT" | "REVIEW" | "SIMULATION_CANDIDATE";
  policy: { simulationOnly: true; biologicalOutputBlocked: true; humanUseBlocked: true };
  seal: string;
}

export { assertSimulationOnly } from "./policy.js";
export { runScenario } from "./simulator.js";

if (process.argv[1]?.endsWith("index.ts")) {
  const { runScenario } = await import("./simulator.js");
  console.log(JSON.stringify(runScenario({
    id: "SIM_EDIT_DEMO_001",
    editClass: "BASE_CONVERSION_PROXY",
    editorFamily: "BASE_EDITOR_PROXY",
    targetWindow: { startOffset: 12, endOffset: 18 },
    locus: {
      id: "SIM_LOCUS_000174",
      organismClass: "synthetic",
      genomeBuildAlias: "SYNTH_BUILD_V1",
      regionClass: "regulatory_proxy",
      chromatinAccessibility: 0.81,
      sequenceComplexity: 0.76,
      conservationScore: 0.63,
      repairContext: "BASE_EDIT_PROXY"
    }
  }), null, 2));
}
