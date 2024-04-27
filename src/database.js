import { MongoClient } from "mongodb";
import * as dotenv from "dotenv"

dotenv.config()

// const connectionString = process.env.MDBURL
const connectionString = process.env.MBURL
// create a new MONGO DB connection client with the URL from the ENV file

const client = new MongoClient(connectionString)

// Select the database to use and export for use by models.
export const db = client.db("example_weather")
