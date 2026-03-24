import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { useBibleStore } from './store/useBibleStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useFavoritesStore } from './store/useFavoritesStore';
import { useHighlightsStore } from './store/useHighlightsStore';
import { useNotesStore } from './store/useNotesStore';
import { usePlansStore } from './store/usePlansStore';
import { syncFileFromDrive, DRIVE_FILES } from './utils/driveSync';

function RootRedirect() {
  const { translation, bookId, chapter } = useBibleStore();
  return <Navigate to={`/read/${translation}/${bookId}/${chapter}`} replace />;
}

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const token = useAuthStore((state) => state.token);
  const synced = useSettingsStore((state) => state.synced);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const loadHighlights = useHighlightsStore((state) => state.loadHighlights);
  const loadNotes = useNotesStore((state) => state.loadNotes);
  const loadPlans = usePlansStore((state) => state.loadPlans);
  const setPosition = useBibleStore((state) => state.setPosition);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/read/:translation/:bookId/:chapter" element={<ReaderPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
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
