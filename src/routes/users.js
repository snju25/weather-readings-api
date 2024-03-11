import {Router} from "express"
import { changeUserRoles, createUser,deleteMultipleUserInRange,deleteUserById } from "../controllers/users.js"
import auth from "../middleware/auth.js"

const usersRouter = Router()

usersRouter.post("/",auth(["teacher"]),createUser)

usersRouter.delete("/:id",auth(["teacher"]),deleteUserById)

usersRouter.delete("/delete/multipleStudents",auth(["teacher"]),deleteMultipleUserInRange)

usersRouter.patch("/update/roles",auth(["teacher"]),changeUserRoles)


export default usersRouter

