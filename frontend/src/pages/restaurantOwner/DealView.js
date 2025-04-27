import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from 'react-router-dom';
import
{
    ShoppingBag,
    Search,
    Filter,
    Plus,
    Calendar,
    Tag,
    CheckCircle,
    XCircle,
    ChevronDown,
    Edit,
    Trash2,
    Eye,
} from "lucide-react"

function DealsView()
{
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true)


    // Fetch Deals
    useEffect(() =>
    {
        const fetchDeals = async () =>
        {
            try
            {
                const response = await axiosInstance.get("/create-deal/");
                console.log(response.data);
                setDeals(response.data);
            } catch (error)
            {
                console.error("Error fetching deals:", error);
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    // Toggle is_valid status
    const toggleValidity = async (deal) =>
    {
        try
        {
            const updatedDeal = { ...deal, is_valid: !deal.is_valid };
            await axiosInstance.put(`/update-deal/${deal.id}/`, updatedDeal);
            setDeals((prevDeals) =>
                prevDeals.map((d) => (d.id === deal.id ? updatedDeal : d))
            );
        } catch (error)
        {
            console.error("Error updating deal validity:", error);
        }
    };

    // Handle Date Change
    const handleDateChange = async (deal, newDateTime) =>
    {
        try
        {
            const newDate = newDateTime.split("T")[0];
            const updatedDeal = { ...deal, dateTime: newDate };
            await axiosInstance.put(`/update-deal/${deal.id}/`, updatedDeal);
            setDeals((prevDeals) =>
                prevDeals.map((d) => (d.id === deal.id ? updatedDeal : d))
            );
        } catch (error)
        {
            console.error("Error updating deal date:", error);
        }
    };

    // Ensure date is in "yyyy-MM-ddThh:mm" format
    const formatDateTime = (dateStr) =>
    {
        if (!dateStr) return ""; // Handle empty values
        return `${dateStr}T00:00`; // Append time if missing
    };
    // Format date
    const formatDate = (dateString) =>
    {
        const options = { day: "2-digit", month: "short", year: "numeric" }
        return new Date(dateString).toLocaleDateString("en-US", options)
    }

    // Format currency
    const formatCurrency = (amount) =>
    {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }



    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Deals</h1>
                    <Link to="/owner/create-deal" className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]">
                        New Deal
                    </Link>
                </div>

                {loading && (<p>Loading...</p>)}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deals.map((deal) => (
                        <div
                            key={deal.id}
                            className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48">
                                <img
                                    src={`data:image/png;base64,${deal.image}` || "/placeholder.svg"}
                                    alt={deal.description}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
                                <div className="absolute top-2 right-2">
                                    {deal.is_valid ? (
                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            ACTIVE
                                        </span>
                                    ) : (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            INACTIVE
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">Deal #{deal.id}</h3>
                                    <span className="font-bold text-[#F97316]">{formatCurrency(deal.total_price)}</span>
                                </div>

                                <p className="text-gray-600 mb-4">{deal.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Valid until: {formatDate(deal.dateTime)}
                                    </div>
                                    <div className="flex items-start text-sm text-gray-500">
                                        <Tag className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                                        <div>
                                            {deal.items.map((item, index) => (
                                                <span key={item.id}>
                                                    {item.item_name} (x{item.quantity}){index < deal.items.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t">
                                    <button
                                        onClick={() => toggleValidity(deal)}
                                        className={`text-sm px-3 py-1 rounded ${deal.is_valid
                                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                                            : "bg-green-100 text-green-600 hover:bg-green-200"
                                            }`}
                                    >
                                        {deal.is_valid ? "Dectivate" : "Activate"}
                                    </button>
                                    <div className="flex space-x-2">

                                        <button className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                        // onClick={() => handleDeleteDeal(deal.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {deals.map((deal) => (
                        <div
                            key={deal.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "15px",
                                margin: "10px",
                                width: "250px",
                            }}
                        >
                            <h3>Deal #{deal.id}</h3>
                            <p><strong>Description:</strong> {deal.description}</p>
                            <p><strong>Price:</strong> ${deal.total_price}</p>
                            <p>
                                <strong>Date:</strong>{" "}
                                <input
                                    type="datetime-local"
                                    value={formatDateTime(deal.dateTime)}
                                    onChange={(e) => handleDateChange(deal, e.target.value)}
                                />
                            </p>
                            <p>
                                <strong>Valid:</strong> {deal.is_valid ? "✅ Yes" : "❌ No"}
                            </p>
                            <button onClick={() => toggleValidity(deal)}>
                                {deal.is_valid ? "Invalidate" : "Validate"}
                            </button>

                            <p><strong>Items:</strong></p>
                            <ul>
                                {deal.items.map((item, index) => (
                                    <li key={index}>
                                        {item.item_name} (x{item.quantity})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div> */}
            </div>
        </main>
    );
}

export default DealsView;
