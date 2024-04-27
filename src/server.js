import express from "express"
import readingsRouter from "./routes/readings.js"
import usersRouter from "./routes/users.js"
import authRouter from "./routes/auth.js"
import docs from "./middleware/docs.js"
import cors from "cors"

// fetch("http://localhost:8000/api/readings/65f3ece6b4a57334944c1498",{
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json"
//     }
// }).then(res => res.json()).then(data => console.log(data)) 

// fetch("http://localhost:8000/api/readings/",{
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({})
// }).then(res => res.json()).then(data => console.log(data)) 

// fetch("http://localhost:8000/api/readings/65f3ece6b4a57334944c1498",{
//     method: "PUT",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({})
// }).then(res => res.json()).then(data => console.log(data)) 

// fetch("http://localhost:8000/api/readings/65f3ece6b4a57334944c1498",{
//     method: "DELETE",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({})
// }).then(res => res.json()).then(data => console.log(data)) 

// Express application instance
const app = express();
const port = 8000;

// CORS middleware
app.use(cors({
    origin: true
}))

// Parse JSON request body 
app.use(express.json())


// Routes
app.use(docs)
app.use("/api/readings",readingsRouter)
app.use("/api/users",usersRouter)
app.use("/api/",authRouter)


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