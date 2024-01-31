import { fetchData, url } from "./api.js";
import * as module from "./module.js";

const addEventonElements = function (elements, eventType, callback) {
    for (const element of elements) element.addEventListener(eventType, callback);
}

const searchBar = document.querySelector("[data-search-view]");

const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchBar.classList.toggle("active");

addEventonElements(searchTogglers, "click", toggleSearch);

const searchField = document.querySelector("[data-search-field]");

const searchResult = document.querySelector("[data-search-results]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function (event) {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    } else {
        searchField.classList.add("searching");
    }

    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (locations) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                <ul class="view-list" data-search-list>
                    
                </ul>`;

                const items = [];

                for(const {name,lat,lon,country,state} of locations){
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                    <span class="m-icon">
                                location_on
                            </span>
                            <div>
                                <p class="item-title">${name}</p>
                                <p class="lable-2 item-subtitle">${state ||""} ${country}</p>
                            </div>
                            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler>
                            </a>`;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }

                addEventonElements(items,"click",function(){
                    toggleSearch();
                    searchResult.classList.remove("active");
                })
            });
        }, searchTimeoutDuration);
    }
});


const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

const toggleUnitBtn = document.getElementById('toggleUnitBtn');

var isCelsius = true;
toggleUnitBtn.addEventListener('click', function () {
    isCelsius = !isCelsius;
    console.log('Button clicked:', isCelsius);

});

const convertTemperature = (temperature) => {
    return isCelsius ? parseInt(temperature) : module.celsiusToFahrenheit(parseInt(temperature));
};

export const updateWeather = function(lat, lon ){
    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML="";
    highlightSection.innerHTML = "";
    forecastSection.innerHTML = "";

    if(window.location.hash=== "#/current-location"){
        currentLocationBtn.setAttribute("disabled","");
    }else{
        currentLocationBtn.removeAttribute("disabled");
    }

    fetchData(url.currentWeather(lat,lon),function(currentWeather){
        const{
            weather,
            dt: dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, temp_min, temp_max, pressure, humidity},
            visibility,
            timezone,
            wind: { speed: windSpeed, deg: windDirection }
        } = currentWeather
        const [{description, icon}] = weather;

        const card = document.createElement("div");
        card.classList.add("card","card-lg","current-weather-card");

        card.innerHTML=`
        <h2 class="title-2 card-title">Now</h2>
                        <div class="weapper">
                            <p class="heading" data-temperature>${convertTemperature(temp)}&deg;<sup>${isCelsius ? 'c' : 'f'}</sup></p>

                            <img src="./images/weather_icons/${icon}.png" width="64" height="64" alt="${description}">
                        </div>
                        <p class="body-3">${description}</p>
                        <ul class="meta-list">
                            <li class="meta-item">
                                <span class="m-icon">calendar_today</span>
                                <p class="title-3 meta-text">${module.getData(dateUnix,timezone)}</p>
                            </li>
                            <li class="meta-item">
                                <span class="m-icon">location_on</span>
                                <p class="title-3 meta-text" data-location></p>
                            </li>
                        </ul>`;
        fetchData(url.reverseGeo(lat,lon),function([{name,country}]){
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
        });
        currentWeatherSection.appendChild(card);

        const card2 = document.createElement("div");
        card2.classList.add("card","card-lg");

        card2.innerHTML=`
        <h2 class="title-2" id="highlights-label">
                        Todays Highlights
                    </h2>
                    <div class="highlight-list">
                        <div class="card card-sm highlight-card one">
                            <h3 class="title-3 c">Min-Max Temprature</h3>
                            <div class="wrapper">
                                <h3 class="title-1">Min - ${parseInt(temp_min)}&deg;<sup>c</sup></h3>
                                <h3 class="title-1">Max - ${parseInt(temp_max)}&deg;<sup>c</sup></h3>
                            </div>
                            <span class="badge aqi-1 label-1" title="aqi message">${description}</span>

                        </div>

                        <div class="card card-sm highlight-card two">
                            <h3 class="title3">Sunrise & Sunset</h3>
                            <div class="card-list">
                                <div class="card-item">
                                    <span class="m-icon">
                                        clear_day
                                    </span>
                                    <div>
                                        <p class="label-1">
                                            Sunrise
                                        </p>
                                        <p class="title-1">
                                        ${module.getTime(sunriseUnixUTC,timezone)}
                                        </p>
                                    </div>
                                </div>
                                <div class="card-item">
                                    <span class="m-icon">
                                        clear_day
                                    </span>
                                    <div>
                                        <p class="label-1">
                                            Sunset
                                        </p>
                                        <p class="title-1">
                                        ${module.getTime(sunsetUnixUTC,timezone)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-sm highlight-card">
                            <h3 class="title-3">Humidity</h3>
                            <div class="wrapper">
                                <span class="m-icon">
                                    humidity_percentage
                                </span>
                                <p class="title-1">${humidity}<sub>%</sub></p>
                            </div>
                        </div>
                        <div class="card card-sm highlight-card">
                        <h3 class="title-3">Wind</h3>
                        <div class="wrapper">
                            <span class="m-icon">
                                wind
                            </span>
                            <p class="title-1">${parseInt(module.mps_to_kmh(windSpeed))} km/h, ${windDirection-180}°</p>
                        </div>
                        </div>
                        <div class="card card-sm highlight-card">
                            <h3 class="title-3">Visibility</h3>
                            <div class="wrapper">
                                <span class="m-icon">
                                    visibility
                                </span>
                                <p class="title-1">${visibility/1000}<sub>km</sub></p>
                            </div>
                        </div>
                        <div class="card card-sm highlight-card">
                            <h3 class="title-3">Feels Like</h3>
                            <div class="wrapper">
                                <span class="m-icon">
                                    thermostat
                                </span>
                                <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                            </div>
                        </div>
                    </div>`;

        highlightSection.appendChild(card2);

        
        fetchData(url.forecast(lat,lon),function(forecast){
            const{
                list:forecastList,
                city: {timezone}
            }= forecast;

            
            forecastSection.innerHTML = `
            <div class="day5title">
                        <h2 class="title2" id="forecast-label">5 Days Forecast</h2>
                    </div>
                    <div class="card card-lg forecast-card">
                        <ul data-forecast-list>
                        </ul>
                    </div>`;
            
            for(let i=7, len = forecastList.length; i<len;i+=8){
                const{
                    main:{temp_max},
                    weather,
                    dt_txt
                } = forecastList[i];
                const [{icon, description}] = weather
                const date = new Date(dt_txt);

                const li = document.createElement("li");
                li.classList.add("card-item");
                li.innerHTML = ` 
                <div class="icon-wrapper" style="gap-3">
                <div style="margin-right:5px">
                    <img src="./images/weather_icons/${icon}.png" alt="${description}" width="36"
                    height="36" class="weather-icon" title="${description}">
                </div>
                <span class="span" >
                    <p class="title-2" data-temperature>${parseInt(temp_max)}&deg;</p>
                </span>
            </div>
            <p class="label-1">
                ${date.getDate()} ${module.monthNames[date.getMonth()]}
            </p>
            <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
            <h4 class="label-1">${description}</h4>`;
            forecastSection.querySelector("[data-forecast-list]").appendChild(li);

            
            }

            loading.style.display = "none";
            container.style.overflowY = "overlay";
            container.classList.add("fade-in");
        });


    });
}

export const error404 = function(){
    errorContent.style.display = "flex";
}