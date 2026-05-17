type Props = {
  message: string;
  onCancel: () => void;
};

export function LoadingOverlay({ message, onCancel }: Props) {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 rounded-xl">
      <div className="w-9 h-9 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-zinc-300">{message}</p>
      <button
        onClick={onCancel}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
      >
        Cancel
      </button>
    </div>
  );
}
