import { BookOpenText, ChevronRight, Heart, House, NotebookPen, Plus, Search, Settings2, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { categoryPalette } from '../utils/category';

type Props = { open: boolean; close: () => void };

const navItems = [
  { label: '首頁概覽', to: '/', icon: House, end: true },
  { label: '所有筆記', to: '/notes', icon: NotebookPen, end: true },
  { label: '我的最愛', to: '/favorites', icon: Heart, end: true },
];

export default function Sidebar({ open, close }: Props) {
  const { data } = useNotes();
  const countFavorites = data.notes.filter((note) => note.isFavorite).length;

  return (
    <>
      {open && <button type="button" className="mobile-backdrop" aria-label="關閉選單" onClick={close} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="網站導覽">
        <div className="sidebar-brand-row">
          <Link to="/" className="brand" onClick={close} aria-label="NoteNest 回到首頁">
            <span className="brand-mark"><BookOpenText size={22} strokeWidth={2.3} /></span>
            <span className="brand-words"><strong>NoteNest<span className="brand-period">.</span></strong><small>整理每個好點子</small></span>
          </Link>
          <button type="button" className="icon-button sidebar-mobile-close" onClick={close} aria-label="關閉選單"><X size={20} /></button>
        </div>

        <Link className="sidebar-create" to="/notes/new" onClick={close}><Plus size={19} strokeWidth={2.3} />建立新筆記<span>＋</span></Link>

        <div className="sidebar-scroll">
          <div className="sidebar-group">
            <div className="sidebar-group-label">工作空間</div>
            <nav aria-label="主要導覽" className="sidebar-nav">
              {navItems.map(({ label, to, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} strokeWidth={1.95} /><span>{label}</span>
                  {label === '所有筆記' && <span className="nav-count">{data.notes.length}</span>}
                  {label === '我的最愛' && <span className="nav-count">{countFavorites}</span>}
                </NavLink>
              ))}
              <Link to="/notes?focus=1" onClick={close} className="nav-link"><Search size={18} /><span>搜尋筆記</span><span className="keycap">⌘ K</span></Link>
            </nav>
          </div>

          <div className="sidebar-group category-nav-group">
            <div className="sidebar-group-heading"><span className="sidebar-group-label">我的分類</span>
              <Link to="/settings?section=categories" onClick={close} aria-label="管理分類" className="mini-add"><Plus size={17} /></Link>
            </div>
            <nav aria-label="筆記分類" className="sidebar-nav category-nav">
              {data.categories.map((category) => {
                const palette = categoryPalette(category.id);
                const count = data.notes.filter((note) => note.categoryId === category.id).length;
                return <NavLink key={category.id} to={`/categories/${category.id}`} onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="sidebar-category-dot" style={{ backgroundColor: palette.accent }} />
                  <span className="nav-label-truncate">{category.name}</span><span className="nav-count">{count}</span>
                </NavLink>;
              })}
              <NavLink to="/categories/uncategorized" onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="sidebar-category-dot" style={{ backgroundColor: '#cbd5e1' }} />
                <span>未分類</span><span className="nav-count">{data.notes.filter((note) => !note.categoryId).length}</span>
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/settings" onClick={close} className={({ isActive }) => `nav-link settings-link ${isActive ? 'active' : ''}`}>
            <Settings2 size={18} /><span>設定與資料備份</span><ChevronRight size={15} className="settings-chevron" />
          </NavLink>
          <div className="sidebar-tip"><span className="tip-sparkle">✦</span><div><strong>想法，就從這裡開始</strong><p>把每一天的小靈感，收進你的筆記宇宙。</p></div></div>
          <p className="sidebar-local-note">● 資料僅儲存於你的瀏覽器</p>
        </div>
      </aside>
    </>
  );
}
