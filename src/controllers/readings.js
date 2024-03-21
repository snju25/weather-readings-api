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
    // const authenticationKey = req.get("X-AUTH_KEY")

    try{
        const reading = await Readings.getById(readingID)
        res.status(200).json({
            status: 200,
            message: "Get readings by ID",
            reading: reading
        })
    }
    catch(err) {
        res.status(404).json({
            status: 404,
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
    const pageNumber = req.params.page

    const pageSize = 5;
    const page = parseInt(req.params.page)
    
    // Validate if the page parameter is an integer
    const isValidPage = Number.isInteger(page)
    if (!isValidPage) {
        return res.status(400).json({ 
            status: 400,
            message: "The page parameter is not an integer" })
    }
    
    const readings = await Readings.getByPage(page,pageSize)
    if(readings.length === 0){
        return res.status(404).json({
            status: 404,
            message: "No readings found for page number " + page + " please try a different page number" 
        })
    }
    res.status(200).json({
        status: 200,
        message: "Get readings by page number",
        readings: readings
    })
   
}


/**
 * Create a new reading in database
 * 
 * @param {Request} req - express request Object
 * @param {Response} res - express response Object
 */
export const createNewReading = async(req,res) =>{
    const readingData = req.body
    const currentTime = new Date();

    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)
    if(currentUser.role !== "teacher"){
        return res.status(403).json({
            status: 403,
            message: "Access Forbidden",
        }); 
    }
    
    const reading = Readings.readings(
        null,
        readingData.latitude,
        readingData.device_name,
        readingData.precipitation_mm_per_h,
        currentTime.toISOString(),
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
        res.status(201).json({
            status: 201,
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


    //------------------------------------------------ validation needed ------------------------//
    

    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    if(currentUser.role !== "teacher"){
        return res.status(403).json({
            status: 403,
            message: "Access Forbidden",
        }); 
    }
    // Validate that readingsData is an array
    if (!Array.isArray(readingsData)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid input: Expected an array of readings.",
        });
    }
      
    const currentTime = new Date();

    // Map each reading data to a Reading instance
    const readings = readingsData.map(readingData => {

       return Readings.readings(
            null,
            readingData.latitude,
            readingData.device_name,
            readingData.precipitation_mm_per_h,
            currentTime.toISOString(),
            readingData.longitude,
            readingData.temperature_deg_celsius,
            readingData.atmospheric_pressure_kPa,
            readingData.max_wind_speed_m_per_s,
            readingData.solar_radiation_W_per_m2 ,
            readingData.vapor_pressure_kPa,
            readingData.humidity,
            readingData.wind_direction_deg 
            )
        }
            );

    // Create multiple readings in the database
    Readings.createMany(readings).then(createdReadings => {
        res.status(201).json({
            status: 201,
            message: "Readings created",
            readings: createdReadings
        });
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to create readings",
        });
    });
};


