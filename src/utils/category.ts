import type { Category } from '../types/note';

const palettes = [
  { bg: '#eef2ff', fg: '#5851d8', accent: '#818cf8' },
  { bg: '#eaf7f2', fg: '#16876c', accent: '#4cbe9e' },
  { bg: '#fff3e6', fg: '#d37a21', accent: '#f3b76a' },
  { bg: '#fcecf3', fg: '#bf5082', accent: '#e69ac0' },
  { bg: '#e8f5fd', fg: '#2886b6', accent: '#74c7e9' },
];

export function categoryPalette(categoryId: string | null) {
  if (!categoryId) return { bg: '#f1f5f9', fg: '#64748b', accent: '#94a3b8' };
  const defaultIndex: Record<string, number> = { learning: 0, work: 1, life: 2, ideas: 3 };
  if (categoryId in defaultIndex) return palettes[defaultIndex[categoryId]];
  const hash = [...categoryId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

export function categoryName(categories: Category[], id: string | null) {
  return categories.find((category) => category.id === id)?.name ?? '未分類';
}
