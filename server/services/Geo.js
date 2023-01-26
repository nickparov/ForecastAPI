const axios = require("axios");

const Geo = (function () {
    const baseURL = `https://geocoding.geo.census.gov/geocoder/locations/address?benchmark=4&format=json&`;

    function _getQuery(obj) {
        return Object.keys(obj)
            .map((key) => {
                return (
                    encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
                );
            })
            .join("&");
    }

    function _getDataUrl(query) {
        return `${baseURL}${query}`;
    }

    async function getData(params) {
        var query = _getQuery(params);

        const config = {
            method: "get",
            // url: "https://geocoding.geo.census.gov/geocoder/locations/address?benchmark=4&format=json&street=205%20S%20Peoria&city=Chicago&state=Illinois&zip=60607",
            url: _getDataUrl(query),
        };

        let data = null;

        try {
            // make request
            const res = await axios(config);
            // set result data
            data = res.data.result.addressMatches;
        } catch (error) {
            throw new Error(error);
        }

        return data;
    }

    return {
        getData,
    };
})();

module.exports = Geo;
