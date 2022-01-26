// This array contains the coordinates for all bus stops between MIT and Harvard 
const busStops = [ [-71.093729, 42.359244], [-71.094915, 42.360175], [-71.0958, 42.360698], [-71.099558, 42.362953], [-71.103476, 42.365248], [-71.106067, 42.366806], [-71.108717, 42.368355], [-71.110799, 42.369192], [-71.113095, 42.370218], [-71.115476, 42.372085], [-71.117585, 42.373016], [-71.118625, 42.374863], ]; 
var markers = [];
var map;
function createMapMarker() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoianVzdGluZ255YyIsImEiOiJja3JlZmVpY2Uwbm9tMndtNHpzb2RlZXhiIn0.pumIEKSl7lqN_AYAG8nw9g';

   map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091542, 42.358862],
    zoom: 12,
  });

  //let marker = new mapboxgl.Marker().setLngLat([-71.091542, 42.358862]).addTo(map);
}
async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);
// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});
	// timer
	setTimeout(run, 15000);
}
function addMarker(bus){
	var icon = getIcon(bus);
	//let marker = new mapboxgl.Marker().setLngLat([-71.091542, 42.358862]).addTo(map);
	let marker = new mapboxgl.Marker().setLngLat([bus.attributes.longitude, bus.attributes.latitude]).addTo(map);
	marker.id=bus.id;
markers.push(marker);
}
function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	//marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setLngLat( [bus.attributes.longitude, bus.attributes.latitude]);
}
// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}
function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}
function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}


window.onload = () => {
  createMapMarker();
  run();
};


// Do not edit code past this point
if (typeof module !== 'undefined') {
  module.exports = { createMapMarker };
}
