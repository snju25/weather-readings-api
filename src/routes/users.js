import {Router} from "express"
import { changeUserRoles, createUser,deleteMultipleUserInRange,deleteUserById } from "../controllers/users.js"
import auth from "../middleware/auth.js"

const usersRouter = Router()

/**
 * @openapi
 * /api/users:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          '201':
 *              description: User created successfully
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
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
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
usersRouter.post("/",auth(["teacher"]),createUser)

/**
 * @openapi
 * /api/users/{id}:
 *  delete:
 *      summary: Delete a user by ID
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the user to be deleted
 *      responses:
 *          '200':
 *              description: User deleted successfully
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
 *                                  properties:
 *                                      acknowledged:
 *                                          type: boolean
 *                                      deletedCount:
 *                                          type: number
 *          '404':
 *              description: User not found
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
usersRouter.delete("/:id",auth(["teacher"]),deleteUserById)

/**
 * @openapi
 * /api/users/delete/multipleStudents:
 *  delete:
 *      summary: Delete multiple student users within a specified date range
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - startDate
 *                          - endDate
 *                      properties:
 *                          startDate:
 *                              type: string
 *                              format: date
 *                              description: Start date of the range (inclusive)
 *                          endDate:
 *                              type: string
 *                              format: date
 *                              description: End date of the range (inclusive)
 *      responses:
 *          '200':
 *              description: Users deleted successfully
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
 *              description: No users found in the specified range
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
usersRouter.delete("/delete/multipleStudents",auth(["teacher"]),deleteMultipleUserInRange)

/**
 * @openapi
 * /api/users/update/roles:
 *  patch:
 *      summary: Update roles of users within a specified date range
 *      tags: [Users]
 *      security:
 *          - ApiKey: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - startDate
 *                          - endDate
 *                          - newRole
 *                      properties:
 *                          startDate:
 *                              type: string
 *                              format: date
 *                              description: Start date of the range (inclusive)
 *                          endDate:
 *                              type: string
 *                              format: date
 *                              description: End date of the range (inclusive)
 *                          newRole:
 *                              type: string
 *                              description: New role to assign to users in the specified range
 *      responses:
 *          '200':
 *              description: Roles updated successfully
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
 *              description: No accounts found in the specified range
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
usersRouter.patch("/update/roles",auth(["teacher"]),changeUserRoles)


export default usersRouter

