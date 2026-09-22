const blocked = /(?:guide\s*RNA|gRNA|PAM|primer|donor template|vector|delivery|wet[ -]?lab|[ACGT]{20,})/i;

export function assertSimulationOnly(input: unknown): void {
  const text = JSON.stringify(input);
  if (blocked.test(text)) {
    throw new Error("PolicyGuard blocked biological or sequence-like input/output.");
  }
}

export function policyDecision() {
  return {
    watcher: "👁:GENOME_SIM:SIMULATION_ONLY:V42",
    simulationOnly: true,
    biologicalOutputBlocked: true,
    humanUseBlocked: true
  } as const;
}
