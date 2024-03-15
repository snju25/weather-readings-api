import {Router } from "express"
import { getAllReadings, getReadingsByPage,getReadingsById, createNewReading, deleteReadingById,createMultipleReadings, deleteMultipleReadingsById, patchReadingById, patchMultipleReadings, maxPrecipitation, findTARP, findMaxTemperature, updatePrecipitation } from "../controllers/readings.js"
import auth from "../middleware/auth.js"


const readingsRouter = Router()

// TODO: Docs
// TODO: Auth middleware


// readingsRouter.get("/",getAllReadings)


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


/**
 * @openapi
 * /api/readings/TARP/{device_name}/{date}:
 *  get:
 *      summary: Get TARP readings for a specific device and date
 *      tags: [Readings]
 *      parameters:
 *        - in: path
 *          name: device_name
 *          required: true
 *          schema:
 *            type: string
 *          description: Name of the device
 *        - in: path
 *          name: date
 *          required: true
 *          schema:
 *            type: string
 *            format: date-time
 *          description: Date of the readings in ISO format
 *      responses:
 *          '200':
 *              description: TARP readings retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                                  example: 200
 *                              message:
 *                                  type: string
 *                                  example: "The TARP recorded at Date"
 *                              temperature_deg_celsius:
 *                                  type: number
 *                                  example: 152
 *                              atmospheric_pressure_kPa:
 *                                  type: number
 *                                  example: 152
 *                              solar_radiation_W_per_m2:
 *                                  type: number
 *                                  example: 152
 *                              precipitation_mm_per_h:
 *                                  type: number
 *                                  example: 152
 *          '400':
 *              description: Invalid input parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '404':
 *              description: No readings found for the specified device and date
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '500':
 *              description: Server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 */
readingsRouter.get("/TARP/:device_name/:date", findTARP)

/**
 * @openapi
 * /api/readings/temperature/max/range:
 *  get:
 *      summary: Get the maximum temperature readings within a date range
 *      tags: [Readings]
 *      parameters:
 *        - in: query
 *          name: startDate
 *          required: true
 *          schema:
 *            type: string
 *            format: date
 *          description: Start date of the range in YYYY-MM-DD format
 *        - in: query
 *          name: endDate
 *          required: true
 *          schema:
 *            type: string
 *            format: date
 *          description: End date of the range in YYYY-MM-DD format
 *      responses:
 *          '200':
 *              description: Maximum temperature readings retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              result:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                          maxTemperature:
 *                                              type: number
 *                                          readingDate:
 *                                              type: string
 *                                              format: date-time
 *                                          device_name:
 *                                              type: string
 *          '400':
 *              $ref: '#/components/responses/400_InvalidRequest'
 * 
 *          '404':
 *              description: No readings found for the specified device and date
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
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
 *          '201':
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
 *          '500':
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                          example:
 *                              status: 500
 *                              message: "error creating readings"
 *                          
 */
readingsRouter.post("/",auth(["teacher","sensor"]),createNewReading)

/**
 * @openapi
 * /api/readings/multiple:
 *  post:
 *      summary: Add multiple new readings
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      requestBody: 
 *          required: true
 *          content:     
 *             application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: "#/components/schemas/WeatherReading"
 *      responses: 
 *          '201':
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
 *                                  type: object
 * 
 *          '500':
 *              description: Database error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                          example:
 *                              status: 500
 *                              message: "Error creating multiple readings"
 */
readingsRouter.post("/multiple",auth(["teacher","sensor"]), createMultipleReadings)


/**
 * @openapi
 * /api/readings/{id}:
 *  delete:
 *      summary: Delete a reading by its ID
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the reading to be deleted
 *      responses:
 *          '200':
 *              description: Reading deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              reading:
 *                                  type: object
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
 *                                      deletedCount:
 *                                          type: number
 *          '404':
 *              description: Reading not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '400': 
*               $ref: '#/components/responses/400_InvalidRequest'
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
readingsRouter.delete("/:id", auth(["teacher"]),deleteReadingById)

/**
 * @openapi
 * /api/readings/delete/multiple:
 *  delete:
 *      summary: Delete multiple readings by their IDs
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ids:
 *                              type: array
 *                              items:
 *                                  type: string
 *                      example:
 *                          ids: ["65b99b98c72f93bfa0da83e6", "65b99b98c72f93bfa0da83e5"]
 *      responses:
 *          '200':
 *              description: Readings deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              deleteResult:
 *                                  type: object
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
 *                                      deletedCount:
 *                                          type: number
 *          '404':
 *              description: Readings with the provided IDs not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '400': 
 *               $ref: '#/components/responses/400_InvalidRequest'
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
readingsRouter.delete("/delete/multiple", auth(["teacher"]),deleteMultipleReadingsById)

/**
 * @openapi
 * /api/readings/{id}:
 *  put:
 *      summary: Update a reading by its ID
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the reading to be updated
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          device_name:
 *                              type: string
 *                      example:
 *                          device_name: "Nambour_Sensor"
 *      responses:
 *          '200':
 *              description: Reading updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              updateResult:
 *                                  type: object
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
 *                                      modifiedCount:
 *                                          type: number
 *                                      upsertedId:
 *                                          type: string
 *                                          nullable: true
 *                                      upsertedCount:
 *                                          type: number
 *                                      matchedCount:
 *                                          type: number
 *          '404':
 *              description: Reading with the specified ID not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '400': 
*               $ref: '#/components/responses/400_InvalidRequest'
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
readingsRouter.put("/:id", auth(["teacher"]), patchReadingById)


/**
 * @openapi
 * /api/readings/update/many:
 *  patch:
 *      summary: Update multiple readings
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                              fields:
 *                                  type: object
 *                                  properties:
 *                                      latitude:
 *                                          type: number
 *                                      humidity:
 *                                          type: number
 *                                      # Add other properties from the schema as needed
 *                          required:
 *                              - id
 *                              - fields
 *      responses:
 *          '200':
 *              description: Readings updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              results:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          acknowledged:
 *                                              type: boolean
 *                                          modifiedCount:
 *                                              type: number
 *                                          upsertedId:
 *                                              type: string
 *                                              nullable: true
 *                                          upsertedCount:
 *                                              type: number
 *                                          matchedCount:
 *                                              type: number
 *          '404':
 *              description: One of the reading IDs is incorrect
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '400': 
*               $ref: '#/components/responses/400_InvalidRequest'
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
readingsRouter.patch("/update/many",auth(["teacher"]), patchMultipleReadings)


/**
 * @openapi
 * /api/readings/update/precipitation:
 *  patch:
 *      summary: Update the precipitation value of a reading
 *      tags: [Readings]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - id
 *                          - newPrecipitation
 *                      properties:
 *                          id:
 *                              type: string
 *                              description: ID of the reading to be updated
 *                          newPrecipitation:
 *                              type: number
 *                              description: New precipitation value
 *      responses:
 *          '200':
 *              description: Updated precipitation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              result:
 *                                  type: object
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
 *                                      modifiedCount:
 *                                          type: number
 *                                      upsertedId:
 *                                          type: string
 *                                          nullable: true
 *                                      upsertedCount:
 *                                          type: number
 *                                      matchedCount:
 *                                          type: number
 *          '404':
 *              description: Reading with the specified ID not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *          '400': 
 *              $ref: '#/components/responses/400_InvalidRequest'
 *          '500':
 *              $ref: '#/components/responses/500_DatabaseError'
 */
readingsRouter.patch("/update/precipitation",auth(["teacher"]), updatePrecipitation)

export default readingsRouter

// fc545c47-6eed-4ba2-9d22-386e626e91bc