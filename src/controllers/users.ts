import { Request, Response } from "express";
import {
    deleteUserById,
    getUserById,
    getUsers,
    updateUserById,
} from "../db/users";

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const user = await getUsers();
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            return res.sendStatus(404);
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username } = req.body;
        const { id } = req.params;

        if (!username) {
            return res.sendStatus(400);
        }

        // const user = await getUserById(id);
        // user.username = username;
        // await user.save();
        const user = await updateUserById(id, { username });
        console.log({ user });
        user.username = username;
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};
