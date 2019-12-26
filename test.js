const test = require('./script');
const reply = require('./reply');
const mocha = require('mocha');
var referee = require("@sinonjs/referee");
var assertSinon = referee.assert;

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const _ = require('lodash');
const fetchMock = require('fetch-mock');
const assert = require('assert');
const sinon = require('sinon');
const Handlebars = require('./handlebars-v4.3.1');

const html = '<script id="error-template" type="text/x-handlebars-template">\n' +
    '        ой, такого города нет\n' +
    '    </script>\n' +
    '\n' +
    '    <script id="loading-template" type="text/x-handlebars-template">\n' +
    '        <div><b>грузится...</b></div>\n' +
    '    </script>\n' +
    '    <script id="weather-template" type="text/x-handlebars-template">\n' +
    '        <section id="weather-result">\n' +
    '\n' +
    '            <section id="city-name"><b>{{city}}</b></section>\n' +
    '            <section id="weather-section">\n' +
    '                <section id="temp">\n' +
    '                    <div><b>{{temp}}</b> °C</div>\n' +
    '                </section>\n' +
    '                <section id="info">\n' +
    '                    <div id="humidity">Humidity: {{humidity}} %</div>\n' +
    '                    <div id="wind">Wind speed: {{wind}} m/s</div>\n' +
    '                    <div id="pressure">Atmospheric pressure: {{pressure}} hPa</div>\n' +
    '                    <div id="weather-name">{{weatherInfo}}</div>\n' +
    '                </section>\n' +
    '            </section>\n' +
    '        </section>\n' +
    '\n' +
    '    </script>' +
    '    </script><div><div id="result"/></div>';

const context = {
    "city": "Kursk",
    "temp": -1,
    "humidity": 63,
    "wind": 4,
    "pressure": 1017,
    "weatherInfo": "overcast clouds"
};

