import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FavoritesPage } from '../src/features/favorites/FavoritesPage';
import { useFavoritesStore } from '../src/store/useFavoritesStore';
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));
describe('FavoritesPage', () => { it('empty state', () => { useFavoritesStore.setState({ favorites: [] }); expect(renderToString(<FavoritesPage />)).toContain('Aucun favori'); }); });
