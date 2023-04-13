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
var futureForecasts = []; //stores the actual weather information of the next five days

//a function that generates a weather data of a city

function getWeatherData(city){

    //API call to retrieve longitude and latitude of a city

var coordinatesUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid='+APIkey
fetch(coordinatesUrl) //fetches data using city name to get the longitude and lattitude of that city
.then(function(res){
    return res.json()
}).then(function(result){

    var latitude = result[0].lat;   //grabs the first results lattitude
    var longitude = result[0].lon;  //grabs the second of results longitude
    
 //API calling  which uses the longitude and lattitude to fetch data
 
    var queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+APIkey+'&units=imperial';
    fetch(queryUrl) //fetch using coordinates
    .then(function(response){
        return response.json();
    }).then(function(data){        
        
        cityDisplay.text(data.city.name); //writes the city name on the page
        dateDisplay.text(dayjs().format('MM/DD/YYYY')) //date

        var tempFar = data.list[0].main.temp //gets temprature in Franehit
        tempDisplay.text("Temp: " + tempFar.toFixed(2) + ' \u00B0F') //temprature in two decimal place with a degree symbol represented by \u00B0 Unicode 

        var windSpeedMph = data.list[0].wind.speed //  windspeed in mph
        windDisplay.text("Wind: "+ windSpeedMph.toFixed(2) +' mph')

        humidityDisplay.text("Humidity:  " + data.list[0].main.humidity + "%") //humidity
        
        var weatherHourly = data.list; //array of objects for every 3 hours of 5 days weather forecast(length of array = 40)
        

        

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
        
        //future forecast display in cards using bootstrap classes
        for(var i=0; i<futureForecasts.length;i++){
            var dateDay = dayjs(futureForecasts[i].dt_txt)
            //creating container and cards to display the next 5 days forecast
            var futureForecastContainer = $('<div>',{class:"col-sm-12 col-md-4 col-lg-3"});            
            var futureForecastCard = $('<div>',{class: 'card bg-secondary text-white m-4'});
            var futureForecastCardHeader = $('<div>',{class:'card-header text-center'}); 
            futureForecastCardHeader.html(`<h5 class="card-title">${dateDay.format('ddd')}</h5><h6>${dayjs(dateDay).format('DD/MM/YYYY')}</h6>`);
            var futureForecastCardBody = $('<div>',{class:'card-body text-center'}); 
            futureForecastCardBody.html(`<p class="card-text"> 
                                            <h5>Temp : ${futureForecasts[i].main.temp}\u00B0F</h5>
                                            <h5>Humidity : ${futureForecasts[i].main.humidity} %</h5>
                                            <h5>Wind : ${futureForecasts[i].wind.speed} mph</h5>
                                        </p>`);
            //appending
            futureForecastCard.append(futureForecastCardHeader)
            futureForecastCard.append(futureForecastCardBody)
            futureForecastContainer.append(futureForecastCard)
            futureForecastDisplay.append(futureForecastContainer);        
        }
  
    })//end of second api calling
   
})//end of first api calling

} //end of function


//event listener
searchBtn.on('click',function(){

    futureForecastDisplay.empty(); //clearing contents from the cards display space
    fiveDaysArray = []; //resetting arrays
    futureForecasts = [];

    var cityName = $('#input-city').val(); //grabs the city name from user input    
    getWeatherData(cityName);
    
})

