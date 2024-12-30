import { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;

        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: "Unauthorized" });
    }
};

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const sessionToken = req.cookies["Beauty-auth"];
        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: "Unauthorized" });
    }
};
