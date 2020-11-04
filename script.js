const apiKey = 'cadbd16055d546e9afd42652200211';

// const resortList = [ 
//     {
//         resort: alta,
//         airport: SLC
//     },
//     {
//         resort: aspen,
//         airport: ASE
//     },
//     {
//         resort: beaver-creek,
//         airport: DEN
//     },
//     {
//         resort: big-sky,
//         airport: BZN
//     },
//     {
//         resort: brekenridge,
//         airport: DEN
//     },
//     {
//         resort: crested-butte,
//         airport: GUC
//     },
//     {
//         resort: jackson-hole,
//         airport: JAC
//     },
//     {
//         resort: mammoth,
//         airport: MMH
//     },
//     {
//         resort: park-city,
//         airport: SLC
//     },
//     {
//         resort: snowbird,
//         airport: SLC
//     },
//     {
//         resort: squaw-valley,
//         airport: RNO
//     },
//     {
//         resort: steamboat-springs,
//         airport: HDN
//     },
//     {
//         resort: sun-valley,
//         airport: SUN
//     },
//     {
//         resort: telluride,
//         airport: MJT
//     },
//     {
//         resort: vail,
//         airport: EJE
//     },
// ]

function findResort(){
    const url =  "https://api.worldweatheronline.com/premium/v1/ski.ashx?key=cadbd16055d546e9afd42652200211&q=mammoth+lakes&includeLocation=yes&format=json"
    fetch(url)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => console.log(responseJson))
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        findResort();
        findFlights();
    });
}

$(watchForm);

function findFlights(){
    let outbound = $('#outbound-airport').val();
    let inbound = 'MMH';
    outboundDate = createTomorrowsDate();
    inboundDate = $('#inbound-date').val();


    var url = `https://rapidapi.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${outbound}-sky/${inbound}-sky/${outboundDate}?inboundpartialdate=${inboundDate}`

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
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });  
}


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

