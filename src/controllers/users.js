import * as Users from "../models/users.js"
import bcrypt from "bcryptjs"

// GET user by id /users/:id

// GET /users/key/:authenticationKey

// POST /users/ 

export const createUser = async (req,res) =>{
    const userData = req.body

    // check if user with that email already exits

    const userAlreadyExists = await Users.getByEmail(userData.email)
    if(userAlreadyExists){
        res.status(409).json({
            status: 409,
            message: "The provided email address is already taken"
        })
        return 
    }

    // hash the password(if not already hashed)

    if(!userData.password.startsWith("$2a")){
        userData.password = bcrypt.hashSync(userData.password)
    }
    // create a user model from user data
    const user = Users.User(
        null,
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.role,
        null
    )

    // create the user in the database

    const userCreated = await Users.create(user)

    res.status(200).json({
        status: 200,
        message: "User created",
        user: userCreated
    })
}

// PATCH /users/

// DELETE /users/:id

