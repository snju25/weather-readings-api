import * as Readings from "../models/readings.js"
import * as Users from "../models/users.js"
import { ObjectId } from 'mongodb'


/**
 * Get all readings from readings collection
 * 
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 */
export const getAllReadings = async(req,res) =>{
    const readings = await Readings.getAll()

    res.status(200).json({
        status: 200,
        message: "Get All sightings",
        readings: readings
    })

}


/**
 * 
 * Get a reading by its ID
 * 
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 */
export const getReadingsById = async (req,res) =>{
    const readingID = req.params.id
    try{
        const reading = await Readings.getById(readingID)
        res.status(200).json({
            status: 200,
            message: "Get readings by ID",
            reading: reading
        })
    }
    catch(err) {
        res.status(500).json({
            status: 500,
            message: "Failed to get an ID with " + readingID
        })

    }

}



/**
 * Get readings by page number 
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const getReadingsByPage = async(req,res) =>{
    const pageSize = 5;
    const page = parseInt(req.params.page)
    try{
        const readings = await Readings.getByPage(page,pageSize)
        res.status(200).json({
            status: 200,
            message: "Get readings by page number",
            readings: readings
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: "Get readings by page number not found",
        })
    }
}


/**
 * Create a new reading in database
 * 
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 */
export const createNewReading = async(req,res) =>{
    const readingData = req.body
    
    const reading = Readings.readings(
        null,
        readingData.device_name,
        readingData.precipitation_mm_per_h,
        readingData.time,
        readingData.longitude,
        readingData.temperature_deg_celsius,
        readingData.atmospheric_pressure_kPa,
        readingData.max_wind_speed_m_per_s,
        readingData.solar_radiation_W_per_m2 ,
        readingData.vapor_pressure_kPa,
        readingData.humidity,
        readingData.wind_direction_deg 
    )

   
    Readings.create(reading).then(reading => {
        res.status(200).json({
            status: 200,
            message: "Reading Created",
            reading: reading
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: "Failed to created readings",
        })
    })
}


export const createMultipleReadings = async (req, res) => {
    const readingsData = req.body;

    // Validate that readingsData is an array
    if (!Array.isArray(readingsData)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid input: Expected an array of readings.",
        });
    }

    // Map each reading data to a Reading instance
    const readings = readingsData.map(readingData => 
         Readings.readings(
            null,
            readingData.device_name,
            readingData.precipitation_mm_per_h,
            readingData.time,
            readingData.longitude,
            readingData.temperature_deg_celsius,
            readingData.atmospheric_pressure_kPa,
            readingData.max_wind_speed_m_per_s,
            readingData.solar_radiation_W_per_m2,
            readingData.vapor_pressure_kPa,
            readingData.humidity,
            readingData.wind_direction_deg
        )
    );

    // Create multiple readings in the database
    Readings.createMany(readings).then(createdReadings => {
        res.status(200).json({
            status: 200,
            message: "Readings created",
            readings: createdReadings
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Failed to create readings",
        });
    });
};




// Update a reading


/**
 * Only teacher can delete reading By ID
 * 
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 * @returns 
 */
export const deleteReadingById = async (req,res) =>{
    const readingID = req.params.id

    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    if(currentUser.role !== "teacher"){
        return 
    }
      // Validate the readingID is a valid 24 character hex string
      if (!ObjectId.isValid(readingID)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }
    try{
        const deleteReadings = await Readings.deleteByID(readingID)

        res.status(200).json({
            status: 200,
            message: "Readings deleted",
            reading: deleteReadings
        })

    }catch(err){
        console.log(err)
        res.status(404).json({
            status: 404,
            message: "Readings with Id "+ readingID + " not found",
        })

    }
   
}

/**
 * Delete multiple reading by their ID 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteMultipleReadingsById = async (req, res) => {
    const readingIDs = req.body.ids; // Assume the request body contains an array of IDs

    const authenticationKey = req.get("X-AUTH-KEY");
    const currentUser = await Users.getByAuthenticationKey(authenticationKey);

    if (currentUser.role !== "teacher") {
        return res.status(403).json({
            status: 403,
            message: "Unauthorized: Only teachers can delete readings.",
        });
    }

    // Validate each readingID is a valid 24 character hex string
    if (!readingIDs.every(id => ObjectId.isValid(id))) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }

    const deleteResult = await Readings.deleteManyByID(readingIDs);

    if (deleteResult.deletedCount === 0) {
        return res.status(404).json({
            status: 404,
            message: `Readings with the provided IDs not found`,
        });
    }

    res.status(200).json({
        status: 200,
        message: "Readings deleted successfully",
    });

 
};
