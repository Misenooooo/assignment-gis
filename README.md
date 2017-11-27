# Overview

My app shows the number of people living in the city of Prešov and surrounding villages.

It has following features:

* The number of people living in every object in the city
* Count of people living in every street of the city
* Boundaries of Prešov and other villages.
* Ability to quickly switch between these layers on the map.
* Create a polygon on the map and count the number of people living in this polygon.

## Architecture
This app uses www.mapbox.com as a map komponent. The frontend consists of HTML, CSS and
Javascript, which handles frontend functionality and ajax calls on the server.

The backend is written in nodejs and framework express. It handles ajax requests and send queries to the database.

The database is PostgreSQL with spatial extension Postgis. Some selects are stored in database in form of views.

## Data

This application uses data from www.data.gov.sk and www.openstreetmap.org.

Both datasets are used to correctly show the number of people living in various streets.

Here is the link to the government dataset https://data.gov.sk/dataset/pocetnost-obcanov-mesta-presov-na-trvalom-pobyte/resource/a99caedc-6a47-42cf-9315-8bf34892ce87.

The government data are in special format called Krovak of US company called ESRI. Here is this format explained http://desktop.arcgis.com/en/arcmap/10.3/guide-books/map-projections/krovak.htm.


## Workflow
#### Request
* POST -> http://localhost:8085/api/population-on-polygon with request.body = drawn polygon on the mapbox map in GeosJson format.
#### Server
* Server will execute following query to count the number of people in the given polygon.
* Query includes my own projection transformation function, because ArcGeo's showed points on the map cca. 100 m east and 50 m north than their real position.
* My own projection transformation function looks like this '+proj=krovak +lat_0=49.689 +lon_0=24.8315 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +no_defs'.

#### Response
* Server returns the number of people in Json.
#### Map
* Map renders the number to the user.