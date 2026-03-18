export interface OrderItem {
  id: string;
  orderId: string;
  productid: string;
  quantity: number;
  priceattime: number;
}

export interface CreateOrderItemDTO {
  orderid: string;
  productid: string;
  quantity: number;
  priceattime: number;
}