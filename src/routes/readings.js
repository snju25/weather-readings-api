import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById } from "../controllers/readings.js"


const readingsRouter = Router()

readingsRouter.get("/",getAllReadings)
readingsRouter.get("/:id",getReadingsById)
readingsRouter.get("/page/:page",getReadingsByPage)
readingsRouter.post("/",createNewReading)
readingsRouter.delete("/",deleteReadingById)


export default readingsRouter