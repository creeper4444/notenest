import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AppData, Note, NoteInput } from '../types/note';
import { createSeedData } from '../data/seedData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createId } from '../utils/id';
import { saveAppData } from '../utils/storage';

type Toast = { id: number; text: string; type: 'success' | 'error' | 'info' };

type NotesContextValue = {
  data: AppData;
  warning: string | null;
  toast: Toast | null;
  dismissToast: () => void;
  notify: (text: string, type?: Toast['type']) => void;
  createNote: (input: NoteInput) => string | null;
  updateNote: (id: string, input: NoteInput) => boolean;
  deleteNote: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  addCategory: (name: string) => boolean;
  renameCategory: (id: string, name: string) => boolean;
  deleteCategory: (id: string) => boolean;
  replaceData: (data: AppData) => boolean;
  resetData: () => boolean;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: PropsWithChildren) {
  const initial = useLocalStorage();
  const [data, setData] = useState<AppData>(initial.data);
  const [warning] = useState(initial.warning);
  const [toast, setToast] = useState<Toast | null>(null);
  const dataRef = useRef(data);

  const notify = useCallback((text: string, type: Toast['type'] = 'success') => {
    setToast({ id: Date.now() + Math.random(), text, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const commit = useCallback((next: AppData, successMessage: string): boolean => {
    try {
      saveAppData(next);
      dataRef.current = next;
      setData(next);
      notify(successMessage);
      return true;
    } catch {
      notify('無法寫入瀏覽器儲存空間，變更尚未儲存。請確認瀏覽器儲存設定或剩餘容量。', 'error');
      return false;
    }
  }, [notify]);

  const createNote = useCallback((input: NoteInput): string | null => {
    const now = new Date().toISOString();
    const note: Note = { ...input, id: createId(), createdAt: now, updatedAt: now };
    const next = { ...dataRef.current, notes: [note, ...dataRef.current.notes] };
    return commit(next, '筆記已建立！') ? note.id : null;
  }, [commit]);

  const updateNote = useCallback((id: string, input: NoteInput): boolean => {
    if (!dataRef.current.notes.some((note) => note.id === id)) return false;
    const next = {
      ...dataRef.current,
      notes: dataRef.current.notes.map((note) =>
        note.id === id ? { ...note, ...input, updatedAt: new Date().toISOString() } : note),
    };
    return commit(next, '筆記已儲存！');
  }, [commit]);

  const deleteNote = useCallback((id: string): boolean => {
    const notes = dataRef.current.notes.filter((note) => note.id !== id);
    if (notes.length === dataRef.current.notes.length) return false;
    return commit({ ...dataRef.current, notes }, '筆記已刪除。');
  }, [commit]);

  const toggleFavorite = useCallback((id: string) => {
    const note = dataRef.current.notes.find((item) => item.id === id);
    if (!note) return;
    const next = {
      ...dataRef.current,
      notes: dataRef.current.notes.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite, updatedAt: new Date().toISOString() } : item),
    };
    commit(next, note.isFavorite ? '已從我的最愛移除。' : '已加入我的最愛！');
  }, [commit]);

  const addCategory = useCallback((rawName: string) => {
    const name = rawName.trim();
    if (!name) { notify('請輸入分類名稱。', 'error'); return false; }
    if (dataRef.current.categories.some((category) => category.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      notify('這個分類名稱已經存在。', 'error'); return false;
    }
    return commit({
      ...dataRef.current,
      categories: [...dataRef.current.categories, { id: createId(), name }],
    }, '分類已新增！');
  }, [commit, notify]);

  const renameCategory = useCallback((id: string, rawName: string) => {
    const name = rawName.trim();
    if (!name) { notify('分類名稱不能是空白。', 'error'); return false; }
    if (!dataRef.current.categories.some((category) => category.id === id)) return false;
    if (dataRef.current.categories.some((category) =>
      category.id !== id && category.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      notify('這個分類名稱已經存在。', 'error'); return false;
    }
    return commit({
      ...dataRef.current,
      categories: dataRef.current.categories.map((category) => category.id === id ? { ...category, name } : category),
    }, '分類名稱已更新！');
  }, [commit, notify]);

  const deleteCategory = useCallback((id: string) => {
    if (!dataRef.current.categories.some((category) => category.id === id)) return false;
    return commit({
      ...dataRef.current,
      categories: dataRef.current.categories.filter((category) => category.id !== id),
      notes: dataRef.current.notes.map((note) =>
        note.categoryId === id ? { ...note, categoryId: null, updatedAt: new Date().toISOString() } : note),
    }, '分類已刪除，原有筆記已移至未分類。');
  }, [commit]);

  const replaceData = useCallback((next: AppData) => commit(next, '資料匯入成功！'), [commit]);
  const resetData = useCallback(() => commit(createSeedData(), '已重設為範例資料。'), [commit]);

  return (
    <NotesContext.Provider value={{
      data, warning, toast, dismissToast, notify, createNote, updateNote, deleteNote,
      toggleFavorite, addCategory, renameCategory, deleteCategory, replaceData, resetData,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes(): NotesContextValue {
  const value = useContext(NotesContext);
  if (!value) throw new Error('useNotes must be used inside NotesProvider');
  return value;
}
