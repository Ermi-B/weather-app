var APIkey = '05818f2d35db6557de278dbcb6229116';
var city = prompt();
var latitude;
var longitude;
var url = 'http://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid='+APIkey;
//API call to retrieve longitude and latitude of a city

var coordinatesUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid='+APIkey
fetch(coordinatesUrl) //fetches data using city name and we can get the longitude and lattitude from that
.then(function(res){
    return res.json()
}).then(function(data){
    console.log('longitude',data[0].lon)
    console.log('lattitude',data[0].lat)
    latitude = data[0].lon;
    longitude = data[0].lat;
})
//API calling with city name
