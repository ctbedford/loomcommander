// Voyage AI embeddings integration
const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-3.5-lite'; // Fast, cheap, 1024-dim default

interface VoyageResponse {
  data: { embedding: number[] }[];
  usage: { total_tokens: number };
}

/**
 * Get API key from env var or localStorage
 */
export function getApiKey(): string | null {
  // Check env var first (set via .env file with VITE_VOYAGE_API_KEY)
  const envKey = import.meta.env.VITE_VOYAGE_API_KEY;
  if (envKey) return envKey;

  return localStorage.getItem('loomlib:voyage-api-key');
}

/**
 * Set API key in localStorage
 */
export function setApiKey(key: string): void {
  localStorage.setItem('loomlib:voyage-api-key', key);
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
  return !!getApiKey();
}

/**
 * Get embedding for a single text from Voyage AI
 */
export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  // Skip empty or very short text
  if (!text || text.trim().length < 10) return null;

  try {
    const res = await fetch(VOYAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: [text],
        input_type: 'document',
      }),
    });

    if (!res.ok) {
      console.error('Voyage AI error:', res.status, await res.text());
      return null;
    }

    const data: VoyageResponse = await res.json();
    return data.data[0]?.embedding ?? null;
  } catch (err) {
    console.error('Voyage AI fetch error:', err);
    return null;
  }
}

/**
 * Get embeddings for multiple texts in a single batch
 */
export async function getEmbeddingsBatch(texts: string[]): Promise<(number[] | null)[]> {
  const apiKey = getApiKey();
  if (!apiKey) return texts.map(() => null);

  // Filter valid texts, tracking indices
  const validIndices: number[] = [];
  const validTexts: string[] = [];
  texts.forEach((text, i) => {
    if (text && text.trim().length >= 10) {
      validIndices.push(i);
      validTexts.push(text);
    }
  });

  if (validTexts.length === 0) {
    return texts.map(() => null);
  }

  try {
    const res = await fetch(VOYAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: validTexts,
        input_type: 'document',
      }),
    });

    if (!res.ok) {
      console.error('Voyage AI batch error:', res.status, await res.text());
      return texts.map(() => null);
    }

    const data: VoyageResponse = await res.json();

    // Map results back to original indices
    const results: (number[] | null)[] = texts.map(() => null);
    data.data.forEach((item, i) => {
      const originalIndex = validIndices[i];
      if (originalIndex !== undefined) {
        results[originalIndex] = item.embedding;
      }
    });

    return results;
  } catch (err) {
    console.error('Voyage AI batch fetch error:', err);
    return texts.map(() => null);
  }
}