describe('Functions from script.js', function () {


    describe('formatWeatherData', function () {
        it('should parse json from api to context object', function () {
            assert(_.isEqual(context, test.formatWeatherData(reply.apiJSON)))
        })
    });
    describe('getWeather', function () {
        it('should get mock city weather from OpenWeather', function () {
            const mockSuccess = reply.apiJSON;
            fetchMock.mock('*', mockSuccess);
            return test.getWeather('kursk').then(function (res) {
                assert.equal(200, res.cod);
                fetchMock.reset();
            })
        })
    });
    describe('showLoading', function () {
        it('should show loading message', function () {
            const dom = (new JSDOM(html)).window;
            global.document = dom.document;
            global.Handlebars = Handlebars;
            test.showLoading();
            assert.equal(document.getElementById('result').innerHTML, '\n' +
                '        <div><b>грузится...</b></div>\n' +
                '    ');
        })
    });
    describe('showError', function () {
        it('should show error message', function () {
            const dom = (new JSDOM(html)).window;
            global.document = dom.document;
            global.Handlebars = Handlebars;
            test.showError();
            assert.equal(document.getElementById('result').innerHTML, '\n' +
                '        ой, такого города нет\n' +
                '    ');
        })
    });
    describe('showWeatherData', function () {
        it('should show formatted weather data from context', function () {

            const dom = (new JSDOM(html)).window;
            global.document = dom.document;
            global.Handlebars = Handlebars;
            test.showWeatherData(context);
            assert.equal(document.getElementById('result').innerHTML, '\n' +
                '        <section id="weather-result">\n' +
                '\n' +
                '            <section id="city-name"><b>Kursk</b></section>\n' +
                '            <section id="weather-section">\n' +
                '                <section id="temp">\n' +
                '                    <div><b>-1</b> °C</div>\n' +
                '                </section>\n' +
                '                <section id="info">\n' +
                '                    <div id="humidity">Humidity: 63 %</div>\n' +
                '                    <div id="wind">Wind speed: 4 m/s</div>\n' +
                '                    <div id="pressure">Atmospheric pressure: 1017 hPa</div>\n' +
                '                    <div id="weather-name">overcast clouds</div>\n' +
                '                </section>\n' +
                '            </section>\n' +
                '        </section>\n' +
                '\n' +
                '    ');
        })
    });

    describe('getAndShowWeather', async function () {
        it('should show mock city weather from OpenWeather', function () {
            const mockSuccess = reply.apiJSON;
            fetchMock.mock('*', mockSuccess);
            const dom = (new JSDOM(html)).window;
            global.document = dom.document;
            global.Handlebars = Handlebars;
            test.getAndShowWeather('kursk');
            assert.equal(document.getElementById('result').innerHTML, '\n' +
                '        <div><b>грузится...</b></div>\n' +
                '    ');
            console.log('loading is fine');
            return test.getAndShowWeather('kursk').then(function (res) {
                assert.equal(document.getElementById('result').innerHTML, '\n' +
                    '        <section id="weather-result">\n' +
                    '\n' +
                    '            <section id="city-name"><b>Kursk</b></section>\n' +
                    '            <section id="weather-section">\n' +
                    '                <section id="temp">\n' +
                    '                    <div><b>-1</b> °C</div>\n' +
                    '                </section>\n' +
                    '                <section id="info">\n' +
                    '                    <div id="humidity">Humidity: 63 %</div>\n' +
                    '                    <div id="wind">Wind speed: 4 m/s</div>\n' +
                    '                    <div id="pressure">Atmospheric pressure: 1017 hPa</div>\n' +
                    '                    <div id="weather-name">overcast clouds</div>\n' +
                    '                </section>\n' +
                    '            </section>\n' +
                    '        </section>\n' +
                    '\n' +
                    '    ');
                console.log('correct result is fine');
                fetchMock.reset();
            });
            fetchMock.reset();
        })
    });

    describe('getAndShowWeather error', async function () {
        it('should show error', function () {
            const mockError = reply.apiErrorJSON;
            fetchMock.mock('*', mockError);
            const dom = (new JSDOM(html)).window;
            global.document = dom.document;
            global.Handlebars = Handlebars;
            test.getAndShowWeather('kursk');
            assert.equal(document.getElementById('result').innerHTML, '\n' +
                '        <div><b>грузится...</b></div>\n' +
                '    ');
            console.log('loading is fine');
            return test.getAndShowWeather('kursk').then(function (res) {
                assert.equal(document.getElementById('result').innerHTML, '\n' +
                    '        ой, такого города нет\n' +
                    '    ');
                console.log('error result is fine');
                fetchMock.reset();
            });
            fetchMock.reset();
        })
    });


    describe('getWeather error', function () {
        it('should get error response from OpenWeather', function () {
            const mockError = reply.apiErrorJSON;
            fetchMock.mock('*', mockError);
            return test.getWeather('kursk').then(function (res) {
                console.log(res);
                assert.equal(400, res.cod);
                fetchMock.reset();
            })
        })
    });

    describe('getAndShowWeather calls', async function () {
        describe('success call', async function () {
            it('should call showLoading, getWeather, formatWeatherData, showWeatherData', function () {
                let spyShowLoading = sinon.spy(test.showLoading);
                let spyFormatWeatherData = sinon.spy(test.formatWeatherData);
                let spyShowWeatherData = sinon.spy(test.showWeatherData);
                let spyGetWeather = sinon.spy((test.getWeather));
                const mockSuccess = reply.apiJSON;
                fetchMock.mock('*', mockSuccess);
                const dom = (new JSDOM(html)).window;
                global.document = dom.document;
                global.Handlebars = Handlebars;
                global.showLoading = spyShowLoading();
                global.formatWeatherData = spyFormatWeatherData(reply.apiJSON);
                global.showWeatherData = spyShowWeatherData(context);
                global.getWeather = spyGetWeather('kursk');
                test.getAndShowWeather('kursk');
                assertSinon(spyShowLoading.calledOnce);
                assertSinon(spyFormatWeatherData.calledOnce);
                assertSinon(spyShowWeatherData.calledOnce);
                assertSinon(spyGetWeather.calledOnce);
                fetchMock.reset();
            });
        });
        describe('error call', async function () {
            it('should call showLoading, getWeather, showError', function () {
                let spyShowLoading = sinon.spy(test.showLoading);
                let spyShowError = sinon.spy(test.showError);
                let spyGetWeather = sinon.spy((test.getWeather));
                const mockSuccess = reply.apiJSON;
                fetchMock.mock('*', mockSuccess);
                const dom = (new JSDOM(html)).window;
                global.document = dom.document;
                global.Handlebars = Handlebars;
                global.showLoading = spyShowLoading();
                global.showWeatherData = spyShowError();
                global.getWeather = spyGetWeather('kursk');
                test.getAndShowWeather('kursk');
                assertSinon(spyShowLoading.calledOnce);
                assertSinon(spyShowError.calledOnce);
                assertSinon(spyGetWeather.calledOnce);
                fetchMock.reset();
            });
        })

    });
});
