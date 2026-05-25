import { describe, it, expect, vi } from 'vitest';
import { getChapter, searchVerses } from '../src/utils/bibleApi';
describe('bibleApi', () => { it('map chapter', async () => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{ verse: 1, text: ' test ' }] })); const v = await getChapter('lsg', 'genese', 1); expect(v[0].text).toBe('test'); }); it('search fail', async () => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false })); expect(await searchVerses('lsg', 'q')).toEqual([]); }); });
