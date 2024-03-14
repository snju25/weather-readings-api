import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById,createMultipleReadings, deleteMultipleReadingsById, patchReadingById, patchMultipleReadings, maxPrecipitation, findTARP, findMaxTemperature, updatePrecipitation } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware


readingsRouter.get("/",getAllReadings)


/**
 * @openapi
 * /api/readings/{id}:
 *      get:
 *          summary: "Get readings by ID "
 *          tags: [Readings]
 *          parameters: 
 *              - name: id 
 *                in: path
 *                description: reading ID
 *                required: true
 *                schema:
 *                  type: string
 *          responses: 
 *              '200':
 *                  description: "Response Object with readings array"
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: integer
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      example: "Get readings"
 *                                  readings:
 *                                      type: array
 *                                      items: 
 *                                         type: object  
 *                                         properties: 
 *                                              _id: 
 *                                              #    type: string 
 *                                                   example: "65b99b98c72f93bfa0da83e7"
 *                                              latitude: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              device_name: 
 *                                                  type: string 
 *                                                  example: "Woodford_Sensor"
 *                                              precipitation_mm_per_h: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              time: 
 *                                                  type: string
 *                                                  format: date-time
 *                                                  example: "2021-05-07T01:44:07.000+00:00"
 *                                              longitude: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              temperature_deg_celsius: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              atmospheric_pressure_kPa: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              max_wind_speed_m_per_s: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              solar_radiation_W_per_m2: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              vapor_pressure_kPa: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              humidity: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              wind_direction_deg: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *              '404':
 *                  description: "No results found"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties: 
 *                                  status: 
 *                                      type: number
 *                                      example: 400
 *                                  message: 
 *                                      type: string
 *                                      example: "no readings found by this ID"
*/
readingsRouter.get("/:id",getReadingsById)

/**
 * @openapi
 * /api/readings//max_precipitation/{device_name}:
 *      get:
 *          summary: "Get max_precipitation of a specific device in last 5 months"
 *          tags: [Readings]
 *          parameters: 
 *              - name: device_name
 *                in: path
 *                description: device name
 *                required: true
 *                schema:
 *                  type: string
 *          responses: 
 *              '200':
 *                  description: "Response Object with readings array"
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: integer
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      example: "Get max precipitation"
 *                                  readings:
 *                                      type: array
 *                                      items: 
 *                                         type: object  
 *                                         properties: 
 *                                              _id: 
 *                                              #    type: string 
 *                                                   example: "65b99b98c72f93bfa0da83e7"
 *                                              latitude: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              device_name: 
 *                                                  type: string 
 *                                                  example: "Woodford_Sensor"
 *                                              precipitation_mm_per_h: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              time: 
 *                                                  type: string
 *                                                  format: date-time
 *                                                  example: "2021-05-07T01:44:07.000+00:00"
 *                                              longitude: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              temperature_deg_celsius: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              atmospheric_pressure_kPa: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              max_wind_speed_m_per_s: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              solar_radiation_W_per_m2: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              vapor_pressure_kPa: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              humidity: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *                                              wind_direction_deg: 
 *                                                  type: number 
 *                                                  example: "152.77"
 *              '404':
 *                  description: "No results found"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties: 
 *                                  status: 
 *                                      type: number
 *                                      example: 500
 *                                  message: 
 *                                      type: string
 *                                      example: "no readings found on this page"
*/
readingsRouter.get("/max_precipitation/:device_name", maxPrecipitation)



readingsRouter.get("/TARP/:device_name/:date", findTARP)

readingsRouter.get("/temperature/max/range", findMaxTemperature)

/**
 * @openapi
 * /api/readings/page/{page}:
 *      get:
 *          summary: "Get 5 readings from page number "
 *          tags: [Readings]
 *          parameters: 
 *              - name: page 
 *                in: path
 *                description: Page Number
 *                required: true
 *                schema:
 *                  type: string
 *          responses: 
 *              '200':
 *                  description: "Response Object with readings array"
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: integer
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      example: "Get readings"
 *                                  readings:
 *                                      type: array
 *                                      items: 
 *                                         $ref: "#/components/schemas/WeatherReading"
 *              '400':
 *                  description: "No results found"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties: 
 *                                  status: 
 *                                      type: number
 *                                      example: 500
 *                                  message: 
 *                                      type: string
 *                                      example: "no readings found on this page"
*/
readingsRouter.get("/page/:page",getReadingsByPage)

/**
 * @openapi
 * /api/readings:
 *  post:
 *      summary: Add new reading
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      requestBody: 
 *          required: true
 *          content:     
 *             application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/WeatherReading"
 *      responses: 
 *          '200':
 *              description: "Readings successfully created"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: "number"
 *                              message:
 *                                  type: "string"
 *                              readings:
 *                                  $ref: "#/components/schemas/WeatherReading"
 *                          
 */
readingsRouter.post("/",auth(["teacher","sensor"]),createNewReading)

readingsRouter.post("/multiple",auth(["teacher","sensor"]), createMultipleReadings)

readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)

readingsRouter.delete("/delete/multiple", auth(["teacher"]),deleteMultipleReadingsById)

readingsRouter.put("/:id", auth(["teacher"]), patchReadingById)

readingsRouter.patch("/update/many",auth(["teacher"]), patchMultipleReadings)

readingsRouter.patch("/update/precipitation",auth(["teacher"]), updatePrecipitation)

export default readingsRouter