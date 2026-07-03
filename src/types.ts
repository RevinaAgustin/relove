/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen =
  | 'explore'
  | 'catalog'
  | 'product-detail'
  | 'checkout'
  | 'payment'
  | 'track-order'
  | 'review-seller'
  | 'profile'
  | 'seller-dashboard'
  | 'create-listing-info'
  | 'create-listing-photo'
  | 'create-listing-price'
  | 'create-listing-review'
  | 'login'
  | 'messages'
  | 'seller-shop'
  | 'seller-finance'
  | 'withdraw-funds'
  | 'seller-products'
  | 'seller-orders'
  | 'edit-profile';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  size: string;
  condition: 'Baru' | 'Sangat Baik' | 'Baik' | 'Pernah Dipakai';
  price: number;
  description: string;
  imagePrimary: string;
  imageHover: string;
  isVerified?: boolean;
  sellerName: string;
  sellerRating: number;
  transactions?: number;
  responseTime?: string;
  stars?: number;
  isDraft?: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  image: string;
  sellerName: string;
  totalAmount: number;
  courier: string;
  courierFee: number;
  serviceFee: number;
  status: 'Waiting' | 'Paid' | 'Shipped' | 'Courier' | 'Received' | 'Reviewed';
  resi: string;
  date: string;
}

export interface SellerReview {
  id: string;
  buyerName: string;
  stars: number;
  text: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

