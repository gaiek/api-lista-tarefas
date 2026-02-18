import { Request, Response } from "express";
import { UserService } from "../service/userService";
import { AuthRequest } from "../middleware/auth";
import logger from "../logger";

export class UserController {
    static async getMe(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await UserService.getUserbyId(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error: any) {
            logger.error(`[UserController.getMe] Error: ${error.message}`);
            return res.status(404).json({ message: error.message });
        }
    }
}