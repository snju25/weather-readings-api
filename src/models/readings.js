import { db } from "../database.js";
import { ObjectId } from 'mongodb';




/**
 * Creates a new readings model object
 * 
 * @param {String | ObjectId | null} _id - mongoDB object ID for this readings
 * @param {String | null} device_name 
 * @param {*} precipitation_mm_per_h 
 * @param {*} time 
 * @param {*} longitude 
 * @param {*} temperature_deg_celsius 
 * @param {*} atmospheric_pressure_kPa 
 * @param {*} max_wind_speed_m_per_s 
 * @param {*} solar_radiation_W_per_m2 
 * @param {*} vapor_pressure_kPa 
 * @param {*} humidity 
 * @param {*} wind_direction_deg 
 * @returns 
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
            latitude: parseInt(latitude),
            device_name,
            precipitation_mm_per_h: parseInt(precipitation_mm_per_h),
            time: new Date(time),
            longitude: parseInt(longitude),
            temperature_deg_celsius: parseInt(temperature_deg_celsius),
            atmospheric_pressure_kPa: parseInt(atmospheric_pressure_kPa),
            max_wind_speed_m_per_s: parseInt(max_wind_speed_m_per_s),
            solar_radiation_W_per_m2: parseInt(solar_radiation_W_per_m2),
            vapor_pressure_kPa: parseInt(vapor_pressure_kPa),
            humidity: parseInt(humidity),
            wind_direction_deg: parseInt(wind_direction_deg)
            
        }
    }


/**
 * Get all readings
 * 
 * @returns {Promise<Object[]>} - A promise for the array of all readings objects
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
 * Updates reading
 * 
 * @param {Object} reading 
 * @returns 
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
 * Delete reading by ID
 * 
 * @param {string} id 
 * @returns {Promise<DeleteOneResult>}
 */
export const  deleteByID = async (id) => {
    return db.collection("readings").deleteOne({ _id: new ObjectId(id) })
}


/**
 * Delete multiple readings by their IDs
 * 
 * @param {string[]} ids - Array of reading IDs
 * @returns {Promise<DeleteResult>}
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

export const updatePrecipitation = async(id,NewPrecipitation) =>{
    return db.collection("readings").updateOne({_id: new ObjectId(id)},{$set : {precipitation_mm_per_h: NewPrecipitation}})
}

