import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose} // Close when clicking backdrop
    >
      <div
        className="bg-[var(--color-card)] rounded-xl shadow-lg w-full max-w-md relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        <div className="p-6 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
          >
            ✕
          </button>

          {title && (
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4 pr-10">
              {title}
            </h2>
          )}

          {/* The new scrollable container */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}