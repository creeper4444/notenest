import type { AppData } from '../types/note';
import { createId } from '../utils/id';

export const DEFAULT_CATEGORIES = [
  { id: 'learning', name: '學習' },
  { id: 'work', name: '工作' },
  { id: 'life', name: '生活' },
  { id: 'ideas', name: '靈感' },
];

export function createSeedData(): AppData {
  const now = Date.now();
  const time = (daysAgo: number) => new Date(now - daysAgo * 86_400_000).toISOString();
  return {
    version: 1,
    categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
    notes: [
      {
        id: createId(), title: '開始使用 NoteNest ✨',
        content: '歡迎來到你的筆記小宇宙！\n\n這裡可以存放每一個值得記住的想法。試著點選右上角的「編輯筆記」，修改這份筆記吧。\n\n你可以：\n・建立不同分類\n・為筆記加上標籤\n・將重要內容加入最愛\n・在設定中匯出 JSON 備份',
        categoryId: 'learning', tags: ['新手指南', '筆記技巧'], isFavorite: true,
        createdAt: time(6), updatedAt: time(0.08),
      },
      {
        id: createId(), title: '本週學習計畫',
        content: '本週想完成的三件事：\n\n1. 每天閱讀 20 分鐘\n2. 整理 React 學習筆記\n3. 複習上週的重點\n\n小提醒：持續累積，比一次做很多更重要。',
        categoryId: 'learning', tags: ['學習計畫', '目標'], isFavorite: false,
        createdAt: time(4), updatedAt: time(0.8),
      },
      {
        id: createId(), title: '專案會議重點整理',
        content: '會議紀錄\n\n・確認本週工作優先順序\n・先完成主要功能，再優化細節\n・週五前彙整回饋與待辦\n\n下一步：把想法轉成可以執行的小任務。',
        categoryId: 'work', tags: ['會議', '專案'], isFavorite: true,
        createdAt: time(3), updatedAt: time(1.7),
      },
      {
        id: createId(), title: '週末想做的小事',
        content: '留一點時間給自己。\n\n☐ 去喜歡的咖啡廳看看書\n☐ 散步，拍幾張照片\n☐ 整理房間和桌面\n☐ 煮一頓好吃的晚餐',
        categoryId: 'life', tags: ['生活', '清單'], isFavorite: false,
        createdAt: time(4.2), updatedAt: time(2.2),
      },
      {
        id: createId(), title: '突然想到的網站點子',
        content: '如果可以把學過的知識變成一張地圖呢？\n\n使用卡片連結不同想法，慢慢建立自己的知識庫。\n\n先記下來，之後再慢慢實現。',
        categoryId: 'ideas', tags: ['靈感', '網站設計'], isFavorite: true,
        createdAt: time(5), updatedAt: time(3),
      },
      {
        id: createId(), title: '值得收藏的閱讀摘記',
        content: '閱讀時不要只畫重點，也試著寫下自己的理解。\n\n・這段內容帶來什麼啟發？\n・能應用在哪裡？\n・有什麼還想深入了解？',
        categoryId: 'learning', tags: ['閱讀', '整理方法'], isFavorite: false,
        createdAt: time(9), updatedAt: time(5),
      },
    ],
  };
}
