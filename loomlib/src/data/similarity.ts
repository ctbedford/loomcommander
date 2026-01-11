// Vector similarity utilities

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Find the most similar documents to a target embedding
 */
export function findMostSimilar(
  targetId: string,
  targetEmbedding: number[],
  allEmbeddings: Map<string, number[]>,
  excludeIds: Set<string>,
  limit = 6
): { id: string; score: number }[] {
  const scores: { id: string; score: number }[] = [];

  for (const [docId, embedding] of allEmbeddings) {
    if (docId === targetId || excludeIds.has(docId)) continue;

    const score = cosineSimilarity(targetEmbedding, embedding);
    scores.push({ id: docId, score });
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
