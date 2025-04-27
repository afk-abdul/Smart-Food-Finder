import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

function DealsView()
{
    const [deals, setDeals] = useState([]);

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

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Deals</h1>
                </div>

                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
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

                            {/* Display Menu Items in Deal */}
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
                </div>
            </div>
        </main>
    );
}

export default DealsView;
