export interface Store {
    id: string;
    name: string;
    isopen: boolean;
    userid: string;
}

export interface CreateStoreDTO {
    name: string;
    userid: string;
}

export interface UpdateStoreStatusDTO {
    id: string;
    isopen: boolean;
}