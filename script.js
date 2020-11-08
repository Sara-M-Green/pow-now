//list of resorts to search snowfall data
const resortList = [
    {
        resort: 'Squaw Valley/Alpine Meadows',
        cityState: 'Olympic Valley, CA',
        searchQuery: 'olympic+valley',
        airport: 'RNO',
        airportName: 'Reno-Tahoe International Airport'
    },
    {
        resort: 'Snowbird',
        cityState: 'Salt Lake City, UT',
        searchQuery: 'salt+lake+city',
        airport: 'SLC',
        airportName: 'Salt Lake City International Airport'
    },
    {
        resort: 'Mammoth Mountain',
        cityState: 'Mammoth Lakes, CA',
        searchQuery: 'mammoth+lakes',
        airport: 'MMH',
        airportName: 'Mammoth Yosemite Airport'
    },
    {
        resort: 'Telluride Ski Resort',
        cityState: 'Telluride, CO',
        searchQuery: 'telluride',
        airport: 'MTJ',
        airportName: 'Montrose Regional Airport'
    },
    {
        resort: 'Big Sky Resort',
        cityState: 'Big Sky, MT',
        searchQuery: 'big+sky',
        airport: 'BZN',
        airportName: 'Bozeman Yellowstone International Airport'
    },
    {
        resort: 'Sun Valley',
        cityState: 'Sun Valley, ID',
        searchQuery: 'sun+valley',
        airport: 'SUN',
        airportName: 'Friedman Memorial Airport'
    }
]

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
    const apiKey = 'cadbd16055d546e9afd42652200211'
    const url =  `https://api.worldweatheronline.com/premium/v1/ski.ashx?key=${apiKey}&q=${city}&includeLocation=yes&format=json`
    return fetch(url)
    .then(response => {
        if (response.ok){
            return response.json()
        }
        throw new Error(response.statusText)
    })
}

//displays weather results to HTML
function displayResults(weatherDataArray){
    $('#results-list').empty()
    for(let i = 0; i < weatherDataArray.length; i++){
    let snowIn = (`${weatherDataArray[i].data.weather[0].totalSnowfall_cm}`*0.39370079).toFixed(2)  
        $('#results-list').append(
            `<div class='resort-result'>
                <h3 class='resortName'>${resortList[i].resort}</h3>
                <h4>${resortList[i].cityState}</h4>
                
                    <p class='snowfall'>Current Snowfall: ${snowIn} in</p>
                
                <div id='flightPrice-${i}'>
                </div>
            </div>`
        )    
    }
    $('#results').removeClass('hidden')
    $('#home-screen-copy').addClass('hidden')
    $('#submit').attr('value', 'Search Again')
}

//loops through resort list and finds inbound airport code to each resort
function getFlightData(resortList){
    for(i = 0; i < resortList.length; i++){
        let resortName = resortList[i].resort
        let inbound = resortList[i].airport
        findFlights(inbound, resortName)
    }
}

//makes request for flight info from selected outbound airport to resort
function findFlights(inbound, resortName){

    const outbound = $('#outbound-airport').val()
    const outboundDate = createTomorrowsDate()
    const inboundDate = $('#inbound-date').val()

    const url = `https://rapidapi.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${outbound}-sky/${inbound}-sky/${outboundDate}?inboundpartialdate=${inboundDate}`
    
    fetch(url, {
        'method': 'GET',
        'headers': {
            'x-rapidapi-key': '36f9ae898amsh1413f301961a480p18ed20jsn9e5d4d694fec',
            'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
    })
    .then(response => {
        return response.json()
    })
    .then(responseJsonFlight => {
        findMinPrice(responseJsonFlight, resortName)
    })
    .catch(err => {
        console.error(err)
    })
}

//finds price and carrier from flight data response and appends results to HTML
function findMinPrice(responseJsonFlight, resortName){
    const matchingIndex = resortList.findIndex(resort => resort.resort === resortName)
    if(responseJsonFlight.Quotes.length === 0){
        $(`#flightPrice-${matchingIndex}`).append(`<p>No flights found into ${resortList[matchingIndex].airportName}</p>`)
    } else {
        let price = responseJsonFlight.Quotes[0].MinPrice
        let airline = responseJsonFlight.Carriers[0].Name
        $(`#flightPrice-${matchingIndex}`).append(`<p class='flight-price'>Flight Price: $${price}</p> 
        <p>Into ${resortList[matchingIndex].airportName}</p>
        <p>on ${airline}</p>`)
    } 
}

// creates tomorrow's date variable for outbound flight date
function createTomorrowsDate(){
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate() + 1
    if(month < 10){
        month = '0' + month
    }
    if (day < 10){
        day = '0' + day
    }
    const tomorrow = `${year}-${month}-${day}`
    return tomorrow
}

// sets the date input's min value
function minDateAttr(){
    const minDate = createTomorrowsDate()
    $('#inbound-date').attr('min', minDate)
}

//  submit click listener function
function watchForm(){
    $('form').submit(event => {
        event.preventDefault()
        getWeatherData(resortList)
    })
}

$(watchForm)
$(minDateAttr)