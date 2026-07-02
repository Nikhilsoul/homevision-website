import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import ContactOwnerForm from './ContactOwnerForm'; 
import API_BASE_URL from '../config';
import './PropertyDetails.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png'; // Import default marker icon
import markerShadow from 'leaflet/dist/images/marker-shadow.png'; // Import marker shadow
import { useNavigate } from 'react-router-dom';  

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [position, setPosition] = useState([23.0225, 72.5714]); // Default position
  const [showContactForm, setShowContactForm] = useState(false); // State to control modal visibility
  const navigate = useNavigate();  

  const handleBookingClick = () => {
    navigate('/booking', { state: { id } });  
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        const propertyData = response.data;
        setProperty(propertyData);

        // If no coordinates available, use geocoding
        if (!propertyData.latitude || !propertyData.longitude) {
          const geocodeResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${propertyData.address}, ${propertyData.city}, ${propertyData.state}, ${propertyData.country}`
            )}`
          );

          if (geocodeResponse.data && geocodeResponse.data.length > 0) {
            const { lat, lon } = geocodeResponse.data[0];
            setPosition([parseFloat(lat), parseFloat(lon)]);
          }
        } else {
          setPosition([propertyData.latitude, propertyData.longitude]);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchProperty();
  }, [id]);

  // Custom icon setup
  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41]  // Size of the shadow
  });

  const renderGallery = () => {
    if (property && property.images && property.images.length > 0) {
      const images = property.images.map((image) => ({
        original: `${API_BASE_URL}${image}`,
        thumbnail: `${API_BASE_URL}${image}`,
      }));
      return <ImageGallery items={images} showThumbnails={true} />;
    }
    return <p>No images available</p>;
  };

  const downloadBrochure = () => {
    axios({
      url: `${API_BASE_URL}/api/properties/${id}/brochure`, // Use template literal here
      method: 'GET',
      responseType: 'blob', // Important for file download
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${property.name}-brochure.pdf`); // Set download filename using template literal
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      //.catch((error) => console.error('Error downloading brochure:', error));
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      });
      
  };
  

  return (
    <div className="property-details-container">
      {property ? (
        <div className="property-details-content">
          <div className="property-header">
            <h1>{property.name}</h1>
            <p className="property-price">₹{property.price}</p>
            <p className="property-location">{property.address}, {property.city}, {property.state}, {property.country}</p>
          </div>
          <div className="property-details-main">
            <div className="property-images">
              {renderGallery()}
            </div>
            <div className="property-info">
              <div className="property-summary">
                <p><b>Description:</b> {property.description}</p>
                <div className="property-specs">
                  <p><b>Bedrooms:</b> {property.bedrooms}</p>
                  <p><b>Bathrooms:</b> {property.bathrooms}</p>
                  <p><b>Floor Area:</b> {property.floorArea} sq. ft.</p>
                  <p><b>Total Floors:</b> {property.totalFloors}</p>
                  <p><b>Amenities:</b> {property.amenities.join(', ')}</p>
                  <p><b>Legal Documentation:</b> {property.legalDocumentation}</p>
                </div>
              </div>
              <div className="property-contact">
                <h3>Contact Owner</h3>
                <p><b>Name:</b> {property.contactName}</p>
                <p><b>Email:</b> {property.contactEmail}</p>
                <p><b>Phone:</b> {property.contactPhoneNumber}</p>
                {/* <button className="contact-button">Contact Owner</button> */}
                <button 
                  className="contact-button"
                  onClick={() => setShowContactForm(true)} // Show the modal on click
                >
                  Contact Owner
                </button>
                <button className="download-button" onClick={downloadBrochure}>Download Brochure</button>
                <button className="booking-button" onClick={handleBookingClick}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="property-map">
            <MapContainer 
              key={position.toString()} // Forces re-render when position changes
              center={position} 
              zoom={15} 
              style={{ height: '400px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker position={position} icon={customMarkerIcon}>
                <Popup>{property.name}</Popup>
              </Marker>
            </MapContainer> 
           
          </div>
          
          {showContactForm && (
            <ContactOwnerForm 
              property={property} 
              onClose={() => setShowContactForm(false)} 
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PropertyDetails;


