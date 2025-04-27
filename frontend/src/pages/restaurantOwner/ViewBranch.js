import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../utils/axiosInstance";
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

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">View Branches</h1>
                </div>
                {loading ? (
                    <p>Loading branches...</p>
                ) : (
                    <>
                        <MapContainer
                            center={[24.8607, 67.0011]} // Default to Karachi, Pakistan
                            zoom={10}
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
                                        <button onClick={() => handleDelete(branch.id)}>Delete</button>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        <h3>Branch List</h3>
                        <ul>
                            {branches.map((branch) => (
                                <li key={branch.id}>
                                    <strong>{branch.location}</strong> ({branch.city}, {branch.country})
                                    <button onClick={() => handleDelete(branch.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </main>
    );
};

export default ViewBranches;
