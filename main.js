


document.getElementById('search').addEventListener('submit', function (evt) {
    evt.preventDefault();

    let city = evt.target[0].value;

    getAndShowWeather(city);
})
