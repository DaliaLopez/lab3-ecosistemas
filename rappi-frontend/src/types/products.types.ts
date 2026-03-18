export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageurl: string;
    storeid: string;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    storeid: string;
}