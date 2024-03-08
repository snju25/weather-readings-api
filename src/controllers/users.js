import * as Users from "../models/users.js";
import bcrypt from "bcryptjs";

// GET user by id /users/:id

// GET /users/key/:authenticationKey

// POST /users/

export const createUser = async (req, res) => {
  const userData = req.body;

  // check if user with that email already exits

  const userAlreadyExists = await Users.getByEmail(userData.email);
  if (userAlreadyExists) {
    res.status(409).json({
      status: 409,
      message: "The provided email address is already taken",
    });
    return;
  }

  // hash the password(if not already hashed)

  const currentTime = new Date();

  if (!userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }
  // create a user model from user data
  const user = Users.User(
    null,
    userData.email,
    userData.password,
    userData.firstName,
    userData.lastName,
    userData.role,
    null,
    currentTime.toISOString(),
    null
  );

  // create the user in the database

  const userCreated = await Users.create(user);

  res.status(200).json({
    status: 200,
    message: "User created",
    user: userCreated,
  });
};

// PATCH /users/

/**
 * Only teacher can delete reading By ID
 *
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 * @returns
 */
export const deleteUserById = async (req, res) => {
  const userID = req.params.id;
  const authenticationKey = req.get("X-AUTH-KEY");

  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "teacher") {
    return;
  }

  Users.deleteById(userID)
    .then((user) =>
      res.status(200).json({
        status: 200,
        message: "User deleted",
        user: user,
      })
    )
    .catch((err) =>
      res.status(404).json({
        status: 404,
        message: "User not found with ID " + userID,
      })
    );
};

// delete multiple users with role as student from range start to end
export const deleteMultipleUserInRange = async (req, res) => {
  const { startDate, endDate } = req.body;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);
  console.log(currentUser);

  if (currentUser.role !== "teacher") {
    return res.status(400).json({
      status: 200,
      message: "Access Forbidden",
    });
  }

  try {
    const result = await Users.deleteUserWithinRange(startDate, endDate);
    res.status(200).json({
      status: 200,
      message:
        "Deleted Students who logged in between " + startDate + " " + endDate,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "No users found in that range",
    });
  }
};

export const changeUserRoles = async (req, res) => {
  const { startDate, endDate, newRole } = req.body;

  const authenticationKey = req.get("X-AUTH-KEY");
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);

  if (currentUser.role !== "admin") {
    return res.status(401).json({
      status: 401,
      message: "You are not authorised to access this content",
    });
  }
  const validRoles = ["admin", "teacher", "student"];

  // do some validation
  if (!startDate) {
    return res.status(400).json({ message: `startDate is required` });
  }

  if (!endDate) {
    return res.status(400).json({ message: `endDate is required` });
  }

  if (!newRole) {
    return res.status(400).json({ message: `Role is required` });
  }
  // check if the user has given a valid role and throw a 400 if they haven't
  if (!validRoles.includes(newRole)) {
    return res
      .status(400)
      .json({
        message: "Invalid Role! Role must be admin, teacher, or student",
      });
  }

  try{
    const result = await Users.changeUserRoles(startDate,endDate,newRole)
    if(result.modifiedCount === 0){
        return res.status(400).json({
            status: 400,
            message: "No accounts found in that range please provide that range"
        })
    }
    res.status(200).json({
        status: 200,
        message: `${result.modifiedCount} were been modified to the new Role as ${newRole} `
    })
  }catch (error){
    res.status(400).json({
        status: 400,
        message: error
    })
  }
  
};
