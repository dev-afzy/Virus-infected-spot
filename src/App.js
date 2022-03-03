import React, { useState, useEffect, useCallback, useRef } from "react";
import { Spin } from 'antd';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polygon,
  Circle
} from "@react-google-maps/api";

import { formatDistance, subDays } from "date-fns";
import Search from './Search';
import Locate from './Locate';
import 'antd/dist/antd.min.css';
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ['places'];

const googleOptions = {
  zoom: 14,
  center: { lat: 31.483854943560956, lng: 74.38654789589322 },
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
}

const polygonOptions = {
  fillColor: "#0000FF",
  fillOpacity: 0.35,
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
  paths: [
    { lat: 31.47484396429631, lng: 74.3750173087037 },
    { lat: 31.4869206579151, lng: 74.3855642934348 },
    { lat: 31.47912130479585, lng: 74.40879716186939 },
    { lat: 31.46282862364127, lng: 74.40894467214535 },
    { lat: 31.464937758152946, lng: 74.39001165528641 },
    { lat: 31.47484396429631, lng: 74.3750173087037 },
  ],
}

const circleOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 1,
  strokeWeight: 5,
  fillColor: '#FF0000',
  fillOpacity: 0.2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 100,
  center: { lat: 31.483854943560956, lng: 74.38654789589322 },
  zIndex: 1
}

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

export default function App() {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCJPvUs0mK-WOsx6M0uOf7xzrvI3MVcPcw",
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

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
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
            <img src="https://img.icons8.com/external-others-phat-plus/64/000000/external-corona-covid-19-color-line-others-phat-plus-19.png" alt="logo" />          </span>
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
          <Circle
            options={circleOptions}
          />
          <Polygon
            options={polygonOptions}
          />
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