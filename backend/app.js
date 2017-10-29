let express    = require('express');
let app        = express();
let bodyParser = require('body-parser');
let pg = require('pg');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8085;        // set  port

let client = new pg.Client({
  user: 'dbs',
  host: 'localhost',
  database: 'dbs',
  password: 'dbs',
  port: 5433
});

(async function () {
  await client.connect();
})();

let router = express.Router();

// api calls

router.get('/api/population', async function(req, res) {
  try {
    let data = await client.query('Select * FROM points');

    data.rows.forEach(function (row) {
      row.geometry = JSON.parse(row.geom);
      row.properties = {
        "title": row.cs + '/'+ row.co  + ' - ' + row.poc_tp + ' obyv.',
        "icon":"marker"
      };
    });
    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.res.sendStatus(500);
  }
});

router.get('/api/streets', async function(req, res) {
  try {
    let data = await client.query('Select * FROM streets');

    data.rows.forEach(function (row) {
      row.geometry = JSON.parse(row.geom);
      row.properties = {
        "title": row.title + ' - '+ row.sum + ' obyv.',
      };
    });
    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.res.sendStatus(500);
  }
});

router.get('/api/city-parts', async function(req, res) {
  try {
    let data = await client.query('Select * FROM city_parts');

    data.rows.forEach(function (row) {
      row.geometry = JSON.parse(row.geom);
      row.properties = {
        "title": row.title + ' - '+ row.sum + ' obyv.',
      };
    });
    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.res.sendStatus(500);
  }
});

// inicialization
router.get('/', async function(req, res) {
  res.sendFile(('/home/michal/Desktop/advanced-dbs/backend/index.html'));
});


app.use(router)
app.listen(port);
console.log('Magic happens on port ' + port);
