const apiKey = 'cadbd16055d546e9afd42652200211';

const resortList = [ 
    {
        resort: alta,
        airport: SLC
    },
    {
        resort: aspen,
        airport: ASE
    },
    {
        resort: beaver-creek,
        airport: DEN
    },
    {
        resort: big-sky,
        airport: BZN
    },
    {
        resort: brekenridge,
        airport: DEN
    },
    {
        resort: crested-butte,
        airport: GUC
    },
    {
        resort: jackson-hole,
        airport: JAC
    },
    {
        resort: mammoth,
        airport: MMH
    },
    {
        resort: park-city,
        airport: SLC
    },
    {
        resort: snowbird,
        airport: SLC
    },
    {
        resort: squaw-valley,
        airport: RNO
    },
    {
        resort: steamboat-springs,
        airport: HDN
    },
    {
        resort: sun-valley,
        airport: SUN
    },
    {
        resort: telluride,
        airport: MJT
    },
    {
        resort: vail,
        airport: EJE
    },

]

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
    });
}

$(watchForm);

//5fa08f47323fb0620266eaca Validity: 30 days

