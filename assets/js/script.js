var APIkey = '05818f2d35db6557de278dbcb6229116';

//selectors
var searchBtn = $('#search-button');
var inputEl = $('#input-city');
var cityDisplay = $('#city-display');
var dateDisplay = $('#date-display')
var tempDisplay = $('#temp-display')
//a function that generates a weather data of a city
function getWeatherData(city){
    //API call to retrieve longitude and latitude of a city

var coordinatesUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid='+APIkey
fetch(coordinatesUrl) //fetches data using city name to get the longitude and lattitude of that city
.then(function(res){
    return res.json()
}).then(function(data){
    console.log('longitude',data[0].lon)
    console.log('lattitude',data[0].lat)
    var latitude = data[0].lat;
    var longitude = data[0].lon;
    
 //API calling  which uses longitude and lattitude to fetch data
 
    var queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIkey;
    fetch(queryUrl) //fetch using coordinates
    .then(function(response){
        return response.json();
    }).then(function(data){
        
        console.log(data.city.name)
        cityDisplay.text(data.city.name);
        dateDisplay.text(dayjs().format('MM/DD/YYYY'))
        tempDisplay.text(Math.floor((data.list[0].main.temp-273.15)*9/5)+32+' C')


    })
   
})

}


//event listener
searchBtn.on('click',function(){
    var cityName = $('#input-city').val();

    getWeatherData(cityName);
    
})