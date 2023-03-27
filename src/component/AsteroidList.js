import {useEffect, useState} from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import AsteroidDetails from "./AsteroidDetails";
import 'jquery/dist/jquery';
import 'moment/moment';
import moment from "moment";
import {NASA_API_KEY} from "../Constant";


function AsteroidList() {
    const [asteroids, setAsteroids] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    const [isListLoading, setIsListLoading] = useState(true);
    const [asteroid, setAsteroid] = useState(null);
    const [dates, setDates] = useState({
        startDate: "",
        endDate: "",
    })

    const listVisibilityHandler = () => {
        setIsListVisible((prevState) => !prevState);
    }

    const asteroidIdHandler = (asteroid) => {
        setAsteroid(asteroid);
    }

    const dateRangePickerHandler = (event, picker) => {
        const startDate = moment(picker.startDate).format('YYYY-MM-DD');
        const endDate = moment(picker.endDate).format('YYYY-MM-DD');
        setDates({
            startDate,
            endDate,
        });
    }

    useEffect(() => {
        const fetchAsteroids = async () => {
            setIsListVisible(false);
            setIsListLoading(true);
            const URL = "https://api.nasa.gov/neo/rest/v1/feed?" +
                "start_date=" + dates.startDate + "&end_date=" + dates.endDate +
                "&api_key=" + NASA_API_KEY;
            try {
                const response = await fetch(URL);
                const data = await response.json();
                const asteroidList = Object.values(data.near_earth_objects).flat();
                console.log(asteroidList);
                setAsteroids(asteroidList);
                setIsListLoading(false);
                setIsListVisible(true);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAsteroids();
    }, [dates]);

    return (<>
        {isListLoading && <div>Loading...</div>}
        {isListVisible &&
            <> <DateRangePicker
                onApply={dateRangePickerHandler}
            >
                <i className="bi bi-calendar2-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                         className="mt-3 bi bi-calendar2-date" viewBox="0 0 16 16">
                        <path
                            d="M6.445 12.688V7.354h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>
                        <path
                            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>
                </i>
            </DateRangePicker>
                {asteroids
                    .sort((a, b) => {
                        return parseFloat(a.close_approach_data[0].miss_distance.kilometers) -
                            parseFloat(b.close_approach_data[0].miss_distance.kilometers)
                    })
                    .map((asteroid) => {
                        const isHazardous = asteroid.is_potentially_hazardous_asteroid;
                        return (
                            <div className="card my-2" key={asteroid.id}>
                                <div className="card-body">
                                    <h3 className={`card-title ${isHazardous ? "link-danger" : "link-success"}`}
                                        role={"button"}
                                        onClick={() => {
                                            asteroidIdHandler(asteroid);
                                            listVisibilityHandler();
                                        }}
                                    >
                                        {`${asteroid.name}`}
                                    </h3>
                                    <p className="card-text">{`Miss distance
                                            (km): ${asteroid.close_approach_data[0].miss_distance.kilometers}`}</p>
                                </div>
                            </div>
                        )
                    })}
            </>}

        {!isListVisible && asteroid &&
            <AsteroidDetails
                asteroid={asteroid}
                onClose={() => {
                    asteroidIdHandler(null);
                    listVisibilityHandler();
                }}
            />

        }
    </>);
}

export default AsteroidList;
