document.querySelector("#btnSearch").addEventListener("click",()=>{
    let text = document.querySelector("#txtSearch").value;
    try{if (text == "") {
        throw new Error("Please enter location");
    }}
    catch(err){
        renderError(err);
    }
    document.querySelector("#details").style.opacity = 0;
    document.querySelector("#loading").style.display = "block";
    getCountry(text);
});

document.querySelector("#btnLocation").addEventListener("click",()=>{
    if (navigator.geolocation) {
    document.querySelector("#loading").style.display = "block";
    navigator.geolocation.getCurrentPosition(onSuccess,onError);
    
    }
})

async function onSuccess(position) {
    console.log(position);
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude

    console.log(latitude);
    console.log(longitude);

    const api_key = "22593cdfd1ce4a9ea0b13b786f75b44c";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log(data.results[0].components.country+"/"+data.results[0].components.state +"/"+data.results[0].components.town +"/"+data.results[0].components.village);

    const country = data.results[0].components.country;

    document.querySelector("#txtSearch").placeholder = data.results[0].components.country+"/"+data.results[0].components.state +"/"+data.results[0].components.town +"/"+data.results[0].components.village;

    getCountry(country);
    getWeather(latitude,longitude);
    
}

function onError(err) {
    document.querySelector("#loading").style.display = "none";
    console.log(err);
}

async function getCountry(country) {
    try{const response = await fetch('https://restcountries.com/v3.1/name/'+country);
    if (!response.ok) {
        throw new Error("Country not found");
    };
    const data = await response.json();

    renderCountry(data[0]);
    const countries = data[0].borders;
    if (!countries) {
        throw new Error("Neighboring countries not found");
    }

    const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes='+countries.toString());
    const neighbors = await response2.json();
    renderNeighbors(neighbors)}

    catch(err){
        document.querySelector("#loading").style.display = "none";
        renderError(err);
    }
};
function renderCountry(data) {
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#country-details").innerHTML ="";
    document.querySelector("#neighbors").innerHTML="";

    let html =`

                <div class="col-4">
                    <img src="${data.flags.png}" class="img-fluid" alt="">
                </div>
                <div class="col-8">
                    <h3 class="card-title">${data.name.common}</h3>
                    <hr>
                    <div class="row">
                        <div class="col-4">Population:</div>
                        <div class="col-8 text-success">${(data.population /1000000).toFixed(1)} Mn</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Capital:</div>
                        <div class="col-8 text-success">${data.capital[0]}</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Language:</div>
                        <div class="col-8 text-success">${Object.values(data.languages)}</div>
                    </div>
                    <div class="row">
                        <div class="col-4">Currency:</div>
                        <div class="col-8 text-success">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                    </div>
                </div>
    `;

    document.querySelector("#details").style.opacity = 1;
    document.querySelector("#country-details").innerHTML = html

};
function renderNeighbors(data) {
    let html ="";

    for( let country of data){
        html +=  `
        <div class="col-2 mt-2">
            <div class="card">
                <img src="${country.flags.png}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${country.name.official}</h6>
                </div>
            </div>
        </div>
    `;
    };
    document.querySelector("#neighbors").innerHTML=html;
};
function renderError(err) {
    const html = `
        <div class="alert alert-danger">
            ${err.message}
        </div>
    `;
    setTimeout(function () {
        document.querySelector("#errors").innerHTML =""
    },3000);
    document.querySelector("#errors").innerHTML = html
};
function toggleDarkMode() {
    const body = document.querySelector('body');
    document.querySelector("#switch").classList.remove("fa-sun");
    document.querySelector("#switch").classList.add("fa-moon");
    body.classList.toggle('dark-mode');
};
async function getWeather(latitude,longitude) {

    this.latitude = latitude;
    this.longitude = longitude

    const wapi_key = 'fa7b5127f1daedc8fc1f814a5fc7bcbe'
    const urlw = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${wapi_key}`;
    const response = await fetch(urlw)
    const data = await response.json();
    console.log(data.weather[0].main);
    renderWeather(data)
}

function renderWeather(data) {
    
    let html = `
    <div class="col-4">
        <h1>${data.weather[0].main}</h1>
    </div>
    `

    document.querySelector("#weather-details").innerHTML = html
}
