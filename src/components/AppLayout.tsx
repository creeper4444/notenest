import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Menu, Plus, Search, X } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast, dismissToast, warning } = useNotes();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3800);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('/notes?focus=1');
      }
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" type="button" aria-label="開啟選單" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
            <div className="topbar-location"><span className="topbar-icon">✦</span> 你的靈感工作台 <span className="topbar-separator">/</span> <span className="topbar-current">NoteNest</span></div>
          </div>
          <div className="topbar-actions">
            <Link to="/notes?focus=1" className="topbar-search" aria-label="搜尋筆記"><Search size={18} /><span>搜尋筆記</span><kbd>⌘ K</kbd></Link>
            <Link className="button button-primary topbar-create" to="/notes/new"><Plus size={17} /> <span>新增筆記</span></Link>
            <span className="topbar-avatar" aria-label="我的空間" role="img">N</span>
          </div>
        </header>
        <main className="main-content" id="main-content">
          {warning && <div className="storage-warning" role="alert"><CircleAlert size={18} />{warning}</div>}
          <Outlet />
          <footer className="site-footer"><span>Made for curious minds ✳</span><span>NoteNest · 用心收藏每個想法</span></footer>
        </main>
      </div>
      {toast && <div className={`toast toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'} key={toast.id}>
        {toast.type === 'error' ? <CircleAlert size={19} /> : <CheckCircle2 size={19} />}
        <span>{toast.text}</span>
        <button type="button" aria-label="關閉通知" onClick={dismissToast}><X size={17} /></button>
      </div>}
    </div>
  );
}
