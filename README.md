Project z pokrocilych databaz

1. Angularovska appka vyuzivajuca nasledujuci balicek -  https://www.npmjs.com/package/@asymmetrik/ngx-leaflet

2. NodeJS server napojeny na PostgreSql databazu cez pgAdmin - Data su odosielane vo formate GeoJson - http://geojson.org/

3. PostgreSQl + PostGis databaza ukladajuca nejake GeoData

---
Asi pocitanie obyvatelov v presove.
https://data.gov.sk/dataset/pocetnost-obcanov-mesta-presov-na-trvalom-pobyte/resource/a99caedc-6a47-42cf-9315-8bf34892ce87

DB

User
username: dbs
password: dbs
DB dbs

Import data by ogr2ogr from data.json to database dbs.

SSRID UPDATED TO 102067 from ArcGeo. Imported dataset from their site.

Remove angular and add simple index.html and migrate from angular to mapbox!!!


SELECT ST_TRANSFORM(wkb_geometry, '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs ', 3857) FROM DATA

SELECT ST_AsText(ST_TRANSFORM(wkb_geometry, '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs ', 4326)) FROM DATA

Posledna verzia s posunutim 15 metrov juzne a 50 vychodne.
let all_population_query = 'SELECT \'Feature\' as type, poc_tp, n_u, co, cs,' +
  'ST_AsGeoJSON(ST_TRANSFORM(wkb_geometry, \'+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs \', 4326),20) as geom FROM DATA limit 50';

Pomenena verzia
let all_population_query = 'SELECT \'Feature\' as type, poc_tp, n_u, co, cs,' +
  'ST_AsGeoJSON(ST_TRANSFORM(wkb_geometry, \'+proj=krovak +lat_0=49.689 +lon_0=24.8315 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs \', 4326),20) as geom FROM DATA limit 50';

