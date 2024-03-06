import {Router } from "express"
import { getAllReadings } from "../controllers/readings.js"
import { getReadingsById } from "../controllers/readings.js"

const readingsRouter = Router()

readingsRouter.get("/readings",getAllReadings)
readingsRouter.get("/readings/:id",getReadingsById)

export default readingsRouter