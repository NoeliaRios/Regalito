'import React, { useState } from 'react';
import { X, Gift as GiftIcon } from 'lucide-react';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reservedBy: string) => Promise<void>;
  giftTitle: string;
}

export function ReserveModal({
  isOpen,
  onClose,
  onConfirm,
  giftTitle,
}: ReserveModalProps) {
  const [reservedBy, setReservedBy] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(reservedBy.trim() || 'Anónimo');
      setReservedBy('');
      onClose();
    } catch (error) {
      console.error('Error reserving gift:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <GiftIcon className="h-5 w-5" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Reservar Regalo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Estás a punto de reservar: <strong className="text-zinc-900 dark:text-zinc-100">{giftTitle}</strong>
            </p>
          </div>

          <div>
            <label
              htmlFor="reservedBy"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1"
            >
              Tu nombre o apodo (opcional)
            </label>
            <input
              type="text"
              id="reservedBy"
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
              placeholder="Ej. María o Anónimo"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Si lo dejas en blanco, aparecerá como &quot;Anónimo&quot;.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition"
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
