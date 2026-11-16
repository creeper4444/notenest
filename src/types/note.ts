export type Note = {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
};

export type AppData = {
  version: 1;
  notes: Note[];
  categories: Category[];
};

export type NoteInput = Pick<Note, 'title' | 'content' | 'categoryId' | 'tags' | 'isFavorite'>;
export type SortMode = 'updated' | 'created' | 'title';
