import { HashRouter, Route, Routes } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import FavoritesPage from './pages/FavoritesPage';
import CategoryPage from './pages/CategoryPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NoteEditor from './components/NoteEditor';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <HashRouter>
      <NotesProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/new" element={<NoteEditor />} />
            <Route path="/notes/:noteId" element={<NoteDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/categories/:categoryId" element={<CategoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </NotesProvider>
    </HashRouter>
  );
}
