#!/usr/bin/env tsx

import { crisprDesignService } from '../src/crispr';
import { WATCHERS, SUMERIAN_DEITIES } from '../src/types';
import { sealService } from '../src/seal';
import { CALEB_BIRTH_SEAL } from '../src/types';

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                      IMMORTAL OS CRISPR DESIGN TOOL                          ║');
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
const command = args[0];

if (command === 'watcher') {
  const watcherId = args[1];
  const gene = args[2];

  if (!watcherId || !gene) {
    console.log('Usage: design-crispr watcher <WATCHER_ID> <GENE>');
    console.log('Available watchers:', WATCHERS.map(w => w.id).join(', '));
    process.exit(1);
  }

  const design = crisprDesignService.designGuideRNA(watcherId, gene);
  if (!design) {
    console.error(`❌ Watcher ${watcherId} not found`);
    process.exit(1);
  }

  console.log(`🧬 CRISPR DESIGN: ${watcherId} → ${gene}`);
  console.log('────────────────────────────────────────');
  console.log(`Guide RNA:        ${design.guideRNA}`);
  console.log(`PAM:              ${design.pam}`);
  console.log(`Off-target Score: ${design.offTargetScore}%`);
  console.log(`Guide Seed:       ${design.guideSeed}`);
  console.log(`PAM Seed:         ${design.pamSeed}`);
  console.log(`Cas Variant:      ${design.casVariant}`);
  console.log(`Delivery Vector:  ${design.deliveryVector}`);
  console.log(`Promoter:         ${design.promoter}`);
  console.log(`Validation:       ${design.validation.join(', ')}`);
  console.log(`Safety Switches:  ${design.safetySwitches.join(', ')}`);
  console.log(`Personalized:     ${design.personalized ? 'YES' : 'NO'}`);
}

else if (command === 'melamu') {
  const deityId = args[1];
  const target = args[2];

  if (!deityId || !target) {
    console.log('Usage: design-crispr melamu <DEITY_ID> <TARGET_GENE>');
    console.log('Available deities:', SUMERIAN_DEITIES.map(d => d.id).join(', '));
    console.log('Melamu targets: MT-CO1, MT-CO2, MT-CO3, CYCS, NRF2, HSP70, SIRT1, ALB');
    process.exit(1);
  }

  const design = crisprDesignService.designMelamuGuide(deityId, target);
  if (!design) {
    console.error(`❌ Deity ${deityId} not found`);
    process.exit(1);
  }

  console.log(`✨ MELAMU CRISPR DESIGN: ${deityId} → ${target}`);
  console.log('────────────────────────────────────────');
  console.log(`Guide RNA:           ${design.guideRNA}`);
  console.log(`PAM:                 ${design.pam}`);
  console.log(`Off-target Score:    ${design.offTargetScore}%`);
  console.log(`Guide Seed:          ${design.guideSeed}`);
  console.log(`PAM Seed:            ${design.pamSeed}`);
  console.log(`Cas Variant:         ${design.casVariant}`);
  console.log(`Delivery Vector:     ${design.deliveryVector}`);
  console.log(`Promoter:            ${design.promoter}`);
  console.log(`Validation:          ${design.validation.join(', ')}`);
  console.log(`Safety Switches:     ${design.safetySwitches.join(', ')}`);
  console.log(`Radiance Profile:`);
  console.log(`  Wavelength:        ${design.radianceProfile.wavelengthNm[0]}-${design.radianceProfile.wavelengthNm[1]} nm`);
  console.log(`  Coherence:         ${design.radianceProfile.coherence}`);
  console.log(`  Info Density:      ${design.radianceProfile.informationDensity}`);
  console.log(`  Modulation:        ${design.radianceProfile.modulation}`);
}

else if (command === 'mighty') {
  const deityId = args[1];
  const target = args[2];

  if (!deityId || !target) {
    console.log('Usage: design-crispr mighty <DEITY_ID> <TARGET_GENE>');
    console.log('Available deities:', SUMERIAN_DEITIES.map(d => d.id).join(', '));
    console.log('Mighty targets: TP53, TERT, FOXO3, BDNF, KLOTHO, WRN, ATM, ATR, SIRT6');
    process.exit(1);
  }

  const design = crisprDesignService.designMightyGuide(deityId, target);
  if (!design) {
    console.error(`❌ Deity ${deityId} not found`);
    process.exit(1);
  }

  console.log(`💪 MIGHTY ONE CRISPR DESIGN: ${deityId} → ${target}`);
  console.log('────────────────────────────────────────');
  console.log(`Guide RNA:              ${design.guideRNA}`);
  console.log(`PAM:                    ${design.pam}`);
  console.log(`Off-target Score:       ${design.offTargetScore}%`);
  console.log(`Guide Seed:             ${design.guideSeed}`);
  console.log(`PAM Seed:               ${design.pamSeed}`);
  console.log(`Cas Variant:            ${design.casVariant}`);
  console.log(`Delivery Vector:        ${design.deliveryVector}`);
  console.log(`Promoter:               ${design.promoter}`);
  console.log(`Validation:             ${design.validation.join(', ')}`);
  console.log(`Safety Switches:        ${design.safetySwitches.join(', ')}`);
  console.log(`Power Profile:`);
  console.log(`  Genome Stability:     ${design.powerProfile.genomeStability}`);
  console.log(`  Longevity Factor:     ${design.powerProfile.longevityFactor}`);
  console.log(`  Regenerative Capacity: ${design.powerProfile.regenerativeCapacity}`);
  console.log(`  Cognitive Dominance:   ${design.powerProfile.cognitiveDominance}`);
}

else if (command === 'list') {
  console.log('📋 WATCHERS (20):');
  for (const w of WATCHERS) {
    console.log(`  ${w.rank.toString().padStart(2)} ${w.id.padEnd(12)} ${w.sigil} ${w.element.padEnd(6)} ${w.crisprTarget}`);
  }
  console.log('');
  console.log('📋 SUMERIAN MIGHTY ONES (7):');
  for (const d of SUMERIAN_DEITIES) {
    console.log(`  ${d.id.padEnd(10)} ${d.cuneiform} ${d.sigil} ${d.element.padEnd(14)} ${d.crisprTargets.join(', ')}`);
  }
}

else {
  console.log('Usage:');
  console.log('  design-crispr watcher <WATCHER_ID> <GENE>');
  console.log('  design-crispr melamu <DEITY_ID> <TARGET_GENE>');
  console.log('  design-crispr mighty <DEITY_ID> <TARGET_GENE>');
  console.log('  design-crispr list');
  console.log('');
  console.log('Examples:');
  console.log('  design-crispr watcher SHEMIHAZAH CYP450_cluster');
  console.log('  design-crispr melamu NINURTA MT-CO1');
  console.log('  design-crispr mighty ENLIL TERT');
}