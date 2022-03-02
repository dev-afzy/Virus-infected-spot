import React, { useState, useEffect, useCallback, useRef } from "react";
import { Spin } from 'antd';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { formatDistance, subDays } from "date-fns";
import Search from './Search';
import Locate from './Locate';
import 'antd/dist/antd.css';
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ['places'];

const googleOptions = {
  zoom: 10,
  center: {
    lat: 25.2048,
    lng: 55.2708
  },
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
}

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

export default function App() {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries,
  });

  const [marker, setMarker] = useState([]);
  const [selected, setSelected] = useState(null);
  const onMapClick = useCallback((event) => {
    setMarker((current) => [...current, { lat: event.latLng.lat(), lng: event.latLng.lng(), time: new Date() }])
  }, [])
  const mapRef = useRef();
  const mapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])
  useEffect(() => console.log({ marker }), [marker]);

  const panTo = useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(15);
  }, [])
  const Spinner = () => {
    return (
      <div className="spinner">
        <Spin />
      </div>)
  }
  

  const renderMap = () => {
    return (
      <div>
        <h1>
          <span role="img" aria-label="tent">
            <img src="https://img.icons8.com/external-others-phat-plus/64/000000/external-corona-covid-19-color-line-others-phat-plus-19.png" alt="logo"/>          </span>
          INFECTED SPOT{" "}

        </h1>
        <Search panTo={panTo} />
        <Locate panTo={panTo} />
        <GoogleMap
          options={googleOptions}
          mapContainerStyle={mapContainerStyle}
          onClick={onMapClick}
          onLoad={mapLoad}
        >
          {
            marker.map((point, i) => <Marker key={i} position={point} icon={{
              url: "https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/30/000000/external-coronavirus-virus-transmission-flatart-icons-lineal-color-flatarticons-2.png",
              scaledSize: new window.google.maps.Size(30, 30), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(15, 15)
            }} onClick={() => setSelected(point)} />)
          }
          {
            selected && (<InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
              <div>
                <b>Reported At</b>
                <br></br>
                <span> {
                  formatDistance(subDays(selected.time, 0), new Date(), { addSuffix: true })}</span>
              </div>

            </InfoWindow>)
          }
        </GoogleMap>
      </div>
    );
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? renderMap() : <Spinner />
}