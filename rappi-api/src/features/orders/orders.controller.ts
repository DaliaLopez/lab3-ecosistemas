import { Request, Response } from "express";
import {
    acceptOrderService,
    createOrderService,
    getAvailableOrdersService,
    getOrdersByStoreService,
    getUserOrdersService,
    updateOrderStatusService
} from "./orders.service";
import {
    createOrderItemService,
    getOrderDetailsService
} from "./orderItems/orderItems.service";
import Boom from "@hapi/boom";



export const createOrderController = async (req: Request, res: Response) => {
    const { consumerid, storeid, total, items } = req.body;

    const order = await createOrderService({
        consumerid,
        storeid,
        total
    });

    for (const item of items) {
        await createOrderItemService({
            orderid: order.id,
            productid: item.productid,
            quantity: item.quantity,
            priceattime: item.priceattime
        });
    }

    if (!items || items.length === 0) {
        throw Boom.badRequest("Order must contain items");
    }

    return res.json(order);
};

export const getAvailableOrdersController = async (req: Request, res: Response) => {
    const orders = await getAvailableOrdersService();

    return res.json(orders);
};

export const acceptOrderController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { deliveryid } = req.body;

    const order = await acceptOrderService({
        id: String(id),
        deliveryid
    });

    return res.json(order);
};

export const updateOrderStatusController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { status } = req.body;
    const { deliveryid } = req.body;

    const order = await updateOrderStatusService({
        id: String(id),
        status,
        deliveryid
    });

    return res.json(order);
};

export const getUserOrdersController = async (req: Request, res: Response) => {

    const { userId } = req.params;
    const orders = await getUserOrdersService(String(userId));
    return res.json(orders);
};

export const getOrderDetailsController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const details = await getOrderDetailsService(String(id));

        if (!details || details.length === 0) {
            console.log(`No se encontraron items para la orden: ${id}`);
            return res.status(200).json([]);
        }

        return res.json(details);
    } catch (error) {
        console.error("Error en getOrderDetailsController:", error);
        res.status(500).json({ message: "Error interno al obtener detalles" });
    }
};

export const getOrdersByStoreController = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const orders = await getOrdersByStoreService(String(storeId));

    res.status(200).json(orders);
};