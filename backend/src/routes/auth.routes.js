import { Router } from "express";
import { getUserProfile, signIn, signOut, signUp, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

authRouter.put('/update-profile',protectRoute ,updateProfile);

authRouter.get('/',protectRoute,getUserProfile)

export default authRouter;
