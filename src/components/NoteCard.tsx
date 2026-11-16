import { ArrowUpRight, Clock3, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import type { Note } from '../types/note';
import { relativeDate } from '../utils/date';
import { categoryName, categoryPalette } from '../utils/category';

type Props = { note: Note; position?: number };

export default function NoteCard({ note, position = 0 }: Props) {
  const { data, toggleFavorite } = useNotes();
  const navigate = useNavigate();
  const palette = categoryPalette(note.categoryId);
  const excerpt = note.content.replace(/\s+/g, ' ').trim() || '這篇筆記還沒有內容，點擊開始記錄吧。';
  return (
    <article className="note-card" onClick={(event) => {
      if (event.target instanceof Element && event.target.closest('a, button')) return;
      navigate(`/notes/${note.id}`);
    }} style={{ '--card-accent': palette.accent, '--card-delay': `${Math.min(position, 8) * 45}ms` } as CSSProperties}>
      <div className="note-card-top">
        <span className="category-pill" style={{ backgroundColor: palette.bg, color: palette.fg }}>
          <span className="category-pill-dot" style={{ backgroundColor: palette.accent }} />
          {categoryName(data.categories, note.categoryId)}
        </span>
        <button
          className={`favorite-button ${note.isFavorite ? 'active' : ''}`}
          type="button" aria-label={note.isFavorite ? `取消收藏「${note.title}」` : `收藏「${note.title}」`}
          aria-pressed={note.isFavorite}
          title={note.isFavorite ? '移出我的最愛' : '加入我的最愛'}
          onClick={() => toggleFavorite(note.id)}
        ><Star size={19} fill={note.isFavorite ? 'currentColor' : 'none'} /></button>
      </div>
      <Link to={`/notes/${note.id}`} className="note-card-main">
        <h3>{note.title}</h3>
        <p>{excerpt}</p>
        <span className="sr-only">開啟筆記</span>
      </Link>
      <div className="note-card-bottom">
        <div className="note-tags">
          {note.tags.slice(0, 2).map((tag) => <span className="note-tag" key={tag}>#{tag}</span>)}
          {note.tags.length > 2 && <span className="more-tags">+{note.tags.length - 2}</span>}
        </div>
        <div className="card-footer">
          <span><Clock3 size={13} />{relativeDate(note.updatedAt)}</span>
          <Link to={`/notes/${note.id}`} className="card-open-link" aria-label={`開啟「${note.title}」`}><ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </article>
  );
}
