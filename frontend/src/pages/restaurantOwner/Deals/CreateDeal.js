import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { ShoppingBag, Plus, Minus, Trash2, Search, Calendar, ImageIcon, FileText, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
function CreateDeal()
{
    let { dealId } = useParams();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [deal, setDeal] = useState({ description: "", total_price: "", dateTime: "", image: null });
    const [loading, setLoading] = useState(true)

    const [selectedCategory, setSelectedCategory] = useState(0)

    const [working, setWorking] = useState(false)

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
                console.log("Menu Items:", itemsResponse.data);

                if (dealId)
                {
                    const dealResponse = await axiosInstance.get(`/create-deal/`);
                    console.log(dealResponse.data);
                    const dealData = dealResponse.data.find(d => d.id == dealId);
                    if (dealData)
                    {
                        setDeal(dealData);
                        let dealItemIds = dealData.items.map((item) => item.item)
                        let selectedItems = itemsResponse.data.filter(i => dealItemIds.includes(i.id)).map((item) =>
                        {
                            const selectedItem = dealData.items.find((i) => i.item === item.id);
                            return {
                                ...item,
                                quantity: selectedItem ? selectedItem.quantity : 1, // Set quantity to 1 if not found
                            };
                        });
                        console.log("Selected Items:", selectedItems)
                        setSelectedItems(selectedItems)
                    }
                }


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

    const navigate = useNavigate();


    // Submit Deal
    const handleSubmit = async () =>
    {
        console.log("Submitting deal:", deal, selectedItems);
        if (!deal.description || !deal.dateTime || selectedItems.length === 0)
        {
            alert("Please fill all fields and select at least one item.");
            return;
        }
        setWorking(true)

        if (dealId)
        {
            try
            {
                await axiosInstance.put(`/update-deal/${dealId}/`, {
                    description: deal.description,
                    total_price: totalPrice,
                    dateTime: deal.dateTime,
                    image_upload: deal.image_upload,
                    items: selectedItems.map((item) => ({ item: item.id, quantity: item.quantity })),
                });
                setDeal({ description: "", total_price: "", dateTime: "" });
                setSelectedItems([]);
                navigate("/owner/deals")

            } catch (error)
            {
                console.error("Error updating deal:", error);
            }
        }
        else
        {
            try
            {
                await axiosInstance.post("/create-deal/", {
                    description: deal.description,
                    total_price: totalPrice,
                    dateTime: deal.dateTime,
                    image_upload: deal.image_upload,
                    items: selectedItems.map((item) => ({ item: item.id, quantity: item.quantity })),
                });
                setDeal({ description: "", total_price: "", dateTime: "" });
                setSelectedItems([]);
                navigate("/owner/deals")

            } catch (error)
            {
                console.error("Error creating deal:", error);
            }
        }
        setWorking(false)
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


    ///
    const handleAddItem = (item) =>
    {
        const existingItem = selectedItems.find((i) => i.id === item.id)

        if (existingItem)
        {
            setSelectedItems(selectedItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)))
        } else
        {
            setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
        }
    }

    // Handle removing an item from the deal
    const handleRemoveItem = (itemId) =>
    {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
    }

    // Handle changing item quantity
    const handleQuantityChange = (itemId, newQuantity) =>
    {
        if (newQuantity < 1) return

        setSelectedItems(selectedItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }

    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="p-6 bg-[#FFF8EE] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Menu Items Selection */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className="text-xl font-bold">{dealId ? "Update" : "Create"} Deal</h2>

                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                    {/* Search */}
                                    {/* <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                        />
                                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                    </div> */}
                                    {loading && (
                                        <p className="text-gray-500">Loading...</p>
                                    )}
                                </div>

                            </div>



                            {/* Category Tabs */}
                            <div className="mb-6 overflow-x-auto">
                                <div className="flex space-x-2 min-w-max">
                                    <button
                                        key={0}
                                        onClick={() => setSelectedCategory(0)}
                                        className={`px-4 py-2 rounded-md ${selectedCategory === 0
                                            ? "bg-[#F97316] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`px-4 py-2 rounded-md ${selectedCategory === category.id
                                                ? "bg-[#F97316] text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Menu Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                                {menuItems.filter(i => (i.category === selectedCategory || selectedCategory === 0)).map((item) => (
                                    <div
                                        key={item.id}
                                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="h-32 bg-gray-100">
                                            <img
                                                src={`data:image/png;base64,${item.image}` || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{item.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#F97316]">${item.price}</span>
                                                <button
                                                    onClick={() => handleAddItem(item)}
                                                    className="p-1 bg-[#F97316] text-white rounded-full hover:bg-[#EA580C]"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}



                                {!loading && menuItems.filter(i => (i.category === selectedCategory || selectedCategory === 0)).length === 0 && (
                                    <div className="col-span-full text-center py-10">
                                        <p className="text-gray-500">No items found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Deal Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4">Deal Summary</h2>

                            {selectedItems.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg mb-4">
                                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-2 text-gray-500">No items added to the deal yet</p>
                                    <p className="text-sm text-gray-400">Select items from the menu to add them to your deal</p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="max-h-80 overflow-y-auto pr-2">
                                        {selectedItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between py-3 border-b">
                                                <div className="flex items-center">
                                                    <img
                                                        src={`data:image/png;base64,${item.image}` || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded mr-3"
                                                    />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-500">${item.price} each</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="p-1 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="mx-2 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="p-1 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="ml-2 p-1 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg mt-2 ">
                                        <span>Total:</span>
                                        <span className="text-[#F97316]">${totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            {/* Deal Details Form */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-3">Deal Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <FileText className="inline-block w-4 h-4 mr-1" />
                                            Description
                                        </label>
                                        <textarea
                                            value={deal.description}
                                            onChange={(e) => setDeal({ ...deal, description: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                            rows="3"
                                            placeholder="Enter deal description"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar className="inline-block w-4 h-4 mr-1" />
                                            Valid Until
                                        </label>
                                        <input
                                            type="date"
                                            value={deal.dateTime}
                                            onChange={(e) => setDeal({ ...deal, dateTime: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <ImageIcon className="inline-block w-4 h-4 mr-1" />
                                            Deal Image
                                        </label>

                                        {deal.image && (
                                            <div className="mb-2">
                                                <img
                                                    src={`data:image/png;base64,${deal.image}`}
                                                    alt="Deal"
                                                    className="w-32 h-32 object-cover rounded-md mb-2"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <input type="file"
                                                accept="image/*"
                                                onChange={handleFileChange} />
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_valid"
                                            checked={deal.is_valid}
                                            onChange={(e) => setDeal({ ...deal, is_valid: e.target.checked })}
                                            className="h-4 w-4 text-[#F97316] focus:ring-[#F97316] border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_valid" className="ml-2 block text-sm text-gray-700">
                                            Deal is active and valid
                                        </label>
                                    </div> */}
                                </div>

                                <button
                                    disabled={selectedItems.length === 0}
                                    className={`w-full mt-6 py-3 px-4 rounded-md font-medium flex items-center justify-center
                    ${selectedItems.length === 0
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#F97316] text-white hover:bg-[#EA580C]"
                                        }`}
                                    onClick={handleSubmit}
                                >

                                    {working ? (<span>{dealId ? "Updating..." : "Creating..."}</span>) : (<span>{dealId ? "Update Deal" : "Create Deal"}</span>)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CreateDeal;
