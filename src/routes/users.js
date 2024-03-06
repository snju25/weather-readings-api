import {Router} from "express"
import { createUser } from "../controllers/users.js"

const usersRouter = Router()

usersRouter.post("/",createUser)

export default usersRouter

