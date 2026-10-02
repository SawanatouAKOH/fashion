"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-[#f2dfe7] bg-[#fff8fb] p-3">
        <Image
          src={selectedImage}
          alt={name}
          width={900}
          height={1100}
          priority
          className="h-[420px] w-full rounded-[22px] object-contain sm:h-[540px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-2xl border ${selectedImage === image ? "border-[#d95d8d]" : "border-[#f0dfe6]"}`}
            aria-label={`Voir la photo ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${name} vue ${index + 1}`}
              width={300}
              height={360}
              className="h-24 w-full bg-[#fff8fb] object-contain sm:h-28"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
