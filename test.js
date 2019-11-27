const test = require('./script');
const reply  = require('./reply');

const _ = require('lodash');
const fetchMock = require('fetch-mock');
const assert = require('assert');

describe('Functions from script.js', function () {
    describe('formatWeatherData', function () {
        it('should parse json from api to context object', function () {
            assert(_.isEqual({
                "city": "Kursk",
                "temp": -1,
                "humidity": 63,
                "wind": 4,
                "pressure": 1017,
                "weatherInfo": "overcast clouds"
            }, test.formatWeatherData(reply.apiJSON)))
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
    })
})
