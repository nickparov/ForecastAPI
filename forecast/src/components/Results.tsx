import { Button, Card, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Period } from "../Interfaces/Forecast.interface";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";

interface ResultsComponent {
    data: Period[] | [];
    days: number;
}

function ForecastElement(props: Period) {
    const startDate = new Date(props.startTime);
    // date pieces
    const dateStr =
        startDate.getUTCFullYear() +
        "/" +
        `${startDate.getUTCMonth() + 1}` +
        "/" +
        startDate.getUTCDate();

    console.log(startDate.getUTCMonth(), dateStr);

    return (
        <Card>
            <React.Fragment>
                <CardContent>
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                    >
                        {dateStr}
                        <br />
                        {props.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {props.shortForecast}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {props.temperature} - {props.temperatureUnit}
                    </Typography>
                    <Typography variant="body2">
                        Wind direction: {props.windDirection}
                        <br />
                        Speed: {props.windSpeed}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* <Button size="small">Learn More</Button> */}
                </CardActions>
            </React.Fragment>
        </Card>
    );
}

export default function Results(props: ResultsComponent) {
    const navigate = useNavigate();

    function goBackHandler() {
        navigate(-1);
    }

    function navigateHome() {
        navigate("/");
    }

    // run once rendered
    useEffect(() => {
        if (props.data.length === 0) {
            navigateHome();
        }
    }, []);

    const { data, days } = props;

    const numOfEntries = days * 2;
    const forecastSliced = data.slice(0, numOfEntries);

    const ForecastList = forecastSliced.map((el, idx) => {
        return (
            <Grid item xs={2} sm={4} md={4} key={idx}>
                <ForecastElement {...el} />
            </Grid>
        );
    });

    return (
        <Container maxWidth="xl" sx={{ m: 4, mb: 12 }}>
            <h1>Forecast for the next 7 days:</h1>
            <Grid
                sx={{ mb: 12 }}
                container
                spacing={{ xs: 4, md: 4 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {ForecastList}
            </Grid>

            <Button onClick={goBackHandler} variant="outlined">
                GO BACK
            </Button>
        </Container>
    );
}
