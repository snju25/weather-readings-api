import {Router} from "express"
import { createUser,deleteMultipleUserInRange,deleteUserById } from "../controllers/users.js"
import auth from "../middleware/auth.js"

const usersRouter = Router()

usersRouter.post("/",createUser)

usersRouter.delete("/:id",auth(["teacher"]),deleteUserById)

usersRouter.post("/deleteMultipleStudents/",auth(["teacher"]),deleteMultipleUserInRange)


export default usersRouter

