import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { Search, Plus, Edit, Trash2, Filter, Camera, LogOut, User } from "lucide-react"

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
    const [branches, setBranches] = useState([]);

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
                `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${address}&format=json&addressdetails=1`
            );
            const location = response.data[0];
            setMarker([parseFloat(location.lat), parseFloat(location.lon)]);
            setBranches(response.data);
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
                    <div className="flex justify-center items-center gap-2">
                        <input
                            type="text"
                            onKeyUp={(e) =>
                            {
                                if (e.key === "Enter")
                                {
                                    getCoordinates(e.target.value);
                                    e.target.blur();
                                }
                            }}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                            placeholder="Search location"
                        />
                    </div>
                </div>

                {branches.length <= 0 ? ("Search for a location to add a branch") : ""}

                <div className="grid grid-cols-1 gap-2 mb-8">
                    {branches.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-4 flex justify-between items-center   ">
                                <div className="flex justify-between items-baseline gap-2">
                                    <h3 className="font-bold text-lg">{item.address.suburb || item.address.subdistrict || item.display_name}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{item.address.city || item.address.district || item.address.state}, {item.address.country}</p>
                                </div>
                                <div className="flex justify-between items-end">

                                    <div className="flex space-x-2">

                                        <button
                                            type="submit"
                                            onClick={async () =>
                                            {
                                                setForm();
                                                try
                                                {
                                                    await axiosInstance.post("/branchs/", {
                                                        location: item.address.suburb || item.address.subdistrict || item.display_name || "",
                                                        country: item.address.country || "",
                                                        city: item.address.city || item.address.district || item.address.state || "",
                                                        latitude: parseFloat(item.lat),
                                                        longitude: parseFloat(item.lon),
                                                    });
                                                    if (onBranchAdded) onBranchAdded(); // Refresh branch list
                                                    alert("Branch added successfully!");
                                                } catch (error)
                                                {
                                                    console.error("Error adding branch:", error);
                                                }
                                            }}
                                            className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                                        >
                                            Add Branch
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default BranchForm;
