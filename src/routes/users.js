import {Router} from "express"
import { createUser,deleteUserById } from "../controllers/users.js"

const usersRouter = Router()

usersRouter.post("/",createUser)

usersRouter.delete("/:id",deleteUserById)

export default usersRouter

