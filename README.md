# ✦ NoteNest｜我的筆記整理空間

使用 **React + TypeScript + Vite** 製作的繁體中文筆記整理網站。支援新增、編輯、刪除、分類、標籤、最愛、即時搜尋、排序與 JSON 備份，所有資料都存放在**目前瀏覽器的 localStorage**，不需後端或 API Key。

## 開發環境

- Node.js **20.19+ 或 22.12+**（建議 Node.js 22）
- npm

## 在電腦上執行

```bash
npm install
npm run dev
```

終端機會顯示網站網址，通常是 `http://localhost:5173/`。在瀏覽器開啟即可使用。

其他指令：

```bash
npm run typecheck # TypeScript 靜態檢查
npm run build     # 型別檢查 + 產生正式版 dist/
npm run preview   # 在本機預覽 dist/
```

## 功能

- **首頁**：根據實際資料顯示總數、最愛、分類以及最近更新的筆記
- **筆記**：新增、查看、編輯、儲存與刪除（刪除前需確認）
- **分類**：新增、改名、刪除；刪除分類時筆記保留在「未分類」
- **標籤**：一篇筆記可加入多個標籤
- **搜尋與排序**：搜尋標題／內文／標籤，依最近更新／建立時間／標題排序
- **最愛**：星號收藏，從列表與詳情頁同步更新
- **資料備份**：匯出 JSON；匯入前驗證格式並確認覆蓋
- **跨裝置版面**：桌面側邊欄、手機抽屜導覽；`Ctrl/⌘ + K` 快速搜尋
- **防呆**：空標題提示、404 畫面、儲存異常提示、匯入錯誤檢查

首次瀏覽會建立 4 個分類與 6 篇範例筆記。你的修改將保留在此瀏覽器裡，重新整理不會消失。

> ⚠️ **關於資料保存**：沒有雲端同步；不同裝置/瀏覽器之間不會共用筆記。清除網站資料可能導致遺失，請定期使用「設定 → 匯出所有筆記」下載 JSON 備份。

## 專案架構

```text
notenest/
├── AGENT.md                       # 開發規範
├── .github/workflows/deploy.yml   # GitHub Pages 自動部署
├── index.html
├── package.json
├── public/favicon.svg
├── src/
│   ├── App.tsx                    # HashRouter 路由
│   ├── main.tsx
│   ├── components/                # 共用元件與筆記編輯器
│   ├── context/NotesContext.tsx   # 資料狀態與增刪改查
│   ├── data/seedData.ts           # 範例資料
│   ├── hooks/useLocalStorage.ts
│   ├── pages/                     # 首頁、筆記、分類、最愛、設定
│   ├── styles/                    # CSS 設計變數與排版
│   ├── types/note.ts              # TypeScript 資料型別
│   └── utils/                     # 資料驗證、日期、分類
├── tsconfig.json
└── vite.config.ts
```

詳細開發規範請參閱 [AGENT.md](./AGENT.md)。

## 上傳到 GitHub

### 1. 建立 GitHub Repository

在 GitHub 點選 **New repository**，例如取名 `notenest`。如果已經有本機檔案，建立 Repository 時可以先不要勾選 README、`.gitignore`。

### 2. 把專案推上去

在本專案根目錄開啟終端機，執行：

```bash
git init
git add .
git commit -m "Initial commit: NoteNest website"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<儲存庫名稱>.git
git push -u origin main
```

請把 `<你的帳號>` 和 `<儲存庫名稱>` 換成自己的實際資訊。`node_modules/` 和 `dist/` 已由 `.gitignore` 排除，**不用上傳**。

### 3. 使用 GitHub Pages 發布網站

本專案已包含 `.github/workflows/deploy.yml`，每次推送到 `main` 就會嘗試建立並部署網站。

1. 在 GitHub 專案選擇 **Settings → Pages**。
2. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
3. 點選 **Actions**，確認「Deploy NoteNest to GitHub Pages」執行成功；如需手動觸發可點選 **Run workflow**。
4. 部署完成後，網站通常位於 `https://<你的帳號>.github.io/<儲存庫名稱>/`。

網站使用 Vite 的相對資源路徑 `base: './'` 和 React Router 的 `HashRouter`，所以部署在 GitHub Pages 子路徑後，重整筆記頁面仍可正常導覽。

**注意**：GitHub Pages 提供的是公開的靜態網站，但你的筆記資料只留在各訪客自己的瀏覽器，不會存進 GitHub Repository；打開網站的人彼此不會看到對方的筆記。

## 資料備份格式

```json
{
  "version": 1,
  "notes": [],
  "categories": []
}
```

完整資料需符合 `src/types/note.ts` 中的型別，匯入時會檢查必填欄位、日期、重複 ID 與分類參照等。舊資料不會因錯誤 JSON 而被覆蓋。
