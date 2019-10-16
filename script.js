// разделить на функции, не ходить в дом

//import * as Handlebars from "./handlebars-v4.3.1";


const ApiKey = '4d7bab9a12e7e664eeadf2d29a195b1f';
const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

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


function getAndShowWeather() {
    let city = document.getElementById('city').value;

    let loadingSource = document.getElementById('loading-template').innerHTML;
    let loadingHtml = Handlebars.compile(loadingSource);
    let html = loadingHtml();
    document.getElementById('result').innerHTML = html;

    getWeather(city).then(weather => {
        let source = document.getElementById('weather-template').innerHTML;
        let template = Handlebars.compile(source);
        let context = {
            city: weather.name,
            temp: weather.main.temp,
            humidity: weather.main.humidity,
            wind: weather.wind.speed,
            pressure: weather.main.pressure,
            weatherInfo: weather.weather[0].description
        };
        let weatherHtml = template(context);
        document.getElementById('result').innerHTML = weatherHtml;
    }).catch(err => {
            let source = document.getElementById('error-template').innerHTML;
            let template = Handlebars.compile(source);
            document.getElementById('result').innerHTML = template();
        }
    );
    return false
}


