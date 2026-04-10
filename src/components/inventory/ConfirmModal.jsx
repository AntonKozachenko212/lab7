export default function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-sm shadow-2xl shadow-black/60">
        <div className="text-amber-400 text-2xl mb-3">⚠</div>
        <p className="text-zinc-200 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
