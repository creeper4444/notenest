import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Check, Database, Download, FolderOpen, HardDrive, Pencil, Plus, RotateCcw, ShieldCheck, Trash2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotes } from '../context/NotesContext';
import type { AppData, Category } from '../types/note';
import { categoryPalette } from '../utils/category';
import { validateAppData } from '../utils/storage';

export default function SettingsPage() {
  const { data, addCategory, renameCategory, deleteCategory, replaceData, resetData, notify } = useNotes();
  const [searchParams] = useSearchParams();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const categorySection = useRef<HTMLElement>(null);

  useEffect(() => {
    if (searchParams.get('section') === 'categories') {
      categorySection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (addCategory(newName)) setNewName('');
  }

  function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editId && renameCategory(editId, editName)) setEditId(null);
  }

  function exportJson() {
    try {
      const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notenest-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('備份 JSON 已下載！');
    } catch {
      notify('匯出失敗，請稍後再試。', 'error');
    }
  }

  async function selectImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 8 * 1024 * 1024) throw new Error('檔案超過 8MB，請選擇較小的備份。');
      const content = await file.text();
      let parsed: unknown;
      try { parsed = JSON.parse(content) as unknown; }
      catch { throw new Error('JSON 無法解析，請確認檔案內容。'); }
      setPendingImport(validateAppData(parsed));
    } catch (error) {
      notify(error instanceof Error ? error.message : '無法讀取此備份檔案。', 'error');
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function closeImport() {
    setPendingImport(null);
    if (fileInput.current) fileInput.current.value = '';
  }

  return (
    <div className="page-stack settings-page">
      <header className="page-heading"><p className="eyebrow">MAKE IT YOURS / 個人設定</p><h1>設定與資料管理</h1><p className="page-description">整理分類、備份筆記，讓你的靈感有個安心的家。</p></header>

      <section ref={categorySection} id="category-section" className="settings-section">
        <div className="settings-section-heading"><span className="settings-icon settings-icon-purple"><FolderOpen size={21} /></span><div><h2>管理筆記分類</h2><p>替不同想法建立專屬的整理空間。</p></div></div>
        <div className="settings-card">
          <form className="add-category-form" onSubmit={add}><label htmlFor="category-name">新增分類</label>
            <div className="inline-form-row"><input id="category-name" value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="例如：閱讀心得、旅行、創作…" maxLength={50} /><button type="submit" className="button button-primary"><Plus size={17} />新增分類</button></div>
          </form>
          <div className="settings-list-title">目前分類 <span>{data.categories.length}</span></div>
          <div className="category-manage-list">
            {data.categories.length === 0 && <p className="empty-categories">目前沒有分類，從上方新增第一個分類吧。</p>}
            {data.categories.map((category) => {
              const colors = categoryPalette(category.id);
              const count = data.notes.filter((note) => note.categoryId === category.id).length;
              return <div className="category-manage-row" key={category.id}>
                <span className="manage-category-icon" style={{ backgroundColor: colors.bg, color: colors.fg }}><FolderOpen size={20} /></span>
                {editId === category.id ? (
                  <form className="rename-category-form" onSubmit={rename}><label className="sr-only" htmlFor={`rename-${category.id}`}>重新命名分類</label><input id={`rename-${category.id}`} value={editName} onChange={(event) => setEditName(event.target.value)} maxLength={50} autoFocus />
                    <button className="icon-button confirm-icon" type="submit" aria-label="儲存分類名稱"><Check size={18} /></button>
                    <button className="icon-button" type="button" aria-label="取消重新命名" onClick={() => setEditId(null)}><X size={18} /></button>
                  </form>
                ) : <><div className="manage-category-info"><strong>{category.name}</strong><span>{count} 篇筆記</span></div><div className="manage-category-actions"><button type="button" className="icon-button" aria-label={`重新命名 ${category.name}`} title="重新命名" onClick={() => { setEditId(category.id); setEditName(category.name); }}><Pencil size={17} /></button><button type="button" className="icon-button danger-hover" aria-label={`刪除 ${category.name}`} title="刪除分類" onClick={() => setCategoryToDelete(category)}><Trash2 size={17} /></button></div></>}
              </div>;
            })}
          </div>
          <p className="settings-hint">刪除分類不會刪除裡面的筆記，筆記會自動移至「未分類」。</p>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading"><span className="settings-icon settings-icon-green"><Database size={21} /></span><div><h2>備份與還原</h2><p>把你的筆記帶著走，資料由自己掌握。</p></div></div>
        <div className="backup-grid"><div className="backup-card"><div className="backup-card-icon backup-export"><ArrowDownToLine size={24} /></div><h3>匯出所有筆記</h3><p>將所有筆記與分類下載為 JSON 檔案，隨時保存一份完整備份。</p><button className="button button-secondary backup-button" type="button" onClick={exportJson}><Download size={17} />下載 JSON 備份</button></div>
          <div className="backup-card"><div className="backup-card-icon backup-import"><ArrowUpFromLine size={24} /></div><h3>匯入備份資料</h3><p>選擇之前匯出的 JSON 檔案。匯入前會先檢查格式並請你確認。</p><input ref={fileInput} id="import-json" type="file" accept=".json,application/json" className="sr-only" onChange={(event) => { void selectImport(event); }} /><button className="button button-secondary backup-button" type="button" onClick={() => fileInput.current?.click()}><ArrowUpFromLine size={17} />選擇 JSON 檔案</button></div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading"><span className="settings-icon settings-icon-orange"><HardDrive size={21} /></span><div><h2>儲存空間與重設</h2><p>了解資料的保存方式，或重新開始。</p></div></div>
        <div className="storage-info-card"><ShieldCheck size={22} /><div><strong>你的筆記，只有你看得到</strong><p>NoteNest 使用瀏覽器的 localStorage 保存資料，不需登入，也不會將你的筆記上傳到伺服器。清除瀏覽器資料、使用不同裝置或無痕模式，都可能看不到原本的筆記；請定期匯出備份。</p></div></div>
        <div className="reset-row"><div><strong>重設為範例筆記</strong><p>清除目前所有筆記和分類，恢復最初的示範內容。</p></div><button type="button" className="button button-outline-danger" onClick={() => setConfirmReset(true)}><RotateCcw size={16} />重設資料</button></div>
      </section>

      <ConfirmDialog open={categoryToDelete !== null} title="刪除這個分類？" description={`「${categoryToDelete?.name ?? ''}」將被刪除，這個分類中的筆記會移至未分類，不會消失。`} confirmText="刪除分類" destructive onCancel={() => setCategoryToDelete(null)} onConfirm={() => { if (categoryToDelete) deleteCategory(categoryToDelete.id); setCategoryToDelete(null); }} />
      <ConfirmDialog open={pendingImport !== null} title="確定要匯入備份？" description={`即將匯入 ${pendingImport?.notes.length ?? 0} 篇筆記與 ${pendingImport?.categories.length ?? 0} 個分類。這會完全覆蓋目前所有資料，建議先匯出原有備份。`} confirmText="覆蓋並匯入" destructive onCancel={closeImport} onConfirm={() => { if (pendingImport) replaceData(pendingImport); closeImport(); }} />
      <ConfirmDialog open={confirmReset} title="確定要重設所有資料？" description="目前的筆記與分類都將被刪除並換成範例資料。這項操作無法復原，建議先匯出 JSON 備份。" confirmText="確認重設" destructive onCancel={() => setConfirmReset(false)} onConfirm={() => { resetData(); setConfirmReset(false); }} />
    </div>
  );
}
