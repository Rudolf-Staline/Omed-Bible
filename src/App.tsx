import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/Layout';
import { ReaderPage } from './features/reader/ReaderPage';
import { PlanDetail } from './features/plans/PlanDetail';
import { useBibleStore } from './store/useBibleStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { syncFileFromDrive, DRIVE_FILES } from './utils/driveSync';

const SearchPage = lazy(() => import('./features/search/SearchPage').then((module) => ({ default: module.SearchPage })));
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage').then((module) => ({ default: module.FavoritesPage })));
const NotesPage = lazy(() => import('./features/notes/NotesPage').then((module) => ({ default: module.NotesPage })));
const PlansPage = lazy(() => import('./features/plans/PlansPage').then((module) => ({ default: module.PlansPage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })));

function RouteFallback() {
  return <div className="p-4 text-sm text-text-muted">Chargement…</div>;
}

function RootRedirect() {
  const { translation, bookId, chapter } = useBibleStore();
  return <Navigate to={`/read/${translation}/${bookId}/${chapter}`} replace />;
}

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const token = useAuthStore((state) => state.token);
  const synced = useSettingsStore((state) => state.synced);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const settings = useSettingsStore((state) => state.settings);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const loadHighlights = useHighlightsStore((state) => state.loadHighlights);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const loadPlans = usePlansStore((state) => state.loadPlans);
  const setPosition = useBibleStore((state) => state.setPosition);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    if (settings.theme === 'Sepia') root.classList.add('theme-sepia');
    else if (settings.theme === 'Dark') root.classList.add('theme-dark');
    else root.classList.add('theme-light');
  }, [settings.theme]);

  useEffect(() => {
    if (token && synced) {
      const syncDown = async () => {
        try {
          const [
            remoteSettings,
            remoteFavorites,
            remoteHighlights,
            remoteNotes,
            remotePlans,
            remotePosition
          ] = await Promise.all([
            syncFileFromDrive(DRIVE_FILES.settings, token),
            syncFileFromDrive(DRIVE_FILES.favorites, token),
            syncFileFromDrive(DRIVE_FILES.highlights, token),
            syncFileFromDrive(DRIVE_FILES.notes, token),
            syncFileFromDrive(DRIVE_FILES.plans, token),
            syncFileFromDrive(DRIVE_FILES.position, token)
          ]);

          if (remoteSettings) loadSettings(remoteSettings);
          if (remoteFavorites) loadFavorites(remoteFavorites);
          if (remoteHighlights) loadHighlights(remoteHighlights);
          if (remoteNotes) loadNotes(remoteNotes);
          if (remotePlans) loadPlans(remotePlans);
          if (remotePosition) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);
        } catch (err) {
          console.error('Erreur de synchronisation automatique en arrière-plan', err);
        }
      };
      syncDown();
    }
  }, [token, synced, loadSettings, loadFavorites, loadHighlights, loadNotes, loadPlans, setPosition]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/read/:translation/:bookId/:chapter" element={<ReaderPage />} />
          <Route path="/search" element={<Suspense fallback={<RouteFallback />}><SearchPage /></Suspense>} />
          <Route path="/favorites" element={<Suspense fallback={<RouteFallback />}><FavoritesPage /></Suspense>} />
          <Route path="/notes" element={<Suspense fallback={<RouteFallback />}><NotesPage /></Suspense>} />
          <Route path="/plans" element={<Suspense fallback={<RouteFallback />}><PlansPage /></Suspense>} />
          <Route path="/plans/:planId" element={<PlanDetail />} />
          <Route path="/settings" element={<Suspense fallback={<RouteFallback />}><SettingsPage /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
