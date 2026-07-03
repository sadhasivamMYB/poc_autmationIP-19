import { Request, Response } from "express";

import { InitialStockService } from "../service/initialStock.service";


export class InitialStockController {

    static async excelUpload(req: Request, res: Response) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            console.log(file, "file 🔃🔃🔃🔃")
            await InitialStockService.excelUpload(file);
            return res.status(200).json({
                success: true,
                message: "Initial stock uploaded successfully."
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async create(req: Request, res: Response) {

        try {

            //   const body =
            //     createInitialStockSchema.parse(req.body);

            const stock =
                await InitialStockService.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Initial stock created successfully.",
                data: stock,
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message,
            });

        }

    }

    static async getAll(req: Request, res: Response) {

        try {

            const data =
                await InitialStockService.getAll();

            return res.json({
                success: true,
                data,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    }

    static async getByWarehouse(
        req: Request,
        res: Response
    ) {

        try {

            const warehouseId = Number(
                req.params.warehouseId
            );

            const data =
                await InitialStockService.getByWarehouse(
                    warehouseId
                );

            return res.json({
                success: true,
                data,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    }

    static async update(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            //   const body =
            //     updateInitialStockSchema.parse(req.body);

            const stock =
                await InitialStockService.update(
                    id,
                    req.body
                );

            return res.json({
                success: true,
                message: "Updated successfully.",
                data: stock,
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message,
            });

        }

    }

    static async delete(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            await InitialStockService.delete(id);

            return res.json({
                success: true,
                message: "Deleted successfully.",
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    }
}