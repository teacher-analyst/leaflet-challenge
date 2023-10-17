// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Define colors based on depth
function getColor(depth){
  if (depth < -10) {
    color = "#DAF7A6";
  } else if (depth < 10) {
    color = "#FFC300";
  } else if (depth < 30) {
    color = "#FF5733";
  } else if (depth < 50) {
    color = "#C70039";
  } else if (depth < 70) {
    color = "#900C3F";
  } else {
    color = "#581845";
  }
return color;
}

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>magnitude:${feature.properties.mag}</p><p>depth:${(feature.geometry.coordinates[2])}</p>`);
  }

  // Create a GeoJSON layer with circle markers.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      // Extract the magnitude value from the GeoJSON data
      const mag = feature.properties.mag;

      // Extract the depth value from the GeoJSON data
      const depth = feature.geometry.coordinates[2];

      // Scale the radius based on the magnitude value (adjust the multiplier as needed)
      const radius = mag * 5;

      //create circle markers
      return L.circleMarker(latlng, {
        radius: radius, // Set the radius based on magnitude
        fillColor: getColor(depth), //adjust color of markers based on depth
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}  
function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

