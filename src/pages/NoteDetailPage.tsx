import { useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, Pencil, Star, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotes } from '../context/NotesContext';
import { categoryName, categoryPalette } from '../utils/category';
import { formatDateTime } from '../utils/date';
import NotFoundPage from './NotFoundPage';

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const { data, toggleFavorite, deleteNote } = useNotes();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const note = data.notes.find((item) => item.id === noteId);

  if (!note) return <NotFoundPage title="找不到這篇筆記" />;
  if (editing) return <NoteEditor note={note} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />;
  const colors = categoryPalette(note.categoryId);

  return (
    <div className="page-stack reader-page">
      <div className="reader-topbar"><Link className="back-link" to="/notes"><ArrowLeft size={18} />返回所有筆記</Link>
        <div className="reader-actions"><button type="button" className={`reader-favorite ${note.isFavorite ? 'selected' : ''}`} onClick={() => toggleFavorite(note.id)} aria-pressed={note.isFavorite}><Star size={18} fill={note.isFavorite ? 'currentColor' : 'none'} />{note.isFavorite ? '已收藏' : '收藏'}</button><button type="button" className="button button-secondary" onClick={() => setEditing(true)}><Pencil size={17} />編輯筆記</button><button type="button" className="icon-button delete-note-button" onClick={() => setConfirming(true)} aria-label="刪除筆記" title="刪除筆記"><Trash2 size={18} /></button></div>
      </div>
      <article className="reader-card">
        <div className="reader-category"><span className="category-pill" style={{ backgroundColor: colors.bg, color: colors.fg }}><span className="category-pill-dot" style={{ backgroundColor: colors.accent }} />{categoryName(data.categories, note.categoryId)}</span></div>
        <h1>{note.title}</h1>
        <div className="reader-meta"><span><CalendarDays size={15} />建立於 {formatDateTime(note.createdAt)}</span><span><Clock3 size={15} />最後更新 {formatDateTime(note.updatedAt)}</span></div>
        {note.tags.length > 0 && <div className="reader-tags">{note.tags.map((tag) => <span className="note-tag" key={tag}>#{tag}</span>)}</div>}
        <div className="reader-separator" />
        <div className="reader-content">{note.content || '這篇筆記還沒有內容，點擊「編輯筆記」開始寫作吧。'}</div>
      </article>
      <ConfirmDialog open={confirming} title="確定要刪除這篇筆記？" description={`「${note.title}」刪除後將無法復原，建議先匯出資料備份。`} confirmText="刪除筆記" destructive onCancel={() => setConfirming(false)} onConfirm={() => { setConfirming(false); if (deleteNote(note.id)) navigate('/notes', { replace: true }); }} />
    </div>
  );
}
