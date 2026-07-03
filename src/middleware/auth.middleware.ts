import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export function authenticate(
    req: any,
    res: any,
    next: any
) {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token)

        return res.status(401).json({

            message: "Unauthorized",

        });

    const decoded = jwt.verify(

        token,

        process.env.JWT_SECRET!

    );

    req.user = decoded;

    next();

}