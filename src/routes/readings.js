import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById,createMultipleReadings, deleteMultipleReadingsById, patchReadingById, patchMultipleReadings, maxPrecipitation, findTARP, findMaxTemperature } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware

readingsRouter.get("/",getAllReadings)

readingsRouter.get("/:id",getReadingsById)

readingsRouter.get("/:device_name/max_precipitation", maxPrecipitation)

readingsRouter.get("/:device_name/:date", findTARP)

readingsRouter.get("/temperature/max/range", findMaxTemperature)

readingsRouter.get("/page/:page",getReadingsByPage)

readingsRouter.post("/",auth(["teacher"]),createNewReading)

readingsRouter.post("/multiple",auth(["teacher"]), createMultipleReadings)

readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)

readingsRouter.delete("/delete/multiple", auth(["teacher"]),deleteMultipleReadingsById)

readingsRouter.patch("/:id", auth(["teacher"]), patchReadingById)

readingsRouter.patch("/update/many",auth(["teacher"]), patchMultipleReadings)

export default readingsRouter