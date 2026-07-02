import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './admindashboard.css';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((property) => property._id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => navigate('/create-property')}>Create New Property</button>
      </div>
      <div className="property-list">
        {properties.map((property) => (
          <div key={property._id} className="property-item">
            {/* <p>{property.images}</p> */}
            <h3>{property.name}</h3>
            <p><strong>Description:</strong> {property.description}</p>
            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
            <p><strong>Price:</strong> ₹{property.price}</p>
            
            <button onClick={() => navigate(`/edit-property/${property._id}`)}>Edit</button>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
