export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
  customization?: {
    designUrl: string;
    themeName: string;
    text: string;
  };
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  products: { name: string; image: string; };
}

export interface DraftOrder {
  id: string;
  produto_id: number;
  tipo_personalizacao: string;
  products: {
    name: string;
    price: number;
    image: string;
  }[] | null;
}

export interface Order {
  id: number;
  user_id: string;
  created_at: string;
  total: number;
  status: string;
  tracking_code?: string;
  shipping_address: ShippingAddress;
  customer_name: string;
  customer_email: string;
  order_items: OrderItem[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  additional_images?: string[];
  category_id: number;
  categories: { name: string; };
}


export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  created_at: string;
  is_featured?: boolean;
}

export interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  image_url_desktop?: string;
  image_url_mobile?: string;
  crop_data_desktop?: any; // Idealmente, um tipo mais específico de react-image-crop
  crop_data_mobile?: any;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Theme {
  id: number;
  name: string;
  image_url: string;
  category: string;
  product_id: number;
}
