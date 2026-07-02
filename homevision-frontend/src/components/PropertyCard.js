
import React from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property._id}`);
  };

  return (
    <div className="property-card" onClick={handleClick}>
      {property.images && property.images.length > 0 ? (
        <div className="image-container">
          <img 
          //src={property.images[0]} 
          src={`${API_BASE_URL}${property.images[0]}`}
          alt={property.name} className="property-image" />
          <div className="image-overlay">
            <span className="image-count">{property.images.length} photos</span>
          </div>
        </div>
      ) : (
        <div className="no-image">No Image Available</div>
      )}
      <div className="property-info">
        <h3 className="property-type">{property.name}</h3>
        <p className="property-price">₹{property.price}</p>
        <p className="property-size">{property.floorArea} sqft</p>
        <p className="property-address">{property.address}{","}{property.city}{","}{property.state}
          {","}{property.country}</p>
        <p className="property-status">{property.status}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
