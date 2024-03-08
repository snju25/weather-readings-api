import {Router} from "express"
import { createUser,deleteMultipleUserInRange,deleteUserById } from "../controllers/users.js"

const usersRouter = Router()

usersRouter.post("/",createUser)

usersRouter.delete("/:id",deleteUserById)

usersRouter.post("/deleteMultipleStudents/",deleteMultipleUserInRange)


export default usersRouter

