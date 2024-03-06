import express from "express"
import readingsRouter from "./routes/readings.js"
// import {db}  from "./database.js"


// Express application instance
const app = express();
const port = 8000;

// CORS middleware

// Parse JSON request body 
app.use(express.json())


// Routes
app.use("/",readingsRouter)


// handle errors raised by endpoints and respond with JSON error object.
app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors
    })
})

// Listen request 

app.listen(port, ()=>{
    console.log("Express server started on http://localhost:8000")
})