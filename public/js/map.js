mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
});


const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML("<p>Exact location is provided after booking</p>")
)
.addTo(map);