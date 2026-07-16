console.log(mapToken);
var map = new maplibregl.Map({
    container: 'map', // container id
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`, // style url
    center: coordinates, //[lng,lat]
    zoom: 11 // starting zoom
});

console.log(coordinates);

const popup = new maplibregl.Popup({ offset: 25 })
  .setHTML(`
    <p>Exact location will be provided after booking</p>
  `);


new maplibregl.Marker({color:"red"})
  .setLngLat(coordinates) // listing.geometry.coordinates
  .setPopup(popup)
  .addTo(map)
  .togglePopup()
  .addTo(map)