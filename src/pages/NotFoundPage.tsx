import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = { title?: string };

export default function NotFoundPage({ title = '這個頁面不存在' }: Props) {
  return <div className="not-found"><span className="not-found-icon"><Compass size={43} strokeWidth={1.5} /></span><span className="not-found-code">404 — OOPS!</span>
    <h1>{title}</h1><p>這個連結可能已移動或刪除，別擔心，你的其他筆記還在。</p>
    <Link className="button button-primary" to="/"><ArrowLeft size={17} />回到首頁</Link>
  </div>;
}
