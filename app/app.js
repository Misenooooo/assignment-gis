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
  port: 5436
});

(async function () {
  await client.connect();
})();

let router = express.Router();

// api calls


let query = "SELECT sum(poc_tp) FROM data where st_within(st_transform(data.wkb_geometry, '+proj=krovak +lat_0=49.689 +lon_0=24.8315 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs'::text, 4326), ST_Transform((SELECT ST_SetSRID(ST_GeomFromGeoJSON($1),4326)), 4326)) = true ";

router.post('/api/population-on-polygon', async function(req, res) {
  try {
    let values = [req.body];
    let result = await client.query(query,values);
    console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


router.get('/api/population', async function(req, res) {
  try {
    let data = await client.query('Select * FROM points');

    data.rows.forEach(function (row) {
      row.geometry = JSON.parse(row.geom);
      row.properties = {
        "title": row.cs + '/'+ row.co  + ' - ' + row.poc_tp + ' residents',
        "icon":"marker"
      };
    });
    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.res.sendStatus(500);
  }
});

let q = "WITH presov as (SELECT sum(data.poc_tp) AS sum, data.n_u AS title FROM data GROUP BY data.n_u) Select MAX(p.sum) as sum, p.title as title, st_asgeojson(ST_makeline(way)) as geom from presov p join planet_osm_line pol on p.title=pol.name where pol.highway NOT IN ('service', 'track') group by title"


router.get('/api/streets', async function(req, res) {
  try {
    let data = await client.query(q);

    data.rows.forEach(function (row) {
      row.geometry = JSON.parse(row.geom);
      row.properties = {
        "title": row.title + ' - '+ row.sum + ' residents',
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
        "title": row.title + ' - '+ row.sum + ' residents',
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
  res.sendFile(('/home/michal/Desktop/advanced-dbs/app/index.html'));
});


app.use(router);
app.listen(port);
console.log('Magic happens on port ' + port);
