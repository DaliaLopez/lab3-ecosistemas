export interface Order {
    id: string;
    consumerid: string;
    storeid: string;
    deliveryid: string | null;
    status: string;
    total: number;
    createdat: string;
}

export interface CreateOrderDTO {
    consumerid: string;
    storeid: string;
    total: number;
}

export interface AcceptOrderDTO {
    id: string;
    deliveryid: string;
}

export interface UpdateOrderStatusDTO {
    id: string;
    status: string;
    deliveryid: null;
}