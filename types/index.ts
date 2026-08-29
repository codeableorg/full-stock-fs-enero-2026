export interface Category {
  id: number;
  name: string;
  slug: string;
  imgSrc: string;
  alt: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  imgSrc: string;
  price: number;
  description: string;
  categoryId: number;
  features: string[];
}

export interface Cart {
  id: number;
  userId?: number | null;
  items: CartItem[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Order {
  id: number;
  userId?: number;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  total: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  imgSrc: string;
  quantity: number;
}

export interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
}

export interface Db {
  categories: Category[];
  products: Product[];
  carts: Cart[];
  users?: User[];
  orders?: Order[];
}
