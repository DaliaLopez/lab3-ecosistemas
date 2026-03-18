import type { CreateOrderItemDTO } from "./orderItems.types";

export interface CreateOrderDTO {
    consumerid: string;
    storeid: string;
    total: number;
    items: Omit<CreateOrderItemDTO, 'orderid'>[];
}

export interface Order {
    id: string;
    consumerid: string;
    storeid: string;
    deliveryid: string | null;
    status: string;
    total: number;
    createdat: string;
}

export interface AcceptOrderDTO {
    id: string;
    deliveryid: string;
}

export interface UpdateOrderStatusDTO {
    id: string;
    status: string;
}