import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select(
            "+authentication.salt +authentication.password"
        );

        if (!user) {
            return res.sendStatus(404);
        }

        const expectedHash = authentication(
            user.authentication.salt,
            password,
            process.env.SECRET
        );

        if (expectedHash !== user.authentication.password) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(
            salt,
            user._id.toString(),
            process.env.SECRET
        );
        await user.save();
        res.cookie("Beauty-auth", user.authentication.sessionToken, {
            domain: "localhost",
            path: "/",
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                password: authentication(salt, password, process.env.SECRET),
                salt,
            },
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};
