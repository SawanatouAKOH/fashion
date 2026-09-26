export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductStatus = "AVAILABLE" | "COMING_SOON";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId?: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  status: ProductStatus;
  estimatedArrival?: string | null;
};

export type CartLineItem = {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
};
