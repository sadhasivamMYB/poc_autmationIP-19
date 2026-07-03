import { WarehouseService } from "../service/warehouse.service";


export class WarehouseController {

    static getWareHouses = async (req: any, res: any) => {
        try {
            const warehouses = await WarehouseService.getAll();
            return res.status(200).json({
                success: true,
                data: warehouses,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static excelUpload = async (req: any, res: any) => {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            await WarehouseService.excelUpload(file);

            return res.status(200).json({
                success: true,
                message: "Warehouses uploaded successfully."
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

}