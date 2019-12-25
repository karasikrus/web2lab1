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
        return await response.json()
            .then(json => Promise.reject(json))
    }
}

function formatWeatherData(data) {

    let context = {
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        pressure: data.main.pressure,
        weatherInfo: data.weather[0].description
    };
    return context;

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

function showWeatherData(weatherContext) {
    let source = document.getElementById('weather-template').innerHTML;
    let template = Handlebars.compile(source);
    let weatherHtml = template(weatherContext);
    document.getElementById('result').innerHTML = weatherHtml;
}


async function getAndShowWeather(city) {

    showLoading();

    await getWeather(city).then(weather => {
        let weatherContext = formatWeatherData(weather);
        showWeatherData(weatherContext);
    }).catch(err => {
            showError();
        }
    )
}

module.exports = {formatWeatherData, getWeather, showLoading, showError, getAndShowWeather, showWeatherData};
