import { db } from "../database.js";
import { ObjectId } from 'mongodb';




/**
 * Creates a new readings model object.
 * 
 * @param {String | ObjectId | null} _id - MongoDB object ID for this reading.
 * @param {Number | null} latitude - Latitude of the sensor location.
 * @param {String | null} device_name - Name of the sensor device.
 * @param {Number | null} precipitation_mm_per_h - Precipitation in millimeters per hour.
 * @param {String | null} time - Timestamp of the reading in ISO format.
 * @param {Number | null} longitude - Longitude of the sensor location.
 * @param {Number | null} temperature_deg_celsius - Temperature in degrees Celsius.
 * @param {Number | null} atmospheric_pressure_kPa - Atmospheric pressure in kilopascals.
 * @param {Number | null} max_wind_speed_m_per_s - Maximum wind speed in meters per second.
 * @param {Number | null} solar_radiation_W_per_m2 - Solar radiation in watts per square meter.
 * @param {Number | null} vapor_pressure_kPa - Vapor pressure in kilopascals.
 * @param {Number | null} humidity - Humidity percentage.
 * @param {Number | null} wind_direction_deg - Wind direction in degrees.
 * @returns {Object} - The new readings model object.
 */
export const readings = (
    _id,
    latitude,
    device_name,
    precipitation_mm_per_h,
    time,
    longitude,
    temperature_deg_celsius,
    atmospheric_pressure_kPa,
    max_wind_speed_m_per_s,
    solar_radiation_W_per_m2 ,
    vapor_pressure_kPa,
    humidity,
    wind_direction_deg 
    
    ) => {
        return {
            _id: new ObjectId(_id),
            latitude: parseFloat(latitude),
            device_name,
            precipitation_mm_per_h: parseFloat(precipitation_mm_per_h),
            time: new Date(time),
            longitude: parseFloat(longitude),
            temperature_deg_celsius: parseFloat(temperature_deg_celsius),
            atmospheric_pressure_kPa: parseFloat(atmospheric_pressure_kPa),
            max_wind_speed_m_per_s: parseFloat(max_wind_speed_m_per_s),
            solar_radiation_W_per_m2: parseFloat(solar_radiation_W_per_m2),
            vapor_pressure_kPa: parseFloat(vapor_pressure_kPa),
            humidity: parseFloat(humidity),
            wind_direction_deg: parseFloat(wind_direction_deg)
            
        }
    }


/**
 * Get all readings.
 * 
 * Retrieves all readings from the 'readings' collection in the database.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of readings objects.
 */   
export const getAll = async() =>{
    return db.collection('readings').find().toArray()
}


/**
 * Creates a new reading in readings collection.
 * 
 * @param {Object} sighting - the sighting to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export const create = async(reading) =>{
    delete reading._id

    return db.collection("readings").insertOne(reading)
}

/**
 * Insert the provided readings into the database
 *
 * @export
 * @async
 * @param {Object[]} readings - the readings to insert
 * @returns {Promise<InsertOneResult>} - The result of the insert operation
 */
export async function createMany(readings) {
    // Clear _id from sightings to ensure the new sightings do not 
    // have existing _ids from the database, as we want new _ids
    // to be created and added to the sighting objects.
    for (const reading of readings) {
        delete reading.id
    }

    // Insert the sighting document and implicitly add the new _id to sighting
    return db.collection("readings").insertMany(readings)
}

/**
 * Get paginated sightings 
 *
 * @export
 * @async
 * @param {*} page - the page number (1 indexed)
 * @param {*} size - the number of documents per page
 * @returns {Promise<Object[]>} - A promise for the array of sightings on the specified page
 */
export const getByPage = async(page, size) => {
    // Calculate page offset
    const offset = (page + 1) * size

    return db.collection("readings").find().skip(offset).limit(size).toArray()
}



/**
 * Get a specific reading by its ObjectID
 * 
 * @param {ObjectId} id - mongoDB ObjectId of the reading to get
 * @returns {Promise<ObjectId>} - A promise for the matching reading
*/
export const getById = async(id) =>{
    const reading = await db.collection("readings").findOne({_id: new ObjectId(id)})
    
    if(reading){
        return reading
    } else {
        return Promise.reject("Reading not found with id " + id)
    }
}


/**
 * Update a specific reading in the database.
 * 
 * @param {string} id - The ID of the reading to update.
 * @param {Object} updateFields - An object containing the fields to update.
 * @returns {Promise<UpdateWriteOpResult>} - A promise that resolves to the result of the update operation.
 */
