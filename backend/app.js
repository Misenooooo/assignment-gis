// call the packages we need
let express    = require('express');        // call express
let app        = express();                 // define our app using express
let bodyParser = require('body-parser');
let pg = require('pg');

let death = require('death'); // Gonna catch them all!!!

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8083;        // set our port



// START THE SERVER
// =============================================================================

let client = new pg.Client({
  user: 'dbs',
  host: 'localhost',
  database: 'dbs',
  password: 'dbs',
  port: 5432
});

(async function () {
  await client.connect();
})();

death(async function(signal, err) {
  //clean up code here
  console.log('Death!!!');
  await client.end();
});

let router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8083/api)
router.get('/', async function(req, res) {
  try {
    let func = async function () {
      return await client.query('SELECT NOW()');
    };
    let result = await func();
    res.json({message: result});
  } catch (err) {
    res.error(500);
  }
});

// ROUTES FOR OUR API
// =============================================================================

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
