import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware

readingsRouter.get("/",getAllReadings)

readingsRouter.get("/:id",getReadingsById)

readingsRouter.get("/page/:page",getReadingsByPage)

readingsRouter.post("/",auth(["teacher"]),createNewReading)

readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)


export default readingsRouter