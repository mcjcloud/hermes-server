const env = require('./env');
// client to connect to mongodb instance
let mongoClient = require('mongodb').MongoClient;

/**
 * create a connection to the mongodb
 * @returns {Promise} with a mongodb connection
 */
function createConnection() {
    return new Promise((resolve, reject) => {
        // connect to mongodb
        mongoClient.connect(
            `mongodb://${env.DB_USERNAME}:${encodeURIComponent(env.DB_PASSWORD)}@hermesdb.documents.azure.com:${env.DB_PORT}/?ssl=true`, 
            (err, connection) => {
                if (err) reject(err);
                else resolve(connection);
            }
        );
    });
}

/**
 * add a user to the database
 * @param {object} user the user object
 */
function createUser(user) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .insertOne(user, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * update a user with the given user_id
 * @param {string} user_id the id of the user to update
 * @param {object} user the data to update
 * @returns {Promise} containing the result of the operation
 */
function updateUser(user_id, user) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .update({ user_id }, { $set: user }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * fetch a user with a given id
 * @param {string} user_id the id the user to fetch
 * @returns {Promise} containing the result
 */
function getUser(user_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .find({ user_id })
        .toArray((err, arr) => {
            if (err) reject(err);
            else resolve(arr.length > 0 ? arr[0] : undefined);
            conn.close();
        });
    }));
}

function getUsers() {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .find({})
        .toArray((err, arr) => {
            if (err) reject(err);
            else resolve(arr);
            conn.close();
        });
    }));
}

/**
 * return all users on a given flight
 * @param {string} flight_id the id of the flight to filter by
 * @returns {Promise} with the users on the flight
 */
function getUsersByFlightId(flight_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .find({ flight_id })
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * create a bag object in the database
 * @param {string} bag the bag object to add to the server
 * @returns {Promise} containing a the response from the server
 */
function createBag(bag) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        let db = conn.db(env.DB_NAME);
        db.collection('bags').insertOne(bag, (err, res) => {
            if (err) reject(err);
            else resolve(res);
            conn.close();
        });
    }));
}

/**
 * update a bag with the given name
 * @param {string} bag_id the id of the bag to update
 * @param {string} bag the bag object to merge into the database
 * @returns {Promise} containing the result
 */
function updateBag(bag_id, bag) {
    console.log('updat: ', bag);
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        let db = conn.db(env.DB_NAME);
        db.collection('bags')
        .update({ bag_id: bag_id }, { $set: bag }, { multi: true }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
            conn.close();
        });
    }));
}

/**
 * add bags to a user object
 * @param {string} user_id the user to add the bags to
 * @param {array} bag_ids the bag ids to add
 */
function addBagsToUser(user_id, bag_ids) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('users')
        .update({ user_id }, { $push: { bags: { $each: bag_ids } } }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * get all of the bags
 * @returns {Promise} containing an array of bags
 */
function getBags() {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('bags')
        .find({})
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * fetch a bag by its bag_id
 * @param {string} bag_id the id of the bag to get
 * @returns {Promise} with a bag if it exists
 */
function getBag(bag_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('bags')
        .find({ bag_id })
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result.length > 0 ? result[0] : undefined);
            conn.close();
        });
    }));
}

/**
 * find all bags with a given user
 * @param {string} user_id the user to filter by
 * @returns {Promise} with bag array
 */
function getBagsByUserId(user_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('bags')
        .find({ 'user_id': user_id })
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * create a flight object in the database
 * @param {object} flight the flight object to create
 * @returns {Promise} with result of operation
 */
function createFlight(flight) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('flights')
        .insertOne(flight, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * update a flight object
 * @param {string} flight_id the id of the flight to update
 * @param {object} flight the flight data
 * @returns {Promise} with result of operation
 */
function updateFlight(flight_id, flight) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('flights')
        .update({ flight_id }, { $set: flight }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * add the given bag_ids to the flight with the given flight_id
 * @param {string} flight_id the id of the flight to add bags to
 * @param {array} user_ids an array of bag ids
 * @returns {Promise} with result of operation
 */
function addUsersToFlight(flight_id, user_ids) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('flights')
        .update({ flight_id }, { $push: { users: { $each: user_ids } } }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * get all flights
 * @returns {Promise} with array of flight objects
 */
function getFlights() {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('flights')
        .find({})
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * get a flight by its id
 * @param {string} flight_id the id of the flight to fetch
 */
function getFlight(flight_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('flights')
        .find({ flight_id })
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result.length > 0 ? result[0] : undefined);
        });
    }));
}

/**
 * create a scanner in the database
 * @param {object} scanner the scanner to create
 */
function createScanner(scanner) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('scanners')
        .insertOne(scanner, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    }));
}

/**
 * update scanner data
 * @param {string} scanner_id the scanner id
 * @param {object} scanner the new scanner
 */
function updateScanner(scanner_id, scanner) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('scanners')
        .update({ scanner_id }, { $set: scanner }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * add a scanner id to a bag
 * @param {string} scanner_id the scanner id
 * @param {string} bag_id the bag id
 */
function addScannerToBag(scanner_id, bag_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('bags')
        .update({ bag_id }, { $addToSet: { scanners: scanner_id } }, { multi: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
            conn.close();
        });
    }));
}

/**
 * get a scanner by id
 * @param {string} scanner_id the scanner to get
 */
function getScanner(scanner_id) {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('scanners')
        .find({ scanner_id })
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result.length > 0 ? result[0] : undefined);
        });
    }));
}

/**
 * get all scanners
 */
function getScanners() {
    return createConnection()
    .then(conn => new Promise((resolve, reject) => {
        const db = conn.db(env.DB_NAME);
        db.collection('scanners')
        .find({})
        .toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    }));
}

module.exports = {
    createConnection,

    createUser,
    updateUser,
    getUsers,
    getUser,
    getUsersByFlightId,

    createBag,
    updateBag,
    addBagsToUser,
    getBags,
    getBag,
    getBagsByUserId,

    createFlight,
    updateFlight,
    addUsersToFlight,
    getFlights,
    getFlight,

    createScanner,
    updateScanner,
    addScannerToBag,
    getScanner,
    getScanners,
};
