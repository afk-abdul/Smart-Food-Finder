import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Search, Plus, Edit, Trash2, Filter, Camera, LogOut, User } from "lucide-react"


function MenuItems()
{
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "", image: null });
    const [selectedCategory, setSelectedCategory] = useState(0)


    const [showForm, setShowForm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchMenuItems = async () =>
    {
        try
        {
            const response = await axiosInstance.get("/menu-items/");
            console.log(response.data)
            setMenuItems(response.data);
        } catch (error)
        {
            console.error("Error fetching menu items:", error);
        }
    };

    const fetchCategories = async () =>
    {
        try
        {
            const response = await axiosInstance.get("/menuCategory/");
            setCategories(response.data);
        } catch (error)
        {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch Menu Items & Categories
    useEffect(() =>
    {
        fetchMenuItems();
        fetchCategories();
    }, []);

    // Save updated item to backend
    const saveEdit = async (id, updatedItem) =>
    {
        try
        {
            setUpdating(true);
            const formData = new FormData();
            formData.append("name", updatedItem.name);
            formData.append("description", updatedItem.description);
            formData.append("price", updatedItem.price);
            formData.append("category", updatedItem.category);

            if (updatedItem.image instanceof File)
            {
                formData.append("image", updatedItem.image);
            }

            await axiosInstance.put(`/menu-items/${id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchMenuItems();
            setShowForm(false)
            setSelectedItemId(null)
        } catch (error)
        {
            console.error("Error updating item:", error);
        }
        finally
        {
            setUpdating(false);
        }
    };

    // Handle adding a new item dynamically
    const handleAdd = async () =>
    {

        if (!newItem.name || !newItem.price || !newItem.category) return;

        setUpdating(true);
        try
        {
            const formData = new FormData();
            formData.append("name", newItem.name);
            formData.append("description", newItem.description);
            formData.append("price", newItem.price);
            formData.append("category", newItem.category); // ID of the category

            if (newItem.image_upload)
            {
                formData.append("image_upload", newItem.image_upload);
                console.log(newItem.image_upload);
            }

            const response = await axiosInstance.post("/menu-items/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMenuItems([...menuItems, { ...newItem, id: response.data.id }]);
            setNewItem({ name: "", description: "", price: "", category: "", image: null }); // Reset fields
            setShowForm(false); // Hide form after adding
            setSelectedItemId(null); // Reset selected item ID
        } catch (error)
        {
            console.error("Error adding new item:", error);
        }
        finally
        {
            setUpdating(false);
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
                setNewItem((prevItem) => ({
                    ...prevItem,
                    image_upload: base64String,
                }));
            };

            reader.readAsDataURL(file); // convert file to base64
        }
    };



    return (
        <main className="flex-1 p-6">

            {/* Add New Item Form */}
            {showForm ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-[#F97316]" />
                        {selectedItemId ? "Update" : "Add"} Menu Item
                    </h2>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                    placeholder="Enter item name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="text"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                    placeholder="Enter price (e.g. $12.99)"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter((cat) => cat !== "All")
                                        .map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <input type="file"
                                    accept="image/*"
                                    onChange={handleFileChange} />
                            </div>


                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                    placeholder="Enter item description"
                                    required
                                ></textarea>
                            </div>

                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                {
                                    setShowForm(false)
                                    setSelectedItemId(null)
                                    setNewItem({ name: "", description: "", price: "", category: "", image: null })
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            {selectedItemId ? (
                                <button
                                    onClick={async () =>
                                    {
                                        await saveEdit(selectedItemId, newItem)
                                    }}
                                    disabled={updating}
                                    className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                                >
                                    {updating ? "Updating..." : "Update"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleAdd}
                                    disabled={updating}
                                    className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                                >
                                    {updating ? "Adding..." : "Add Item"}
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Menu Items</h1>

                        <div className="flex space-x-4">
                            <button
                                onClick={() =>
                                {
                                    setNewItem({ name: "", description: "", price: "", category: "", image: null })
                                    setSelectedItemId(null)
                                    setShowForm(true)
                                }}
                                className="px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316]"
                            >
                                New Item
                            </button>
                            {/* <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            </div> */}
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

                    {(menuItems.length === 0 || categories.length === 0) && (<p>Loading...</p>)}

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {menuItems.filter(i => (i.category == selectedCategory || selectedCategory == 0)).map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={`data:image/png;base64,${item.image}` || "/placeholder.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <span className="font-bold text-[#F97316]">{item.price}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{categories.find(c => c.id == item.category)?.name}</span>
                                        <div className="flex space-x-2">
                                            <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                onClick={() =>
                                                {
                                                    setNewItem({ ...item })
                                                    setSelectedItemId(item.id)
                                                    setShowForm(true)
                                                }}>
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



        </main >
    );
}

export default MenuItems;
