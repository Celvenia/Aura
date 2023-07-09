import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./GoogleMaps.css";

export default function GoogleMaps() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAP_API;

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const mapRef = useRef(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterRestaurants = () => {
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  const filteredRestaurants = filterRestaurants();

  useEffect(() => {
    // Request the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.log("Error retrieving location:", error);
      }
    );
  }, []);

  const searchNearbyRestaurants = async () => {
    if (!window.google || !window.google.maps) {
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: { lat: latitude, lng: longitude },
      radius: 500,
      type: "restaurant",
      keyword: searchQuery,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results);
      } else {
        console.log("Error fetching nearby restaurants:", status);
      }
    });
  };

  const handleLoad = () => {
    searchNearbyRestaurants();
  };

  const handleMapClick = () => {
    setSelectedMarker(null);
  };

  const handleSearch = () => {
    searchNearbyRestaurants();
  };

  return (
    <div id="google-map">
      {latitude && longitude && (
        <LoadScript
          googleMapsApiKey={googleMapApiKey}
          onLoad={handleLoad}
          libraries={["places"]}
        >
          <GoogleMap
            zoom={15}
            center={{ lat: latitude, lng: longitude }}
            mapContainerClassName="map-container"
            options={options}
            onClick={handleMapClick}
            onLoad={(map) => {
              mapRef.current = map;
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
              />
            )}
            {filteredRestaurants.map((restaurant) => (
              <Marker
                key={restaurant.place_id}
                position={{
                  lat: restaurant.geometry.location.lat(),
                  lng: restaurant.geometry.location.lng(),
                }}
                onClick={() =>
                  handleMarkerClick({
                    position: {
                      lat: restaurant.geometry.location.lat(),
                      lng: restaurant.geometry.location.lng(),
                    },
                    name: restaurant.name,
                  })
                }
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h3>{selectedMarker.name}</h3>
                  <p>Latitude: {selectedMarker.position.lat()}</p>
                  <p>Longitude: {selectedMarker.position.lng()}</p>
                  <p>
                    Distance:{" "}
                    {calculateDistance(
                      latitude,
                      longitude,
                      selectedMarker.position.lat(),
                      selectedMarker.position.lng()
                    )}{" "}
                    km
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for restaurants..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {filteredRestaurants.length > 0 && (
        <div className="restaurant-list">
          <h2>Nearby Restaurants</h2>
          <ul>
            {filteredRestaurants.map((restaurant) => (
              <li key={restaurant.place_id}>
                <p>{restaurant.name}</p>
                <p>
                  Distance:{" "}
                  {calculateDistance(
                    latitude,
                    longitude,
                    restaurant.geometry.location.lat(),
                    restaurant.geometry.location.lng()
                  )}{" "}
                  km
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
