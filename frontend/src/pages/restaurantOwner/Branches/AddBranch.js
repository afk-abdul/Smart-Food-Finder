import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import
{
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

import { ShoppingBag, Plus, Minus, Trash2, Search, Calendar, ImageIcon, FileText, Check, X } from "lucide-react"
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

    const API_KEYY = "pk.9dc970f03c1af0c730eb78063fbc6248";
    const API_KEY = process.env.REACT_APP_LOCATION_IQ_API_KEY || API_KEYY;

    // Get coordinates from address
    const getCoordinates = async (address) =>
    {
        try
        {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${address}&format=json&addressdetails=1`
            );
            const location = response.data[0];
            setBranches(response.data);
            console.log(response.data);
            // setForm({
            //     ...form,
            //     latitude: parseFloat(location.lat),
            //     longitude: parseFloat(location.lon),
            // });
        } catch (error)
        {
            console.error("Error fetching location:", error);
        }
    };

    function BranchItem({ item })
    {
        const [working, setWorking] = useState(false);

        const [form, setForm] = useState({
            location: "",
            country: "",
            city: "",
            latitude: item.lat,
            longitude: item.lon,
            image_upload: null,
        });

        const handleFileChange = (e) =>
        {
            const file = e.target.files[0] || null;

            if (file)
            {
                const reader = new FileReader();

                reader.onloadend = () =>
                {
                    const base64String = reader.result.split(",")[1]; // remove data:image/... prefix
                    setForm((prevItem) => ({
                        ...prevItem,
                        image_upload: base64String,
                    }));
                };

                reader.readAsDataURL(file); // convert file to base64
            }
        };

        return (
            <div
                key={item.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
                {form?.image_upload ? (
                    <div className="relative">
                        <img
                            src={`data:image/png;base64,${form?.image_upload}` || "/placeholder.png"}
                            alt="Branch preview"
                            className="w-full h-60 object-cover rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, image_upload: null })}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
                <div className="p-4 flex justify-between items-center   ">

                    <div className="">
                        <h3 className="font-bold text-lg">
                            {item.address?.suburb ||
                                item.address?.subdistrict ||
                                item.display_name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {item.address?.city ||
                                item.address?.district ||
                                item.address?.state}
                            , {item.address?.country}
                        </p>
                    </div>
                    <div className="flex justify-end items-center">
                        {/* <input type="file"
                            accept="image/*"
                            onChange={handleFileChange} /> */}
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                onClick={async () =>
                                {
                                    setWorking(true);
                                    try
                                    {
                                        await axiosInstance.post("/branchs/", {
                                            location:
                                                item.address.suburb ||
                                                item.address.subdistrict ||
                                                item.display_name ||
                                                "",
                                            country: item.address.country || "",
                                            city:
                                                item.address.city ||
                                                item.address.district ||
                                                item.address.state ||
                                                "",
                                            latitude: parseFloat(item.lat),
                                            longitude: parseFloat(item.lon),
                                            image_upload: form?.image_upload || undefined,
                                        });
                                        if (onBranchAdded) onBranchAdded(); // Refresh branch list
                                        setForm({
                                            location: "",
                                            country: "",
                                            city: "",
                                            latitude: "",
                                            longitude: "",
                                            image_upload: null,
                                        });
                                        alert("Branch added successfully!");
                                    } catch (error)
                                    {
                                        console.error("Error adding branch:", error);
                                    }
                                    setWorking(false);
                                }}
                                className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                            >
                                {working ? "Adding..." : "Add Branch"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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

                {branches.length <= 0 ? "Search for a location to add a branch" : ""}

                <div className="grid grid-cols-1 gap-2 mb-8">
                    {branches.map((item) => (
                        <BranchItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default BranchForm;
