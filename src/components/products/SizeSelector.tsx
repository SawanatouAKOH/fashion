type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#666]">Taille</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedSize === size
                ? "border-[#d95d8d] bg-[#f9dfe9] text-[#1d1d1d]"
                : "border-[#eedde6] bg-white text-[#2f2f30] hover:border-[#d8c3cd]"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
