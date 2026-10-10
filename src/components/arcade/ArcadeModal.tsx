import {
  useEffect,
  type KeyboardEventHandler,
  type ReactNode,
  type RefObject,
} from 'react';
import { X } from 'lucide-react';

export default function ArcadeModal({
  title,
  closeLabel,
  onClose,
  dialogRef,
  onKeyDown,
  children,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  children: ReactNode;
}) {
  useEffect(() => {
    const dialog = dialogRef.current!;
    const overflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, [dialogRef]);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="arcade-player"
      aria-labelledby="arcade-game-title"
      onKeyDown={onKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="arcade-player-heading">
        <h2 id="arcade-game-title">{title}</h2>
        <button
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
