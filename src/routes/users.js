import {Router} from "express"
import { changeUserRoles, createUser,deleteMultipleUserInRange,deleteUserById } from "../controllers/users.js"
import auth from "../middleware/auth.js"

const usersRouter = Router()

usersRouter.post("/",createUser)

usersRouter.delete("/:id",auth(["teacher"]),deleteUserById)

usersRouter.post("/deleteMultipleStudents/",auth(["teacher"]),deleteMultipleUserInRange)

usersRouter.patch("/update/roles",auth(["teacher","admin"]),changeUserRoles)


export default usersRouter

