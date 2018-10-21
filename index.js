const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {
    createBag,
    updateBag,
    getBag,
    getBags,
    getBagsByUserId,

    createUser,
    updateUser,
    getUser,
    getUsers,
    getUsersByFlightId,

    createFlight,
    updateFlight,
    getFlight,
    getFlights,

    createScanner,
    updateScanner,
    addScannerToBag,
    getScanner,
    getScanners,
} = require('./database');

let PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/**
 * get a user or list of users
 */
app.get('/users/:user_id?', (req, res) => {
    const user_id = req.params.userId;
    const flight_id = req.params.flightId
    if (user_id) {
        getUser(user_id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        })
    }
    else if (flight_id) {
        getUsersByFlightId(flight_id)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        getUsers()
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

/**
 * add or update a user
 */
app.post('/users/:user_id?', (req, res) => {
    const user_id = req.params.user_id;
    if (user_id) {
        // update the user
        updateUser(user_id, req.body)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        })
    }
    else {
        // create a new user
        createUser(req.body)
        .then(data => res.json(data))
        .catch(err => res.status(400).send(err));
    }
});

/**
 * get all bags or a single bag
 */
app.get('/bags/:bag_id?', (req, res) => {
    const user_id = req.params.user_id;
    if (req.params.bag_id) {
        getBag(req.params.bag_id)
        .then((bag) => res.json(bag))
        .catch((err) => res.status(400).send(err));
    }
    else if (user_id) {
        getBagsByUserId(user_id)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        getBags()
        .then(bags => res.json(bags))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err)
        });
    }
});

/**
 * add a bag to the server, updating it if it already exists
 */
app.post('/bags/:bag_id?', (req, res) => {
    const bag = req.body.bag;
    const bag_id = req.params.bag_id;

    console.log('data: ', JSON.stringify(req.body));

    // if a bag id is given, update that bag
    if (!!bag_id) {
        getBag(bag_id)
        .then(res => {
            // if the bag exists, update it, otherwise create it
            if (!!res) {
                return updateBag(bag_id, bag);
            }
            else {
                return createBag(bag);
            }
        })
        .then(result => {
            return addScannerToBag(req.body.scanner_id, bag_id);
        })
        .then(result => res.json(result))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    // otherwise create the bag
    else {
        createBag(bag)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

/**
 * get a flight or flights
 */
app.get('/flights/:flight_id?', (req, res) => {
    const flight_id = req.params.flight_id;
    if (flight_id) {
        getFlight(flight_id)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        getFlights()
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

/**
 * add a flight or update a flight
 */
app.post('/flights/:flight_id?', (req, res) => {
    const flight_id = req.params.flight_id;
    if (flight_id) {
        updateFlight(flight_id, req.body)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        createFlight(req.body)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

/**
 * get scanner(s) from the database
 */
app.get('/scanners/:scanner_id?', (req, res) => {
    const scanner_id = req.params.scanner_id;
    if (scanner_id) {
        getScanner(scanner_id)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        getScanners()
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

/**
 * post a scanner to the database
 */
app.post('/scanners/:scanner_id?', (req, res) => {
    const scanner_id = req.params.scanner_id;
    if (scanner_id) {
        updateScanner(scanner_id, req.body)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
    else {
        createScanner(req.body)
        .then(data => res.json(data))
        .catch(err => {
            console.log('ERR: ', err);
            res.status(400).send(err);
        });
    }
});

function server() {
    app.listen(PORT, () => {
        console.log('listening: ', PORT);
    })
    .on('error', () => {
        PORT += 1;
        console.log('addr in use.');
        server();
    });
}
server();

