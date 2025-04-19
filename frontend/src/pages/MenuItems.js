import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "", image: null });

  // Fetch Menu Items & Categories
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axiosInstance.get("/menu-items/");
        console.log(response.data)
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/menuCategory/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  // Handle editing an existing menu item
  const handleEdit = (id, field, value) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Save updated item to backend
  const saveEdit = async (id, updatedItem,categoryid) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedItem.name);
      formData.append("description", updatedItem.description);
      formData.append("price", updatedItem.price);
      formData.append("category",categoryid );

      if (updatedItem.image instanceof File) {
        formData.append("image", updatedItem.image);
      }

      await axiosInstance.put(`/menu-items/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle adding a new item dynamically
  const handleAdd = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("description", newItem.description);
      formData.append("price", newItem.price);
      formData.append("category", newItem.category); // ID of the category

      if (newItem.image_upload) {
        formData.append("image_upload", newItem.image_upload);
        console.log(newItem.image_upload);
      }

      const response = await axiosInstance.post("/menu-items/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMenuItems([...menuItems, { ...newItem, id: response.data.id }]);
      setNewItem({ name: "", description: "", price: "", category: "", image: null }); // Reset fields
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Menu Items</h2>

      {/* Display Menu Items by Category */}
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {menuItems
              .filter((item) => item.category === category.id) // Fixed this line
                .map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "10px",
                    margin: "10px",
                    width: "200px",
                  }}
                >
                  <img
                    src={`data:image/png;base64,${item.image}`}
                    alt={item.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEdit(item.id, "name", e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleEdit(item.id, "description", e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleEdit(item.id, "price", e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <button onClick={() => saveEdit(item.id, item,category.id)}>Save</button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Add New Menu Item */}
      <div style={{ marginTop: "20px" }}>
        <h3>Add New Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button onClick={handleAdd}>Add Item</button>
      </div>
    </div>
  );
}

export default MenuItems;
