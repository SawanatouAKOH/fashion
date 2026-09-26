export type ProductCategory =
  | "Robes"
  | "Ensembles"
  | "Hauts"
  | "Pantalons"
  | "Accessoires";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type ReservationStatus = "pending" | "confirmed" | "expired" | "cancelled";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProfilesRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductsRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
};

export type OrdersRow = {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  guest_email: string | null;
  shipping_address: Record<string, string>;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemsRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image_url: string | null;
  created_at: string;
};

export type ReservationsRow = {
  id: string;
  product_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  size: string | null;
  color: string | null;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: Omit<ProfilesRow, "created_at" | "updated_at">;
        Update: Partial<ProfilesRow>;
      };
      products: {
        Row: ProductsRow;
        Insert: Omit<ProductsRow, "id" | "created_at" | "updated_at">;
        Update: Partial<ProductsRow>;
      };
      orders: {
        Row: OrdersRow;
        Insert: Omit<OrdersRow, "id" | "created_at" | "updated_at">;
        Update: Partial<OrdersRow>;
      };
      order_items: {
        Row: OrderItemsRow;
        Insert: Omit<OrderItemsRow, "id" | "created_at">;
        Update: Partial<OrderItemsRow>;
      };
      reservations: {
        Row: ReservationsRow;
        Insert: Omit<ReservationsRow, "id" | "created_at" | "updated_at">;
        Update: Partial<ReservationsRow>;
      };
    };
  };
};
