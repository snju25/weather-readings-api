import * as Readings from "../models/readings.js"
import * as Users from "../models/users.js"



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
 * Get /readings/:id
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


//readings/:page

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
    })
}


// Update a reading




// delete /readings/:id

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

    if(currentUser !== "teacher"){
        return 
    }
    const deleteReadings = await Readings.deleteByID(readingID)

    res.status(200).json({
        status: 200,
        message: "Sighting deleted",
        reading: deleteReadings
    })
}