import * as Users from "../models/users.js"
import {v4 as uuid4} from "uuid"
import bcrypt from "bcryptjs"

/**
 * Controller for: POST /auth/login
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const loginUser = async(req,res)=>{
    //Access login data in request
    const loginData = req.body
    const user = await Users.getByEmail(loginData.email)


    if(user){
        if(bcrypt.compareSync(loginData.password, user.password)){
            // generate the API KEy for user
            user.authenticationKey =  uuid4().toString()
            const currentTime = new Date();
            user.lastSession = new Date(currentTime.toISOString())
            const updatedUser = await Users.update(user)

            res.status(200).json({
                status: 200,
                message: "user logged in",
                authenticationKey: user.authenticationKey
            })
        } else {
            // Invalid password error
            res.status(401).json({
                status: 401,
                message: "Invalid Credentials"
            })
        }

    } else {
        // user not found
        res.status(401).json({
            status: 401,
            message: "Invalid Credentials"
        })

    }
}



/**
 * Controller for: POST /auth/logout
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const logoutUser = async (req,res)=>{
    const authenticationKey = req.body.authenticationKey

    // check if the authenticationKey doesn't exist
    if(!authenticationKey){
        return res.status(400).json({
            status: 400,
            message: "Missing Auth Key, can not logout"
        })
    }
    try{
        const userToLogout =  await Users.getByAuthenticationKey(authenticationKey)
        userToLogout.authenticationKey = null
        await Users.update(userToLogout)
        res.status(200).json({
            status: 200,
            message: "Logged out",
        })
    }
    catch(err){
        res.status(404).json({
            status: 404,
            message: "Failed to find user",
        })
    }

}




/**
 * Controller for: POST /auth/register
 * @param {Request} req The Request Object
 * @param {Response} res The Response Object
 */
export const registerUser = async(req,res) =>{
    const userData = req.body

    const userAlreadyExists = await Users.getByEmail(userData.email)

    if(userAlreadyExists){
        res.status(409).json({
            status: 409,
            message: "the provided email address is already associated with an account"
        })
        return 
    }
    // hash the password 
    userData.password = bcrypt.hashSync(userData.password);
    const currentTime = new Date();
     // Convert the user data into an User model object
     const user = Users.User(
        null,
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        "student",
        null,
        currentTime.toISOString(),
        null
    )
     // Use the create model function to insert this user into the DB
     Users.create(user).then(_ => {
        res.status(201).json({
            status: 201,
            message: "Registration successful",
            user: user
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Registration failed",
        })
    })

}