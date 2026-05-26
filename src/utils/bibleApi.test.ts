import { describe, it, expect, vi, afterEach } from 'vitest';
import { getChapter } from './bibleApi';

describe('bibleApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch from bolls.life for French translations (e.g. lsg)', async () => {
    const mockResponse = [
      { pk: 1, verse: 1, text: 'Au commencement, Dieu créa les cieux et la terre.' }
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as any;

    const verses = await getChapter('lsg', 'genese', 1);

    expect(fetch).toHaveBeenCalledWith('https://bolls.life/get-chapter/FRLSG/1/1/');
    expect(verses).toHaveLength(1);
    expect(verses[0].verse).toBe(1);
    expect(verses[0].text).toBe('Au commencement, Dieu créa les cieux et la terre.');
  });

  it('should fetch from bible-api.com for English translations (e.g. kjv)', async () => {
    const mockResponse = {
      verses: [
        { book_id: 'gen', book_name: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.\n' }
      ]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as any;

    const verses = await getChapter('kjv', 'genese', 1);

    // Should translate "Genèse" to "Genesis" for english API
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/bible-api/Genesis+1?translation=kjv'));
    expect(verses).toHaveLength(1);
    expect(verses[0].verse).toBe(1);
    // bible-api text might be preserved as is, but we trim it in the function if needed or just return what it is.
  });

  it('should handle fetch errors gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    }) as any;

    await expect(getChapter('lsg', 'genese', 1)).rejects.toThrow('Failed to fetch chapter');
  });
});
