import {Router} from "express"
import {loginUser, logoutUser, registerUser} from "../controllers/auth.js"

const authRouter = Router()


// TODO write documentation today

/**
 * @openapi
 * /api/login:
 *  post:
 *      summary: Log in a user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: "saanaj@gmail.com"
 *                          password:
 *                              type: string
 *                              example: "1234"
 *      responses:
 *          '200':
 *              description: User logged in successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              authenticationKey:
 *                                  type: string
 *                                  example: "2a42cdcf-7e35-4b36-bf96-862be15f3300"
 *          '401':
 *              description: Invalid credentials
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
authRouter.post("/login", loginUser)


/**
 * @openapi
 * /api/logout:
 *  post:
 *      summary: Log out a user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - authenticationKey
 *                      properties:
 *                          authenticationKey:
 *                              type: string
 *                              example: "1a400f4f-4482-4220-af11-97453b88d637"
 *      responses:
 *          '200':
 *              description: Logged out successfully
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
 *              description: Failed to find user
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
authRouter.post("/logout", logoutUser)

/**
 * @openapi
 * /api/register:
 *  post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 *      responses:
 *          '201':
 *              description: User registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: number
 *                              message:
 *                                  type: string
 *                              user:
 *                                  type: object
 *              
 *          '409':
 *              description: Email address already taken
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
authRouter.post("/register", registerUser)



export default authRouter