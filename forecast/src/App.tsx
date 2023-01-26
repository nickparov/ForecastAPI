import React, { useState } from "react";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Form from "./components/Form";
import Results from "./components/Results";
import { Period } from "./Interfaces/Forecast.interface";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [forecast, setForecast] = useState<Period[] | []>([]);
    const [userDays, setUserDays] = useState(3);

    return (
        <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
                <div className="App">
                    <CssBaseline />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Form
                                    updateForecastData={setForecast}
                                    setDays={setUserDays}
                                />
                            }
                        />
                        <Route
                            path="/results"
                            element={
                                <Results data={forecast} days={userDays} />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
