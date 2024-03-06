import { MongoClient } from "mongodb";
import * as dotenv from "dotenv"

dotenv.config()

// const connectionString = process.env.MDBURL
const connectionString = "mongodb+srv://sanjay25:Radha25@nodeexpressprojects.kbqhrrh.mongodb.net/?proxyHost=mongodb.bypass.host&proxyPort=80&proxyUsername=student&proxyPassword=student"
// create a new MONGO DB connection client with the URL from the ENV file

const client = new MongoClient(connectionString)

// Select the database to use and export for use by models.
export const db = client.db("example_weather")
