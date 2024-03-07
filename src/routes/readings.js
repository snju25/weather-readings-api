import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById,createMultipleReadings, deleteMultipleReadingsById, patchReadingById, patchMultipleReadings } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware

readingsRouter.get("/",getAllReadings)

readingsRouter.get("/:id",getReadingsById)

readingsRouter.get("/page/:page",getReadingsByPage)

readingsRouter.post("/",auth(["teacher"]),createNewReading)

readingsRouter.post("/multiple", createMultipleReadings)

readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)

readingsRouter.delete("/delete/multiple", auth(["teacher"]),deleteMultipleReadingsById)

readingsRouter.patch("/:id", auth(["teacher"]), patchReadingById)

readingsRouter.patch("/update/many", patchMultipleReadings)

export default readingsRouter