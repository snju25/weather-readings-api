import {Router} from "express"
import {loginUser, logoutUser, registerUser} from "../controllers/auth.js"

const authRouter = Router()


// TODO write documentation today
authRouter.post("/login",loginUser)
authRouter.post("/logout",logoutUser)
authRouter.post("/register",registerUser)

export default authRouter