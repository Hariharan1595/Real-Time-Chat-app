import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js";

const messsageRouter = Router();

messsageRouter.get("/", protectRoute, getAllUsers);
messsageRouter.get("/:id", protectRoute, getMessage);
messsageRouter.post("/:id", protectRoute, sendMessage);

export default messsageRouter;