/**
 * Updates a reading with specified fields
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const patchReadingById = async (req, res) => {
    const readingId = req.params.id;
    const updateFields = req.body;

     // List of allowed field names for the Readings collection
     const allowedFields = [
        'device_name',
        'latitude',
        'longitude',
        'precipitation_mm_per_h',
        'temperature_deg_celsius',
        'atmospheric_pressure_kPa',
        'max_wind_speed_m_per_s',
        'solar_radiation_W_per_m2',
        'vapor_pressure_kPa',
        'humidity',
        'wind_direction_deg',
        // Add any other allowed fields here
    ];
       // Validate the readingID is a valid 24 character hex string
       if (!ObjectId.isValid(readingId)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }

    // Check if all fields in updateFields are allowed
    const invalidFields = Object.keys(updateFields).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            status: 400,
            message: `Invalid field(s) in request body: ${invalidFields.join(', ')}`,
        });
    }
    
  

    
    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    if(currentUser.role !== "teacher"){
        return res.status(403).json({
            status: 403,
            message: "Access Forbidden",
        }); 
    }


    try {
        // check of reading exist by that id if not throw error
        const findReading = await Readings.getById(readingId)
        if(!findReading){
            return res.status(404).json({
                status: 404,
                message: `Readings with with ID ${readingId} is not found in readings collection`
            })
        }
        const updateResult = await Readings.updateReadings(readingId, updateFields);
        res.status(200).json({
            status: 200,
            message: "Reading updated successfully",
            updateResult: updateResult
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: `Reading with ID ${readingId} not found`,
        });
    }
};


/**
 * Updates many reading at once
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const patchMultipleReadings = async (req, res) => {
    const updates = req.body; 


      // List of allowed field names for the Readings collection
      const allowedFields = [
        'latitude',
        'longitude',
        'device_name',
        'precipitation_mm_per_h',
        'temperature_deg_celsius',
        'atmospheric_pressure_kPa',
        'max_wind_speed_m_per_s',
        'solar_radiation_W_per_m2',
        'vapor_pressure_kPa',
        'humidity',
        'wind_direction_deg',
        // Add other allowed fields here
    ];
     // Validate each readingID is a valid 24 character hex string
     if (!updates.every(id => ObjectId.isValid(id))) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }

    // Validate the fields in each update object
    for (const update of updates) {
        const invalidFields = Object.keys(update.fields).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                status: 400,
                message: `Invalid field(s) in request body: ${invalidFields.join(', ')}`,
            });
        }
    } 

    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    if(currentUser.role !== "teacher"){
        return res.status(403).json({
            status: 403,
            message: "Access Forbidden",
        }); 
    }

    try {
        const updateResults = await Readings.updateMultipleReadings(updates);
        const invalidIDExist = updateResults.filter(result => result.matchedCount === 0)
        if(invalidIDExist.length > 0) {
            return res.status(404).json({
               status: 404,
               message: "One of the reading id is incorrect please make sure all the ids are correct" 
            })
        }
        res.status(200).json({
            status: 200,
            message: "Readings updated successfully",
            results: updateResults,
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 400,
            message: "Error updating readings",
        });
    }
};


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
        return res.status(403).json({
            status: 403,
            message: "Access Forbidden",
        }); 
    }
      // Validate the readingID is a valid 24 character hex string
      if (!ObjectId.isValid(readingID)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }
   
        const deleteReadings = await Readings.deleteByID(readingID)
        if(deleteReadings.deletedCount === 0){
            return res.status(404).json({
                status: 404,
                message: "Readings with Id "+ readingID + " not found",
            })
        }
        res.status(200).json({
            status: 200,
            message: "Readings deleted",
            reading: deleteReadings
        })
}

/**
 * Delete multiple reading by their ID 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteMultipleReadingsById = async (req, res) => {
    const readingIDs = req.body.ids; // the request body contains an array of IDs

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
        deleteResult
    });

 
};




// find the maximum precipitation recorded in the last 5 months for a specific sensor

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const maxPrecipitation = async (req,res) =>{
    const sensorName = req.params.device_name


    try{
        const result = await Readings.findMaxPrecipitation(sensorName)
        if (result.length === 0) {
            return res.status(404).json({ 
                status: 404,
                message: `No data found for '${sensorName}' in the last 5 months` });
          }
            // get the max precipitation and the time from the first result
        const { maxPrecipitation, time } = result[0];
    
        res.status(200).json({ 
            status: 200,
            sensorName, 
            maxPrecipitation, 
            time 
        });

    }catch(error){
        console.log(error.message);
        res.status(500).json({ 
            status: 500,
            message: error.message })
    }
    
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const findTARP = async(req,res) =>{
    const device_name = req.params.device_name
    const rawDate = req.params.date

    

    try{
        const result = await Readings.findTARP(device_name,rawDate)

        if (result.length === 0) {
            return res.status(404).json({ 
                status: 404,
                message: `No data found in the provided date range or please check if the Sensor name is correct` 
            });
          }


        const {temperature_deg_celsius,atmospheric_pressure_kPa,solar_radiation_W_per_m2,precipitation_mm_per_h} = result[0]
        res.status(200).json({
            status: 200,
            message: `the temperature, atmospheric pressure, radiation, and precipitation recorded by ${device_name} at ${rawDate}.`,
            temperature_deg_celsius,
            atmospheric_pressure_kPa,
            solar_radiation_W_per_m2,
            precipitation_mm_per_h
        })

    }catch(error){
        res.status(400).json({
            status: 400,
            message: `NO temperature, atmospheric pressure, radiation, and precipitation recorded by ${device_name} at ${rawDate}.`,
        })
    }

}

// Find the maximum temperature recorded across all stations for a given date/time range.


export const findMaxTemperature = async(req,res) =>{
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    // do some validation
    if (!startDate) {
        return res.status(400).json({ message: `startDate is required` });
    }

    if (!endDate) {
        return res.status(400).json({ message: `endDate is required` });
    }
    

    try{
        const result = await Readings.findMaxTemperature(startDate,endDate)
        if (result.length === 0) {
            return res.status(404).json({ 
                status: 404,
                message: `No data found in the provided date range` 
            });
          }
        res.status(200).json({
            status:200,
            message: "Max temperature between " + startDate + " and " + endDate,
            result : result
        })
    }catch(error){
        res.status(400).json({
            status: 400,
            message: `No Data found`,
        })
    }

}

// // to update the precipitation value of a specific document

export const updatePrecipitation = async(req,res)=>{
    const {id, newPrecipitation } = req.body


    //------------------------------------------------ validation needed ------------------------//
       // Validate the readingID is a valid 24 character hex string
       if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid reading ID format.",
        });
    }
    const authenticationKey = req.get("X-AUTH-KEY");
    const currentUser = await Users.getByAuthenticationKey(authenticationKey);
  
    if (currentUser.role !== "teacher") {
      return res.status(401).json({
        status: 401,
        message: "You are not authorised to access this content",
      });
    }

    const isReadingValid = await Readings.getById(id)
    if(!isReadingValid){
        return res.status(404).json({
            status: 404,
            message: "Could not find any ID",
        })
    }

    const result = await Readings.updatePrecipitation(id,newPrecipitation)
    res.status(200).json({
        status: 200,
        message: "Updated precipitation",
        result
    })
  
  
  
  }