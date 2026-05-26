import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { ReaderPage } from './features/reader/ReaderPage';
import { HomePage } from './features/home/HomePage';
import { useBibleStore } from './store/useBibleStore';
import { LoadingState } from './components/LoadingState';

const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SearchPage = lazy(() => import('./features/search/SearchPage').then(m => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const NotesPage = lazy(() => import('./features/notes/NotesPage').then(m => ({ default: m.NotesPage })));
const PlansPage = lazy(() => import('./features/plans/PlansPage').then(m => ({ default: m.PlansPage })));
const PlanDetail = lazy(() => import('./features/plans/PlanDetail').then(m => ({ default: m.PlanDetail })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { syncFileFromDrive, DRIVE_FILES } from './utils/driveSync';

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
          console.error("Erreur de synchronisation automatique en arrière-plan", err);
        }
      };
      syncDown();
    }
  }, [token, synced, loadSettings, loadFavorites, loadHighlights, loadNotes, loadPlans, setPosition]);

  const SuspenseFallback = <LoadingState title="Chargement…" message="Veuillez patienter." compact />;

  return (
    <Router>
      <Suspense fallback={SuspenseFallback}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/read/:translation/:bookId/:chapter" element={<ReaderPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/plans/:planId" element={<PlanDetail />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
