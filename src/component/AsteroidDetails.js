import {useEffect, useState} from "react";
import {NASA_API_KEY, NEO_LOOK_UP_URL} from "../Constant";

const AsteroidDetails = (props) => {
    const [asteroid, setAsteroid] = useState(null);
    const [isCloseApproachDatesVisible, setIsCloseApproachDatesVisible] = useState(false);
    const [isEstimatedDiameterVisible, setIsEstimatedDiameterVisible] = useState(false);

    useEffect(() => {
        const fetchAsteroid = async () => {
            const URL = NEO_LOOK_UP_URL + "/" + props.asteroid.id +
                "?api_key=" + NASA_API_KEY;
            try {
                const response = await fetch(URL);
                const data = await response.json();
                console.log(data)
                setAsteroid(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchAsteroid();
    }, [props.asteroid.id]);

    return (<>
        {!asteroid && <div>Loading...</div>}
        {asteroid &&
            <>
                <div className={"d-flex mt-4 align-items-center justify-content-between"}>
                    <h1 className={`"p-0 m-0" ${asteroid.is_potentially_hazardous_asteroid === true ? "text-danger" : "text-success"}`}>{`Asteroid: ${asteroid.name}`}</h1>
                    <button className={"btn btn-close"}
                            onClick={() => {
                                props.onClose();
                            }
                            }></button>
                </div>
                <div className="card my-2">
                    <div className="card-body">
                        <p className="card-text font-size-">
                            <strong>{`Absolute magnitude: ${asteroid.absolute_magnitude_h}`}</strong>
                        </p>
                        <p className="card-text">
                            <strong>{`Designation: ${asteroid.designation}`}</strong>
                        </p>
                        <p className="card-text link-primary"
                           role={"button"}
                           onClick={() => {
                               setIsCloseApproachDatesVisible(!isCloseApproachDatesVisible)
                           }}><strong>Close approach dates</strong>
                        </p>
                        {isCloseApproachDatesVisible &&
                            <div
                                className={"mb-3 d-flex flex-wrap row-cols-auto justify-content-center border border-dark border-opacity-25"}>
                                {asteroid.close_approach_data.map((data, index) => {
                                    return <span className={"m-2"} key={index}>
                                        {`${data.close_approach_date}`}
                                    </span>
                                })}
                            </div>}
                        <p className="card-text link-primary"
                           role={"button"}
                           onClick={() => {
                               setIsEstimatedDiameterVisible(!isEstimatedDiameterVisible)
                           }}><strong>Estimated diameter (km)</strong>
                        </p>
                        {isEstimatedDiameterVisible &&
                            <div
                                className={"mb-3 d-flex flex-wrap row-cols-auto justify-content-center border border-dark border-opacity-25"}>
                                    <span className="m-2">
                                        {`MIN: ${asteroid.estimated_diameter.kilometers.estimated_diameter_min}`}
                                    </span>
                                <span className="m-2">
                                        {`MAX: ${asteroid.estimated_diameter.kilometers.estimated_diameter_max}`}
                                    </span>
                            </div>}
                        <p className="card-text">
                            <strong>{`Orbital period: ${asteroid.orbital_data.orbital_period}`}</strong>
                        </p>
                    </div>
                </div>
            </>}
    </>);
}

export default AsteroidDetails;
