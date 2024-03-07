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
    console.log(objectIds)
    return db.collection("readings").deleteMany({ _id: { $in: objectIds } });
};



