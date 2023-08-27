import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker, // to display marker
  InfoWindow, // to showcase info on marker
  useJsApiLoader, // hook to see if map is loaded
  Autocomplete, // enables improved autocompletion
  DirectionsRenderer, // shows route
  Geocoder, // converts lat/lng to address
} from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faX,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./GoogleMaps.css";
const libraries = ["places"];

export default function GoogleMaps() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(/** @type google.maps.Map*/ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const mapRef = useRef(null);

  /** @type React.MutableRefObject<HTMLInputElements> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElements> */
  const destinationRef = useRef();

  const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAP_API;

  const options = {
    disableDefaultUI: true, // allows map full screen
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullScreenControl: true,
  };

  const markerOptions = {
    icon: {
      path: "M9.5,0C4.26,0,0,4.26,0,9.5C0,18,9.5,30,9.5,30S19,18,19,9.5C19,4.26,14.74,0,9.5,0z M9.5,13.3c-1.83,0-3.3-1.47-3.3-3.3c0-1.83,1.47-3.3,3.3-3.3s3.3,1.47,3.3,3.3C12.8,11.83,11.33,13.3,9.5,13.3z",
      fillColor: "#7397cc",
      fillOpacity: 1,
      strokeWeight: 1.5,
      scale: 1.5,
    },
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapApiKey,
    libraries: libraries,
  });

  const geocoder = isLoaded ? new window.google.maps.Geocoder() : null;

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text); // use first direction
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    // originRef.current.value = "";
    destinationRef.current.value = "";
  };

  const getAddressFromLatLng = (latLng) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Reverse geocoding failed"));
        }
      });
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        if (originRef.current) {
          const latLng = {
            lat: latitude,
            lng: longitude,
          };
          try {
            const address = await getAddressFromLatLng(latLng);
            originRef.current.value = address;
          } catch (error) {
            // alert("Reverse geocoding failed:", error);
          }
        }

        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        // alert("Error retrieving location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }, [map]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div id="google-map">
      <div className="search-container">
        <Autocomplete>
          <input
            type="text"
            id="origin-input"
            placeholder="Origin"
            ref={originRef}
          ></input>
        </Autocomplete>
        <Autocomplete>
          <input
            type="text"
            id="destination-input"
            placeholder="Destination"
            ref={destinationRef}
          />
        </Autocomplete>
        <button
          id="find-route-button"
          onClick={calculateRoute}
          title="find route"
        >
          {" "}
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button
          id="clear-route-button"
          onClick={clearRoute}
          title="clear route"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        {latitude && longitude && (
          <button
            title="center"
            onClick={() => map.panTo({ lat: latitude, lng: longitude })}
          >
            <FontAwesomeIcon icon={faLocationDot} />
          </button>
        )}
      </div>
      <div className="flex-row-end">
        <p id="distance">Distance: {distance}</p>
        <p id="duration">Duration: {duration}</p>
      </div>
      <GoogleMap
        zoom={15}
        center={{ lat: latitude, lng: longitude }}
        mapContainerClassName="map-container"
        options={options}
        onLoad={(map) => {
          setMap(map);
        }}
      >
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            onClick={() =>
              handleMarkerClick({
                position: { lat: latitude, lng: longitude },
              })
            }
            options={markerOptions}
          />
        )}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>Latitude: {selectedMarker.position.lat}</p>
              <p>Longitude: {selectedMarker.position.lng}</p>
              <p>
                Distance:{" "}
                {calculateDistance(
                  latitude,
                  longitude,
                  selectedMarker.position.lat,
                  selectedMarker.position.lng
                )}{" "}
                km
              </p>
            </div>
          </InfoWindow>
        )}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  );
}
