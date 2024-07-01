import React from "react";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import './YaMapsLocation.css'

const YaMapsLocation = (props) => {
    const { coords } = props;

    return (
        <div>
            <YMaps query={{ apikey: '7640512c-28c6-40f7-830e-e9edf96bdbd8' }}>
                <div className={"map"}>
                    <div className={"map-container"}>
                        <Map state={{ center: coords, zoom: 8, controls: [] }} className={"map-container"} />
                    </div>
                </div>
            </YMaps>
        </div>
    );
};

export default YaMapsLocation;