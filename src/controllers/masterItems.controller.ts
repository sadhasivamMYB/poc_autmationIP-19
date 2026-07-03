import { Request, Response } from "express";
import { MasterItemsService } from "../service/masterItems.service";
// import { createMasterItemSchema } from "../models/validation/master.validation";

export class MasterItemsController {
    /**
     * Create Master Item
     */
    static async create(req: Request, res: Response) {
        try {
            // const body = createMasterItemSchema.parse(req.body);

            const item = await MasterItemsService.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Master item created successfully.",
                data: item,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get All Master Items
     */
    static async getAll(req: Request, res: Response) {
        try {
            const items = await MasterItemsService.getAll();

            return res.status(200).json({
                success: true,
                data: items,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get Single Master Item
     */
    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const item = await MasterItemsService.getById(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Master item not found.",
                });
            }

            return res.status(200).json({
                success: true,
                data: item,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update Master Item
     */
    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            //   const body = createMasterItemSchema.partial().parse(req.body);

            const item = await MasterItemsService.update(id, req.body);

            return res.status(200).json({
                success: true,
                message: "Master item updated successfully.",
                data: item,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Soft Delete Master Item
     */
    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            await MasterItemsService.delete(id);

            return res.status(200).json({
                success: true,
                message: "Master item deleted successfully.",
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async excelUpload(req: Request, res: Response) {
        try {

            const file = req.file;

            console.log(req.files)
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "Excel file is required.",
                });
            }

            await MasterItemsService.excelUpload(file)

            return res.status(200).json({
                success: true,
                message: "Master items uploaded successfully.",

            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}