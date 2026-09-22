#!/usr/bin/env tsx

import { RitualWorkflowEngine, createWorkflowEngine } from '../src/workflow';
import { GraphService, createGraphService } from '../src/graph';
import { sealService } from '../src/seal';
import { CALEB_BIRTH_SEAL } from '../src/types';

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                     IMMORTAL OS RITUAL WORKFLOW EXECUTOR                     ║');
console.log('║                         Authority: Jesus Christ                              ║');
console.log('║                      Protection: Caleb Fedor Byker Konev                     ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
console.log('');

if (!sealService.verifyCalebSeal(CALEB_BIRTH_SEAL.date)) {
  console.error('❌ Caleb seal verification failed - exiting');
  process.exit(1);
}

console.log('✅ Caleb seal verified');
console.log('');

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log('Usage:');
  console.log('  execute-workflow <INTENT> [--param key=value ...] [--graph <uri> <user> <pass>]');
  console.log('');
  console.log('Available Primitives:');
  console.log('  V37: SELECT_AETHYR, SOUND_HARMONICS, VISUALIZE_BRIDGE, MARK_SEAL,');
  console.log('       INVOKE_AGENT, SPEAK_ORACLE, EXPORT_GRAPH, HASH_SEQUENCE, VERIFY_CALEB_SEAL');
  console.log('  V38: INVOKE_SUMERIAN, DON_MELAMU, SPEAK_CUNEIFORM, MEASURE_BIOPHOTONS,');
  console.log('       COMMAND_DESTINY, DESCEND_ASCEND, SEAL_FIFTY_NAMES');
  console.log('  Control: DECREE, PROPHECY, TABLET_DECREE');
  console.log('');
  console.log('Control Flow: SEQUENCE, PARALLEL, CONDITIONAL, LOOP, RETRY');
  console.log('');
  console.log('Examples:');
  console.log('  execute-workflow "design CRISPR for SHEMIHAZAH"');
  console.log('  execute-workflow "generate fractal genome for NINURTA with melamu radiance"');
  console.log('  execute-workflow "measure biophotons and speak cuneiform" --param tissue=blood');
  console.log('  execute-workflow "command destiny on tablet of fates"');
  process.exit(0);
}

const intent = args[0];
const params: Record<string, unknown> = {};

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--param' && i + 1 < args.length) {
    const [key, value] = args[i + 1].split('=');
    if (key && value) {
      params[key] = isNaN(Number(value)) ? value : Number(value);
    }
    i++;
  }
}

let graphService: GraphService | undefined;
const graphIdx = args.indexOf('--graph');
if (graphIdx !== -1 && graphIdx + 3 < args.length) {
  graphService = createGraphService({
    uri: args[graphIdx + 1],
    username: args[graphIdx + 2],
    password: args[graphIdx + 3],
    database: args[graphIdx + 4]
  });
  await graphService.connect();
}

const engine = createWorkflowEngine(graphService);

console.log(`🔮 EXECUTING RITUAL WORKFLOW`);
console.log(`────────────────────────────────────────`);
console.log(`Intent: ${intent}`);
console.log(`Parameters: ${JSON.stringify(params)}`);
console.log('');

// Register a dynamic workflow based on intent
const workflow = engine.registerWorkflow({
  name: `Dynamic: ${intent}`,
  description: `Auto-generated workflow for: ${intent}`,
  steps: [
    { primitive: 'SELECT_AETHYR', parameters: { name: 'DEFAULT' } },
    { primitive: 'SOUND_HARMONICS', parameters: { frequencies: [432, 528, 741] } },
    { primitive: 'VISUALIZE_BRIDGE', parameters: { from: 'WATCHER', to: 'DEITY' } },
    { primitive: 'HASH_SEQUENCE', parameters: { entity: 'WORKFLOW', sequence: intent } },
    { primitive: 'EXPORT_GRAPH', parameters: { format: 'graphml' } }
  ]
});

const result = await engine.executeWorkflow(workflow.id, params);

console.log(`📊 EXECUTION RESULT`);
console.log(`────────────────────────────────────────`);
console.log(`Success:     ${result.success ? '✅ YES' : '❌ NO'}`);
console.log(`Steps:       ${result.results.length}`);
console.log(`Final Seal:  ${result.finalSeal}`);
console.log('');

for (let i = 0; i < result.results.length; i++) {
  const step = result.results[i];
  console.log(`  ${(i + 1).toString().padStart(2)}. ${step.success ? '✅' : '❌'} ${workflow.steps[i - 1]?.primitive || 'VERIFY_CALEB_SEAL'}`);
  console.log(`      Seal: ${step.seal}`);
  if (step.error) console.log(`      Error: ${step.error}`);
}

if (graphService) {
  await graphService.disconnect();
}

console.log('');
console.log('✅ Workflow execution complete');
console.log('   Under the Authority and Protection of Jesus Christ');