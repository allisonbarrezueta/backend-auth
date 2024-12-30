import express from "express";

import {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router): void => {
    router.get("/users", isAuthenticated, getAllUsers);
    router.get("/users/:id", isAuthenticated, getUser);
    router.patch("/users/:id", isAuthenticated, updateUser);
    router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
};
