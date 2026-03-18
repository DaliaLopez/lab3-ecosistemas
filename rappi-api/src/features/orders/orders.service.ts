import { pool } from "../../config/database";
import { AcceptOrderDTO, CreateOrderDTO, Order, UpdateOrderStatusDTO } from "./orders.types";

export const createOrderService = async (data: CreateOrderDTO): Promise<Order> => {
    const { consumerid, storeid, total } = data;
    const dbRequest = await pool.query(
        `INSERT INTO orders (consumerId, storeId, total)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [consumerid, storeid, total]
    );

    return dbRequest.rows[0];
};

export const getAvailableOrdersService = async (): Promise<Order[]> => {
    const dbRequest = await pool.query(
        `SELECT * FROM orders
        WHERE status = 'pending'
        AND deliveryid IS NULL`
    );

    return dbRequest.rows;
};

export const acceptOrderService = async (data: AcceptOrderDTO): Promise<Order> => {

    const { id, deliveryid } = data;
    const dbRequest = await pool.query(
        `UPDATE orders
        SET deliveryid = $2,
            status = 'accepted'
        WHERE id = $1
         RETURNING *`,
        [id, deliveryid]
    );

    return dbRequest.rows[0];
};

export const updateOrderStatusService = async (data: UpdateOrderStatusDTO): Promise<Order> => {
    const { id, status, deliveryid } = data;
    const dbRequest = await pool.query(
        `UPDATE orders
        SET status = $2, deliveryid = $3
        WHERE id = $1
         RETURNING *`,
        [id, status, deliveryid]
    );

    return dbRequest.rows[0];
};

export const getUserOrdersService = async (userId: string): Promise<Order[]> => {

    const dbRequest = await pool.query(
        `SELECT * FROM orders
        WHERE consumerid = $1
        OR deliveryid = $1
        ORDER BY createdat DESC`,
        [userId]
    );

    return dbRequest.rows;
};

export const getOrdersByStoreService = async (storeId: string): Promise<Order[]> => {
    const dbRequest = await pool.query(
        `SELECT * FROM orders WHERE storeId = $1 ORDER BY createdAt DESC`,
        [storeId]
    );
    return dbRequest.rows;
};
