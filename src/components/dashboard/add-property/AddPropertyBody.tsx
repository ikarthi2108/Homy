import React, { useState } from 'react';
import axios from 'axios';
import './AddProperty.css';

interface PropertyFormData {
    title: string;
    description: string;
    category: string;
    listedIn: string;
    price: number | '';
    size: string;
    bedrooms: number | '';
    bathrooms: number | '';
    kitchens: number | '';
    yearBuilt: string;
    floors: number | '';
    address: string;
    location: { lat: string; lng: string };
    amenities: string[];
}

const AddProperty: React.FC = () => {
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        description: '',
        category: '',
        listedIn: '',
        price: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        kitchens: '',
        yearBuilt: '',
        floors: '',
        address: '',
        location: { lat: '', lng: '' },
        amenities: [],
    });

    const categories = ['Apartment', 'House', 'Villa'];
    const listings = ['Rent', 'Sale'];
    const amenitiesList = ['Pool', 'Gym', 'Garage', 'Garden'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            location: { ...formData.location, [name]: value },
        });
    };

    const handleCheckboxChange = (amenity: string) => {
        setFormData((prevState) => {
            const { amenities } = prevState;
            if (amenities.includes(amenity)) {
                return { ...prevState, amenities: amenities.filter((item) => item !== amenity) };
            } else {
                return { ...prevState, amenities: [...amenities, amenity] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            listedIn: formData.listedIn,
            price: formData.price,
            size: formData.size,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            kitchens: formData.kitchens,
            yearBuilt: formData.yearBuilt,
            floors: formData.floors,
            amenities: formData.amenities,
            address: formData.address,
            location: formData.location,
            userId: localStorage.getItem('userId') // or the user ID stored in your session
        };

        try {
            const response = await axios.post('http://localhost:5000/api/properties', formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                alert('Property added successfully');
                console.log('Property added:', response.data);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('Error submitting property:', error);
            alert('Failed to submit property.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-property-form">
            <h1 className="form-title">Add Property</h1>

            <div className="form-section">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="form-section">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <label>Listed In</label>
                <select name="listedIn" value={formData.listedIn} onChange={handleChange} required>
                    <option value="">Select Listing Type</option>
                    {listings.map((list) => (
                        <option key={list} value={list}>
                            {list}
                        </option>
                    ))}
                </select>
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                <label>Size (m²)</label>
                <input type="text" name="size" value={formData.size} onChange={handleChange} required />
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
                <label>Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
                <label>Kitchens</label>
                <input type="number" name="kitchens" value={formData.kitchens} onChange={handleChange} required />
                <label>Year Built</label>
                <input type="text" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} required />
                <label>Floors</label>
                <input type="number" name="floors" value={formData.floors} onChange={handleChange} required />
            </div>

            <div className="form-section">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="form-section">
                <label>Location</label>
                <input
                    type="text"
                    name="lat"
                    placeholder="Latitude"
                    value={formData.location.lat}
                    onChange={handleLocationChange}
                    required
                />
                <input
                    type="text"
                    name="lng"
                    placeholder="Longitude"
                    value={formData.location.lng}
                    onChange={handleLocationChange}
                    required
                />
            </div>

            <div className="form-section">
                <label>Amenities</label>
                <div className="checkbox-group">
                    {amenitiesList.map((amenity) => (
                        <label key={amenity}>
                            <input
                                type="checkbox"
                                checked={formData.amenities.includes(amenity)}
                                onChange={() => handleCheckboxChange(amenity)}
                            />
                            {amenity}
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
};

export default AddProperty;
