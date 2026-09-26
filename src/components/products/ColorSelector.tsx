import type { ProductColor } from "@/types/product";

type ColorSelectorProps = {
  colors: ProductColor[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

export function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#666]">Couleur</p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onSelect(color.name)}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
              selectedColor === color.name
                ? "border-[#d95d8d] bg-[#fff7fb] text-[#1d1d1d]"
                : "border-[#efdae2] bg-white text-[#2f2f30] hover:border-[#d7c2ce]"
            }`}
          >
            <span className="h-5 w-5 rounded-full border border-[#e7dfe4]" style={{ backgroundColor: color.hex }} />
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
