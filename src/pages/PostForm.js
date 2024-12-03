import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: {
      address: '',
      city: '',
      district: '',
      ward: ''
    },
    landlord: '',
    roomType: '',
    size: '',
    availability: true,
    amenities: {
      hasWifi: false,
      hasParking: false,
      hasAirConditioner: false,
      hasKitchen: false,
      hasElevator: false
    },
    additionalCosts: {
      electricity: '',
      water: '',
      internet: '',
      cleaningService: '',
      security: ''
    },
    images: [],
    videos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (e, category) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [category]: { ...formData[category], [name]: value } });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const filesArray = Array.from(files);
    setFormData({ ...formData, [name]: [...formData[name], ...filesArray] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'images' || key === 'videos') {
        formData[key].forEach(file => data.append(key, file));
      } else if (typeof formData[key] === 'object') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post('https://be-android-project.onrender.com/api/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Response:', response.data);
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" value={formData.location.address} onChange={(e) => handleNestedChange(e, 'location')} required />
      <input type="text" name="city" placeholder="City" value={formData.location.city} onChange={(e) => handleNestedChange(e, 'location')} required />
      <input type="text" name="district" placeholder="District" value={formData.location.district} onChange={(e) => handleNestedChange(e, 'location')} required />
      <input type="text" name="ward" placeholder="Ward" value={formData.location.ward} onChange={(e) => handleNestedChange(e, 'location')} required />
      <input type="text" name="landlord" placeholder="Landlord ID" value={formData.landlord} onChange={handleChange} required />
      <select name="roomType" value={formData.roomType} onChange={handleChange} required>
        <option value="">Select Room Type</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Shared">Shared</option>
        <option value="Apartment">Apartment</option>
        <option value="Dormitory">Dormitory</option>
      </select>
      <input type="number" name="size" placeholder="Size (m2)" value={formData.size} onChange={handleChange} required />
      <input type="checkbox" name="availability" checked={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.checked })} /> Availability
      <input type="checkbox" name="hasWifi" checked={formData.amenities.hasWifi} onChange={(e) => handleNestedChange(e, 'amenities')} /> Wifi
      <input type="checkbox" name="hasParking" checked={formData.amenities.hasParking} onChange={(e) => handleNestedChange(e, 'amenities')} /> Parking
      <input type="checkbox" name="hasAirConditioner" checked={formData.amenities.hasAirConditioner} onChange={(e) => handleNestedChange(e, 'amenities')} /> Air Conditioner
      <input type="checkbox" name="hasKitchen" checked={formData.amenities.hasKitchen} onChange={(e) => handleNestedChange(e, 'amenities')} /> Kitchen
      <input type="checkbox" name="hasElevator" checked={formData.amenities.hasElevator} onChange={(e) => handleNestedChange(e, 'amenities')} /> Elevator
      <input type="number" name="electricity" placeholder="Electricity Cost" value={formData.additionalCosts.electricity} onChange={(e) => handleNestedChange(e, 'additionalCosts')} />
      <input type="number" name="water" placeholder="Water Cost" value={formData.additionalCosts.water} onChange={(e) => handleNestedChange(e, 'additionalCosts')} />
      <input type="number" name="internet" placeholder="Internet Cost" value={formData.additionalCosts.internet} onChange={(e) => handleNestedChange(e, 'additionalCosts')} />
      <input type="number" name="cleaningService" placeholder="Cleaning Service Cost" value={formData.additionalCosts.cleaningService} onChange={(e) => handleNestedChange(e, 'additionalCosts')} />
      <input type="number" name="security" placeholder="Security Cost" value={formData.additionalCosts.security} onChange={(e) => handleNestedChange(e, 'additionalCosts')} />
      
      <input type="file" name="images" multiple onChange={handleFileChange} />
      <div>
        {formData.images.map((image, index) => (
          <div key={index}>
            <span>{image.name}</span>
            <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
          </div>
        ))}
      </div>
      
      <input type="file" name="videos" multiple onChange={handleFileChange} />
      
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;