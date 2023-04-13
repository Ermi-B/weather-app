var APIkey = '05818f2d35db6557de278dbcb6229116';

//selectors
var searchBtn = $('#search-button');
var inputEl = $('#input-city');
var cityDisplay = $('#city-display');
var dateDisplay = $('#date-display');
var tempDisplay = $('#temp-display');
var windDisplay = $('#wind-display');
var humidityDisplay = $('#humidity-display');
var futureForecastDisplay = $('#future-forecast');

var fiveDaysArray = []; //stores the next five days from current date(just the dates at time 00:00:00)
var futureForecasts = [];

//a function that generates a weather data of a city
function getWeatherData(city){
    //API call to retrieve longitude and latitude of a city

var coordinatesUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid='+APIkey
fetch(coordinatesUrl) //fetches data using city name to get the longitude and lattitude of that city
.then(function(res){
    return res.json()
}).then(function(result){
    console.log('longitude',result[0].lon)
    console.log('lattitude',result[0].lat)
    var latitude = result[0].lat;
    var longitude = result[0].lon;
    
 //API calling  which uses longitude and lattitude to fetch data
 
    var queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIkey+'&units=imperial';
    fetch(queryUrl) //fetch using coordinates
    .then(function(response){
        return response.json();
    }).then(function(data){
        
        console.log(data.city.name)
        cityDisplay.text(data.city.name);
        dateDisplay.text(dayjs().format('MM/DD/YYYY'))
        var tempFar = data.list[0].main.temp //gets temprature in Franehit
        tempDisplay.text("Temp: " + tempFar.toFixed(2) + ' \u00B0F') //displying two decimal place with degree symbol represented by \u00B0 Unicode 

        var windSpeedMph = data.list[0].wind.speed // gets windspeed in mph
        windDisplay.text("Wind: "+ windSpeedMph.toFixed(2) +' mph')

        humidityDisplay.text("Humidity:  " + data.list[0].main.humidity + "%")
        
        var weatherHourly = data.list; //array of objects for every 3 hours of 5 days weather forecast(length of array = 40)
        var dateOfWeather = weatherHourly[39].dt_txt

        console.log(dayjs(dateOfWeather).format('DD/MM/YYYY'))

        //generating the next five days from current date
        for (let i = 1; i <= 5; i++) {
            var date = dayjs().add(i,'day').format('YYYY-MM-DD 00:00:00'); //adding 1 day each iteration to current date (making time by default at 00:00:00)
            
            fiveDaysArray.push(date);            
            
        }
        
        for(var i=0;i<weatherHourly.length;i++){    //looping through the array           
        
                for(var j=0; j<fiveDaysArray.length; j++){ //nested loop that to select those entries that match with next five days
                    
                    // console.log(weatherHourly[i].dt_txt == fiveDaysArray[j])
                    if(weatherHourly[i].dt_txt==fiveDaysArray[j]){
                        
                        futureForecasts.push(weatherHourly[i]); //future forecast now holds the next five days weather forecast at time 00:00:00
                        console.log('added')
                     
                    } 
                }//end of inner for loop                          
          
        }//end of outer for loop
        console.log(futureForecasts)


        //future forecast display in cards usiong bootstrap classes


        for(var i=0; i<futureForecasts.length;i++){
            var dateDay = dayjs(futureForecasts[i].dt_txt).format('ddd')

             var futureForecastContainer = $('<div>',{class:"col-sm-12 col-md-4 col-lg-3"});
    var futureForecastCard = $('<div>',{class: 'card bg-secondary text-white m-4'});
    var futureForecastCardHeader = $('<div>',{class:'card-header text-center'}); 
        futureForecastCardHeader.html(`<h5 class="card-title">${dateDay}</h5>`);
    var futureForecastCardBody = $('<div>',{class:'card-body text-center'}); 
    futureForecastCardBody.html(`<p class="card-text"> 
                                    <h5>Temp : ${futureForecasts[i].main.temp}\u00B0F</h5>
                                    <h5>Humidity : ${futureForecasts[i].main.humidity} %</h5>
                                    <h5>Wind : ${futureForecasts[i].wind.speed} mph</h5>
                                </p>`);
    
    futureForecastCard.append(futureForecastCardHeader)
    futureForecastCard.append(futureForecastCardBody)
    futureForecastContainer.append(futureForecastCard)




        futureForecastDisplay.append(futureForecastContainer);
        }
   



    })//end of api calling
   
})

}


//event listener
searchBtn.on('click',function(){
    var cityName = $('#input-city').val();

    getWeatherData(cityName);
    
})

/**
 *  <div class="row m-4 p-4">
                <div class="col-sm-12 col-md-3 col-lg-3">
                  <div class="card bg-secondary text-white">
                    <div class="card-header text-center">
                        <h5 class="card-title">Monday</h5>
                    </div>
                    <div class="card-body">
                      
                      <p class="card-text"><h5></h5></p>
                      
                    </div>
                  </div>
                </div>
    </div>
 */