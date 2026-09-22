#!/usr/bin/env tsx

import { fractalGenomeService } from '../src/fractal-genome';
import { WATCHERS, SUMERIAN_DEITIES } from '../src/types';
import { sealService } from '../src/seal';
import { CALEB_BIRTH_SEAL } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                     IMMORTAL OS FRACTAL GENOME GENERATOR                     ║');
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
const outputDir = args.includes('--output') ? args[args.indexOf('--output') + 1] : './output/fractal-genomes';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (command === 'watcher') {
  const watcherId = args[1];
  const depth = parseInt(args[2]) || 6;

  if (!watcherId) {
    console.log('Usage: generate-fractal watcher <WATCHER_ID> [DEPTH] [--output <DIR>]');
    console.log('Available watchers:', WATCHERS.map(w => w.id).join(', '));
    process.exit(1);
  }

  const genome = fractalGenomeService.generateWatcherGenome(watcherId, depth);
  if (!genome) {
    console.error(`❌ Watcher ${watcherId} not found`);
    process.exit(1);
  }

  console.log(`🧬 FRACTAL GENOME: ${watcherId} (depth ${depth})`);
  console.log('────────────────────────────────────────');
  console.log(`Length:                    ${genome.metrics.length} bp`);
  console.log(`GC Content:                ${genome.metrics.gcContent.toFixed(2)}%`);
  console.log(`Fractal Dimension:         ${genome.metrics.fractalDimension.toFixed(4)}`);
  console.log(`Compression Ratio:         ${genome.metrics.compressionRatio.toFixed(4)}`);
  console.log(`Self-Similarity Index:     ${genome.metrics.selfSimilarityIndex.toFixed(4)}`);
  console.log(`Caleb Modulation:          ${genome.metrics.calebModulation}`);
  console.log('');

  const fastaFile = path.join(outputDir, `${watcherId}_depth${depth}.fasta`);
  fs.writeFileSync(fastaFile, genome.fasta);
  console.log(`💾 FASTA saved to: ${fastaFile}`);

  const jsonFile = path.join(outputDir, `${watcherId}_depth${depth}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
  console.log(`💾 JSON saved to:  ${jsonFile}`);

  const graphmlFile = path.join(outputDir, `${watcherId}_depth${depth}.graphml`);
  fs.writeFileSync(graphmlFile, fractalGenomeService.exportToGraphML(genome));
  console.log(`💾 GraphML saved to: ${graphmlFile}`);

} else if (command === 'deity') {
  const deityId = args[1];
  const depth = parseInt(args[2]) || 7;

  if (!deityId) {
    console.log('Usage: generate-fractal deity <DEITY_ID> [DEPTH] [--output <DIR>]');
    console.log('Available deities:', SUMERIAN_DEITIES.map(d => d.id).join(', '));
    process.exit(1);
  }

  const genome = fractalGenomeService.generateDeityGenome(deityId, depth);
  if (!genome) {
    console.error(`❌ Deity ${deityId} not found`);
    process.exit(1);
  }

  console.log(`✨ MELAMU FRACTAL GENOME: ${deityId} (depth ${depth})`);
  console.log('────────────────────────────────────────');
  console.log(`Length:                    ${genome.metrics.length} bp`);
  console.log(`GC Content:                ${genome.metrics.gcContent.toFixed(2)}%`);
  console.log(`Fractal Dimension:         ${genome.metrics.fractalDimension.toFixed(4)}`);
  console.log(`Compression Ratio:         ${genome.metrics.compressionRatio.toFixed(4)}`);
  console.log(`Self-Similarity Index:     ${genome.metrics.selfSimilarityIndex.toFixed(4)}`);
  console.log(`Caleb Modulation:          ${genome.metrics.calebModulation}`);
  console.log(`Melamu Radiance Index:     ${genome.metrics.melamuRadianceIndex?.toFixed(4) || 'N/A'}`);
  console.log(`Cuneiform Info Density:    ${genome.metrics.cuneiformInformationDensity?.toFixed(4) || 'N/A'}`);
  console.log('');

  const fastaFile = path.join(outputDir, `${deityId}_melamu_depth${depth}.fasta`);
  fs.writeFileSync(fastaFile, genome.fasta);
  console.log(`💾 FASTA (extended) saved to: ${fastaFile}`);

  const jsonFile = path.join(outputDir, `${deityId}_melamu_depth${depth}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
  console.log(`💾 JSON saved to:  ${jsonFile}`);

  const graphmlFile = path.join(outputDir, `${deityId}_melamu_depth${depth}.graphml`);
  fs.writeFileSync(graphmlFile, fractalGenomeService.exportToGraphML(genome));
  console.log(`💾 GraphML saved to: ${graphmlFile}`);

} else if (command === 'all-watchers') {
  const depth = parseInt(args[1]) || 6;
  console.log(`🔄 Generating fractal genomes for all 20 watchers at depth ${depth}...`);

  for (const watcher of WATCHERS) {
    const genome = fractalGenomeService.generateWatcherGenome(watcher.id, depth);
    if (genome) {
      const fastaFile = path.join(outputDir, `${watcher.id}_depth${depth}.fasta`);
      fs.writeFileSync(fastaFile, genome.fasta);
      const jsonFile = path.join(outputDir, `${watcher.id}_depth${depth}.json`);
      fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
      console.log(`  ✅ ${watcher.id}: ${genome.metrics.length} bp, GC=${genome.metrics.gcContent.toFixed(1)}%, Dim=${genome.metrics.fractalDimension.toFixed(3)}`);
    }
  }
  console.log(`\n💾 All genomes saved to ${outputDir}`);

} else if (command === 'all-deities') {
  const depth = parseInt(args[1]) || 7;
  console.log(`🔄 Generating melamu fractal genomes for all 7 deities at depth ${depth}...`);

  for (const deity of SUMERIAN_DEITIES) {
    const genome = fractalGenomeService.generateDeityGenome(deity.id, depth);
    if (genome) {
      const fastaFile = path.join(outputDir, `${deity.id}_melamu_depth${depth}.fasta`);
      fs.writeFileSync(fastaFile, genome.fasta);
      const jsonFile = path.join(outputDir, `${deity.id}_melamu_depth${depth}.json`);
      fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
      console.log(`  ✅ ${deity.id}: ${genome.metrics.length} bp, GC=${genome.metrics.gcContent.toFixed(1)}%, Dim=${genome.metrics.fractalDimension.toFixed(3)}, Rad=${genome.metrics.melamuRadianceIndex?.toFixed(3) || 'N/A'}`);
    }
  }
  console.log(`\n💾 All melamu genomes saved to ${outputDir}`);

} else if (command === 'all') {
  const watcherDepth = parseInt(args[1]) || 6;
  const deityDepth = parseInt(args[2]) || 7;

  console.log(`🔄 Generating ALL fractal genomes...`);
  console.log(`   Watchers: depth ${watcherDepth}`);
  console.log(`   Deities:  depth ${deityDepth}`);

  for (const watcher of WATCHERS) {
    const genome = fractalGenomeService.generateWatcherGenome(watcher.id, watcherDepth);
    if (genome) {
      const fastaFile = path.join(outputDir, `${watcher.id}_depth${watcherDepth}.fasta`);
      fs.writeFileSync(fastaFile, genome.fasta);
      const jsonFile = path.join(outputDir, `${watcher.id}_depth${watcherDepth}.json`);
      fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
    }
  }

  for (const deity of SUMERIAN_DEITIES) {
    const genome = fractalGenomeService.generateDeityGenome(deity.id, deityDepth);
    if (genome) {
      const fastaFile = path.join(outputDir, `${deity.id}_melamu_depth${deityDepth}.fasta`);
      fs.writeFileSync(fastaFile, genome.fasta);
      const jsonFile = path.join(outputDir, `${deity.id}_melamu_depth${deityDepth}.json`);
      fs.writeFileSync(jsonFile, JSON.stringify(genome, null, 2));
    }
  }

  console.log(`\n💾 All ${WATCHERS.length + SUMERIAN_DEITIES.length} genomes saved to ${outputDir}`);

} else {
  console.log('Usage:');
  console.log('  generate-fractal watcher <WATCHER_ID> [DEPTH] [--output <DIR>]');
  console.log('  generate-fractal deity <DEITY_ID> [DEPTH] [--output <DIR>]');
  console.log('  generate-fractal all-watchers [DEPTH] [--output <DIR>]');
  console.log('  generate-fractal all-deities [DEPTH] [--output <DIR>]');
  console.log('  generate-fractal all [WATCHER_DEPTH] [DEITY_DEPTH] [--output <DIR>]');
  console.log('');
  console.log('Examples:');
  console.log('  generate-fractal watcher SHEMIHAZAH 6');
  console.log('  generate-fractal deity NINURTA 7');
  console.log('  generate-fractal all 6 7 --output ./genomes');
}