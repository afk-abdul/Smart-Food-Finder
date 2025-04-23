import React, { useState } from 'react';
import axios from 'axios';

function RestaurantSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cuisine: '',
    phoneNo: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post("http://127.0.0.1:8000/restaurants/signup/", formData)
      .then(response => {
        alert("Successfully created user");
        
        // Clear the form after successful submission
        setFormData({
          name: '',
          email: '',
          cuisine: '',
          phoneNo: '',
          password: ''
        });
      })
      .catch(error => {
        alert("Error")
        console.error("There was an error:", error);
        setFormData({
          name: '',
          email: '',
          cuisine: '',
          phoneNo: '',
          password: ''
        });
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Restaurant Signup</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div>
          <label>Restaurant Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Cuisine:</label>
          <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default RestaurantSignup;
