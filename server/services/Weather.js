const axios = require("axios");

const Weather = (function () {
    const baseURL = `https://api.weather.gov/points/`;

    // function _getQuery(obj) {
    //     return Object.keys(obj).map((key) => {
    //         return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    //     }).join('&');
    // }

    function _getDataUrl(coords) {
        const { x, y } = coords;

        return `${baseURL}${y},${x}`;
    }

    async function getData(coords) {
        const config = {
            method: "get",
            url: _getDataUrl(coords),
        };

        let data = null;

        try {
            // make request
            const res = await axios(config);
            // set result data
            data = res.data;
        } catch (error) {
            throw new Error(error);
        }

        return data;
    }

    async function getForecast(coords) {
        const allData = await getData(coords);
        const forecastURL = allData.properties.forecast;

        const config = {
            method: "get",
            url: forecastURL,
        };

        try {
            // make request
            const res = await axios(config);
            // set result data
            data = res.data.properties;
        } catch (error) {
            throw new Error(error);
        }

        return data;
    }

    return {
        getData,
        getForecast,
    };
})();

module.exports = Weather;
