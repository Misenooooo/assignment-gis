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

let all_population_query = 'SELECT \'Feature\' as type, poc_tp, n_u, co, cs,' +
  'ST_AsGeoJSON(ST_TRANSFORM(wkb_geometry, \'+proj=krovak +lat_0=49.689 +lon_0=24.8315 ' +
  '+alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs \', 4326),20) as geom FROM DATA';
router.get('/api/population', async function(req, res) {
  try {
    let data = await client.query(all_population_query);

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

let streets = 'SELECT SUM(poc_tp),n_u as title,ST_AsGeoJSON(ST_MakeLine(ST_TRANSFORM(wkb_geometry, \'+proj=krovak +lat_0=49.689 +lon_0=24.8315 ' +
  ' +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs \', 4326)), 20) as geom FROM DATA  GROUP BY n_u';
router.get('/api/streets', async function(req, res) {
  try {
    let data = await client.query(streets);

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

let city_parts = 'SELECT SUM(poc_tp),n_cm as title,ST_AsGeoJSON(st_concavehull(ST_Collect(ST_TRANSFORM(wkb_geometry, \'+proj=krovak +lat_0=49.689 +lon_0=24.8315 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs \', 4326)), 0.99)) as geom FROM DATA GROUP BY n_cm';
router.get('/api/city-parts', async function(req, res) {
  try {
    let data = await client.query(city_parts);

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
