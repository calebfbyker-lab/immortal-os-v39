import { createHash } from 'crypto';
import {
  FRACTAL_GENOME_V37,
  MELAMU_FRACTAL_GENOME,
  WATCHERS,
  SUMERIAN_DEITIES,
  CALEB_BIRTH_SEAL,
  sealService
} from './types';

export interface FractalGenomeOutput {
  sequence: string;
  fasta: string;
  metrics: {
    length: number;
    gcContent: number;
    fractalDimension: number;
    compressionRatio: number;
    selfSimilarityIndex: number;
    calebModulation: string;
    melamuRadianceIndex?: number;
    cuneiformInformationDensity?: number;
  };
  metadata: {
    algorithm: string;
    alphabet: string[];
    axiom: string;
    depth: number;
    rules: Record<string, string>;
    watcherId?: string;
    deityId?: string;
    timestamp: number;
    seal: string;
  };
}

export interface LSystemRule {
  predecessor: string;
  successor: string;
  probability: number;
}

export class FractalGenomeService {
  private readonly V37_ALPHABET = ['A', 'C', 'G', 'T'];
  private readonly MELAMU_ALPHABET = ['A', 'C', 'G', 'T', '𒈨', '𒈠', '𒌝'];

  generateWatcherGenome(watcherId: string, depth = 6): FractalGenomeOutput | null {
    const watcher = WATCHERS.find(w => w.id === watcherId);
    if (!watcher) return null;

    if (!sealService.verifyCalebSeal(CALEB_BIRTH_SEAL.date)) {
      throw new Error('Caleb birth seal verification failed');
    }

    const rules = this.deriveRules(`watcher:${watcherId}`, FRACTAL_GENOME_V37.maxDepth);
    const axiom = this.generateAxiom(watcherId);
    const sequence = this.iterateLSystem(axiom, rules, depth);
    const metrics = this.computeMetrics(sequence, FRACTAL_GENOME_V37.metrics);
    const fasta = this.toFASTA(watcherId, sequence);

    return {
      sequence,
      fasta,
      metrics: {
        length: metrics.length,
        gcContent: metrics.gcContent,
        fractalDimension: metrics.fractalDimension,
        compressionRatio: metrics.compressionRatio,
        selfSimilarityIndex: metrics.selfSimilarityIndex,
        calebModulation: watcher.calebModulation
      },
      metadata: {
        algorithm: FRACTAL_GENOME_V37.algorithm,
        alphabet: FRACTAL_GENOME_V37.alphabet,
        axiom,
        depth,
        rules,
        watcherId,
        timestamp: Date.now(),
        seal: watcher.geneticSeal
      }
    };
  }

  generateDeityGenome(deityId: string, depth = 7): FractalGenomeOutput | null {
    const deity = SUMERIAN_DEITIES.find(d => d.id === deityId);
    if (!deity) return null;

    if (!sealService.verifyCalebSeal(CALEB_BIRTH_SEAL.date)) {
      throw new Error('Caleb birth seal verification failed');
    }

    if (!sealService.verifyMelamuSeal('𒈨𒈠𒌝', CALEB_BIRTH_SEAL.birthSeed)) {
      throw new Error('Melamu seal verification failed');
    }

    const rules = this.deriveRules(`deity:${deityId}`, MELAMU_FRACTAL_GENOME.maxDepth);
    const axiom = MELAMU_FRACTAL_GENOME.axiom;
    const sequence = this.iterateLSystem(axiom, rules, depth);
    const metrics = this.computeMetrics(sequence, MELAMU_FRACTAL_GENOME.metrics);
    const fasta = this.toFASTAExtended(deityId, sequence);

    return {
      sequence,
      fasta,
      metrics: {
        length: metrics.length,
        gcContent: metrics.gcContent,
        fractalDimension: metrics.fractalDimension,
        compressionRatio: metrics.compressionRatio,
        selfSimilarityIndex: metrics.selfSimilarityIndex,
        calebModulation: deity.calebModulation,
        melamuRadianceIndex: metrics.melamuRadianceIndex,
        cuneiformInformationDensity: metrics.cuneiformInformationDensity
      },
      metadata: {
        algorithm: MELAMU_FRACTAL_GENOME.algorithm,
        alphabet: MELAMU_FRACTAL_GENOME.alphabet,
        axiom,
        depth,
        rules,
        deityId,
        timestamp: Date.now(),
        seal: deity.geneticSeal
      }
    };
  }

