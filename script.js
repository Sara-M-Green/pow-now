//api key for world weather online
const apiKey = 'cadbd16055d546e9afd42652200211';

//list of resorts to search snowfall data
const resortList = [
    {
        resort: 'Mammoth Mountain',
        searchQuery: 'mammoth+lakes',
        airport: 'MMH'
    },
    {
        resort: 'Telluride',
        searchQuery: 'telluride',
        airport: 'MJT'
    },
    {
        resort: 'Squaw Valley/Alipine Meadows',
        searchQuery: 'olympic+valley',
        airport: 'RNO'
    },
    {
        resort: 'Big Sky',
        searchQuery: 'big+sky',
        airport: 'BZN'
    },
    {
        resort: 'Snowbird',
        searchQuery: 'salt+lake+city',
        airport: 'SLC'
    },
    {
        resort: 'Sun Valley',
        searchQuery: 'sun+valley',
        airport: 'SUN'
    }
];

//loops through resort list and finds weather data for each resort
function getWeatherData(resortList){
    const results = resortList.map(resort => {
        return findWeather(resort.searchQuery)
    })
    Promise.all(results)
    .then(weatherData => {
        displayResults(weatherData)
        getFlightData(resortList)
    })
}

//makes a request to world wide weather API
function findWeather(city){
    const url =  `https://api.worldweatheronline.com/premium/v1/ski.ashx?key=${apiKey}&q=${city}&includeLocation=yes&format=json`
    return fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
}

//displays weather results to HTML
function displayResults(weatherDataArray){
    console.log(weatherDataArray)
    $('#results-list').empty();
    for(let i = 0; i < weatherDataArray.length; i++){
    let snowIn = (`${weatherDataArray[i].data.weather[0].totalSnowfall_cm}`*0.39370079).toFixed(2);    
        $('#results-list').append(
            `<li>
                <h3>${resortList[i].resort}</h3>
                <ul>
                    <li>Current Snowfall: ${snowIn} in</li>
                </ul>
                <ul id="flightPrice-${i}">
                </ul>
            </li>`
        );     
    };
    $('#results').removeClass('hidden');
}

//loops through resort list and finds inbound airport code to each resort
function getFlightData(resortList){
    for(i = 0; i < resortList.length; i++){
        let resortName = resortList[i].resort;
        let inbound = resortList[i].airport; 
        findFlights(inbound, resortName)
    }
}

//makes request for flight info from selected outbound airport to resort
function findFlights(inbound, resortName){
    let outbound = $('#outbound-airport').val();
    outboundDate = createTomorrowsDate();
    inboundDate = $('#inbound-date').val();

    let url = `https://rapidapi.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${outbound}-sky/${inbound}-sky/${outboundDate}?inboundpartialdate=${inboundDate}`;
    
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "36f9ae898amsh1413f301961a480p18ed20jsn9e5d4d694fec",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
        }
    })
    .then(response => {
        return response.json();
    })
    .then(responseJsonFlight => {
        console.log(responseJsonFlight)
        findMinPrice(responseJsonFlight, resortName);
    })
    .catch(err => {
        console.error(err);
    });  
}


function findMinPrice(responseJsonFlight, resortName){
    const matchingIndex = resortList.findIndex(resort => resort.resort === resortName)
   if(responseJsonFlight.Quotes.length === 0){
        $(`#flightPrice-${matchingIndex}`).append(`<li>No flights found</li>`)
    } else {
            let price = responseJsonFlight.Quotes[0].MinPrice
            $(`#flightPrice-${matchingIndex}`).append(`<li>Flight Price: $${price}</li>`);
    } 
}



// creates tomorrow's date variable for outbound flight date
function createTomorrowsDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate() + 1;
    if(month < 10){
        month = '0' + month;
    }
    if (day < 10){
        day = '0' + day;
    }
    let tomorrow = `${year}-${month}-${day}`;
    return tomorrow;
}

//  submit click listener function
function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        getWeatherData(resortList);
    });
}

$(watchForm);