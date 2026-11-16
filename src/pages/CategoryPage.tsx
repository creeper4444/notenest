import { useParams } from 'react-router-dom';
import NoteCollection from '../components/NoteCollection';
import { useNotes } from '../context/NotesContext';
import NotFoundPage from './NotFoundPage';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { data } = useNotes();
  if (categoryId === 'uncategorized') {
    return <NoteCollection key="uncategorized" eyebrow="CATEGORY / 分類筆記" title="未分類" subtitle="還沒找到分類的想法，也能在這裡好好保存。" categoryId={null} />;
  }
  const category = data.categories.find((item) => item.id === categoryId);
  if (!category) return <NotFoundPage title="找不到這個分類" />;
  return <NoteCollection key={categoryId} eyebrow="CATEGORY / 分類筆記" title={category.name} subtitle={`所有收在「${category.name}」的筆記都在這裡。`} categoryId={category.id} />;
}
