import { BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = { title: string; description: string; showCreate?: boolean };

export default function EmptyState({ title, description, showCreate = true }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-illustration"><BookOpenText size={31} strokeWidth={1.7} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {showCreate && <Link className="button button-primary" to="/notes/new">建立新筆記</Link>}
    </div>
  );
}
