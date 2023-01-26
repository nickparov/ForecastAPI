const express = require("express");
const cors = require("cors");

const Geo = require("./services/Geo");
const Weather = require("./services/Weather");

const app = express();
const port = 3000;

// middlewares
// app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
    })
);

/**
 * Route: get/data/ GET
 * Query Params: street, city, state, zip
 * Returns: Forecast in JSON format
 */
app.get("/get/data", async (req, res) => {
    let resData = null;

    try {
        const geoRes = await Geo.getData(req.query);

        const { coordinates } = geoRes[0];
        const weatherRes = await Weather.getForecast(coordinates);

        const filteredDays = parseInt(req.query.days);

        if (Number.isNaN(filteredDays))
            throw new Error("User is trying to play with us.");

        const finalRes = { ...weatherRes, days: filteredDays };

        resData = finalRes;
    } catch (error) {
        res.sendStatus(404);
        console.error(error);

        return;
    }

    res.json(resData);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