  private deriveRules(source: string, maxDepth: number): Record<string, string> {
    const rules: Record<string, string> = {};
    const numRules = 4 + (maxDepth - 3);

    for (let i = 0; i < numRules; i++) {
      const predecessor = this.V37_ALPHABET[i % this.V37_ALPHABET.length];
      const seed = createHash('sha256')
        .update(`${source}:rule:${i}:${CALEB_BIRTH_SEAL.birthSeed}`)
        .digest('hex');

      let successor = '';
      const alphabet = source.startsWith('deity:') ? this.MELAMU_ALPHABET : this.V37_ALPHABET;
      const length = 3 + (seed[0] % 5);

      for (let j = 0; j < length; j++) {
        const byteIndex = (i * length + j) % seed.length;
        successor += alphabet[seed[byteIndex] % alphabet.length];
      }

      rules[predecessor] = successor;
    }

    return rules;
  }

  private generateAxiom(source: string): string {
    const seed = createHash('sha256')
      .update(`${source}:axiom:${CALEB_BIRTH_SEAL.birthSeed}`)
      .digest('hex');

    let axiom = '';
    for (let i = 0; i < 4; i++) {
      axiom += this.V37_ALPHABET[seed[i] % this.V37_ALPHABET.length];
    }
    return axiom;
  }

  private iterateLSystem(axiom: string, rules: Record<string, string>, depth: number): string {
    let current = axiom;
    for (let i = 0; i < depth; i++) {
      let next = '';
      for (const char of current) {
        next += rules[char] || char;
      }
      current = next;
      if (current.length > 50000) break;
    }
    return current;
  }

  private computeMetrics(sequence: string, metricNames: string[]): Record<string, number> {
    const metrics: Record<string, number> = {};

    if (metricNames.includes('Length')) {
      metrics.length = sequence.length;
    }

    if (metricNames.includes('GC%')) {
      const gcCount = (sequence.match(/[GC]/g) || []).length;
      metrics.gcContent = sequence.length > 0 ? (gcCount / sequence.length) * 100 : 0;
    }

    if (metricNames.includes('Fractal_Dimension')) {
      metrics.fractalDimension = this.computeFractalDimension(sequence);
    }

    if (metricNames.includes('Compression_Ratio')) {
      metrics.compressionRatio = this.computeCompressionRatio(sequence);
    }

    if (metricNames.includes('Self_Similarity_Index')) {
      metrics.selfSimilarityIndex = this.computeSelfSimilarity(sequence);
    }

    if (metricNames.includes('Melamu_Radiance_Index')) {
      metrics.melamuRadianceIndex = this.computeMelamuRadianceIndex(sequence);
    }

    if (metricNames.includes('Cuneiform_Information_Density')) {
      metrics.cuneiformInformationDensity = this.computeCuneiformDensity(sequence);
    }

    return metrics;
  }

  private computeFractalDimension(sequence: string): number {
    const lengths: number[] = [];
    const counts: number[] = [];

    for (let k = 1; k <= Math.min(10, sequence.length / 2); k *= 2) {
      const boxes = new Set<string>();
      for (let i = 0; i <= sequence.length - k; i++) {
        boxes.add(sequence.substring(i, i + k));
      }
      lengths.push(Math.log(k));
      counts.push(Math.log(boxes.size));
    }

    if (lengths.length < 2) return 1.0;

    const n = lengths.length;
    const sumX = lengths.reduce((a, b) => a + b, 0);
    const sumY = counts.reduce((a, b) => a + b, 0);
    const sumXY = lengths.reduce((a, b, i) => a + b * counts[i], 0);
    const sumXX = lengths.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return Math.abs(slope) || 1.0;
  }

