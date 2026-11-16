import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownWideNarrow, Plus, SearchX } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import type { SortMode } from '../types/note';
import NoteCard from './NoteCard';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  categoryId?: string | null;
  favoritesOnly?: boolean;
};

export default function NoteCollection({ eyebrow, title, subtitle, categoryId, favoritesOnly = false }: Props) {
  const { data } = useNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const [sort, setSort] = useState<SortMode>('updated');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchParams.has('focus')) inputRef.current?.focus();
  }, [searchParams]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return data.notes
      .filter((note) => categoryId === undefined || note.categoryId === categoryId)
      .filter((note) => !favoritesOnly || note.isFavorite)
      .filter((note) => !query || `${note.title} ${note.content} ${note.tags.join(' ')}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title, 'zh-TW');
        return new Date(sort === 'updated' ? b.updatedAt : b.createdAt).getTime() -
          new Date(sort === 'updated' ? a.updatedAt : a.createdAt).getTime();
      });
  }, [data.notes, categoryId, favoritesOnly, search, sort]);

  function updateSearch(value: string) {
    const next = new URLSearchParams(searchParams);
    next.delete('focus');
    if (value) next.set('q', value);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  }

  const isEmptyList = data.notes.filter((note) =>
    (categoryId === undefined || note.categoryId === categoryId) && (!favoritesOnly || note.isFavorite)).length === 0;

  return (
    <div className="page-stack">
      <header className="page-heading page-heading-actions">
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}<span className="heading-count">{filtered.length}</span></h1><p className="page-description">{subtitle}</p></div>
        <Link className="button button-primary" to="/notes/new"><Plus size={18} />新增筆記</Link>
      </header>
      <div className="collection-toolbar">
        <SearchBar ref={inputRef} value={search} onChange={updateSearch} />
        <label className="sort-field"><ArrowDownWideNarrow size={18} /><span className="sr-only">排序方式</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
            <option value="updated">最近更新</option><option value="created">建立時間</option><option value="title">筆記標題</option>
          </select>
        </label>
      </div>
      {filtered.length > 0 ? (
        <div className="notes-grid">{filtered.map((note, i) => <NoteCard note={note} position={i} key={note.id} />)}</div>
      ) : isEmptyList ? (
        <EmptyState
          title={favoritesOnly ? '還沒有收藏的筆記' : '這裡還沒有筆記'}
          description={favoritesOnly ? '點擊任意筆記上的星星，就能把它收進我的最愛。' : '新增第一篇筆記，開始蒐集你的想法吧。'}
        />
      ) : (
        <div className="empty-state"><div className="empty-illustration"><SearchX size={30} /></div><h3>找不到符合的筆記</h3>
          <p>試著換個關鍵字，或清除搜尋條件再看看。</p>
          <button type="button" className="button button-secondary" onClick={() => updateSearch('')}>清除搜尋</button>
        </div>
      )}
    </div>
  );
}
