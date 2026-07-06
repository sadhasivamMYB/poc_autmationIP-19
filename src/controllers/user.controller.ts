import { UserService } from "../service/user.service";

export class UserController {
    static getAllUsers = async (req: any, res: any) => {
        try {
            const users = await UserService.getAll();
            return res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static getUserById = async (req: any, res: any) => {
        try {
            const user = await UserService.getById(Number(req.params.id));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static createUser = async (req: any, res: any) => {
        try {
            const user = await UserService.create(req.body);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        } catch (error: any) {
            // Check for duplicate email
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static updateUser = async (req: any, res: any) => {
        try {
            const user = await UserService.update(Number(req.params.id), req.body);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user,
            });
        } catch (error: any) {
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static deleteUser = async (req: any, res: any) => {
        try {
            const user = await UserService.delete(Number(req.params.id));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
