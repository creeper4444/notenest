import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Check, Hash, Save, Star, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import type { Note, NoteInput } from '../types/note';

type Props = { note?: Note; onCancel?: () => void; onSaved?: () => void };

export default function NoteEditor({ note, onCancel, onSaved }: Props) {
  const { data, createNote, updateNote } = useNotes();
  const navigate = useNavigate();
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [categoryId, setCategoryId] = useState(note?.categoryId ?? '');
  const [tags, setTags] = useState(note?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [favorite, setFavorite] = useState(note?.isFavorite ?? false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(note?.title ?? ''); setContent(note?.content ?? ''); setCategoryId(note?.categoryId ?? '');
    setTags(note?.tags ?? []); setTagInput(''); setFavorite(note?.isFavorite ?? false); setError('');
  }, [note?.id]);

  const parsedTags = (raw: string): string[] => raw.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  function addTags(raw: string) {
    const additions = parsedTags(raw);
    if (additions.length) {
      setTags((current) => [...new Set([...current, ...additions])].slice(0, 20));
    }
    setTagInput('');
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) { setError('請輸入筆記標題後再儲存。'); return; }
    const allTags = [...new Set([...tags, ...parsedTags(tagInput)])].slice(0, 20);
    const input: NoteInput = {
      title: title.trim(), content, categoryId: categoryId || null, tags: allTags, isFavorite: favorite,
    };
    if (note) {
      if (updateNote(note.id, input)) onSaved?.();
    } else {
      const id = createNote(input);
      if (id) navigate(`/notes/${id}`, { replace: true });
    }
  }

  return (
    <div className="page-stack">
      <div className="editor-header">
        {onCancel ? <button type="button" className="back-link" onClick={onCancel}><ArrowLeft size={18} />返回筆記</button> :
          <Link className="back-link" to="/notes"><ArrowLeft size={18} />返回所有筆記</Link>}
        <span className="editor-draft-label"><span className="status-dot" />{note ? '編輯模式' : '新筆記'}</span>
      </div>
      <form className="editor-panel" onSubmit={save} noValidate>
        <div className="editor-topline"><span className="eyebrow">{note ? 'EDIT YOUR NOTE' : 'CAPTURE YOUR THOUGHTS'}</span><button type="button" className={`editor-favorite ${favorite ? 'selected' : ''}`} aria-pressed={favorite} onClick={() => setFavorite((value) => !value)}><Star size={18} fill={favorite ? 'currentColor' : 'none'} />{favorite ? '已加入最愛' : '加入最愛'}</button></div>
        <div className="form-field editor-title-field">
          <label htmlFor="note-title">筆記標題 <span className="required">*</span></label>
          <input id="note-title" className={`editor-title-input ${error ? 'input-invalid' : ''}`} type="text" placeholder="幫這個想法取個名字..." value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} maxLength={120} autoFocus aria-invalid={Boolean(error)} aria-describedby={error ? 'title-error' : undefined} />
          {error && <p id="title-error" className="field-error">{error}</p>}
        </div>
        <div className="editor-metadata">
          <div className="form-field"><label htmlFor="note-category">所屬分類</label>
            <select id="note-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">未分類</option>
              {data.categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div className="form-field tags-field"><label htmlFor="note-tags">筆記標籤</label>
            <div className="tags-input-wrap"><Hash size={16} className="tag-hash" />
              {tags.map((tag) => <span className="tag-chip" key={tag}>{tag}<button type="button" aria-label={`移除標籤 ${tag}`} onClick={() => setTags((current) => current.filter((item) => item !== tag))}><X size={13} /></button></span>)}
              <input id="note-tags" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',' || event.key === '，') { event.preventDefault(); addTags(tagInput); }
              }} onBlur={() => addTags(tagInput)} placeholder={tags.length ? '加入標籤...' : '輸入標籤後按 Enter'} aria-label="新增筆記標籤" />
            </div>
          </div>
        </div>
        <div className="form-field editor-body-field"><label htmlFor="note-content">筆記內容</label>
          <textarea id="note-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder={'寫下你的想法、靈感或待辦事項...\n\n每個好點子，都值得被記錄。'} rows={14} />
        </div>
        <div className="editor-bottom"><p><Check size={15} />資料只會儲存在此瀏覽器，按下儲存後生效。</p>
          <div className="editor-actions">{onCancel && <button type="button" className="button button-secondary" onClick={onCancel}>取消</button>}<button type="submit" className="button button-primary"><Save size={17} />儲存筆記</button></div>
        </div>
      </form>
    </div>
  );
}
