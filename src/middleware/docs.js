import {Router} from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import * as OpenApiValidator from "express-openapi-validator"

const docs = Router()
console.log("asd")

const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Weather Readings API",
            description: "JSON REST API for Weather Readings"
        },
        components: {
            securitySchemes: {
                ApiKey: {
                    type: "apiKey",
                    in: "header",
                    name: "X-AUTH-KEY"
                }
            }
        }
    },
    apis: ["./src/routes/*.{js,yaml}", "./src/components.yaml", "./src/middleware/docs.js"]


}

const specification = swaggerJSDoc(options)

// server that specification using swaggerUI specification - this will serve an interactive webpage that documents our API based on the 
// specification generate above


/**
 * @openapi 
 * /docs:
 *  get: 
 *      summary: "View automatically generated API documentation"
 *      responses: 
 *          "200":
 *              description: "Swagger documentation page"
 */
docs.use("/docs",swaggerUi.serve, swaggerUi.setup(specification))

// setup OpenAPI validator - this will automatically check that every rote 
// adheres to the documentation (i.e will validate every request and response)

docs.use(
    OpenApiValidator.middleware({
        apiSpec: specification,
        validateRequests: true,
        validateResponses: true,
    })
)

export default docs
