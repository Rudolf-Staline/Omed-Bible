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

function RootRedirect() {
  const { translation, bookId, chapter } = useBibleStore();
  return <Navigate to={`/read/${translation}/${bookId}/${chapter}`} replace />;
}

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

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
