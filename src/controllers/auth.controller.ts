import { Request, Response } from "express";

import { AuthService } from "../service/auth.service";

export class AuthController {

    static async register(req: Request, res: Response) {

        const user = await AuthService.register(req.body);

        res.status(201).json(user);

    }

    static async login(req: Request, res: Response) {

        const data = await AuthService.login(

            req.body.email,
            req.body.password

        );

        res.json(data);

    }

    static async profile(req: any, res: Response) {

        res.json(req.user);

    }

}