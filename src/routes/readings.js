import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById,createMultipleReadings, deleteMultipleReadingsById, patchReadingById, patchMultipleReadings, maxPrecipitation, findTARP, findMaxTemperature, updatePrecipitation } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware

readingsRouter.get("/",getAllReadings)

readingsRouter.get("/:id",getReadingsById)

readingsRouter.get("/max_precipitation/:device_name/", maxPrecipitation)

readingsRouter.get("/TARP/:device_name/:date", findTARP)

readingsRouter.get("/temperature/max/range", findMaxTemperature)

readingsRouter.get("/page/:page",getReadingsByPage)

readingsRouter.post("/",auth(["teacher","sensor"]),createNewReading)

readingsRouter.post("/multiple",auth(["teacher","sensor"]), createMultipleReadings)

readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)

readingsRouter.delete("/delete/multiple", auth(["teacher"]),deleteMultipleReadingsById)

readingsRouter.put("/:id", auth(["teacher"]), patchReadingById)

readingsRouter.patch("/update/many",auth(["teacher"]), patchMultipleReadings)

readingsRouter.patch("/update/precipitation",auth(["teacher"]), updatePrecipitation)

export default readingsRouter