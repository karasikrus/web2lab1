// разделить на функции, не ходить в дом

//import * as Handlebars from "./handlebars-v4.3.1";


const ApiKey = '4d7bab9a12e7e664eeadf2d29a195b1f';
const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('search').addEventListener('submit', function (evt) {
    evt.preventDefault();

    let city = document.getElementById('city').value;
    getAndShowWeather(city)
})


async function getWeather(city) {
    let url = new URL(ApiUrl);
    url.searchParams.append('appid', ApiKey);
    url.searchParams.append('units', 'metric');
    url.searchParams.append('q', city);
    let response = await fetch(url);

    if (response.status === 200) {
        return await response.json();
    } else {
        await response.json()
            .then(json => Promise.reject(json))
    }
}

function formatWeatherData(data) {
    let source = document.getElementById('weather-template').innerHTML;
    let template = Handlebars.compile(source);
    let context = {
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        pressure: data.main.pressure,
        weatherInfo: data.weather[0].description
    };
    let weatherHtml = template(context);
    return weatherHtml;

}

function showLoading() {
    let loadingSource = document.getElementById('loading-template').innerHTML;
    let loadingHtml = Handlebars.compile(loadingSource);
    let html = loadingHtml();
    document.getElementById('result').innerHTML = html;
}

function showError() {
    let source = document.getElementById('error-template').innerHTML;
    let template = Handlebars.compile(source);
    document.getElementById('result').innerHTML = template();
}

function showWeatherData(weather) {
    document.getElementById('result').innerHTML = formatWeatherData(weather);
}


function getAndShowWeather(city) {

    showLoading();

    getWeather(city).then(weather => {
        showWeatherData(weather);
    }).catch(err => {
            showError();
        }
    )
}


