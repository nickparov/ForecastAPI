import { Properties } from "../Interfaces/Forecast.interface";

interface GeoModel {
    fetch: (street: string, city: string, state: string, zip: string, days: number) => Promise<Properties | null>,
}

export const Geo: GeoModel = {
    fetch: async function (street, city, state, zip, days) {

        const requestOptions: RequestInit = {
            method: 'GET',
        };

        const daysStr = `${days}`;

        const URLParamStr = new URLSearchParams({ street, city, state, zip, days: daysStr }).toString();

        // fetch("https://geocoding.geo.census.gov/geocoder/locations/address?street=205%20S%20Peoria&city=Chicago&state=Illinois&zip=60607&benchmark=4&format=json", requestOptions)
        // const res = await fetch("http://localhost:3000/get/data?street=205%20S%20Peoria&city=Chicago&state=IL&zip=60607", requestOptions);
        let res = null;
        let data: Properties | null = null;
        try {
            res = await fetch("http://localhost:3000/get/data?" + URLParamStr, requestOptions);

            if (!res.ok) {
                throw res.statusText;
            }

            data = await res.json();

            console.log(data);

        } catch (error) {
            throw error;
        }


        return data;
    }
}