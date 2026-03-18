import { Request, Response } from "express";
import Boom from "@hapi/boom";
import { createProductService, deleteProductService, getProductsByStoreService } from "./products.service";

export const getProductsByStoreController = async (req: Request, res: Response) => {
    const { storeId } = req.params;
    const products = await getProductsByStoreService(String(storeId));
    return res.json(products);
};

export const createProductController = async (req: Request, res: Response) => {
    const { name, description, price, imageUrl, storeid } = req.body;

    if (!name || !price || !storeid) {
        throw Boom.badRequest('name, price and storeid are required');
    }

    const product = await createProductService({
        name,
        description,
        price,
        imageUrl,
        storeid
    });

    return res.json(product);
};

export const deleteProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await deleteProductService(String(id));
    return res.json(product);
};