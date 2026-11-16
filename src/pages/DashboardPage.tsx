import { ArrowRight, BookMarked, BookOpenText, FolderOpen, Heart, Lightbulb, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { categoryPalette } from '../utils/category';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';

export default function DashboardPage() {
  const { data } = useNotes();
  const notes = [...data.notes].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const favoritesCount = data.notes.filter((note) => note.isFavorite).length;

  return (
    <div className="page-stack dashboard-page">
      <section className="dashboard-intro"><p className="eyebrow">YOUR PERSONAL KNOWLEDGE SPACE <span>✳</span></p>
        <h1>嗨，歡迎回到 <span>NoteNest!</span> 👋</h1>
        <p>每一個小小的想法，都值得被好好收藏。今天想記錄什麼呢？</p>
      </section>
      <section className="hero-banner" aria-label="新增筆記"><div className="hero-text"><span className="hero-kicker"><Sparkles size={15} />讓靈感自由生長</span>
        <h2>把腦中的靈感，<br /><em>變成看得見的好點子。</em></h2><p>整理思緒、記錄日常，從一篇筆記開始。</p>
        <Link className="hero-button" to="/notes/new"><Plus size={18} />寫下新筆記<ArrowRight size={18} /></Link></div>
        <div className="hero-art" aria-hidden="true"><div className="art-halo" /><div className="art-sheet art-sheet-back"><span /><span /><span /></div><div className="art-sheet art-sheet-front"><div className="art-sheet-symbol">✦</div><span /><span /><span /></div><div className="art-star art-star-one">✳</div><div className="art-star art-star-two">✦</div><div className="art-orbit">◌</div></div>
      </section>
      <section className="stats-grid" aria-label="筆記統計">
        <div className="stat-card"><span className="stat-icon stat-indigo"><BookOpenText size={23} /></span><div><span className="stat-label">筆記總數</span><strong>{data.notes.length}</strong><span className="stat-foot">篇靈感筆記</span></div></div>
        <div className="stat-card"><span className="stat-icon stat-mint"><FolderOpen size={23} /></span><div><span className="stat-label">我的分類</span><strong>{data.categories.length}</strong><span className="stat-foot">個整理空間</span></div></div>
        <div className="stat-card"><span className="stat-icon stat-peach"><Heart size={23} /></span><div><span className="stat-label">最愛筆記</span><strong>{favoritesCount}</strong><span className="stat-foot">個重要收藏</span></div></div>
      </section>
      <section className="dashboard-section">
        <div className="section-heading"><div><span className="section-heading-icon"><BookMarked size={18} /></span><h2>最近編輯</h2><p>接續上次的思考，讓想法慢慢變完整。</p></div>
          <Link className="text-link" to="/notes">查看全部 <ArrowRight size={17} /></Link></div>
        {notes.length ? <div className="notes-grid">{notes.slice(0, 6).map((note, i) => <NoteCard note={note} position={i} key={note.id} />)}</div> :
          <EmptyState title="這裡還沒有任何筆記" description="建立你的第一篇筆記，開始整理想法。" />}
      </section>
      <section className="dashboard-section categories-section">
        <div className="section-heading"><div><span className="section-heading-icon section-heading-icon-green"><Lightbulb size={18} /></span><h2>依分類探索</h2><p>讓每一種想法，都有自己的小角落。</p></div><Link className="text-link" to="/settings?section=categories">管理分類 <ArrowRight size={17} /></Link></div>
        <div className="category-preview-grid">{data.categories.map((category) => {
          const colors = categoryPalette(category.id);
          const count = data.notes.filter((note) => note.categoryId === category.id).length;
          return <Link to={`/categories/${category.id}`} className="category-preview" key={category.id}>
            <span className="category-preview-icon" style={{ backgroundColor: colors.bg, color: colors.fg }}><FolderOpen size={21} /></span>
            <span className="category-preview-text"><strong>{category.name}</strong><small>{count} 篇筆記</small></span><ArrowRight className="category-preview-arrow" size={18} />
          </Link>;
        })}</div>
      </section>
    </div>
  );
}
