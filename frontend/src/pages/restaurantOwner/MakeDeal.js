import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function CreateDeal()
{
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [deal, setDeal] = useState({ description: "", total_price: "", date: "", image: null });
    const [loading, setLoading] = useState(true)

    // Fetch Menu Items & Categories
    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                const itemsResponse = await axiosInstance.get("/menu-items/");
                const categoriesResponse = await axiosInstance.get("/menuCategory/");
                setMenuItems(itemsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (error)
            {
                console.error("Error fetching data:", error);
            }
            finally
            {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Toggle selection of menu items
    const toggleItemSelection = (item) =>
    {
        setSelectedItems((prevSelected) =>
        {
            const existing = prevSelected.find((i) => i.id === item.id);
            if (existing)
            {
                return prevSelected.filter((i) => i.id !== item.id); // Remove if already selected
            } else
            {
                return [...prevSelected, { ...item, quantity: 1 }];
            }
        });
    };

    // Handle quantity change
    const handleQuantityChange = (id, quantity) =>
    {
        setSelectedItems((prevSelected) =>
            prevSelected.map((item) =>
                item.id === id ? { ...item, quantity: Number(quantity) } : item
            )
        );
    };

    // Submit Deal
    const handleSubmit = async () =>
    {
        if (!deal.description || !deal.total_price || !deal.date || selectedItems.length === 0)
        {
            alert("Please fill all fields and select at least one item.");
            return;
        }

        try
        {
            await axiosInstance.post("/create-deal/", {
                description: deal.description,
                total_price: deal.total_price,
                dateTime: deal.date,
                image_upload: deal.image_upload,
                items: selectedItems.map((item) => ({ item: item.id, quantity: item.quantity })),
            });
            alert("Deal created successfully!");
            setDeal({ description: "", total_price: "", date: "" });
            setSelectedItems([]);
        } catch (error)
        {
            console.error("Error creating deal:", error);
        }
    };

    const handleFileChange = (e) =>
    {
        const file = e.target.files[0] || null;

        if (file)
        {
            const reader = new FileReader();

            reader.onloadend = () =>
            {
                const base64String = reader.result.split(",")[1]; // remove data:image/... prefix
                setDeal((prevItem) => ({
                    ...prevItem,
                    image_upload: base64String,
                }));
            };

            reader.readAsDataURL(file); // convert file to base64
        }
    };

    return (
        <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create a Deal</h1>
                </div>

                {/* Display Menu Items by Category */}
                {categories.map((category) => (
                    <div key={category.id}>
                        <h3>{category.name}</h3>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                            {menuItems
                                .filter((item) => item.category === category.id)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemSelection(item)}
                                        style={{
                                            border: selectedItems.find((i) => i.id === item.id) ? "2px solid green" : "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            margin: "10px",
                                            width: "200px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img src={item.image || "placeholder.jpg"} alt={item.name} style={{ width: "100px", height: "100px" }} />
                                        <p>{item.name}</p>
                                        <p>{item.description}</p>
                                        <p>total_price: ${item.total_price}</p>
                                        {selectedItems.find((i) => i.id === item.id) && (
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedItems.find((i) => i.id === item.id)?.quantity || 1}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {loading && (<p>Loading...</p>)}


                {/* Deal Form */}
                <div style={{ marginTop: "20px" }}>
                    <h3>Deal Details</h3>
                    <input
                        type="text"
                        placeholder="Description"
                        value={deal.description}
                        onChange={(e) => setDeal({ ...deal, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="total_price"
                        value={deal.total_price}
                        onChange={(e) => setDeal({ ...deal, total_price: e.target.value })}
                    />
                    <input
                        type="date"
                        value={deal.date}
                        onChange={(e) => setDeal({ ...deal, date: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input type="file"
                            accept="image/*"
                            onChange={handleFileChange} />
                    </div>
                    <button onClick={handleSubmit}>Create Deal</button>
                </div>
            </div>
        </main>
    );
}

export default CreateDeal;
