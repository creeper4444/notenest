import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open, title, description, confirmText = '確認', destructive = false, onCancel, onConfirm,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="confirm-dialog" onClose={onCancel} onCancel={onCancel}>
      <div className="dialog-icon"><AlertTriangle size={22} /></div>
      <button className="icon-button dialog-close" type="button" aria-label="關閉視窗" onClick={onCancel}><X size={18} /></button>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="dialog-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>取消</button>
        <button className={`button ${destructive ? 'button-danger' : 'button-primary'}`} type="button" onClick={onConfirm}>{confirmText}</button>
      </div>
    </dialog>
  );
}
