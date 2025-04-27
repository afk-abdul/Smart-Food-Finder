import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Positioning
    popupAnchor: [1, -34],
});


const BranchMap = () =>
{
    const API_KEY = process.env.REACT_APP_LOCATIONIQ_API_KEY; // Store in .env file
    const [position, setPosition] = useState([40.7128, -74.006]); // Default to New York
    const [address, setAddress] = useState("");

    // Function to get coordinates from an address
    const getCoordinates = async (address) =>
    {
        console.log(address)
        try
        {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${address}&format=json`
            );
            const location = response.data[0]; // Get first match
            setPosition([parseFloat(location.lat), parseFloat(location.lon)]);
        } catch (error)
        {
            console.error("Error fetching location:", error);
        }
    };

    // Function to get address from coordinates (Reverse Geocoding)
    const getAddress = async (lat, lon) =>
    {
        try
        {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
            );
            setAddress(response.data.display_name);
        } catch (error)
        {
            console.error("Error fetching address:", error);
        }
    };

    // Handle map click to get new coordinates
    const handleMapClick = (e) =>
    {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        getAddress(lat, lng);
    };

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Branch Location</h1>
                </div>
                {/* <div style={{ textAlign: "center", marginTop: "20px" }}> */}
                <input
                    type="text"
                    placeholder="Enter location"
                    onBlur={(e) => getCoordinates(e.target.value)}
                    style={{ padding: "10px", width: "300px" }}
                />
                <p>{address}</p>
                <MapContainer center={position} zoom={13} style={{ height: "400px", width: "80%", margin: "auto" }} onClick={handleMapClick}>
                    <TileLayer
                        url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                    />
                    <Marker position={position} icon={customIcon}>
                        <Popup>Selected Location</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </main>
    );
};

export default BranchMap;
