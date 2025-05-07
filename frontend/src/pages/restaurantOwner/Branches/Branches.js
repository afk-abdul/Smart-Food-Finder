import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../../utils/axiosInstance";
import L from "leaflet";
import { Search, Plus, Edit, Trash2, Filter, Camera, LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom";

// Fix Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Navigate } from "react-router-dom";

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const ViewBranches = () =>
{
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        axiosInstance
            .get("/branchs/")
            .then((response) =>
            {
                setBranches(response.data);
                setLoading(false);
            })
            .catch((error) =>
            {
                console.error("Error fetching branches:", error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (branchId) =>
    {
        if (window.confirm("Are you sure you want to delete this branch?"))
        {
            try
            {
                await axiosInstance.delete(`/branchs/${branchId}/`);
                setBranches(branches.filter((branch) => branch.id !== branchId));
            } catch (error)
            {
                console.error("Error deleting branch:", error);
            }
        }
    };

    const navigate = useNavigate();


    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">View Branches</h1>
                    <button
                        onClick={() =>
                        {
                            navigate("/owner/create-branch")
                        }}
                        className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                    >
                        New Branch
                    </button>
                </div>
                {loading ? (
                    <p>Loading branches...</p>
                ) : (
                    <>
                        <MapContainer
                            center={[31, 70]} // Default to Karachi, Pakistan
                            zoom={5}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {branches.map((branch) => (
                                <Marker
                                    key={branch.id}
                                    position={[branch.latitude, branch.longitude]}
                                    icon={customIcon}
                                >
                                    <Popup>
                                        <strong>{branch.location}</strong>
                                        <br />
                                        {branch.city}, {branch.country}
                                        <br />
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        <div className="flex justify-between items-center my-2">
                            <h1 className="text-2xl font-bold">Branch List</h1>
                        </div>

                        <div className="grid grid-cols-1 gap-2 mb-8">
                            {branches.map((item) => (
                                <div
                                    key={item.id}
                                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-4">
                                        <div className="relative h-60">
                                            <img
                                                src={`data:image/png;base64,${item.image}` || "/placeholder.png"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col justify-between items-start">
                                                <h3 className="font-bold text-lg">{item.location}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{item.city}, {item.country}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default ViewBranches;
