import * as Readings from "../models/readings.js"



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
        readings
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
            reading
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


// post /readings

// delete /readings/:id