import React, { useEffect, useState } from "react";
import { Geo } from "../Models/Geo";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useNavigate } from "react-router-dom";
import { Period } from "../Interfaces/Forecast.interface";
import { parse } from "path";

const ErrorFieldMapping = {
    street: 0,
    city: 1,
    state: 2,
    zip: 3,
};

type MappingKey = keyof typeof ErrorFieldMapping;

interface FormComponent {
    updateForecastData: React.Dispatch<React.SetStateAction<[] | Period[]>>;
    setDays: React.Dispatch<React.SetStateAction<number>>;
}

export default function Form(props: FormComponent) {
    const navigate = useNavigate();
    const { updateForecastData, setDays } = props;

    // loading
    const [loading, setLoading] = useState(false);

    // form fields
    const [street, updateStreet] = useState("");
    const [city, updateCity] = useState("");
    const [state, updateState] = useState("");
    const [zip, updateZip] = useState("");
    const [days, updateDays] = useState(3);

    useEffect(() => {
        setDays(days);
    }, [days]);

    // form errors
    // 0 -> street, 1 -> city, 2 -> ....
    const [errors, updateErr] = useState<string[] | null[] | (string | null)[]>(
        [null, null, null, null]
    );

    const getUpdatedErr = (
        errData: (string | null)[],
        fieldID: MappingKey,
        message: string
    ): (string | null)[] => {
        // update
        const newErr = [...errData];
        newErr[ErrorFieldMapping[fieldID]] = message;

        return newErr;
    };

    function resetErrors(): void {
        updateErr([null, null, null, null]);
    }

    function resetFields(): void {
        updateCity("");
        updateStreet("");
        updateState("");
        updateZip("");
    }

    function trimFields(): void {
        updateCity(city.replace(/^\s+|\s+$/gm, ""));
        updateStreet(street.replace(/^\s+|\s+$/gm, ""));
        updateState(state.replace(/^\s+|\s+$/gm, ""));
        updateZip(zip.replace(/^\s+|\s+$/gm, ""));
    }

    function checkLength(fieldValue: string): boolean {
        return (
            fieldValue.length <= 0 || fieldValue.replaceAll(" ", "").length <= 0
        );
    }

    const validated = (): boolean => {
        let flag = true;
        let errData = [...errors];

        // street field rules
        if (checkLength(street)) {
            errData = getUpdatedErr(
                errData,
                "street",
                "Please, enter your street."
            );
            flag = false;
        }

        // city field rules
        if (checkLength(city)) {
            errData = getUpdatedErr(
                errData,
                "city",
                "Please, enter your city."
            );
            flag = false;
        }

        // state field rules
        if (checkLength(state)) {
            errData = getUpdatedErr(
                errData,
                "state",
                "Please, enter your state."
            );
            flag = false;
        }

        // zip field rules
        if (checkLength(zip) || !/^\d+$/.test(zip) || zip.length !== 5) {
            errData = getUpdatedErr(errData, "zip", "Please, enter your zip.");
            flag = false;
        }

        if (!flag) updateErr(errData);

        return flag;
    };

    const getInfoHandler = async () => {
        // validate
        if (!validated()) return;

        // trim
        trimFields();
        setLoading(true);

        let res = null;
        try {
            res = await Geo.fetch(street, city, state, zip, days);
        } catch (error) {
            setLoading(false);
            resetFields();
            alert(error);
        } finally {
            setLoading(false);
        }

        if (res) {
            const forecastData = res.periods;
            const forecastDays = res.days;

            setLoading(false);
            updateForecastData(forecastData);
            setDays(forecastDays);
            navigate("/results");
        }
    };

    return (
        <>
            <h1>Don't know your Forecast?</h1>
            <span>Fill in the fileds below and find out.</span>
            <div className="form-container-custom">
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={1}
                >
                    <Grid item>
                        <TextField
                            id="outlined-basic"
                            label="Street"
                            variant="outlined"
                            onChange={(e) => updateStreet(e.target.value)}
                            onFocus={(e) => resetErrors()}
                            error={errors[0] !== null}
                            helperText={errors[0]}
                            value={street}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="filled-basic"
                            label="City"
                            variant="outlined"
                            onChange={(e) => updateCity(e.target.value)}
                            onFocus={(e) => resetErrors()}
                            error={errors[1] !== null}
                            helperText={errors[1]}
                            value={city}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-basic"
                            label="State"
                            variant="outlined"
                            onChange={(e) => updateState(e.target.value)}
                            onFocus={(e) => resetErrors()}
                            error={errors[2] !== null}
                            helperText={errors[2]}
                            value={state}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-basic"
                            label="zip"
                            variant="outlined"
                            onChange={(e) => updateZip(e.target.value)}
                            onFocus={(e) => resetErrors()}
                            error={errors[3] !== null}
                            helperText={errors[3]}
                            value={zip}
                        />
                    </Grid>
                    <Grid item sx={{ mt: 4 }}>
                        <InputLabel
                            sx={{ mb: 1 }}
                            id="demo-simple-select-disabled-label"
                        >
                            Pick Days Length of Forecast.
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={days}
                            label="Days"
                            onChange={(e) => {
                                updateDays(
                                    typeof e.target.value === "number"
                                        ? e.target.value
                                        : parseInt(e.target.value)
                                );
                            }}
                        >
                            <MenuItem value={3}>Three Days</MenuItem>
                            <MenuItem value={5}>Five Days</MenuItem>
                            <MenuItem value={7}>Week</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </div>
            <LoadingButton
                loading={loading}
                onClick={getInfoHandler}
                variant="outlined"
                sx={{ mt: 4 }}
            >
                GET INFO
            </LoadingButton>
        </>
    );
}