  private computeCompressionRatio(sequence: string): number {
    const original = sequence.length;
    const compressed = this.simpleCompress(sequence).length;
    return original / compressed;
  }

  private simpleCompress(data: string): string {
    let result = '';
    let count = 1;
    for (let i = 1; i <= data.length; i++) {
      if (i < data.length && data[i] === data[i - 1]) {
        count++;
      } else {
        result += data[i - 1] + (count > 1 ? count.toString() : '');
        count = 1;
      }
    }
    return result;
  }

  private computeSelfSimilarity(sequence: string): number {
    if (sequence.length < 10) return 0;

    let matches = 0;
    let total = 0;
    const windowSize = Math.min(100, Math.floor(sequence.length / 4));

    for (let i = 0; i <= sequence.length - windowSize; i += windowSize) {
      const window1 = sequence.substring(i, i + windowSize);
      for (let j = i + windowSize; j <= sequence.length - windowSize; j += windowSize) {
        const window2 = sequence.substring(j, j + windowSize);
        const similarity = this.levenshteinSimilarity(window1, window2);
        matches += similarity;
        total++;
      }
    }

    return total > 0 ? matches / total : 0;
  }

  private levenshteinSimilarity(a: string, b: string): number {
    const distance = this.levenshteinDistance(a, b);
    return 1 - distance / Math.max(a.length, b.length);
  }

  private levenshteinDistance(a: string, b: string): number {
    const dp: number[][] = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[0][i] = i;
    for (let j = 0; j <= b.length; j++) dp[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        if (a[i - 1] === b[j - 1]) {
          dp[j][i] = dp[j - 1][i - 1];
        } else {
          dp[j][i] = 1 + Math.min(dp[j - 1][i], dp[j][i - 1], dp[j - 1][i - 1]);
        }
      }
    }
    return dp[b.length][a.length];
  }

  private computeMelamuRadianceIndex(sequence: string): number {
    const cuneiformChars = sequence.match(/[𒈨𒈠𒌝]/g) || [];
    const ratio = cuneiformChars.length / sequence.length;
    return ratio * 100;
  }

  private computeCuneiformDensity(sequence: string): number {
    const cuneiformChars = sequence.match(/[𒈨𒈠𒌝]/g) || [];
    const uniqueCuneiform = new Set(cuneiformChars).size;
    return (uniqueCuneiform / 3) * 100;
  }

  private toFASTA(id: string, sequence: string): string {
    const lines: string[] = [`>${id} | ${CALEB_BIRTH_SEAL.date} | ${new Date().toISOString()}`];
    for (let i = 0; i < sequence.length; i += 80) {
      lines.push(sequence.substring(i, i + 80));
    }
    return lines.join('\n');
  }

  private toFASTAExtended(id: string, sequence: string): string {
    const lines: string[] = [`>${id} | ${CALEB_BIRTH_SEAL.date} | melamu=true | ${new Date().toISOString()}`];
    for (let i = 0; i < sequence.length; i += 80) {
      lines.push(sequence.substring(i, i + 80));
    }
    return lines.join('\n');
  }

  exportToGraphML(output: FractalGenomeOutput): string {
    const nodes = [`<node id="${output.metadata.watcherId || output.metadata.deityId}"/>`];
    const edges: string[] = [];

    return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <graph edgedefault="directed">
    ${nodes.join('\n    ')}
    ${edges.join('\n    ')}
  </graph>
</graphml>`;
  }
}

export const fractalGenomeService = new FractalGenomeService();