import type { AppData, Category, Note } from '../types/note';
import { createSeedData } from '../data/seedData';

export const STORAGE_KEY = 'notenest-data-v1';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidDate = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value));

function isCategory(value: unknown): value is Category {
  return isObject(value) && typeof value.id === 'string' && value.id.trim().length > 0 &&
    typeof value.name === 'string' && value.name.trim().length > 0;
}

function isNote(value: unknown): value is Note {
  return isObject(value) &&
    typeof value.id === 'string' && value.id.trim().length > 0 &&
    typeof value.title === 'string' && value.title.trim().length > 0 &&
    typeof value.content === 'string' &&
    (value.categoryId === null || typeof value.categoryId === 'string') &&
    Array.isArray(value.tags) && value.tags.every((tag: unknown) => typeof tag === 'string') &&
    typeof value.isFavorite === 'boolean' &&
    isValidDate(value.createdAt) && isValidDate(value.updatedAt);
}

export function validateAppData(input: unknown): AppData {
  if (!isObject(input) || input.version !== 1 || !Array.isArray(input.notes) || !Array.isArray(input.categories)) {
    throw new Error('檔案格式錯誤：需要 version、notes 和 categories 欄位（版本 1）。');
  }
  if (input.notes.length > 50_000 || input.categories.length > 10_000) {
    throw new Error('檔案內容過多，無法匯入。');
  }
  if (!input.categories.every(isCategory) || !input.notes.every(isNote)) {
    throw new Error('檔案資料有缺少或格式不正確的欄位。');
  }
  const categories: Category[] = input.categories.map((item: Category) => ({
    id: item.id, name: item.name.trim(),
  }));
  const notes: Note[] = input.notes.map((item: Note) => ({
    id: item.id, title: item.title.trim(), content: item.content,
    categoryId: item.categoryId, tags: [...item.tags], isFavorite: item.isFavorite,
    createdAt: item.createdAt, updatedAt: item.updatedAt,
  }));
  const categoryIds = new Set(categories.map((category) => category.id));
  if (categoryIds.size !== categories.length || new Set(notes.map((note) => note.id)).size !== notes.length) {
    throw new Error('檔案包含重複的筆記或分類 ID。');
  }
  if (notes.some((note) => note.categoryId !== null && !categoryIds.has(note.categoryId))) {
    throw new Error('檔案中有筆記參照不存在的分類。');
  }
  return { version: 1, categories, notes };
}

export function loadAppData(): { data: AppData; warning: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const data = createSeedData();
      saveAppData(data);
      return { data, warning: null };
    }
    return { data: validateAppData(JSON.parse(raw) as unknown), warning: null };
  } catch {
    return {
      data: createSeedData(),
      warning: '無法讀取舊有本機資料，目前顯示範例筆記。請先檢查或備份瀏覽器資料，避免覆蓋原有內容。',
    };
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
