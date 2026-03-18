import { pool } from "../../config/database";
import { CreateProductDTO, Product } from "./products.types";

export const getProductsByStoreService = async (storeId: string): Promise<Product[]> => {
    const dbRequest = await pool.query(
        'SELECT * FROM products WHERE storeid = $1',
        [storeId]
    );
    return dbRequest.rows;
};

export const createProductService = async (data: CreateProductDTO): Promise<Product> => {
    const { name, description, price, imageUrl, storeid } = data;

    const dbRequest = await pool.query(
        `INSERT INTO products (name, description, price, imageurl, storeid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [name, description, price, imageUrl, storeid]
    );
    return dbRequest.rows[0];
};

export const deleteProductService = async (id: string): Promise<Product> => {
    const dbRequest = await pool.query(
        'DELETE FROM products WHERE id= $1 RETURNING *',
        [id]
    );
    return dbRequest.rows[0];
};