import { db } from "../database.js";
import { ObjectId } from 'mongodb';

/**
 * Create a new user model object
 *
 * @export
 * @param {String | ObjectId | null} _id - mongoDB object ID for this user
 * @param {String} email - email address associated with the user account (used for login)
 * @param {String} password - password associated with the user account (used for login) 
 * @param {String} roles - access role for use by authorisation logic
 * @param {String} firstName - firstName associated with the user account
 * @param {String} lastName - lastName associated with the user account
 * @param {String} authenticationKey - key used to authenticate user requests
 */
export const User = (
    _id,
    email,
    password,
    firstName,
    lastName,
    role,
    authenticationKey
) => {
    return {
        _id,
        email,
        password,
        firstName,
        lastName,
        role,
        authenticationKey
    }
}

/**
 * Insert the provided user into the database
 *
 * @export
 * @async
 * @param {Object} user - user to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export const create = async(user) => {
    // Clear _id from user to ensure the new user does not 
    // have an existing _id from the database, as we want a new _id
    // to be created and added to the user object.
    delete user.id

    // Insert the user document and implicitly add the new _id to user 
    return db.collection("users").insertOne(user)
}

/**
 * Get a specific user by their ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB ObjectId of the user to get
 * @returns {Promise<Object>} - A promise for the matching user
 */
export const getById = async (id) => {
    // attempt to find the first matching user by id
    let user = await db.collection("users").findOne({ _id: new ObjectId(id) })

    // check if a user was found and handle the result
    if (user) {
        return user
    } else {
        return Promise.reject("user not found with id " + id)
    }
}

/**
 * Get a specific user by their email address
 *
 * @export
 * @async
 * @param {ObjectId} email - email address of the user
 * @returns {Promise<Object>} - A promise for the matching user
 */
export const getByEmail = async (email) => {
    // attempt to find the first matching user by email
    let user = await db.collection("users").findOne({ email: email })

    // check if a user was found and handle the result
    if (user) {
        return user
    } else {
        return null
    }
}

/**
 * Get a specific user by their authentication key
 *
 * @export
 * @async
 * @param {ObjectId} key - authentication key
 * @returns {Promise<Object>} - A promise for the matching user
 */
export const getByAuthenticationKey = async (key) => {
    // attempt to find the first matching user by authentication key
    let user = await db.collection("users").findOne({ authenticationKey: key })

    // check if a user was found and handle the result
    if (user) {
        return user
    } else {
        // do not return authentication key in error for security reasons
        return Promise.reject("user not found")
    }
}

/**
 * Update the provided user in the database
 *
 * @export
 * @async
 * @param {Object} user - user to update
 * @returns {Promise<UpdateResult>} - The result of the update operation
 */
export const update = async (user) => {
    // update the user by replacing the user by id
    
    // Copy user and delete ID from it
    const userWithoutId = { ...user }
    delete userWithoutId._id

    return db.collection("users").replaceOne({ _id: new ObjectId(user._id) }, userWithoutId)
}


/**
 * Delete a specific user by their ObjectId
 *
 * @export
 * @async
 * @param {ObjectId} id - mongoDB ObjectId of the user to delete
 * @returns {Promise<DeleteResult>} - The result of the delete operation
 */
export const deleteById = async(id) => {
    return db.collection("users").deleteOne({ _id: new ObjectId(id) })
}

/**
 * Get all users
 *
 * @export
 * @async
 * @returns {Promise<Object[]>} - A promise for the array of all users 
 */
export const getAll = async() => {
    // Get the collection of all users
    return db.collection("users").find().toArray()
}



