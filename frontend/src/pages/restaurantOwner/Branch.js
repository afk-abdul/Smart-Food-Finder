import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const center = [24.8607, 67.0011]; // Default Karachi, Pakistan

function BranchForm({ onBranchAdded })
{
    const API_KEY = process.env.REACT_APP_LOCATIONIQ_API_KEY;

    const [form, setForm] = useState({
        location: "",
        country: "",
        city: "",
        latitude: center[0],
        longitude: center[1],
    });

    const [marker, setMarker] = useState(center);

    // Handle map click to set coordinates
    function MapClickHandler()
    {
        useMapEvents({
            click(e)
            {
                const { lat, lng } = e.latlng;
                setMarker([lat, lng]);
                setForm({ ...form, latitude: lat, longitude: lng });
            },
        });
        return null;
    }

    // Get coordinates from address
    const getCoordinates = async (address) =>
    {
        try
        {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${address}&format=json`
            );
            const location = response.data[0];
            setMarker([parseFloat(location.lat), parseFloat(location.lon)]);
            setForm({
                ...form,
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
            });
        } catch (error)
        {
            console.error("Error fetching location:", error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            await axiosInstance.post("/branchs/", form);
            onBranchAdded(); // Refresh branch list
        } catch (error)
        {
            console.error("Error adding branch:", error);
        }
    };

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add Branch</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Search location"
                        onBlur={(e) => getCoordinates(e.target.value)}
                    />

                    <MapContainer center={marker} zoom={10} style={{ height: "400px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapClickHandler />
                        <Marker position={marker} icon={customIcon}>
                            <Popup>Selected Location</Popup>
                        </Marker>
                    </MapContainer>

                    <button type="submit">Add Branch</button>
                </form>
            </div>
        </main>
    );
}

export default BranchForm;
