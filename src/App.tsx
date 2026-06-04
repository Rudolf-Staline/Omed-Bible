import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/Layout';
import { ReaderPage } from './features/reader/ReaderPage';
import { SearchPage } from './features/search/SearchPage';
import { FavoritesPage } from './features/favorites/FavoritesPage';
import { NotesPage } from './features/notes/NotesPage';
import { PlansPage } from './features/plans/PlansPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { PlanDetail } from './features/plans/PlanDetail';
import { HomePage } from './features/home/HomePage';
import { CollectionsPage } from './features/collections/CollectionsPage';
import { useBibleStore } from './store/useBibleStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { syncFileFromDrive, DRIVE_FILES } from './utils/driveSync';

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const access = useAuthStore((state) => state.token);
  const synced = useSettingsStore((state) => state.synced);
  const setSyncStatus = useSettingsStore((state) => state.setSyncStatus);
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
    if (access && synced) {
      const syncDown = async () => {
        setSyncStatus({ state: 'syncing', error: null });
        try {
          const [remoteSettings, remoteFavorites, remoteHighlights, remoteNotes, remotePlans, remotePosition] = await Promise.all([
            syncFileFromDrive(DRIVE_FILES.settings, access),
            syncFileFromDrive(DRIVE_FILES.favorites, access),
            syncFileFromDrive(DRIVE_FILES.highlights, access),
            syncFileFromDrive(DRIVE_FILES.notes, access),
            syncFileFromDrive(DRIVE_FILES.plans, access),
            syncFileFromDrive(DRIVE_FILES.position, access)
          ]);

          if (remoteSettings) loadSettings(remoteSettings);
          if (remoteFavorites) loadFavorites(remoteFavorites);
          if (remoteHighlights) loadHighlights(remoteHighlights);
          if (remoteNotes) loadNotes(remoteNotes);
          if (remotePlans) loadPlans(remotePlans);
          if (remotePosition) setPosition(remotePosition.translation, remotePosition.bookId, remotePosition.chapter);
          setSyncStatus({ state: 'synced', error: null, lastSyncedAt: Date.now() });
        } catch (err) {
          console.error('Erreur de synchronisation automatique en arrière-plan', err);
          setSyncStatus({ state: 'error', error: 'Synchronisation automatique interrompue. Les données locales restent disponibles.' });
        }
      };
      syncDown();
    }
  }, [access, synced, loadSettings, loadFavorites, loadHighlights, loadNotes, loadPlans, setPosition, setSyncStatus]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/read/:translation/:bookId/:chapter" element={<ReaderPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/:planId" element={<PlanDetail />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