export const updateReadings = async (id, updateFields) =>{
    return db.collection("readings").updateOne({_id: new ObjectId(id)}, {$set : updateFields });
};


/**
 * Updates multiple readings with different fields
 * 
 * @param {Array} updates - An array of objects, each containing a filter and the fields to update
 * @returns {Promise<Array>} - A promise that resolves to an array of update results
 */
export const updateMultipleReadings = async (updates) => {
    const results = [];
    for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const result = await db.collection("readings").updateOne({_id: new ObjectId(update.id)}, { $set: update.fields });
        results.push(result);
    }
    return results;
};


/**
 * Delete a specific reading from the database by its ID.
 * 
 * @param {string} id - The ID of the reading to delete.
 * @returns {Promise<DeleteResult>} - A promise that resolves to the result of the delete operation.
 */
export const  deleteByID = async (id) => {
    return db.collection("readings").deleteOne({ _id: new ObjectId(id) })
}


/**
 * Delete multiple readings by their IDs
 * 
 * @param {string[]} ids - Array of reading IDs
 * @returns {Promise<DeleteResult>} - A promise that resolves to the result of the delete operation.
 */
export const deleteManyByID = async (ids) => {
    const objectIds = ids.map(id => new ObjectId(id)); // Convert each id to an ObjectId
    return db.collection("readings").deleteMany({ _id: { $in: objectIds } });
};




/**
 * Finds the max precipitation in a given sensor in last 5 months
 * 
 * @param {string} sensorName - The name of the sensor
 * @returns {Promise<Object>} - An object containing the sensor name, reading date/time, and max precipitation value
 */
export const findMaxPrecipitation = async (sensorName) => {

    // Get the date 5 months ago
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5); 

    const result = await db.collection("readings").aggregate([
        { 
            $match: {
                device_name: sensorName, 
                time: { $gte: fiveMonthsAgo }
            }
        },
        { 
            $group: {
                _id: "$device_name", 
                maxPrecipitation: { $max: "$precipitation_mm_per_h" },
                time: { $last: "$time" }
            }
        },
    ]).toArray()
    return result
  
};


  

// Find the temperature, atmospheric pressure, radiation, and precipitation recorded by a specific station at a given date and time. 

/**
 * Finds the temperature, atmospheric pressure, radiation, and precipitation recorded by a specific station at a given date and time.
 * 
 * @param {String} sensorName - Sensor Name 
 * @param {String} rawDate - Given date and time 
 * @returns an array of with reading
 */
export const findTARP = async(sensorName, rawDate) =>{

    // convert the provided date to a Date object so it can be used in the query
    const date = new Date(rawDate)

    // query to get readings from a sensor on the provided date
    const result = await db.collection("readings").aggregate([
        { 
            $match: {
                device_name: sensorName, 
                time: { $eq: date } 
                } 
        }
    ]).toArray();

    return result
}



//    Find the maximum Temp(C) recorded for all stations for a given Date / Time range (start and finish date) returning the Sensor Name, reading date / time and the Temperature value: 

/**
 * Find the maximum temperature recorded across all stations for a given date/time range.
 * 
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Object>} - An object containing the sensor name, reading date/time, and the temperature value.
 */
export const findMaxTemperature = async (startDate, endDate) => {
        const result = await db.collection("readings").aggregate([
            {
                $match: {
                    time: { 
                        $gte: new Date(startDate), 
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: "$device_name",
                    maxTemperature: { $max: "$temperature_deg_celsius" },
                    readingDate: { $first: "$time" }
                }
            },
            {
                $project: {
                    _id: 1,
                    device_name: "$_id",
                    maxTemperature: 1,
                    readingDate: 1
                }
            },
            { 
                $sort: { maxTemperature: -1 } 
            }
        ]).toArray();
    
        return result;
    
};

// to update the precipitation value of a specific document
/**
 * Update the precipitation value of a specific reading in the database.
 * 
 * @param {string} id - The ID of the reading to update.
 * @param {number} newPrecipitation - The new precipitation value in millimeters per hour.
 * @returns {Promise<UpdateWriteOpResult>} - A promise that resolves to the result of the update operation.
 */
export const updatePrecipitation = async(id,NewPrecipitation) =>{
    return db.collection("readings").updateOne({_id: new ObjectId(id)},{$set : {precipitation_mm_per_h: NewPrecipitation}})
}

