import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import API_BASE_URL from '../config';
import './PropertiesPage.css';
import videoSrc from './images/vd.mp4';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/properties`);
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filterProperties = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return properties.filter(property => {
        return (
          (property.name && property.name.toLowerCase().includes(lowercasedQuery)) ||
          (property.price && property.price.toString().includes(lowercasedQuery)) ||
          (property.address && property.address.toLowerCase().includes(lowercasedQuery)) ||
          (property.city && property.city.toLowerCase().includes(lowercasedQuery)) ||
          (property.state && property.state.toLowerCase().includes(lowercasedQuery))
        );
      });
    };

    setFilteredProperties(filterProperties());
  }, [searchQuery, properties]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="properties-page">
      <video className="background-video" autoPlay loop muted>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content-container">
        <h1>Our Properties</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Property Name, Price or Address"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="search-button">
            <i className="fas fa-search"></i> 
          </button>
        </div>
        <div className="property-list">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p>No properties available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
