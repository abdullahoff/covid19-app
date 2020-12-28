import React from 'react';
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";

function Map({centre, zoom}) {
    return (
        <div className = "Map">
            <LeafletMap centre = {centre} zoom = {zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </LeafletMap>
        </div>
    );
}

export default Map;
